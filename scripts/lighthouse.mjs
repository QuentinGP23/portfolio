/**
 * Runs Lighthouse (mobile profile) against a running server, several times per URL,
 * keeps the median of each category score and of the JavaScript weight, and fails
 * below the plan's thresholds or above the JavaScript budget.
 *
 * Usage: pnpm build && pnpm start, then in another terminal: pnpm lighthouse
 * Options (environment variables):
 *   LIGHTHOUSE_BASE_URL  default http://localhost:3000
 *   LIGHTHOUSE_PATHS     comma-separated paths, default "/"
 *   LIGHTHOUSE_RUNS      runs per URL, default 3
 *   CHROME_PATH          Chrome or Chromium binary to use
 */
import * as chromeLauncher from "chrome-launcher";
import lighthouse from "lighthouse";

const baseUrl = process.env.LIGHTHOUSE_BASE_URL ?? "http://localhost:3000";
const paths = (process.env.LIGHTHOUSE_PATHS ?? "/").split(",");
const runs = Number(process.env.LIGHTHOUSE_RUNS ?? 3);
const thresholds = {
  performance: 95,
  accessibility: 100,
  "best-practices": 100,
  seo: 100,
};
const categories = Object.keys(thresholds);

// Plan budget: the Next.js + React baseline measured in phase 1 (140.3 KiB of
// gzip-compressed JavaScript with Next.js 16.4.5 and React 19.3.1, served by
// `next start`), plus at most 30 KiB per page. Update it only on purpose.
const jsBudgetKiB = 171;

const median = (values) => {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
};

const chrome = await chromeLauncher.launch({
  chromeFlags: ["--headless=new", ...(process.env.CI ? ["--no-sandbox"] : [])],
});

let failed = false;
try {
  for (const path of paths) {
    const url = new URL(path, baseUrl).href;
    const scores = Object.fromEntries(
      categories.map((category) => [category, []]),
    );
    const jsKiB = [];

    for (let run = 0; run < runs; run += 1) {
      const result = await lighthouse(url, {
        port: chrome.port,
        output: "json",
        logLevel: "error",
        onlyCategories: categories,
      });
      if (!result) throw new Error(`Lighthouse returned no result for ${url}`);
      for (const category of categories) {
        const score = result.lhr.categories[category]?.score ?? 0;
        scores[category].push(Math.round(score * 100));
      }
      const scripts = result.lhr.audits[
        "resource-summary"
      ]?.details?.items?.find((item) => item.resourceType === "script");
      jsKiB.push(Math.round(((scripts?.transferSize ?? 0) / 1024) * 10) / 10);
    }

    for (const [category, minimum] of Object.entries(thresholds)) {
      const value = median(scores[category]);
      const ok = value >= minimum;
      if (!ok) failed = true;
      console.log(
        `${ok ? "PASS" : "FAIL"} ${url} ${category}: ${value} (min ${minimum}, runs ${scores[category].join(", ")})`,
      );
    }

    const js = median(jsKiB);
    const jsOk = js <= jsBudgetKiB;
    if (!jsOk) failed = true;
    console.log(
      `${jsOk ? "PASS" : "FAIL"} ${url} JavaScript: ${js} KiB compressed (max ${jsBudgetKiB} KiB)`,
    );
  }
} finally {
  chrome.kill();
}

process.exit(failed ? 1 : 0);

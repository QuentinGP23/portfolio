import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import jsxA11y from "eslint-plugin-jsx-a11y";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // Strict accessibility rules (target: WCAG 2.2 AA). eslint-config-next already
    // registers the jsx-a11y plugin, so only its strict rule set is added here.
    files: ["**/*.{js,jsx,mjs,ts,tsx,mts}"],
    rules: { ...jsxA11y.flatConfigs.strict.rules },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "coverage/**",
    "playwright-report/**",
    "test-results/**",
  ]),
]);

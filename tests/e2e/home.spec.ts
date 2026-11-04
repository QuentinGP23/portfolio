import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("Accueil", () => {
  test("présente le nom, le métier et les liens de contact", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Quentin Geoffroy-Pitailler/);
    await expect(page.locator("html")).toHaveAttribute("lang", "fr");
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Quentin Geoffroy-Pitailler",
      }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "GitHub" })).toHaveAttribute(
      "rel",
      "noopener noreferrer",
    );
    await expect(
      page.getByRole("link", { name: "quentgeoffpit@proton.me" }),
    ).toHaveAttribute("href", "mailto:quentgeoffpit@proton.me");
  });

  test("ne présente aucune violation d'accessibilité détectable (WCAG 2.2 AA)", async ({
    page,
  }) => {
    await page.goto("/");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });
});

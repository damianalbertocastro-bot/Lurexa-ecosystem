import { expect, test } from "@playwright/test";

test.describe("Learn accessibility baseline", () => {
  test("keyboard users can skip repeated navigation", async ({ page }) => {
    await page.goto("/");

    const skipLink = page.getByRole("link", { name: "Skip to main content" });
    await page.keyboard.press("Tab");
    await expect(skipLink).toBeFocused();
    await expect(skipLink).toBeVisible();

    await page.keyboard.press("Enter");
    await expect(page.locator("#main-content")).toBeFocused();
  });

  test("the landing page exposes named landmarks and progress semantics", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("main")).toHaveCount(1);
    await expect(page.getByRole("navigation", { name: "Primary" })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Footer" })).toBeVisible();
    await expect(page.getByRole("progressbar", { name: "Weekly mastery milestone" })).toHaveAttribute("aria-valuenow", "68");
  });

  test("visible interactive controls have accessible names", async ({ page }) => {
    await page.goto("/");

    const unnamed = await page.locator("a, button, input, select, textarea").evaluateAll((elements) =>
      elements
        .filter((element) => {
          const html = element as HTMLElement;
          const style = window.getComputedStyle(html);
          return style.display !== "none" && style.visibility !== "hidden" && html.getClientRects().length > 0;
        })
        .filter((element) => {
          const html = element as HTMLElement;
          const text = html.innerText?.trim();
          const aria = html.getAttribute("aria-label")?.trim();
          const labelledBy = html.getAttribute("aria-labelledby")?.trim();
          const title = html.getAttribute("title")?.trim();
          const input = html instanceof HTMLInputElement || html instanceof HTMLSelectElement || html instanceof HTMLTextAreaElement;
          const label = input && html.id ? document.querySelector(`label[for="${CSS.escape(html.id)}"]`)?.textContent?.trim() : "";
          return !text && !aria && !labelledBy && !title && !label;
        })
        .map((element) => element.outerHTML.slice(0, 180)),
    );

    expect(unnamed, `Visible interactive controls without accessible names: ${unnamed.join(" | ")}`).toEqual([]);
  });

  test("reduced-motion preference suppresses decorative animation", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    const durationSeconds = await page.locator(".animate-fade-slide-up").first().evaluate((element) => {
      const duration = window.getComputedStyle(element).animationDuration;
      return Number.parseFloat(duration);
    });

    expect(durationSeconds).toBeLessThanOrEqual(0.001);
  });

  test("mobile viewport does not introduce horizontal page overflow", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });
});

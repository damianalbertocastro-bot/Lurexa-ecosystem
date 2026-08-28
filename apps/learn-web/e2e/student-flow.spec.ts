import { expect, test } from "@playwright/test";

test.describe("Learner entry journey", () => {
  test("a new learner can reach the onboarding and placement entry path", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: /learn english/i })).toBeVisible();
    await page.getByRole("link", { name: /start learning free/i }).click();
    await expect(page).toHaveURL(/\/onboarding$/);

    await expect(page.getByRole("heading", { name: /what do you want english to help you do/i })).toBeVisible();
    await expect(page.getByRole("button", { name: "Start my A1 lesson" })).toBeVisible();
  });

  test("legacy A1 links preserve intent through the authenticated canonical lesson route", async ({ page }) => {
    const canonicalContinue = "%2Flearn%2Fenglish-a1-foundations%2Fa1-introduce-yourself";
    for (const legacyPath of ["/learn/a1-preview", "/learn/english-a1/introduce-yourself"]) {
      await page.goto(legacyPath);
      await expect(page).toHaveURL(new RegExp(`/login\\?continue=${canonicalContinue}$`));
      await expect(page.getByRole("heading", { name: /welcome back|sign in/i })).toBeVisible();
    }
  });
});

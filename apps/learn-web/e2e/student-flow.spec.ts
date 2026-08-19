import { expect, test } from "@playwright/test";

test.describe("Learner entry journey", () => {
  test("a new learner can reach the independent-learning sign-up path", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: /learn english/i })).toBeVisible();
    await page.getByRole("link", { name: /start learning free/i }).click();
    await expect(page).toHaveURL(/\/signup$/);

    await expect(page.getByText("Learn independently")).toBeVisible();
    await expect(page.getByRole("button", { name: "Create my learning path" })).toBeVisible();
  });
});

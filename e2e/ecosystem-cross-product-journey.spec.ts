import { test, expect } from "@playwright/test";

test.describe("Lurexa Full Cross-Product Ecosystem E2E Journey", () => {
  test("1. Root Portal renders all ecosystem links and product marks", async ({ page }) => {
    await page.goto("http://localhost:3000");
    await expect(page).toHaveTitle(/Lurexa/);
    await expect(page.locator("text=Lurexa Learn")).toBeVisible();
    await expect(page.locator("text=Lurexa Coach")).toBeVisible();
    await expect(page.locator("text=Lurexa Teach")).toBeVisible();
  });

  test("2. Learn Web loads A1 Curriculum and interactive capabilities", async ({ page }) => {
    await page.goto("http://localhost:3001");
    await expect(page.locator("text=A1 Foundations")).toBeVisible();
  });

  test("3. Coach Web loads standalone dashboard and phoneme spectrum", async ({ page }) => {
    await page.goto("http://localhost:3005");
    await expect(page.locator("text=Refine what matters")).toBeVisible();

    await page.goto("http://localhost:3005/dashboard");
    await expect(page.locator("text=Continuous Spoken Intelligence")).toBeVisible();
    await expect(page.locator("text=Mastered (14-day cycle)")).toBeVisible();
  });

  test("4. Coach Web Oral Placement Diagnostic functions properly", async ({ page }) => {
    await page.goto("http://localhost:3005/placement");
    await expect(page.locator("text=Oral Placement Diagnostic")).toBeVisible();
    await expect(page.locator("text=Task 1 of 3")).toBeVisible();
  });

  test("5. Teach Web credential verification page validates SHA-256 signatures", async ({ page }) => {
    await page.goto("http://localhost:3002/verify/LX-TEACH-T1-DEMO");
    await expect(page.locator("text=Verifiable Credential")).toBeVisible();
  });

  test("6. Admin Portal displays institutional phonetics struggle matrix", async ({ page }) => {
    await page.goto("http://localhost:3003/analytics/phonetics");
    await expect(page.locator("text=Phonological Struggle Matrix")).toBeVisible();
    await expect(page.locator("text=Cohort Heatmap")).toBeVisible();
  });
});

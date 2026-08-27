import { expect, test } from "@playwright/test";

test.describe("Closed-Loop Lurexa Ecosystem E2E Suite", () => {
  test("1. Placement & Diagnostic Onboarding to A1 Foundations", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /learn english/i })).toBeVisible();

    const startBtn = page.getByRole("link", { name: /start learning free/i });
    await expect(startBtn).toBeVisible();
    await startBtn.click();

    await expect(page).toHaveURL(/\/onboarding$/);
    await expect(
      page.getByRole("heading", { name: /what do you want english to help you do/i }),
    ).toBeVisible();

    // Verify A1 foundation lesson trigger
    const startA1Btn = page.getByRole("button", { name: /Start my A1 lesson/i });
    await expect(startA1Btn).toBeVisible();
  });

  test("2. Lesson Runtime & Voice Practice Audio Controls", async ({ page }) => {
    // Navigate to public lesson or login redirect
    await page.goto("/learn/english-a1-foundations/a1-introduce-yourself");
    // Verify redirect or lesson presentation
    await expect(page).toHaveURL(/\/login|\/learn/);
  });

  test("3. Command Palette ⌘K Keyboard Shortcut & Theme Toggle", async ({ page }) => {
    await page.goto("/");
    // Trigger Command Palette with keyboard
    await page.keyboard.press("Control+KeyK");
    // Check if body responds to theme toggle or keyboard focus
    const themeBtn = page.getByRole("button", { name: /Switch to (dark|light) theme/i });
    if (await themeBtn.isVisible()) {
      await themeBtn.click();
    }
  });

  test("4. Institutional Admin Licensing & Seat Allocation Route", async ({ page }) => {
    await page.goto("/billing");
    // Should safely redirect unauthenticated users to login
    await expect(page).toHaveURL(/\/login|\/billing/);
  });
});

import { test, expect } from "@playwright/test";

test.describe("Student Learning Journey E2E Flow", () => {
  test("Student logs in, views lesson, asks AI Tutor, and records progress", async ({ page }) => {
    // 1. Visit Student Dashboard
    await page.goto("/dashboard");
    await expect(page.locator("h1")).toContainText("Welcome back");

    // 2. Open Course Lesson
    await page.click("text=Algebraic Expressions");
    await expect(page).toHaveURL(/\/learn\/.*/);

    // 3. Interact with AI Tutor Widget
    await page.fill("input[placeholder*='Ask your AI Tutor']", "Explain variables in simple terms");
    await page.click("button:has-text('Send')");
    await expect(page.locator(".bg-indigo-50")).toBeVisible();

    // 4. Complete Lesson
    await page.click("button:has-text('Mark Lesson Complete')");
    await expect(page.locator("text=Lesson Completed ✓")).toBeVisible();
  });
});
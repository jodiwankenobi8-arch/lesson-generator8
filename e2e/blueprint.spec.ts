import { test, expect } from "@playwright/test";

test("blueprint page loads without crashing", async ({ page }) => {
  await page.goto("/blueprint");

  await expect(page.locator("body")).toContainText(/Blueprint Review/i);
  await expect(page.locator("body")).toContainText(/CURRENT PLAN/i);
  await expect(page.locator("body")).toContainText(/Teacher notes for the Blueprint/i);
  await expect(page.locator("body")).toContainText(/Back to Lesson Inputs/i);
  await expect(page.locator("body")).toContainText(/Generate Lesson/i);
});

test("blueprint page shows curriculum and exemplar upload areas", async ({ page }) => {
  await page.goto("/blueprint");

  await expect(page.locator("body")).toContainText(/Curriculum Pack/i);
  await expect(page.locator("body")).toContainText(/Exemplar Pack/i);
});
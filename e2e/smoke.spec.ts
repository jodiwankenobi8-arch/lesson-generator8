import { test, expect } from "@playwright/test";

test("wizard app loads inputs page", async ({ page }) => {
  await page.goto("http://127.0.0.1:4173/");
  await expect(page.locator("body")).toContainText("Grade");
  await expect(page.locator("body")).toContainText("Objective");
});

test("materials page opens directly", async ({ page }) => {
  await page.goto("http://127.0.0.1:4173/materials");
  await expect(page.locator("body")).toContainText("Materials Upload");
});

test("results page opens without crashing", async ({ page }) => {
  await page.goto("http://127.0.0.1:4173/results");
  await expect(page.locator("body")).toContainText("Results Hub");
});

import { test, expect } from '@playwright/test'

test('blueprint page loads without crashing', async ({ page }) => {
  await page.goto('/blueprint')

  await expect(page.getByRole('heading', { name: /blueprint/i })).toBeVisible()
  await expect(page.getByRole('button', { name: /back to lesson inputs/i })).toBeVisible()
})

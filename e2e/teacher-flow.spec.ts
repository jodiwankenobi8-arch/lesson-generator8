import { test, expect } from '@playwright/test'

test('teacher workflow reaches materials and generation is gated until materials are ready', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByText(/grade/i).first()).toBeVisible()
  await expect(page.getByText(/objective/i).first()).toBeVisible()

  const gradeByLabel = page.getByLabel(/^grade$/i)
  const gradeCombobox = page.getByRole('combobox').first()
  const gradeTextbox = page.getByRole('textbox').first()

  if (await gradeByLabel.count()) {
    const tag = await gradeByLabel.evaluate((el) => el.tagName.toLowerCase())
    if (tag === 'select') {
      await gradeByLabel.selectOption({ index: 1 })
    } else {
      await gradeByLabel.fill('K')
    }
  } else if (await gradeCombobox.count()) {
    await gradeCombobox.selectOption({ index: 1 })
  } else if (await gradeTextbox.count()) {
    await gradeTextbox.fill('K')
  }

  const objectiveByLabel = page.getByLabel(/^objective$/i)
  const textboxes = page.getByRole('textbox')

  if (await objectiveByLabel.count()) {
    await objectiveByLabel.fill('Students identify the letter A')
  } else {
    const textboxCount = await textboxes.count()
    if (textboxCount > 1) {
      await textboxes.nth(1).fill('Students identify the letter A')
    } else if (textboxCount > 0) {
      await textboxes.first().fill('Students identify the letter A')
    }
  }

  const continueButton = page.getByRole('button', { name: /materials|continue|next|review/i }).first()
  await expect(continueButton).toBeVisible()
  await continueButton.click()

  await expect(page.getByText(/materials/i).first()).toBeVisible()

  const textAreas = page.locator('textarea')
  const textAreaCount = await textAreas.count()
  if (textAreaCount > 0) {
    await textAreas.first().fill('Sample curriculum text about the letter A.')
  }

  const generateButton = page.getByRole('button', { name: /generate|results|build/i }).first()
  await expect(generateButton).toBeVisible()
  await expect(generateButton).toBeDisabled()
})

import { test, expect } from "@playwright/test"

const LOCALES = ["en", "zh", "zh-TW", "ja"]

test.describe("Daily Challenge Pages", () => {
  for (const locale of LOCALES) {
    test(`daily Wordle page loads in ${locale}`, async ({ page }) => {
      await page.goto(`/${locale}/daily/wordle`)
      await expect(page.locator("h1")).toBeVisible()
      await expect(page.locator("iframe")).toBeVisible()
    })

    test(`daily Sudoku page loads in ${locale}`, async ({ page }) => {
      await page.goto(`/${locale}/daily/sudoku`)
      await expect(page.locator("h1")).toBeVisible()
    })
  }
})

test.describe("Blog Pages", () => {
  test("blog list page loads", async ({ page }) => {
    await page.goto("/en/blog")
    await expect(page.locator("h1")).toBeVisible()
  })

  test("blog post page loads", async ({ page }) => {
    await page.goto("/en/blog/best-free-puzzle-games-online")
    await expect(page.locator("article h1").first()).toBeVisible()
  })
})

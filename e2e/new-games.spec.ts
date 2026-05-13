import { test, expect } from "@playwright/test"

const NEW_GAMES = ["snake-io", "cookie-clicker", "slope-run", "worldle", "tower-defense"]

test.describe("New Game Pages", () => {
  for (const slug of NEW_GAMES) {
    test(`${slug} page loads in English`, async ({ page }) => {
      await page.goto(`/en/games/${slug}`)
      await expect(page.locator("h1")).toBeVisible()
      await expect(page.locator("iframe")).toBeAttached()
    })
  }
})

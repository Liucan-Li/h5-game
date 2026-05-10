import { test, expect } from "@playwright/test"

const MOBILE_VIEWPORT = { width: 390, height: 844 }

test.use({ viewport: MOBILE_VIEWPORT })

test.describe("Mobile Functional Tests", () => {
  test("homepage loads with hero section", async ({ page }) => {
    await page.goto("/zh")

    await expect(page.locator("h1")).toBeVisible()
    await expect(page.locator("section a[href='/zh/games']").first()).toBeVisible()
    await expect(page.getByRole("link", { name: /乐游/ }).first()).toBeVisible()
  })

  test("homepage displays game sections and cards", async ({ page }) => {
    await page.goto("/zh")

    // Section headings (h2 elements, more specific)
    await expect(page.locator("h2").filter({ hasText: "推荐游戏" })).toBeVisible()
    await expect(page.locator("h2").filter({ hasText: "全部游戏" })).toBeVisible()
    await expect(page.locator("h2").filter({ hasText: "游戏分类" })).toBeVisible()

    // Many game card links
    expect(await page.locator("a[href*='/zh/games/']").count()).toBeGreaterThan(10)
  })

  test("hamburger menu opens mobile panel", async ({ page }) => {
    await page.goto("/zh")

    await page.getByRole("button", { name: "菜单" }).click()

    // After opening, the mobile panel shows search, nav, and categories
    // (the header still renders a hidden desktop SearchBar, so use .last())
    await expect(page.getByPlaceholder("搜索游戏...").last()).toBeVisible()
  })

  test("games page renders all content", async ({ page }) => {
    await page.goto("/zh/games")

    await expect(page.locator("h1")).toBeVisible()
    await expect(page.locator("text=款游戏").first()).toBeVisible()
    expect(await page.locator("a[href*='/zh/games/']").count()).toBeGreaterThan(5)
  })

  test("search form on games page redirects correctly", async ({ page }) => {
    await page.goto("/zh/games")

    // The inline SearchForm input (inside sm:hidden block on games page)
    const searchInput = page.getByPlaceholder("搜索游戏...").last()
    await expect(searchInput).toBeVisible()

    await searchInput.fill("2048")
    await searchInput.press("Enter")

    // Client-side navigation via router.push
    await expect(page).toHaveURL(/q=2048/, { timeout: 8000 })
    await expect(page.getByText("2048").first()).toBeVisible()
  })

  test("game detail page shows all elements", async ({ page }) => {
    await page.goto("/zh/games/2048")

    await expect(page.locator("h1")).toBeVisible()

    // Game iframe
    await expect(page.locator("iframe")).toBeAttached()

    // Tags
    await expect(page.getByText(/经典|益智|数字/).first()).toBeVisible()

    // Related games
    await expect(page.getByText("同类推荐")).toBeVisible()
  })

  test("category page filters games", async ({ page }) => {
    await page.goto("/zh/categories/puzzle")

    await expect(page.locator("h1")).toBeVisible()
    expect(await page.locator("a[href*='/zh/games/']").count()).toBeGreaterThan(0)
  })

  test("non-existent game returns 404 page", async ({ page }) => {
    await page.goto("/zh/games/non-existent-game-xyz", { waitUntil: "networkidle" })
    await expect(page.getByText("页面未找到")).toBeVisible()
  })

  test("sticky header on scroll", async ({ page }) => {
    await page.goto("/zh")
    await page.evaluate(() => window.scrollTo(0, 500))
    await page.waitForTimeout(400)
    expect(await page.locator("header").getAttribute("class")).toContain("sticky")
  })

  test("language switch to English", async ({ page }) => {
    await page.goto("/zh")

    // Open mobile menu
    await page.getByRole("button", { name: "菜单" }).click()
    await page.waitForTimeout(300)

    // Find and click the language switcher button inside the mobile panel
    // On mobile (< sm), the text label is hidden; button shows flag emoji
    // Target the button that contains "简体中文" after menu is open
    // Use getByText to find the mobile-panel language button
    const langBtn = page.locator("div.md\\:hidden button").filter({ hasText: "简体中文" }).or(
      page.locator("div.md\\:hidden button").filter({ hasText: "🇨🇳" })
    ).first()

    await langBtn.click()

    // Click English option in the opened dropdown
    await page.getByText("English").first().click()

    await expect(page).toHaveURL(/\/en/, { timeout: 10000 })
  })
})

test.describe("Desktop Tests", () => {
  test.use({ viewport: { width: 1280, height: 800 } })

  test("desktop nav and search visible", async ({ page }) => {
    await page.goto("/zh")
    await expect(page.locator("nav a[href='/zh/games']")).toBeVisible()
    await expect(page.getByPlaceholder("搜索游戏...").first()).toBeVisible()
  })
})

test.describe("Locales", () => {
  test.use({ viewport: MOBILE_VIEWPORT })

  for (const locale of ["ja", "zh-TW"]) {
    test(`${locale} homepage loads`, async ({ page }) => {
      await page.goto(`/${locale}`)
      await expect(page.locator("h1")).toBeVisible()
    })
  }

  test("en game detail loads", async ({ page }) => {
    await page.goto("/en/games/2048")
    await expect(page.locator("h1")).toBeVisible()
    await expect(page.locator("iframe")).toBeAttached()
  })
})

test.describe("SEO", () => {
  test.use({ viewport: MOBILE_VIEWPORT })

  test("homepage has JSON-LD", async ({ page }) => {
    await page.goto("/zh")
    const text = await page.locator("script[type='application/ld+json']").first().innerText()
    expect(JSON.parse(text)["@type"]).toBeTruthy()
  })

  test("game detail has JSON-LD", async ({ page }) => {
    await page.goto("/zh/games/2048")
    expect(await page.locator("script[type='application/ld+json']").count()).toBeGreaterThanOrEqual(1)
  })
})

test.describe("Assets", () => {
  test.use({ viewport: MOBILE_VIEWPORT })

  test("game iframe src is correct", async ({ page }) => {
    await page.goto("/zh/games/2048")
    await expect(page.locator("iframe")).toBeAttached()
    expect(await page.locator("iframe").getAttribute("src")).toContain("/games/2048.html")
  })

  test("game thumbnails load correctly", async ({ page }) => {
    await page.goto("/zh")
    await page.waitForTimeout(2000)

    const images = page.locator("img[src*='/images/games/']")
    expect(await images.count()).toBeGreaterThan(5)

    for (let i = 0; i < 5; i++) {
      expect(await images.nth(i).evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(0)
    }
  })
})

test.describe("API", () => {
  test("games search endpoint", async ({ page }) => {
    const res = await page.request.get("/api/games?q=2048")
    expect(res.ok()).toBeTruthy()
    const body = await res.json()
    expect(body.results.length).toBeGreaterThan(0)
  })
})

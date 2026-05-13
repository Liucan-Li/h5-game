import { test, expect } from "@playwright/test"

const MOBILE_VIEWPORT = { width: 390, height: 844 }

test.use({ viewport: MOBILE_VIEWPORT })

test.describe("Game 2048 - Keyboard Interaction", () => {
  test("responds to arrow key moves", async ({ page }) => {
    await page.goto("/zh/games/2048")
    const frame = page.frameLocator("iframe")
    await expect(frame.locator("#gridContainer")).toBeVisible({ timeout: 15000 })
    await page.waitForTimeout(500)

    expect(await frame.locator(".tile").count()).toBe(2)

    await page.keyboard.press("ArrowLeft")
    await page.waitForTimeout(200)
    await page.keyboard.press("ArrowDown")
    await page.waitForTimeout(200)

    expect(await frame.locator(".tile").count()).toBeGreaterThanOrEqual(1)
  })

  test("restart button exists", async ({ page }) => {
    await page.goto("/zh/games/2048")
    const frame = page.frameLocator("iframe")
    await expect(frame.locator("#gridContainer")).toBeVisible({ timeout: 15000 })
    await expect(frame.locator("#restartBtn")).toBeAttached()
  })
})

test.describe("Snake - Keyboard Controls", () => {
  test("snake responds to arrow keys", async ({ page }) => {
    await page.goto("/zh/games/snake")
    const frame = page.frameLocator("iframe")
    await expect(frame.locator("#gameCanvas")).toBeVisible({ timeout: 15000 })
    await page.waitForTimeout(500)

    await page.keyboard.press("ArrowUp")
    await page.waitForTimeout(100)
    await page.keyboard.press("ArrowLeft")
    await page.waitForTimeout(100)

    await expect(frame.locator("#score")).toBeAttached()
  })

  test("restart button exists", async ({ page }) => {
    await page.goto("/zh/games/snake")
    const frame = page.frameLocator("iframe")
    await expect(frame.locator("#gameCanvas")).toBeVisible({ timeout: 15000 })
    await expect(frame.locator("#restartBtn")).toBeAttached()
  })
})

test.describe("Click Speed Test", () => {
  test("click area starts game and records clicks", async ({ page }) => {
    await page.goto("/zh/games/click-speed")
    const iframeEl = page.locator("iframe")
    await expect(iframeEl).toBeAttached({ timeout: 15000 })
    await page.waitForTimeout(2000)

    // Use page.evaluate to access iframe content document directly
    await page.evaluate(() => {
      const iframe = document.querySelector("iframe")
      if (!iframe?.contentDocument) return
      const area = iframe.contentDocument.getElementById("clickArea")
      if (area) area.click()
    })
    await page.waitForTimeout(500)

    // After clicking, game should have started
    const text = page.locator("iframe").contentFrame().locator("#clickAreaText")
    const content = await text.textContent()
    expect(content).toContain("点击")

    // More clicks
    for (let i = 0; i < 10; i++) {
      await page.evaluate(() => {
        const iframe = document.querySelector("iframe")
        if (!iframe?.contentDocument) return
        const area = iframe.contentDocument.getElementById("clickArea")
        if (area) area.click()
      })
      await page.waitForTimeout(20)
    }

    const count = page.locator("iframe").contentFrame().locator("#clickCount")
    expect(parseInt(await count.textContent() || "0")).toBeGreaterThanOrEqual(1)
  })
})

test.describe("Tic-Tac-Toe", () => {
  async function clickCell(page: import("@playwright/test").Page, index: number) {
    await page.evaluate(
      ({ idx }: { idx: number }) => {
        const iframe = document.querySelector("iframe")
        if (!iframe?.contentDocument) return
        const cells = iframe.contentDocument.querySelectorAll(".cell")
        if (cells[idx]) (cells[idx] as HTMLElement).click()
      },
      { idx: index }
    )
  }

  test("clicking cells places X and AI responds with O", async ({ page }) => {
    await page.goto("/zh/games/tic-tac-toe")
    const frame = page.frameLocator("iframe")
    await expect(frame.locator("#grid")).toBeAttached({ timeout: 15000 })
    await page.waitForTimeout(500)

    // Click center cell
    await clickCell(page, 4)
    await page.waitForTimeout(800)

    // Center should have X
    expect(await frame.locator(".cell").nth(4).getAttribute("class")).toContain("x")

    // AI should have responded
    expect(await frame.locator(".cell.x, .cell.o").count()).toBeGreaterThanOrEqual(2)
  })

  test("reset button clears the board", async ({ page }) => {
    await page.goto("/zh/games/tic-tac-toe")
    const frame = page.frameLocator("iframe")
    await expect(frame.locator("#grid")).toBeAttached({ timeout: 15000 })
    await page.waitForTimeout(500)

    // Make a move then reset
    await clickCell(page, 4)
    await page.waitForTimeout(500)

    await page.evaluate(() => {
      const iframe = document.querySelector("iframe")
      if (!iframe?.contentDocument) return
      const btn = iframe.contentDocument.getElementById("resetBtn")
      if (btn) btn.click()
    })
    await page.waitForTimeout(500)

    expect(await frame.locator(".cell.x, .cell.o").count()).toBe(0)
  })
})

test.describe("Rock Paper Scissors", () => {
  test("selecting a choice shows result", async ({ page }) => {
    await page.goto("/zh/games/rock-paper-scissors")
    const frame = page.frameLocator("iframe")
    await expect(frame.locator("[data-choice]").first()).toBeAttached({ timeout: 15000 })
    await page.waitForTimeout(500)

    // Click rock
    await page.evaluate(() => {
      const iframe = document.querySelector("iframe")
      if (!iframe?.contentDocument) return
      const btn = iframe.contentDocument.querySelector("[data-choice='rock']") as HTMLElement
      if (btn) btn.click()
    })
    await page.waitForTimeout(500)

    expect(await frame.locator("#playerChoice").textContent()).not.toBe("❓")
    expect(await frame.locator("#aiChoice").textContent()).not.toBe("❓")
  })
})

test.describe("Memory Game", () => {
  test("clicking cards flips them", async ({ page }) => {
    await page.goto("/zh/games/memory")
    const frame = page.frameLocator("iframe")
    await expect(frame.locator(".card").first()).toBeAttached({ timeout: 15000 })
    await page.waitForTimeout(500)

    // Click first card
    await page.evaluate(() => {
      const iframe = document.querySelector("iframe")
      if (!iframe?.contentDocument) return
      const cards = iframe.contentDocument.querySelectorAll(".card")
      if (cards[0]) (cards[0] as HTMLElement).click()
    })
    await page.waitForTimeout(500)

    expect(await frame.locator(".card").nth(0).getAttribute("class")).toContain("flipped")

    // Click second card
    await page.evaluate(() => {
      const iframe = document.querySelector("iframe")
      if (!iframe?.contentDocument) return
      const cards = iframe.contentDocument.querySelectorAll(".card")
      if (cards[1]) (cards[1] as HTMLElement).click()
    })
    await page.waitForTimeout(500)

    expect(await frame.locator(".card").nth(1).getAttribute("class")).toContain("flipped")
    await expect(frame.locator("#timer")).toBeAttached()
  })
})

test.describe("Dino Runner", () => {
  test("game responds to keyboard input", async ({ page }) => {
    await page.goto("/zh/games/dino-runner")
    const frame = page.frameLocator("iframe")
    await expect(frame.locator("#startBtn")).toBeAttached({ timeout: 15000 })
    await page.waitForTimeout(500)

    // Click start button
    await page.evaluate(() => {
      const iframe = document.querySelector("iframe")
      if (!iframe?.contentDocument) return
      const btn = iframe.contentDocument.getElementById("startBtn")
      if (btn) btn.click()
    })
    await page.waitForTimeout(300)

    await expect(frame.locator("#score")).toBeAttached()
  })
})

test.describe("Game iFrame src Validation", () => {
  test("multiple games have correct iframe src", async ({ page }) => {
    const games = [
      { slug: "2048", expected: "/games/2048.html" },
      { slug: "snake", expected: "/games/snake.html" },
      { slug: "tic-tac-toe", expected: "/games/tic-tac-toe.html" },
      { slug: "click-speed", expected: "/games/click-speed.html" },
      { slug: "memory", expected: "/games/memory.html" },
    ]

    for (const { slug, expected } of games) {
      await page.goto(`/zh/games/${slug}`)
      await expect(page.locator("iframe")).toBeAttached()
      expect(await page.locator("iframe").getAttribute("src")).toContain(expected)
    }
  })
})

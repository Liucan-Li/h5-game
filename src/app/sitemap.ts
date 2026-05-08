import type { MetadataRoute } from "next"
import { getAllGames, getCategories } from "@/lib/games"
import { routing } from "@/i18n/routing"

export const BASE_URL = "https://www.playgo.me"

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = routing.locales
  const games = getAllGames()
  const categories = getCategories()
  const now = new Date()

  const homeUrls = locales.map((locale) => ({
    url: `${BASE_URL}/${locale}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 1.0,
  }))

  const gamesListUrls = locales.map((locale) => ({
    url: `${BASE_URL}/${locale}/games`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }))

  const categoryUrls = locales.flatMap((locale) =>
    categories.map((cat) => ({
      url: `${BASE_URL}/${locale}/categories/${cat.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }))
  )

  const gameUrls = locales.flatMap((locale) =>
    games.map((game) => ({
      url: `${BASE_URL}/${locale}/games/${game.slug}`,
      lastModified: new Date(game.createdAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }))
  )

  return [...homeUrls, ...gamesListUrls, ...categoryUrls, ...gameUrls]
}

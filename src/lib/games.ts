import gamesData from "@/data/games.json"
import categoriesData from "@/data/categories.json"
import type { Game, Category } from "./types"

export type { Game, Category }

export function getAllGames(): Game[] {
  return gamesData as Game[]
}

export function getGameBySlug(slug: string): Game | undefined {
  return (gamesData as Game[]).find((g) => g.slug === slug)
}

export function getGamesByCategory(categorySlug: string): Game[] {
  return (gamesData as Game[]).filter((g) => g.category === categorySlug)
}

export function getFeaturedGames(): Game[] {
  return (gamesData as Game[]).filter((g) => g.featured)
}

export function getCategories(): Category[] {
  return categoriesData as Category[]
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return (categoriesData as Category[]).find((c) => c.slug === slug)
}

export function searchGames(query: string): Game[] {
  const q = query.toLowerCase()
  return (gamesData as Game[]).filter(
    (g) =>
      g.title.toLowerCase().includes(q) ||
      g.description.toLowerCase().includes(q) ||
      g.tags.some((t) => t.toLowerCase().includes(q)) ||
      getCategoryBySlug(g.category)?.name.toLowerCase().includes(q)
  )
}

export function getRelatedGames(game: Game, count = 6): Game[] {
  const all = gamesData as Game[]
  const scored = all
    .filter((g) => g.id !== game.id)
    .map((g) => {
      let score = 0
      if (g.category === game.category) score += 3
      g.tags.forEach((t) => {
        if (game.tags.includes(t)) score += 1
      })
      if (g.featured) score += 1
      return { game: g, score }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
  return scored.map((s) => s.game)
}

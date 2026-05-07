import type { Game, Category } from "./types"

type LocalizedGame = Game & { title: string; description: string; tags: string[] }
type LocalizedCategory = Category & { name: string; description: string }

const messageCache: Record<string, Record<string, unknown>> = {}

function loadMessages(locale: string): Record<string, unknown> {
  if (messageCache[locale]) return messageCache[locale]
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const msgs = require(`../messages/${locale}.json`)
    messageCache[locale] = msgs
    return msgs
  } catch {
    return {}
  }
}

export function getLocalizedGame(game: Game, locale: string): LocalizedGame {
  if (locale === "zh") return { ...game }

  const messages = loadMessages(locale)
  const games = messages.games as Record<string, { title: string; description: string }> | undefined
  const localized = games?.[game.slug]
  const tagsMap = messages.tags as Record<string, string> | undefined

  return {
    ...game,
    title: localized?.title || game.title,
    description: localized?.description || game.description,
    tags: tagsMap ? game.tags.map((tag) => tagsMap[tag] || tag) : game.tags,
  }
}

export function getLocalizedCategory(cat: Category, locale: string): LocalizedCategory {
  if (locale === "zh") return cat

  const messages = loadMessages(locale)
  const cats = messages.categories as Record<string, { name: string; description: string }> | undefined
  const loc = cats?.[cat.slug]

  if (!loc) return cat

  return {
    ...cat,
    name: loc.name || cat.name,
    description: loc.description || cat.description,
  }
}

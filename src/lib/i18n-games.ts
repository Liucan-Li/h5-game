import type { Game } from "./types"

type LocalizedGame = Game & { title: string; description: string }

// Lazily cache loaded message files
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
  if (locale === "zh") return game

  const messages = loadMessages(locale)
  const games = messages.games as Record<string, { title: string; description: string }> | undefined
  const localized = games?.[game.slug]

  if (!localized) return game

  return {
    ...game,
    title: localized.title || game.title,
    description: localized.description || game.description,
  }
}

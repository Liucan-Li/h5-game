import type { Game, Category } from "./types"

export const BASE_URL = "https://www.playgo.me"

export function websiteJsonLd(locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "LeYou",
    url: BASE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${BASE_URL}/${locale}/games?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  }
}

export function videoGameJsonLd(
  game: Game,
  localizedTitle: string,
  localizedDescription: string,
  locale: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    name: localizedTitle,
    description: localizedDescription,
    url: `${BASE_URL}/${locale}/games/${game.slug}`,
    image: `${BASE_URL}${game.thumbnail}`,
    genre: game.category,
    playMode: "SinglePlayer",
    applicationCategory: "Game",
  }
}

export function breadcrumbJsonLd(
  items: Array<{ name: string; url: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

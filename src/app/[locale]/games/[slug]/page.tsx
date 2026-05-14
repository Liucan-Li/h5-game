import { notFound } from "next/navigation"
import Link from "next/link"
import { getGameBySlug, getRelatedGames, getCategoryBySlug } from "@/lib/games"
import { getLocalizedGame, getLocalizedCategory } from "@/lib/i18n-games"
import { videoGameJsonLd } from "@/lib/structured-data"
import GameIframe from "@/components/GameIframe"
import GameGrid from "@/components/GameGrid"
import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

const BASE_URL: string = "https://www.playgo.me"
const EN_MESSAGES = require("@/messages/en.json")

interface Props {
  params: Promise<{ slug: string; locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params
  const game = getGameBySlug(slug)
  if (!game) return { title: "Game not found" }
  const localized = getLocalizedGame(game, locale)
  const canonicalUrl = BASE_URL + "/" + locale + "/games/" + slug

  const gameMessages = (EN_MESSAGES.games as Record<string, { metaTitle?: string; metaDesc?: string }>) || {}
  const seoTitle = gameMessages[slug]?.metaTitle
  const seoDesc = gameMessages[slug]?.metaDesc

  const title = seoTitle || (localized.title + " | LeYou")
  const description = seoDesc || localized.description
  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        zh: `${BASE_URL}/zh/games/${slug}`,
        "zh-TW": `${BASE_URL}/zh-TW/games/${slug}`,
        en: `${BASE_URL}/en/games/${slug}`,
        ja: `${BASE_URL}/ja/games/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "LeYou",
      locale,
      type: "article",
      images: [{ url: `${BASE_URL}${game.thumbnail}`, width: 400, height: 400, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${BASE_URL}${game.thumbnail}`],
    },
  }
}

export default async function GamePage({ params }: Props) {
  const { slug, locale } = await params
  const game = getGameBySlug(slug)
  if (!game) notFound()

  const localized = getLocalizedGame(game, locale)
  const category = getCategoryBySlug(game.category)
  const localizedCat = category ? getLocalizedCategory(category, locale) : null
  const related = getRelatedGames(game, 6)
  const [t, tSection] = await Promise.all([
    getTranslations({ locale, namespace: "breadcrumb" }),
    getTranslations({ locale, namespace: "section" }),
  ])

  const jsonLd = videoGameJsonLd(game, localized.title, localized.description, locale)

  const catClass = `cat-${game.category.toLowerCase()}`

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-xs text-[var(--text-muted)]">
        <Link href={`/${locale}`} className="transition-colors hover:text-[var(--text-primary)]">{t("home")}</Link>
        <span className="text-[var(--border-default)]">/</span>
        <Link href={`/${locale}/games`} className="transition-colors hover:text-[var(--text-primary)]">{t("games")}</Link>
        <span className="text-[var(--border-default)]">/</span>
        {category && (
          <>
            <Link href={`/${locale}/categories/${category.slug}`} className={`transition-colors hover:text-[var(--cat-from)] ${catClass}`}>
              {localizedCat?.name ?? category.name}
            </Link>
            <span className="text-[var(--border-default)]">/</span>
          </>
        )}
        <span className="text-[var(--text-secondary)]">{localized.title}</span>
      </nav>

      {/* Game Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--text-primary)] sm:text-3xl">{localized.title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--text-secondary)]">
          {localized.description}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {category && (
            <Link
              href={`/${locale}/categories/${category.slug}`}
              className={`inline-flex items-center gap-1.5 rounded-xl border border-[var(--border-default)] px-3.5 py-1.5 text-xs font-medium text-[var(--text-muted)] transition-all hover:border-[var(--accent-1)]/30 hover:text-[var(--accent-1)] ${catClass}`}
            >
              <span>{category.icon}</span>
              <span>{localizedCat?.name ?? category.name}</span>
            </Link>
          )}
          {localized.tags.map((tag) => (
            <span
              key={tag}
              className={`rounded-xl px-3 py-1.5 text-xs font-medium ${catClass}`}
              style={{
                background: "linear-gradient(135deg, color-mix(in srgb, var(--cat-from) 12%, transparent), color-mix(in srgb, var(--cat-to) 8%, transparent))",
                color: "var(--cat-from)",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Game Play Area */}
      <div className="mb-12">
        <GameIframe game={game} />
      </div>

      {/* Related Games */}
      {related.length > 0 && (
        <section>
          <GameGrid title={tSection("related")} games={related} locale={locale} />
        </section>
      )}
    </div>
  )
}

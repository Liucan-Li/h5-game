import { notFound } from "next/navigation"
import Link from "next/link"
import { getGameBySlug, getRelatedGames, getCategoryBySlug } from "@/lib/games"
import { getLocalizedGame } from "@/lib/i18n-games"
import GameIframe from "@/components/GameIframe"
import GameGrid from "@/components/GameGrid"
import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

interface Props {
  params: Promise<{ slug: string; locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params
  const game = getGameBySlug(slug)
  if (!game) return { title: "Game not found" }
  const localized = getLocalizedGame(game, locale)
  return {
    title: `${localized.title} - 乐游`,
    description: localized.description,
  }
}

export default async function GamePage({ params }: Props) {
  const { slug, locale } = await params
  const game = getGameBySlug(slug)
  if (!game) notFound()

  const localized = getLocalizedGame(game, locale)
  const category = getCategoryBySlug(game.category)
  const related = getRelatedGames(game, 6)
  const t = await getTranslations({ locale, namespace: "breadcrumb" })
  const tSection = await getTranslations({ locale, namespace: "section" })

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-xs text-[var(--text-muted)]">
        <Link href={`/${locale}`} className="transition-colors hover:text-[var(--text-primary)]">{t("home")}</Link>
        <span className="text-[var(--border-default)]">/</span>
        <Link href={`/${locale}/games`} className="transition-colors hover:text-[var(--text-primary)]">{t("games")}</Link>
        <span className="text-[var(--border-default)]">/</span>
        {category && (
          <>
            <Link href={`/${locale}/categories/${category.slug}`} className="transition-colors hover:text-[var(--text-primary)]">
              {category.name}
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
              className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border-default)] bg-white/[0.03] px-3.5 py-1.5 text-xs font-medium text-[var(--text-muted)] transition-all hover:border-[var(--accent-1)]/30 hover:text-[var(--accent-1)]"
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </Link>
          )}
          {game.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-xl bg-gradient-to-r from-[var(--accent-1)]/10 to-[var(--accent-2)]/10 px-3 py-1.5 text-xs font-medium text-[var(--accent-2)]"
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

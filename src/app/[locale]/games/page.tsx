import type { Metadata } from "next"
import { getAllGames, searchGames } from "@/lib/games"
import GameGrid from "@/components/GameGrid"
import CategoryNav from "@/components/CategoryNav"
import SearchForm from "./SearchForm"
import { getTranslations } from "next-intl/server"

const BASE_URL = "https://www.playgo.me"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "meta" })
  const title = t("allGamesTitle")
  const desc = t("siteDesc")
  return {
    title,
    description: desc,
    alternates: {
      canonical: `${BASE_URL}/${locale}/games`,
      languages: {
        zh: `${BASE_URL}/zh/games`,
        "zh-TW": `${BASE_URL}/zh-TW/games`,
        en: `${BASE_URL}/en/games`,
        ja: `${BASE_URL}/ja/games`,
      },
    },
    openGraph: {
      title,
      description: desc,
      url: `${BASE_URL}/${locale}/games`,
      siteName: "LeYou",
      locale,
      type: "website",
    },
  }
}

export default async function GamesPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ q?: string }>
}) {
  const { locale } = await params
  const { q } = await searchParams
  const t = await getTranslations({ locale, namespace: "search" })
  const tBc = await getTranslations({ locale, namespace: "breadcrumb" })
  const games = q ? searchGames(q) : getAllGames()

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--text-primary)] sm:text-3xl">
          {q ? (
            <>
              {tBc("games")}: &ldquo;<span className="text-gradient">{q}</span>&rdquo;
            </>
          ) : (
            tBc("games")
          )}
        </h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          {q ? t("found", { count: games.length }) : t("total", { count: games.length })}
        </p>
      </div>

      {/* Mobile search */}
      <div className="mb-6 sm:hidden">
        <SearchForm />
      </div>

      {/* Category filter */}
      <div className="mb-8">
        <CategoryNav locale={locale} />
      </div>

      {/* Game grid */}
      <GameGrid title="" games={games} locale={locale} />
    </div>
  )
}

import type { Metadata } from "next"
import { getAllGames, searchGames } from "@/lib/games"
import GameGrid from "@/components/GameGrid"
import CategoryNav from "@/components/CategoryNav"
import SearchForm from "./SearchForm"

export const metadata: Metadata = {
  title: "全部游戏 - H5 游戏平台",
}

export default async function GamesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const games = q ? searchGames(q) : getAllGames()

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white sm:text-3xl">
          {q ? (
            <>
              搜索: "<span className="text-gradient">{q}</span>"
            </>
          ) : (
            "全部游戏"
          )}
        </h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          {q ? `找到 ${games.length} 个结果` : `共 ${games.length} 款游戏`}
        </p>
      </div>

      {/* Mobile search */}
      <div className="mb-6 sm:hidden">
        <SearchForm />
      </div>

      {/* Category filter */}
      <div className="mb-8">
        <CategoryNav />
      </div>

      {/* Game grid */}
      <GameGrid title="" games={games} />
    </div>
  )
}

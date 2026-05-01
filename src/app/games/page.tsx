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
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {q ? `搜索: "${q}"` : "全部游戏"}
          </h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {q ? `找到 ${games.length} 个结果` : `共 ${games.length} 款游戏`}
          </p>
        </div>
      </div>

      <div className="mb-6">
        <CategoryNav />
      </div>

      <div className="mb-6 sm:hidden">
        <SearchForm />
      </div>

      <GameGrid title="" games={games} />
    </div>
  )
}

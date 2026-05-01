import Link from "next/link"
import GameGrid from "@/components/GameGrid"
import { getFeaturedGames, getAllGames, getCategories } from "@/lib/games"

export default function HomePage() {
  const featured = getFeaturedGames()
  const all = getAllGames()
  const categories = getCategories()

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10">
      {/* Hero */}
      <section className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-white sm:text-4xl">
          H5 游戏平台
        </h1>
        <p className="mt-3 text-sm text-[var(--muted)] sm:text-base">
          聚合海量 H5 小游戏，无需下载，打开即玩
        </p>
        <div className="mt-6 flex justify-center">
          <Link
            href="/games"
            className="rounded-xl bg-[var(--accent)] px-6 py-2.5 text-sm font-medium text-white hover:bg-[var(--accent-hover)] transition-colors"
          >
            浏览全部游戏
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="mb-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">游戏分类</h2>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4 hover:border-[var(--accent)] hover:bg-[var(--card-hover)] transition-all group"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent)]/10 text-lg group-hover:bg-[var(--accent)]/20 transition-colors">
                {cat.icon}
              </span>
              <div>
                <p className="text-sm font-medium text-white">{cat.name}</p>
                <p className="text-xs text-[var(--muted)]">{cat.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="mb-10">
        <GameGrid title="🔥 推荐游戏" games={featured} />
      </section>

      {/* All Games */}
      <section>
        <GameGrid title="🎮 全部游戏" games={all} />
      </section>
    </div>
  )
}

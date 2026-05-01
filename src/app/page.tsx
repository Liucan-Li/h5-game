import Link from "next/link"
import GameGrid from "@/components/GameGrid"
import { getFeaturedGames, getAllGames, getCategories } from "@/lib/games"

export default function HomePage() {
  const featured = getFeaturedGames()
  const all = getAllGames()
  const categories = getCategories()

  return (
    <div>
      {/* ── Hero ── */}
      <section className="hero-gradient relative overflow-hidden pb-16 pt-12 sm:pb-24 sm:pt-20">
        {/* Floating emoji decorations */}
        <div className="pointer-events-none absolute inset-0 select-none overflow-hidden">
          <span className="absolute left-[10%] top-[15%] text-2xl opacity-20 animate-float">🎮</span>
          <span className="absolute right-[15%] top-[20%] text-3xl opacity-20 animate-float-delayed">🕹️</span>
          <span className="absolute left-[20%] bottom-[25%] text-xl opacity-15 animate-float" style={{ animationDelay: "2s" }}>⭐</span>
          <span className="absolute right-[25%] bottom-[30%] text-2xl opacity-15 animate-float-delayed" style={{ animationDelay: "0.5s" }}>🎯</span>
          <span className="absolute left-[50%] top-[10%] text-lg opacity-10 animate-float" style={{ animationDelay: "1s" }}>🚀</span>
        </div>

        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-[var(--accent-1)]/20 bg-[var(--accent-1)]/8 px-4 py-1.5 text-xs font-medium text-[var(--accent-2)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-2)] animate-pulse-glow" />
            {all.length} 款游戏在线畅玩
          </div>

          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            <span className="text-white">发现你的</span>
            <br />
            <span className="text-gradient">下一款最爱游戏</span>
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
            聚合海量 H5 小游戏，无需下载，打开即玩
          </p>

          <div className="mt-8 flex items-center justify-center gap-3">
            <Link
              href="/games"
              className="group relative inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[var(--accent-glow)] transition-all duration-300 hover:shadow-xl hover:shadow-[var(--accent-glow)] hover:scale-[1.02]"
            >
              浏览全部游戏
              <svg className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6">
        <div className="mb-6 flex items-center gap-3">
          <h2 className="text-lg font-bold text-white">游戏分类</h2>
          <div className="h-px flex-1 bg-gradient-to-r from-[var(--border-default)] to-transparent" />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="group relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-card)] p-4 transition-all duration-300 hover:border-[var(--accent-1)]/30 hover:shadow-lg hover:shadow-[var(--accent-glow)]"
            >
              {/* Hover bg effect */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[var(--accent-1)]/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="relative z-10 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--accent-1)]/15 to-[var(--accent-2)]/15 text-lg transition-transform duration-200 group-hover:scale-110">
                  {cat.icon}
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">{cat.name}</p>
                  <p className="text-xs text-[var(--text-muted)]">{cat.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Content ── */}
      <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6">
        <section className="mb-12">
          <GameGrid title="🔥 推荐游戏" games={featured} />
        </section>

        <section>
          <GameGrid title="🎮 全部游戏" games={all} />
        </section>
      </div>
    </div>
  )
}

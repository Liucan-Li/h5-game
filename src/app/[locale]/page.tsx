import Link from "next/link"
import GameGrid from "@/components/GameGrid"
import CategoryGridSection from "@/components/CategoryGridSection"
import { getFeaturedGames, getAllGames } from "@/lib/games"
import { getTranslations } from "next-intl/server"

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "hero" })
  const tSection = await getTranslations({ locale, namespace: "section" })
  const featured = getFeaturedGames()
  const all = getAllGames()

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
            {t("badge", { count: all.length })}
          </div>

          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            <span className="text-[var(--text-primary)]">{t("title1")}</span>
            <br />
            <span className="text-gradient">{t("title2")}</span>
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
            {t("subtitle")}
          </p>

          <div className="mt-8 flex items-center justify-center gap-3">
            <Link
              href={`/${locale}/games`}
              className="group relative inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[var(--accent-glow)] transition-all duration-300 hover:shadow-xl hover:shadow-[var(--accent-glow)] hover:scale-[1.02]"
            >
              {t("browseBtn")}
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
          <h2 className="text-lg font-bold text-[var(--text-primary)]">{tSection("categories")}</h2>
          <div className="h-px flex-1 bg-gradient-to-r from-[var(--border-default)] to-transparent" />
        </div>
        <CategoryGridSection locale={locale} />
      </section>

      {/* ── Content ── */}
      <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6">
        <section className="mb-12">
          <GameGrid title={tSection("featured")} games={featured} locale={locale} />
        </section>
        <section>
          <GameGrid title={tSection("allGames")} games={all} locale={locale} />
        </section>
      </div>
    </div>
  )
}

import Link from "next/link"
import GameGrid from "@/components/GameGrid"
import CategoryGridSection from "@/components/CategoryGridSection"
import { getFeaturedGames, getAllGames } from "@/lib/games"
import { getTranslations } from "next-intl/server"
import { websiteJsonLd } from "@/lib/structured-data"

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

  const jsonLd = websiteJsonLd(locale)

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Hero ── */}
      <section className="hero-bg hero-grid relative overflow-hidden pb-16 pt-16 sm:pb-28 sm:pt-24">
        {/* Animated geometric shapes */}
        <div className="pointer-events-none absolute inset-0 select-none overflow-hidden">
          {/* Floating circle */}
          <div className="absolute left-[8%] top-[12%] h-16 w-16 animate-float-shape rounded-full opacity-20 sm:h-20 sm:w-20"
            style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}
          />
          {/* Floating square */}
          <div className="absolute right-[12%] top-[18%] h-14 w-14 animate-float-shape-delayed rounded-2xl opacity-15 sm:h-18 sm:w-18"
            style={{ background: "linear-gradient(135deg, #ec4899, #f43f5e)" }}
          />
          {/* Floating triangle (approximate with rotated square) */}
          <div className="absolute left-[20%] bottom-[20%] h-12 w-12 animate-float-shape rotate-45 rounded-lg opacity-20 sm:h-16 sm:w-16"
            style={{ background: "linear-gradient(135deg, #06b6d4, #3b82f6)" }}
          />
          {/* Small dots */}
          <div className="absolute right-[20%] top-[40%] h-3 w-3 animate-pulse-subtle rounded-full opacity-30"
            style={{ background: "#a855f7" }}
          />
          <div className="absolute left-[45%] bottom-[35%] h-2 w-2 animate-pulse-subtle rounded-full opacity-25"
            style={{ background: "#06b6d4", animationDelay: "1s" }}
          />
          <div className="absolute right-[35%] bottom-[15%] h-2.5 w-2.5 animate-pulse-subtle rounded-full opacity-20"
            style={{ background: "#ec4899", animationDelay: "0.5s" }}
          />
          {/* Ring */}
          <div className="absolute left-[55%] top-[8%] h-20 w-20 animate-float-shape rounded-full border border-white/10 opacity-30 sm:h-24 sm:w-24" />
          {/* Small diamond */}
          <div className="absolute right-[8%] bottom-[25%] h-8 w-8 animate-float-shape-delayed rotate-45 rounded-md opacity-25"
            style={{ background: "linear-gradient(135deg, #f59e0b, #ef4444)" }}
          />
        </div>

        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--accent-1)]/25 bg-gradient-to-r from-[var(--accent-1)]/10 to-[var(--accent-2)]/10 px-4 py-1.5 text-xs font-medium text-[var(--accent-2)] animate-fade-in-up">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent-2)] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--accent-2)]" />
            </span>
            {t("badge", { count: all.length })}
          </div>

          <h1 className="animate-fade-in-up text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl" style={{ animationDelay: "0.1s" }}>
            <span className="text-[var(--text-on-dark)]">{t("title1")}</span>
            <br />
            <span className="text-gradient">{t("title2")}</span>
          </h1>

          <p className="animate-fade-in-up mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[var(--text-on-dark-muted)] sm:text-base" style={{ animationDelay: "0.2s" }}>
            {t("subtitle")}
          </p>

          <div className="animate-fade-in-up mt-8 flex items-center justify-center gap-3" style={{ animationDelay: "0.3s" }}>
            <Link
              href={`/${locale}/games`}
              className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-2xl bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[var(--accent-1)]/30 transition-all duration-300 hover:shadow-xl hover:shadow-[var(--accent-1)]/40 hover:scale-[1.03]"
            >
              {/* Button shimmer */}
              <span className="absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <span className="relative">{t("browseBtn")}</span>
              <svg className="relative h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
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
          <div className="h-px flex-1 bg-gradient-to-r from-[var(--border-accent)] to-transparent" />
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

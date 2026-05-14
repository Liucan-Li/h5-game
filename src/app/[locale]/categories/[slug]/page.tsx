import { notFound } from "next/navigation"
import Link from "next/link"
import { getCategoryBySlug, getGamesByCategory, getCategories } from "@/lib/games"
import { getLocalizedCategory } from "@/lib/i18n-games"
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/structured-data"
import GameGrid from "@/components/GameGrid"
import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { routing } from "@/i18n/routing"

const BASE_URL = "https://www.playgo.me"

interface Props {
  params: Promise<{ slug: string; locale: string }>
}

export function generateStaticParams() {
  const locales = routing.locales
  const categories = getCategories()
  return locales.flatMap((locale) =>
    categories.map((cat) => ({ locale, slug: cat.slug }))
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params
  const category = getCategoryBySlug(slug)
  if (!category) return { title: "Category not found" }
  const localized = getLocalizedCategory(category, locale)
  const t = await getTranslations({ locale, namespace: "meta" })
  const title = t("categoryTitle", { name: localized.name })
  const description = localized.description
  const canonicalUrl = `${BASE_URL}/${locale}/categories/${slug}`
  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        zh: `${BASE_URL}/zh/categories/${slug}`,
        "zh-TW": `${BASE_URL}/zh-TW/categories/${slug}`,
        en: `${BASE_URL}/en/categories/${slug}`,
        ja: `${BASE_URL}/ja/categories/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "LeYou",
      locale,
      type: "website",
    },
  }
}

export default async function CategoryPage({ params }: Props) {
  const { slug, locale } = await params
  const category = getCategoryBySlug(slug)
  if (!category) notFound()

  const localizedCat = getLocalizedCategory(category, locale)
  const games = getGamesByCategory(slug)
  const [t, tBc] = await Promise.all([
    getTranslations({ locale, namespace: "category" }),
    getTranslations({ locale, namespace: "breadcrumb" }),
  ])

  const jsonLd = breadcrumbJsonLd([
    { name: tBc("home"), url: `${BASE_URL}/${locale}` },
    { name: localizedCat.name, url: `${BASE_URL}/${locale}/categories/${slug}` },
  ])

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-xs text-[var(--text-muted)]">
        <Link href={`/${locale}`} className="transition-colors hover:text-[var(--text-primary)]">{tBc("home")}</Link>
        <span className="text-[var(--border-default)]">/</span>
        <span className="text-[var(--text-secondary)]">{localizedCat.name}</span>
      </nav>

      {/* Category header */}
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <span className={`flex h-14 w-14 items-center justify-center rounded-2xl text-2xl cat-${slug}`}
            style={{
              background: "linear-gradient(135deg, color-mix(in srgb, var(--cat-from) 15%, transparent), color-mix(in srgb, var(--cat-to) 10%, transparent))",
              color: "var(--cat-from)",
            }}
          >
            {category.icon}
          </span>
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)] sm:text-3xl">
              {t("gamesOf", { name: localizedCat.name })}
            </h1>
            <p className="mt-1 text-sm text-[var(--text-muted)]">{localizedCat.description}</p>
          </div>
        </div>
      </div>

      {/* SEO intro */}
      {localizedCat.intro && (
        <div className="mb-8 max-w-3xl text-sm leading-relaxed text-[var(--text-secondary)]">
          {localizedCat.intro}
        </div>
      )}

      <GameGrid
        title={t("gameCount", { count: games.length })}
        games={games}
        locale={locale}
      />

      {/* FAQ section */}
      {localizedCat.faq && localizedCat.faq.length > 0 && (
        <section className="mt-12 border-t border-[var(--border-default)] pt-10">
          <h2 className="mb-6 text-lg font-bold text-[var(--text-primary)]">
            Frequently Asked Questions
          </h2>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(localizedCat.faq)) }}
          />
          <div className="space-y-4">
            {localizedCat.faq.map((item, i) => (
              <div key={i} className="rounded-xl border border-[var(--border-default)] bg-white/[0.02] p-4">
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">{item.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">{item.a}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

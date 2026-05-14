import Link from "next/link"
import { getCategories } from "@/lib/games"
import { getLocalizedCategory } from "@/lib/i18n-games"

interface Props {
  locale: string
}

export default function CategoryGridSection({ locale }: Props) {
  const categories = getCategories()

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {categories.map((cat) => {
        const localized = getLocalizedCategory(cat, locale)
        const catClass = `cat-${cat.slug}`
        return (
          <Link
            key={cat.id}
            href={`/${locale}/categories/${cat.slug}`}
            className={`group relative overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border-default)] bg-[var(--bg-card)] p-5 transition-all duration-300 hover:shadow-lg ${catClass}`}
            style={{
              boxShadow: "var(--shadow-card)",
            }}
          >
            {/* Hover gradient background */}
            <div
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                background: "linear-gradient(135deg, color-mix(in srgb, var(--cat-from) 8%, transparent), color-mix(in srgb, var(--cat-to) 4%, transparent))",
              }}
            />

            {/* Corner glow */}
            <div
              className="pointer-events-none absolute -top-8 -right-8 h-24 w-24 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
              style={{ background: "color-mix(in srgb, var(--cat-from) 15%, transparent)" }}
            />

            <div className="relative z-10 flex items-center gap-4">
              {/* Icon with gradient background */}
              <span
                className="flex h-12 w-12 items-center justify-center rounded-xl text-xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
                style={{
                  background: "linear-gradient(135deg, color-mix(in srgb, var(--cat-from) 15%, transparent), color-mix(in srgb, var(--cat-to) 10%, transparent))",
                  color: "var(--cat-from)",
                }}
              >
                {cat.icon}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[var(--text-primary)] transition-colors duration-200 group-hover:text-[var(--cat-from)]">
                  {localized.name}
                </p>
                <p className="mt-0.5 truncate text-xs text-[var(--text-muted)]">
                  {localized.description}
                </p>
              </div>
            </div>

            {/* Arrow indicator */}
            <svg
              className="absolute right-4 top-1/2 hidden h-4 w-4 -translate-y-1/2 text-[var(--cat-from)] opacity-0 transition-all duration-300 group-hover:opacity-100 sm:block"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        )
      })}
    </div>
  )
}

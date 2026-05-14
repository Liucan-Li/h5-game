"use client"

import Link from "next/link"
import { getCategories } from "@/lib/games"
import { getLocalizedCategory } from "@/lib/i18n-games"

interface Props {
  locale: string
  onSelect?: () => void
  /** Render as compact pills (used in mobile menu) */
  compact?: boolean
}

export default function CategoryNav({ locale, onSelect, compact }: Props) {
  const categories = getCategories()

  const baseClass = compact
    ? "group inline-flex items-center gap-1.5 rounded-xl bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-[var(--text-on-dark-muted)] transition-all duration-200 hover:bg-white/[0.08] hover:text-[var(--text-on-dark)]"
    : "group inline-flex items-center gap-1.5 rounded-xl border border-[var(--border-default)] px-3.5 py-2 text-xs font-medium text-[var(--text-muted)] transition-all duration-200 hover:border-[var(--accent-1)]/30 hover:bg-gradient-to-r hover:from-[var(--accent-1)]/8 hover:to-[var(--accent-2)]/8 hover:text-[var(--accent-1)]"

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => {
        const localized = getLocalizedCategory(cat, locale)
        return (
          <Link
            key={cat.id}
            href={`/${locale}/categories/${cat.slug}`}
            onClick={onSelect}
            className={baseClass}
          >
            <span className="transition-transform duration-200 group-hover:scale-110">{cat.icon}</span>
            <span>{localized.name}</span>
          </Link>
        )
      })}
    </div>
  )
}

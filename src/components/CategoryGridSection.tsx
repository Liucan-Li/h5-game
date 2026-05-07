import Link from "next/link"
import { getCategories } from "@/lib/games"

interface Props {
  locale: string
}

export default function CategoryGridSection({ locale }: Props) {
  const categories = getCategories()

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`/${locale}/categories/${cat.slug}`}
          className="group relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-card)] p-4 transition-all duration-300 hover:border-[var(--accent-1)]/30 hover:shadow-lg hover:shadow-[var(--accent-glow)]"
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[var(--accent-1)]/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="relative z-10 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--accent-1)]/15 to-[var(--accent-2)]/15 text-lg transition-transform duration-200 group-hover:scale-110">
              {cat.icon}
            </span>
            <div>
              <p className="text-sm font-semibold text-[var(--text-primary)]">{cat.name}</p>
              <p className="text-xs text-[var(--text-muted)]">{cat.description}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

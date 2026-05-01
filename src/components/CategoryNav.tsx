"use client"

import Link from "next/link"
import { getCategories } from "@/lib/games"

interface Props {
  onSelect?: () => void
}

export default function CategoryNav({ onSelect }: Props) {
  const categories = getCategories()

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`/categories/${cat.slug}`}
          onClick={onSelect}
          className="group inline-flex items-center gap-1.5 rounded-xl border border-[var(--border-default)] bg-white/[0.02] px-3.5 py-2 text-xs font-medium text-[var(--text-muted)] transition-all duration-200 hover:border-[var(--accent-1)]/30 hover:bg-gradient-to-r hover:from-[var(--accent-1)]/8 hover:to-[var(--accent-2)]/8 hover:text-white"
        >
          <span className="transition-transform duration-200 group-hover:scale-110">{cat.icon}</span>
          <span>{cat.name}</span>
        </Link>
      ))}
    </div>
  )
}

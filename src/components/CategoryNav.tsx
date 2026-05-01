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
          className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--muted)] hover:border-[var(--accent)] hover:text-white hover:bg-[var(--accent)]/10 transition-all"
        >
          <span>{cat.icon}</span>
          <span>{cat.name}</span>
        </Link>
      ))}
    </div>
  )
}

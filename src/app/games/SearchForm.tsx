"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function SearchForm() {
  const router = useRouter()
  const [query, setQuery] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/games?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索游戏..."
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--card-bg)] py-2.5 pl-10 pr-4 text-sm text-white placeholder-[var(--muted)] outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
        />
      </div>
    </form>
  )
}

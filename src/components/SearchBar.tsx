"use client"

import { useRouter } from "next/navigation"
import { useState, useCallback, useRef, useEffect } from "react"

export default function SearchBar() {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<{ slug: string; title: string }[]>([])
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([])
      return
    }
    try {
      const res = await fetch(`/api/games?q=${encodeURIComponent(q)}`)
      const data = await res.json()
      setResults(data.results.map((g: { slug: string; title: string }) => ({ slug: g.slug, title: g.title })))
      setOpen(true)
    } catch {
      setResults([])
    }
  }, [])

  const handleChange = (value: string) => {
    setQuery(value)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => doSearch(value), 200)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      setOpen(false)
      router.push(`/games?q=${encodeURIComponent(query.trim())}`)
    }
  }

  const handleSelect = (slug: string) => {
    setOpen(false)
    setQuery("")
    setResults([])
    router.push(`/games/${slug}`)
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.parentElement?.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative w-full">
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
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="搜索游戏... (⌘K)"
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--card-bg)] py-2 pl-10 pr-4 text-sm text-white placeholder-[var(--muted)] outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-colors"
          />
        </div>
      </form>

      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--card-bg)] shadow-xl">
          {results.map((item) => (
            <button
              key={item.slug}
              onClick={() => handleSelect(item.slug)}
              className="w-full px-4 py-2.5 text-left text-sm text-[var(--foreground)] hover:bg-[var(--card-hover)] transition-colors"
            >
              {item.title}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

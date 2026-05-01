"use client"

import { useRouter } from "next/navigation"
import { useState, useCallback, useRef, useEffect } from "react"

export default function SearchBar() {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<{ slug: string; title: string; thumbnail: string; category: string }[]>([])
  const [open, setOpen] = useState(false)
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); return }
    try {
      const res = await fetch(`/api/games?q=${encodeURIComponent(q)}`)
      const data = await res.json()
      setResults(data.results.map((g: { slug: string; title: string; thumbnail: string; category: string }) => ({
        slug: g.slug, title: g.title, thumbnail: g.thumbnail, category: g.category
      })))
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
    if (query.trim()) { setOpen(false); router.push(`/games?q=${encodeURIComponent(query.trim())}`) }
  }

  const handleSelect = (slug: string) => {
    setOpen(false); setQuery(""); setResults([])
    router.push(`/games/${slug}`)
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); inputRef.current?.focus() }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.closest(".search-wrapper")) setOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="search-wrapper relative w-full">
      <form onSubmit={handleSubmit}>
        <div
          className={`relative flex items-center rounded-xl border bg-[var(--bg-secondary)] transition-all duration-200 ${
            focused
              ? "border-[var(--accent-1)] shadow-lg shadow-[var(--accent-glow)]"
              : "border-[var(--border-default)]"
          }`}
        >
          <svg className="ml-3.5 h-4 w-4 shrink-0 text-[var(--text-muted)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            onFocus={() => { setFocused(true); if (query.trim()) setOpen(true) }}
            onBlur={() => setFocused(false)}
            placeholder="搜索游戏..."
            className="w-full bg-transparent px-3 py-2.5 text-sm text-white placeholder-[var(--text-muted)] outline-none"
          />
          <kbd className="mr-3 hidden shrink-0 rounded-md border border-[var(--border-default)] bg-white/[0.03] px-1.5 py-0.5 text-[10px] text-[var(--text-muted)] md:inline-block">
            ⌘K
          </kbd>
        </div>
      </form>

      {/* Dropdown */}
      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-2 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-secondary)] shadow-xl shadow-black/40 animate-scale-in">
          <div className="px-3 py-2 text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
            游戏
          </div>
          {results.map((item) => (
            <button
              key={item.slug}
              onClick={() => handleSelect(item.slug)}
              className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm text-[var(--text-secondary)] transition-colors hover:bg-white/[0.04] hover:text-white"
            >
              <div className="h-8 w-8 shrink-0 overflow-hidden rounded-lg bg-[var(--bg-card)]">
                <img src={item.thumbnail} alt="" className="h-full w-full object-cover" />
              </div>
              <span>{item.title}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

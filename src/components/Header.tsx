"use client"

import Link from "next/link"
import { useState } from "react"
import SearchBar from "./SearchBar"
import CategoryNav from "./CategoryNav"

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent)] text-sm font-bold text-white">
            H5
          </span>
          <span className="hidden text-lg font-bold sm:block">游戏平台</span>
        </Link>

        <div className="hidden md:block flex-1 max-w-md">
          <SearchBar />
        </div>

        <nav className="hidden md:flex items-center gap-1">
          <Link
            href="/"
            className="rounded-lg px-3 py-2 text-sm text-[var(--muted)] hover:bg-[var(--card-bg)] hover:text-white transition-colors"
          >
            首页
          </Link>
          <Link
            href="/games"
            className="rounded-lg px-3 py-2 text-sm text-[var(--muted)] hover:bg-[var(--card-bg)] hover:text-white transition-colors"
          >
            全部游戏
          </Link>
        </nav>

        <button
          className="ml-auto flex h-9 w-9 items-center justify-center rounded-lg text-[var(--muted)] hover:bg-[var(--card-bg)] hover:text-white md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="菜单"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            {menuOpen ? (
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            ) : (
              <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-[var(--border)] px-4 pb-4 md:hidden">
          <div className="py-3">
            <SearchBar />
          </div>
          <nav className="flex flex-col gap-1">
            <Link
              href="/"
              className="rounded-lg px-3 py-2 text-sm text-[var(--muted)] hover:bg-[var(--card-bg)] hover:text-white"
              onClick={() => setMenuOpen(false)}
            >
              首页
            </Link>
            <Link
              href="/games"
              className="rounded-lg px-3 py-2 text-sm text-[var(--muted)] hover:bg-[var(--card-bg)] hover:text-white"
              onClick={() => setMenuOpen(false)}
            >
              全部游戏
            </Link>
          </nav>
          <div className="mt-2">
            <CategoryNav onSelect={() => setMenuOpen(false)} />
          </div>
        </div>
      )}
    </header>
  )
}

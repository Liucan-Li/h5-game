"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import SearchBar from "./SearchBar"
import CategoryNav from "./CategoryNav"

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass-strong shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0">
          <span className="text-base font-semibold">
            <span className="text-gradient">乐游</span>
          </span>
        </Link>

        {/* Search - desktop */}
        <div className="hidden md:block flex-1 max-w-md">
          <SearchBar />
        </div>

        {/* Nav - desktop */}
        <nav className="hidden md:flex items-center gap-1">
          {[
            { href: "/", label: "首页" },
            { href: "/games", label: "全部游戏" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative rounded-xl px-4 py-2 text-sm font-medium text-[var(--text-secondary)] transition-all duration-200 hover:bg-black/[0.04] hover:text-[var(--text-primary)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile menu button */}
        <button
          className="ml-auto flex h-10 w-10 items-center justify-center rounded-xl text-[var(--text-muted)] transition-colors hover:bg-black/[0.04] hover:text-[var(--text-primary)] md:hidden"
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
        <div className="border-t border-[var(--border-default)] bg-[var(--bg-secondary)] px-4 pb-5 pt-3 md:hidden">
          <div className="mb-4">
            <SearchBar />
          </div>
          <nav className="mb-4 flex flex-col gap-1">
            {[
              { href: "/", label: "首页" },
              { href: "/games", label: "全部游戏" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-4 py-2.5 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-black/[0.04] hover:text-[var(--text-primary)]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <CategoryNav onSelect={() => setMenuOpen(false)} />
        </div>
      )}
    </header>
  )
}

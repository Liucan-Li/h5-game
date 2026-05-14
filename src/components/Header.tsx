"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useTranslations, useLocale } from "next-intl"
import SearchBar from "./SearchBar"
import CategoryNav from "./CategoryNav"
import LanguageSwitcher from "./LanguageSwitcher"

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const t = useTranslations("nav")
  const locale = useLocale()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [menuOpen])

  const navLinks = [
    { href: `/${locale}`, label: t("home") },
    { href: `/${locale}/games`, label: t("allGames") },
  ]

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass-strong shadow-lg shadow-black/30"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
        {/* Logo */}
        <Link href={`/${locale}`} className="flex items-center shrink-0">
          <span className="bg-gradient-to-r from-[var(--accent-1)] via-[var(--accent-2)] to-[var(--accent-3)] bg-clip-text text-base font-bold tracking-tight text-transparent">
            乐游
          </span>
        </Link>

        {/* Search - desktop */}
        <div className="hidden flex-1 max-w-md md:block">
          <SearchBar dark />
        </div>

        {/* Nav - desktop */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative rounded-xl px-4 py-2 text-sm font-medium text-[var(--text-on-dark-muted)] transition-all duration-200 hover:bg-white/[0.06] hover:text-[var(--text-on-dark)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Language switcher - desktop */}
        <div className="hidden md:block">
          <LanguageSwitcher dark />
        </div>

        {/* Mobile menu button */}
        <button
          className="ml-auto flex h-10 w-10 items-center justify-center rounded-xl text-[var(--text-on-dark-muted)] transition-colors hover:bg-white/[0.06] hover:text-[var(--text-on-dark)] md:hidden"
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

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Mobile menu panel */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-[300px] overflow-y-auto border-l border-[var(--border-glass)] bg-[var(--bg-deep-secondary)] shadow-2xl shadow-black/50 transition-all duration-300 md:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4">
          <span className="bg-gradient-to-r from-[var(--accent-1)] via-[var(--accent-2)] to-[var(--accent-3)] bg-clip-text text-sm font-bold text-transparent">
            乐游
          </span>
          <button
            onClick={() => setMenuOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-[var(--text-on-dark-muted)] transition-colors hover:bg-white/[0.06] hover:text-[var(--text-on-dark)]"
            aria-label="关闭"
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="px-4 pb-4">
          <SearchBar dark />
        </div>

        <nav className="mb-2 flex flex-col gap-0.5 px-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--text-on-dark-muted)] transition-colors hover:bg-white/[0.06] hover:text-[var(--text-on-dark)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="px-4 pb-4">
          <LanguageSwitcher dark />
        </div>

        <div className="px-4 pb-6">
          <p className="mb-3 text-[11px] font-medium uppercase tracking-wider text-[var(--text-on-dark-muted)]">
            分类
          </p>
          <CategoryNav locale={locale} onSelect={() => setMenuOpen(false)} compact />
        </div>
      </div>
    </header>
  )
}

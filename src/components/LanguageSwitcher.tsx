"use client"

import { usePathname, useRouter } from "next/navigation"
import { useLocale, useTranslations } from "next-intl"
import { useState, useRef, useEffect } from "react"
import { routing } from "@/i18n/routing"

const flagMap: Record<string, string> = {
  zh: "🇨🇳",
  "zh-TW": "🇭🇰",
  en: "🇺🇸",
  ja: "🇯🇵",
}

interface Props {
  dark?: boolean
}

export default function LanguageSwitcher({ dark }: Props) {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const t = useTranslations("lang")
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const switchLocale = (next: string) => {
    setOpen(false)
    const segments = pathname.split("/")
    if (routing.locales.includes(segments[1] as typeof routing.locales[number])) {
      segments[1] = next
    } else {
      segments.splice(1, 0, next)
    }
    router.push(segments.join("/") || "/")
  }

  const btnClass = dark
    ? "flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-xs font-medium text-[var(--text-secondary)] transition-all hover:border-white/[0.15] hover:text-[var(--text-primary)]"
    : "flex items-center gap-1.5 rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)] px-3 py-2 text-xs font-medium text-[var(--text-secondary)] transition-all hover:border-[var(--accent-1)]/40 hover:text-[var(--text-primary)]"

  const dropdownBg = dark
    ? "bg-[var(--bg-deep-secondary)] border-white/[0.08]"
    : "bg-[var(--bg-secondary)] border-[var(--border-default)]"

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={btnClass}
      >
        <span>{flagMap[locale]}</span>
        <span className="hidden sm:inline">{t(locale as keyof typeof flagMap)}</span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={`transition-transform ${open ? "rotate-180" : ""}`}>
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className={`absolute right-0 top-full z-50 mt-1.5 min-w-[140px] overflow-hidden rounded-xl border shadow-xl shadow-black/20 ${dropdownBg}`}>
          {routing.locales.map((loc) => (
            <button
              key={loc}
              onClick={() => switchLocale(loc)}
              className={`flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm transition-colors ${
                dark
                  ? "hover:bg-white/[0.06]"
                  : "hover:bg-black/[0.04]"
              } ${
                loc === locale
                  ? "text-white font-bold"
                  : dark ? "text-white/60" : "text-[var(--text-secondary)]"
              }`}
            >
              <span>{flagMap[loc]}</span>
              <span>{t(loc as keyof typeof flagMap)}</span>
              {loc === locale && (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="ml-auto shrink-0">
                  <path d="M2.5 7l3 3 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

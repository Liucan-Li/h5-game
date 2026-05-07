"use client"

import { useState, useRef, useCallback } from "react"
import type { Game } from "@/lib/types"
import { useTranslations } from "next-intl"

interface Props {
  game: Game
}

export default function GameIframe({ game }: Props) {
  const [loading, setLoading] = useState(true)
  const [fullscreen, setFullscreen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const t = useTranslations("game")

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {})
      setFullscreen(true)
    } else {
      document.exitFullscreen().catch(() => {})
      setFullscreen(false)
    }
  }, [])

  const aspectRatio = game.width && game.height ? game.width / game.height : 4 / 3

  return (
    <div
      ref={containerRef}
      className={`game-iframe-container ${fullscreen ? "!fixed inset-0 z-50 !rounded-none" : ""}`}
      style={fullscreen ? undefined : { aspectRatio: String(aspectRatio) }}
    >
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[var(--bg-primary)]">
          <div className="flex flex-col items-center gap-4">
            <div className="relative flex h-10 w-10 items-center justify-center">
              <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-[var(--accent-1)]" />
              <div className="absolute inset-1 animate-spin rounded-full border-2 border-transparent border-t-[var(--accent-2)]" style={{ animationDuration: "0.8s" }} />
            </div>
            <span className="text-xs text-[var(--text-muted)]">{t("loading")}</span>
          </div>
        </div>
      )}

      <iframe
        src={game.url}
        title={game.title}
        allow="fullscreen"
        onLoad={() => setLoading(false)}
        className={`transition-opacity duration-300 ${loading ? "invisible opacity-0" : "visible opacity-100"}`}
      />

      {/* Controls overlay */}
      <div className="absolute right-3 top-3 z-20 flex gap-2 opacity-0 transition-opacity duration-200 hover:opacity-100">
        <button
          onClick={toggleFullscreen}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-black/60 text-white backdrop-blur-sm transition-all hover:bg-black/80"
          aria-label={fullscreen ? t("exitFullscreen") : t("fullscreen")}
        >
          {fullscreen ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 3v3a2 2 0 01-2 2H3m18 0h-3a2 2 0 01-2-2V3m0 18v-3a2 2 0 012-2h3M3 16h3a2 2 0 012 2v3" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" />
            </svg>
          )}
        </button>
      </div>
    </div>
  )
}

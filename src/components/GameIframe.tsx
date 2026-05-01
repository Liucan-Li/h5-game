"use client"

import { useState, useRef, useCallback } from "react"
import type { Game } from "@/lib/types"

interface Props {
  game: Game
}

export default function GameIframe({ game }: Props) {
  const [loading, setLoading] = useState(true)
  const [fullscreen, setFullscreen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleFullscreen = useCallback(() => {
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
      className={`game-iframe-container ${fullscreen ? "fixed inset-0 z-50 rounded-none" : ""}`}
      style={fullscreen ? undefined : { aspectRatio: String(aspectRatio) }}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[var(--card-bg)]">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
            <span className="text-sm text-[var(--muted)]">加载中...</span>
          </div>
        </div>
      )}

      <iframe
        src={game.url}
        title={game.title}
        allow="fullscreen"
        onLoad={() => setLoading(false)}
        className={`${loading ? "invisible" : "visible"}`}
      />

      <button
        onClick={handleFullscreen}
        className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg bg-black/50 text-white backdrop-blur-sm hover:bg-black/70 transition-colors"
        aria-label="全屏"
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
  )
}

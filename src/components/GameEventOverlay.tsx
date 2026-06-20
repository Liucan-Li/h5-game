"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { useTranslations } from "next-intl"
import type { Achievement, PlayerStats } from "@/lib/achievements"
import { ACHIEVEMENTS, checkNewAchievements } from "@/lib/achievements"

interface GameMessage {
  source: string
  gameId: string
  type: string
  payload: {
    score?: number
    achievement?: string
    won?: boolean
    time?: number
    metadata?: Record<string, unknown>
  }
}

interface Props {
  gameSlug: string
  gameTitle: string
}

// Toast notification for score/achievement
function Toast({
  icon,
  title,
  description,
  onComplete,
}: {
  icon: string
  title: string
  description?: string
  onComplete: () => void
}) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3000)
    return () => clearTimeout(timer)
  }, [onComplete])
  return (
    <div className="animate-slide-up pointer-events-none fixed bottom-6 left-1/2 z-[200] -translate-x-1/2">
      <div className="flex items-center gap-3 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] px-5 py-3 shadow-2xl backdrop-blur-xl">
        <span className="text-2xl">{icon}</span>
        <div>
          <div className="text-sm font-bold text-[var(--text-primary)]">
            {title}
          </div>
          {description && (
            <div className="text-xs text-[var(--text-muted)]">
              {description}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function GameEventOverlay({ gameSlug, gameTitle }: Props) {
  const [toasts, setToasts] = useState<
    Array<{ id: number; icon: string; title: string; description?: string }>
  >([])
  const [stats, setStats] = useState<PlayerStats>({ gamesPlayed: [], highScores: {}, totalSessions: 0, bestScore: 0, dailyChallenges: 0 })
  const toastId = useRef(0)
  const t = useTranslations("gameEvent")

  // Load stats from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("leyou_player_stats")
      if (raw) {
        setStats(JSON.parse(raw))
      }
    } catch {}
  }, [])

  const addToast = useCallback(
    (icon: string, title: string, description?: string) => {
      const id = ++toastId.current
      setToasts((prev) => [...prev, { id, icon, title, description }])
      setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500)
    },
    [],
  )

  const saveStats = useCallback((newStats: PlayerStats) => {
    setStats(newStats)
    try {
      localStorage.setItem("leyou_player_stats", JSON.stringify(newStats))
    } catch {}
  }, [])

  // Listen for postMessage from games
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      const msg = event.data as GameMessage
      if (!msg || msg.source !== "leyou-game") return

      const { type, payload, gameId } = msg

      if (type === "SCORE_UPDATE" && payload.score) {
        // Submit to leaderboard API
        addToast("🎯", `${gameTitle}`, t("score", { score: payload.score }))
        fetch("/api/leaderboard", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ gameId, score: payload.score }),
        }).catch(() => {})
      }

      if (type === "GAME_COMPLETE") {
        const prevStats = { ...stats }
        const newStats: PlayerStats = {
          ...stats,
          gamesPlayed: stats.gamesPlayed.includes(gameId)
            ? stats.gamesPlayed
            : [...stats.gamesPlayed, gameId],
          highScores: {
            ...stats.highScores,
            [gameId]: payload.score
              ? Math.max(stats.highScores[gameId] || 0, payload.score)
              : stats.highScores[gameId] || 0,
          },
          totalSessions: stats.totalSessions + 1,
          bestScore: payload.score
            ? Math.max(stats.bestScore, payload.score)
            : stats.bestScore,
        }

        // Check for new achievements
        const newAchievements = checkNewAchievements(prevStats, newStats)
        for (const ach of newAchievements) {
          addToast(ach.icon, ach.title, ach.description)
        }

        // Show game result
        if (payload.won !== undefined) {
          addToast(
            payload.won ? "🎉" : "😔",
            payload.won ? t("victory") : t("gameOver"),
            payload.score
              ? t("finalScore", { score: payload.score })
              : undefined,
          )
        }

        saveStats(newStats)
      }

      if (type === "ACHIEVEMENT_UNLOCKED" && payload.achievement) {
        const ach = ACHIEVEMENTS.find((a) => a.id === payload.achievement)
        if (ach) {
          addToast(ach.icon, ach.title, ach.description)
        }
      }
    }

    window.addEventListener("message", handler)
    return () => window.removeEventListener("message", handler)
  }, [stats, addToast, saveStats, gameTitle, t])

  return (
    <>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          icon={toast.icon}
          title={toast.title}
          description={toast.description}
          onComplete={() =>
            setToasts((prev) => prev.filter((t) => t.id !== toast.id))
          }
        />
      ))}
    </>
  )
}

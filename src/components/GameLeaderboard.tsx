"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"

interface LeaderboardEntry {
  gameId: string
  score: number
  playerName: string
  timestamp: string
}

interface Props {
  gameSlug: string
}

export default function GameLeaderboard({ gameSlug }: Props) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const t = useTranslations("gameEvent")

  useEffect(() => {
    fetch(`/api/leaderboard?gameId=${gameSlug}&limit=5`)
      .then((r) => r.json())
      .then((data) => {
        setEntries(data.entries || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [gameSlug])

  if (loading) return null
  if (entries.length === 0) return null

  return (
    <div className="mb-6 rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-4">
      <h3 className="mb-3 text-sm font-bold text-[var(--text-primary)]">
        🏆 排行榜
      </h3>
      <div className="space-y-2">
        {entries.map((entry, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-xl bg-[var(--bg-secondary)] px-3 py-2 text-sm"
          >
            <div className="flex items-center gap-2">
              <span className="w-5 text-center text-xs font-bold text-[var(--text-muted)]">
                {i + 1}
              </span>
              <span className="font-medium text-[var(--text-primary)]">
                {entry.playerName}
              </span>
            </div>
            <span className="font-bold text-[var(--accent-1)]">
              {entry.score.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

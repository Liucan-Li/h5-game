"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import type { Achievement } from "@/lib/achievements"
import { ACHIEVEMENTS, getUnlockedAchievements, getProgress } from "@/lib/achievements"
import type { PlayerStats } from "@/lib/achievements"

export default function AchievementsPage() {
  const [stats, setStats] = useState<PlayerStats | null>(null)
  const [unlocked, setUnlocked] = useState<Achievement[]>([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem("leyou_player_stats")
      if (raw) {
        const s: PlayerStats = JSON.parse(raw)
        setStats(s)
        setUnlocked(getUnlockedAchievements(s))
      }
    } catch {}
  }, [])

  const progress = stats ? getProgress(stats) : { unlocked: 0, total: ACHIEVEMENTS.length, percentage: 0 }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="mb-2 text-3xl font-bold text-[var(--text-primary)]">
        成就
      </h1>
      <p className="mb-6 text-sm text-[var(--text-secondary)]">
        完成游戏中的特定目标来解锁成就
      </p>

      {/* Progress bar */}
      {stats && (
        <div className="mb-8">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-[var(--text-muted)]">
              已解锁 {progress.unlocked} / {progress.total}
            </span>
            <span className="font-bold text-[var(--accent-1)]">
              {progress.percentage}%
            </span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-[var(--bg-secondary)]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)] transition-all duration-500"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Achievement grid */}
      <div className="grid gap-3 sm:grid-cols-2">
        {ACHIEVEMENTS.map((ach) => {
          const isUnlocked = unlocked.some((u) => u.id === ach.id)
          return (
            <div
              key={ach.id}
              className={`rounded-2xl border p-4 transition-all ${
                isUnlocked
                  ? "border-[var(--accent-1)]/30 bg-[var(--bg-card)]"
                  : "border-[var(--border-default)] bg-[var(--bg-secondary)] opacity-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{ach.icon}</span>
                <div>
                  <div className="text-sm font-bold text-[var(--text-primary)]">
                    {ach.title}
                  </div>
                  <div className="text-xs text-[var(--text-muted)]">
                    {ach.description}
                  </div>
                </div>
                {isUnlocked && (
                  <span className="ml-auto text-lg">✅</span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {!stats && (
        <div className="mt-8 text-center text-sm text-[var(--text-muted)]">
          玩一局游戏后，成就进度将显示在这里
        </div>
      )}
    </div>
  )
}

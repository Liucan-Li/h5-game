import type { Game } from "@/lib/types"
import GameCard from "./GameCard"

interface Props {
  games: Game[]
  title?: string
}

export default function GameGrid({ games, title }: Props) {
  if (games.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--border-default)] bg-[var(--bg-secondary)]">
          <svg className="h-8 w-8 text-[var(--text-muted)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" />
            <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
            <line x1="9" y1="9" x2="9.01" y2="9" />
            <line x1="15" y1="9" x2="15.01" y2="9" />
          </svg>
        </div>
        <p className="text-sm text-[var(--text-muted)]">没有找到游戏</p>
      </div>
    )
  }

  return (
    <section>
      {title && (
        <div className="mb-5 flex items-center gap-3">
          <h2 className="text-lg font-bold text-[var(--text-primary)]">{title}</h2>
          <div className="h-px flex-1 bg-gradient-to-r from-[var(--border-default)] to-transparent" />
        </div>
      )}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {games.map((game) => (
          <div key={game.id} className="animate-fade-in-up">
            <GameCard game={game} />
          </div>
        ))}
      </div>
    </section>
  )
}

import type { Game } from "@/lib/types"
import GameCard from "./GameCard"

interface Props {
  games: Game[]
  title?: string
}

export default function GameGrid({ games, title }: Props) {
  if (games.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <svg
          className="mb-4 h-12 w-12 text-[var(--muted)]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
          <line x1="9" y1="9" x2="9.01" y2="9" />
          <line x1="15" y1="9" x2="15.01" y2="9" />
        </svg>
        <p className="text-sm text-[var(--muted)]">没有找到游戏</p>
      </div>
    )
  }

  return (
    <section>
      {title && (
        <h2 className="mb-4 text-lg font-bold text-white">{title}</h2>
      )}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </section>
  )
}

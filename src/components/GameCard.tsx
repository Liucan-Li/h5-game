import Link from "next/link"
import type { Game } from "@/lib/types"

interface Props {
  game: Game
}

export default function GameCard({ game }: Props) {
  return (
    <Link
      href={`/games/${game.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card-bg)] transition-all hover:border-[var(--accent)] hover:shadow-lg hover:shadow-[var(--accent-glow)] hover:-translate-y-0.5"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--card-hover)]">
        <img
          src={game.thumbnail}
          alt={game.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--card-bg)]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <h3 className="text-sm font-semibold text-white truncate">
          {game.title}
        </h3>
        <p className="line-clamp-2 text-xs leading-relaxed text-[var(--muted)]">
          {game.description}
        </p>
        <div className="mt-auto flex flex-wrap gap-1.5 pt-1.5">
          {game.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-[var(--accent)]/10 px-2 py-0.5 text-[10px] text-[var(--accent)]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  )
}

import Link from "next/link"
import type { Game } from "@/lib/types"

interface Props {
  game: Game
  locale: string
}

export default function GameCard({ game, locale }: Props) {
  const categoryClass = `cat-${game.category}`

  return (
    <Link
      href={`/${locale}/games/${game.slug}`}
      className={`group relative flex flex-col overflow-hidden rounded-[var(--radius-2xl)] border border-[var(--border-default)] bg-[var(--bg-card)] card-hover ${categoryClass}`}
    >
      {/* Top accent stripe */}
      <div className="absolute top-0 left-0 right-0 z-30 h-1 bg-gradient-to-r from-[var(--cat-from)] to-[var(--cat-to)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Thumbnail */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--bg-secondary)]">
        <img
          src={game.thumbnail}
          alt={game.title}
          className="h-full w-full object-cover transition-all duration-500 group-hover:scale-110"
          loading="lazy"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)]/90 via-transparent to-transparent" />

        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--cat-from)] to-[var(--cat-to)] shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl"
            style={{ boxShadow: "0 0 30px color-mix(in srgb, var(--cat-from) 40%, transparent)" }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
              <polygon points="8,5 19,12 8,19" />
            </svg>
          </div>
        </div>

        {/* Category badge */}
        <div className="absolute top-3 left-3 z-20">
          <span className="inline-flex items-center gap-1 rounded-lg bg-black/50 px-2.5 py-1 text-[10px] font-medium text-white/90 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-0">
            {game.category}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="relative z-20 flex flex-1 flex-col gap-1.5 p-4">
        <h3 className="truncate text-sm font-semibold text-[var(--text-primary)] transition-colors group-hover:text-[var(--cat-from)]">
          {game.title}
        </h3>
        <p className="line-clamp-2 text-xs leading-relaxed text-[var(--text-muted)]">
          {game.description}
        </p>

        {/* Tags */}
        {game.tags.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
            {game.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-gradient-to-r from-[var(--cat-from)]/10 to-[var(--cat-to)]/10 px-2.5 py-0.5 text-[10px] font-medium"
                style={{ color: "var(--cat-from)" }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}

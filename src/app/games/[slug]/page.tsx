import { notFound } from "next/navigation"
import Link from "next/link"
import { getGameBySlug, getRelatedGames, getCategoryBySlug } from "@/lib/games"
import GameIframe from "@/components/GameIframe"
import GameGrid from "@/components/GameGrid"
import type { Metadata } from "next"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const game = getGameBySlug(slug)
  if (!game) return { title: "游戏未找到" }
  return {
    title: `${game.title} - H5 游戏平台`,
    description: game.description,
  }
}

export default async function GamePage({ params }: Props) {
  const { slug } = await params
  const game = getGameBySlug(slug)
  if (!game) notFound()

  const category = getCategoryBySlug(game.category)
  const related = getRelatedGames(game, 6)

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10">
      {/* Breadcrumb */}
      <nav className="mb-4 flex items-center gap-2 text-sm text-[var(--muted)]">
        <Link href="/" className="hover:text-white transition-colors">
          首页
        </Link>
        <span>/</span>
        {category && (
          <>
            <Link
              href={`/categories/${category.slug}`}
              className="hover:text-white transition-colors"
            >
              {category.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-white">{game.title}</span>
      </nav>

      {/* Game Title & Info */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-white">{game.title}</h1>
        <p className="mt-2 text-sm text-[var(--muted)] leading-relaxed">
          {game.description}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {category && (
            <Link
              href={`/categories/${category.slug}`}
              className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--muted)] hover:border-[var(--accent)] hover:text-white transition-colors"
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </Link>
          )}
          {game.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-[var(--accent)]/10 px-3 py-1 text-xs text-[var(--accent)]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Game Play Area */}
      <div className="mb-10">
        <GameIframe game={game} />
      </div>

      {/* Related Games */}
      {related.length > 0 && (
        <section>
          <GameGrid title="🎯 同类推荐" games={related} />
        </section>
      )}
    </div>
  )
}

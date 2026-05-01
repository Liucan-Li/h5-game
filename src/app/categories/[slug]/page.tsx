import { notFound } from "next/navigation"
import Link from "next/link"
import { getCategoryBySlug, getGamesByCategory, getCategories } from "@/lib/games"
import GameGrid from "@/components/GameGrid"
import type { Metadata } from "next"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getCategories().map((cat) => ({ slug: cat.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const category = getCategoryBySlug(slug)
  if (!category) return { title: "分类未找到" }
  return {
    title: `${category.name}游戏 - H5 游戏平台`,
    description: category.description,
  }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  const category = getCategoryBySlug(slug)
  if (!category) notFound()

  const games = getGamesByCategory(slug)

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-xs text-[var(--text-muted)]">
        <Link href="/" className="transition-colors hover:text-white">首页</Link>
        <span className="text-[var(--border-default)]">/</span>
        <span className="text-[var(--text-secondary)]">{category.name}</span>
      </nav>

      {/* Category header */}
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--accent-1)]/15 to-[var(--accent-2)]/15 text-2xl">
            {category.icon}
          </span>
          <div>
            <h1 className="text-2xl font-bold text-white sm:text-3xl">
              {category.name}游戏
            </h1>
            <p className="mt-1 text-sm text-[var(--text-muted)]">{category.description}</p>
          </div>
        </div>
      </div>

      <GameGrid
        title={`共 ${games.length} 款游戏`}
        games={games}
      />
    </div>
  )
}

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
      <nav className="mb-6 flex items-center gap-2 text-sm text-[var(--muted)]">
        <Link href="/" className="hover:text-white transition-colors">
          首页
        </Link>
        <span>/</span>
        <span className="text-white">{category.name}</span>
      </nav>

      <div className="mb-6">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)]/10 text-xl">
            {category.icon}
          </span>
          <div>
            <h1 className="text-2xl font-bold text-white">
              {category.name}游戏
            </h1>
            <p className="text-sm text-[var(--muted)]">{category.description}</p>
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

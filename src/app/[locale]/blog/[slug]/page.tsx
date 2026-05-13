import { notFound } from "next/navigation"
import Link from "next/link"
import { getPostBySlug, getAllPosts, getPostContent, parseMarkdownToHtml } from "@/lib/blog"
import { getAllGames } from "@/lib/games"
import type { Metadata } from "next"

const BASE_URL = "https://www.playgo.me"

interface Props {
  params: Promise<{ locale: string; slug: string }>
}

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return { title: "Post not found" }
  return {
    title: `${post.title} | LeYou Blog`,
    description: post.description,
    alternates: {
      canonical: `${BASE_URL}/${locale}/blog/${slug}`,
      languages: {
        zh: `${BASE_URL}/zh/blog/${slug}`,
        "zh-TW": `${BASE_URL}/zh-TW/blog/${slug}`,
        en: `${BASE_URL}/en/blog/${slug}`,
        ja: `${BASE_URL}/ja/blog/${slug}`,
      },
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `${BASE_URL}/${locale}/blog/${slug}`,
      siteName: "LeYou",
      locale,
      type: "article",
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const games = getAllGames()
  const content = getPostContent(slug)
  const htmlContent = content ? parseMarkdownToHtml(content) : null

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link
        href={`/${locale}/blog`}
        className="text-xs text-[var(--accent-1)] hover:underline mb-4 inline-block"
      >
        &larr; Back to Blog
      </Link>
      <article>
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
          {post.title}
        </h1>
        <div className="flex items-center gap-3 text-xs text-[var(--text-muted)] mb-6">
          <time>{post.date}</time>
          <span>{post.category}</span>
        </div>
        {htmlContent ? (
          <div
            className="space-y-3"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        ) : (
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">{post.description}</p>
        )}
      </article>
      {games.length > 0 && (
        <div className="mt-8 p-4 rounded-xl border border-[var(--border-default)] bg-white/[0.02]">
          <p className="text-sm text-[var(--text-primary)] font-medium mb-2">
            Play these games on LeYou:
          </p>
          <div className="flex flex-wrap gap-2">
            {games.slice(0, 5).map((g) => (
              <Link
                key={g.id}
                href={`/${locale}/games/${g.slug}`}
                className="text-xs text-[var(--accent-1)] hover:underline"
              >
                {g.title}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

import Link from "next/link"
import { getAllPosts } from "@/lib/blog"
import type { Metadata } from "next"

const BASE_URL = "https://www.playgo.me"

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return {
    title: "Blog - LeYou Game Guides & Tips",
    description:
      "Game guides, tips and strategies for the best free online games at LeYou.",
    alternates: {
      canonical: `${BASE_URL}/${locale}/blog`,
      languages: {
        zh: `${BASE_URL}/zh/blog`,
        "zh-TW": `${BASE_URL}/zh-TW/blog`,
        en: `${BASE_URL}/en/blog`,
        ja: `${BASE_URL}/ja/blog`,
      },
    },
  }
}

export default async function BlogListPage({ params }: Props) {
  const { locale } = await params
  const posts = getAllPosts()

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-8">
        Blog
      </h1>
      <p className="text-sm text-[var(--text-secondary)] mb-8">
        Game guides, tips and strategies
      </p>
      <div className="space-y-6">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="rounded-xl border border-[var(--border-default)] p-6 hover:border-[var(--accent-1)]/30 transition-all"
          >
            <Link href={`/${locale}/blog/${post.slug}`}>
              <h2 className="text-lg font-semibold text-[var(--text-primary)] hover:text-[var(--accent-1)] transition-colors">
                {post.title}
              </h2>
            </Link>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              {post.description}
            </p>
            <div className="mt-3 flex items-center gap-3 text-xs text-[var(--text-muted)]">
              <time>{post.date}</time>
              <span>{post.category}</span>
            </div>
          </article>
        ))}
        {posts.length === 0 && (
          <p className="text-sm text-[var(--text-muted)]">Coming soon.</p>
        )}
      </div>
    </div>
  )
}

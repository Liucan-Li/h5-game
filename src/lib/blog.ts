export interface BlogPostMeta {
  slug: string
  title: string
  description: string
  date: string
  tags: string[]
  category: string
}

const POSTS: BlogPostMeta[] = [
  {
    slug: "best-free-puzzle-games-online",
    title: "10 Best Free Puzzle Games to Play Online in 2026",
    description:
      "Looking for the best free puzzle games online? We've curated the top 10 brain-teasers you can play instantly in your browser — no download required.",
    date: "2026-05-01",
    tags: ["puzzle", "classic", "strategy"],
    category: "guides",
  },
  {
    slug: "wordle-strategy-guide",
    title: "How to Win at Wordle Every Time — 5 Expert Strategies",
    description:
      "Master Wordle with these proven strategies. From optimal starting words to elimination patterns, improve your daily word game skills.",
    date: "2026-05-08",
    tags: ["word", "puzzle", "strategy"],
    category: "guides",
  },
]

export function getAllPosts(): BlogPostMeta[] {
  return [...POSTS].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )
}

export function getPostBySlug(slug: string): BlogPostMeta | undefined {
  return POSTS.find((p) => p.slug === slug)
}

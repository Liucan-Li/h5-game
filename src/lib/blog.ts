import fs from "fs"
import path from "path"

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
    description: "Looking for the best free puzzle games online? We've curated the top 10 brain-teasers you can play instantly in your browser — no download required.",
    date: "2026-05-01",
    tags: ["puzzle", "classic", "strategy"],
    category: "guides",
  },
  {
    slug: "wordle-strategy-guide",
    title: "How to Win at Wordle Every Time — 5 Expert Strategies",
    description: "Master Wordle with these proven strategies. From optimal starting words to elimination patterns, improve your daily word game skills.",
    date: "2026-05-08",
    tags: ["word", "puzzle", "strategy"],
    category: "guides",
  },
  {
    slug: "what-are-io-games",
    title: "What Are IO Games? Top 10 Free Browser Multiplayer Games",
    description: "IO games have taken the browser gaming world by storm. Learn what makes them special and discover the best free IO games to play right now.",
    date: "2026-05-12",
    tags: ["io-game", "multiplayer", "action"],
    category: "guides",
  },
  {
    slug: "best-idle-games-online",
    title: "Best Idle Games to Play Online for Free in 2026",
    description: "Idle games let you progress even when you're not playing. Discover the best free idle and clicker games you can play in your browser without downloading anything.",
    date: "2026-05-10",
    tags: ["idle", "clicker", "casual"],
    category: "guides",
  },
  {
    slug: "daily-sudoku-tips",
    title: "Daily Sudoku Tips and Strategies for Beginners",
    description: "Master Sudoku with these beginner-friendly strategies. From scanning techniques to pencil marks, improve your puzzle-solving skills one day at a time.",
    date: "2026-05-14",
    tags: ["puzzle", "numbers", "logic"],
    category: "tips",
  },
  {
    slug: "free-online-shooter-games",
    title: "Best Free Online Shooter Games to Play in Your Browser",
    description: "Get your adrenaline pumping with the best free online shooter games. No download needed — aim, shoot, and compete directly in your browser.",
    date: "2026-05-07",
    tags: ["shooter", "action", "survival"],
    category: "guides",
  },
  {
    slug: "browser-games-no-download",
    title: "Why Browser Games Are Making a Comeback in 2026",
    description: "Browser-based games are experiencing a renaissance. Discover why millions of players are choosing no-download HTML5 games for quick, accessible entertainment.",
    date: "2026-05-05",
    tags: ["casual", "classic", "multiplayer"],
    category: "articles",
  },
  {
    slug: "how-to-play-2048-strategy",
    title: "How to Play 2048: Strategy Guide to Reach the 2048 Tile Every Time",
    description: "Learn the proven corner-strategy technique to consistently reach the 2048 tile. Master this addictive number puzzle with our step-by-step guide.",
    date: "2026-05-03",
    tags: ["puzzle", "numbers", "strategy"],
    category: "tips",
  },
  {
    slug: "brain-games-for-adults",
    title: "10 Brain Games for Adults to Stay Sharp (Free Online)",
    description: "Keep your mind sharp with these free online brain games. From memory challenges to logic puzzles, improve cognitive skills without spending a cent.",
    date: "2026-04-28",
    tags: ["puzzle", "memory", "logic"],
    category: "guides",
  },
  {
    slug: "best-card-games-online",
    title: "Best Free Card Games to Play Online in Your Browser",
    description: "From Solitaire to Poker, discover the best free card games you can play online. No download, no sign-up — just classic card game fun in your browser.",
    date: "2026-04-25",
    tags: ["card", "poker", "classic"],
    category: "guides",
  },
]

export function getAllPosts(): BlogPostMeta[] {
  return [...POSTS].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPostBySlug(slug: string): BlogPostMeta | undefined {
  return POSTS.find((p) => p.slug === slug)
}

export function getPostContent(slug: string): string | null {
  try {
    const filePath = path.join(process.cwd(), "src", "content", "blog", `${slug}.md`)
    return fs.readFileSync(filePath, "utf-8")
  } catch {
    return null
  }
}

export function parseMarkdownToHtml(md: string): string {
  return md
    .replace(/^### (.+)$/gm, '<h3 class="text-base font-semibold text-[var(--text-primary)] mt-6 mb-2">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-lg font-bold text-[var(--text-primary)] mt-8 mb-3">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-xl font-bold text-[var(--text-primary)] mt-8 mb-3">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc text-sm leading-relaxed text-[var(--text-secondary)]">$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4 list-decimal text-sm leading-relaxed text-[var(--text-secondary)]">$1. $2</li>')
    .split(/\n\n+/)
    .map((p) => {
      const trimmed = p.trim()
      if (!trimmed) return ""
      if (trimmed.startsWith("<h") || trimmed.startsWith("<li")) return trimmed
      return `<p class="text-sm leading-relaxed text-[var(--text-secondary)]">${trimmed}</p>`
    })
    .join("\n")
}

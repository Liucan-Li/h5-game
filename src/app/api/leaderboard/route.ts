import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const DATA_FILE = path.join(process.cwd(), "src", "data", "leaderboard.json")

interface LeaderboardEntry {
  gameId: string
  score: number
  playerName: string
  timestamp: string
  metadata?: Record<string, unknown>
}

async function readLeaderboard(): Promise<LeaderboardEntry[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8")
    return JSON.parse(raw)
  } catch {
    return []
  }
}

async function writeLeaderboard(data: LeaderboardEntry[]) {
  const dir = path.dirname(DATA_FILE)
  try {
    await fs.mkdir(dir, { recursive: true })
  } catch {}
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf-8")
}

// GET /api/leaderboard?gameId=xxx&limit=10
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const gameId = searchParams.get("gameId")
  const limit = parseInt(searchParams.get("limit") || "10", 10)

  let entries = await readLeaderboard()

  if (gameId) {
    entries = entries.filter((e) => e.gameId === gameId)
  }

  // Sort by score descending, return top N
  entries.sort((a, b) => b.score - a.score)
  entries = entries.slice(0, limit)

  return NextResponse.json({ entries })
}

// POST /api/leaderboard
// Body: { gameId: string, score: number, playerName?: string, metadata?: object }
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { gameId, score, playerName, metadata } = body

    if (!gameId || typeof score !== "number") {
      return NextResponse.json(
        { error: "Missing required fields: gameId, score" },
        { status: 400 },
      )
    }

    const entry: LeaderboardEntry = {
      gameId,
      score,
      playerName: playerName || "匿名玩家",
      timestamp: new Date().toISOString(),
      metadata,
    }

    const entries = await readLeaderboard()
    entries.push(entry)
    await writeLeaderboard(entries)

    return NextResponse.json({ success: true, entry })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save score" },
      { status: 500 },
    )
  }
}

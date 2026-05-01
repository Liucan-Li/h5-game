import { NextResponse } from "next/server"
import { searchGames } from "@/lib/games"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get("q")

  if (!q || q.trim().length === 0) {
    return NextResponse.json({ results: [] })
  }

  const results = searchGames(q.trim())
  return NextResponse.json({ results })
}

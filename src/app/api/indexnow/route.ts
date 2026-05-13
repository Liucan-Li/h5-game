import { NextRequest, NextResponse } from "next/server"

const INDEXNOW_API_KEY = process.env.INDEXNOW_API_KEY || ""
const INDEXNOW_URL = "https://api.indexnow.org/indexnow"

export async function POST(request: NextRequest) {
  try {
    const { urls } = (await request.json()) as { urls: string[] }
    if (!Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json({ error: "Invalid urls" }, { status: 400 })
    }

    const body = {
      host: "www.playgo.me",
      key: INDEXNOW_API_KEY,
      keyLocation: `https://www.playgo.me/${INDEXNOW_API_KEY}.txt`,
      urlList: urls.slice(0, 10000),
    }

    const res = await fetch(INDEXNOW_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const text = await res.text()
      return NextResponse.json({ error: `IndexNow push failed: ${text}` }, { status: 500 })
    }

    return NextResponse.json({ success: true, count: urls.length })
  } catch (error) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}

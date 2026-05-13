import { ImageResponse } from "next/og"
import { getGameBySlug } from "@/lib/games"
import { getLocalizedGame } from "@/lib/i18n-games"

export const contentType = "image/png"
export const size = { width: 1200, height: 630 }

interface Props {
  params: { slug: string; locale: string }
}

export default async function OGImage({ params }: Props) {
  const { slug, locale } = await params
  const game = getGameBySlug(slug)
  if (!game) return new ImageResponse(<div>Not found</div>, size)
  const localized = getLocalizedGame(game, locale)

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f172a 0%, #312e81 100%)",
          color: "white",
          fontFamily: "sans-serif",
          padding: 60,
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 48, fontWeight: 700, marginBottom: 24, lineHeight: 1.2 }}>
          {localized.title}
        </div>
        <div style={{ fontSize: 22, opacity: 0.85, maxWidth: 800, lineHeight: 1.5 }}>
          {localized.description}
        </div>
        <div style={{ marginTop: 32, fontSize: 18, opacity: 0.6 }}>
          🎮 Play Free on LeYou
        </div>
      </div>
    ),
    size,
  )
}

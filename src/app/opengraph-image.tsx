import { ImageResponse } from "next/og"

export const contentType = "image/png"
export const size = { width: 1200, height: 630 }

export default function OGImage() {
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
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 64, fontWeight: 700, marginBottom: 16 }}>
          🎮 LeYou
        </div>
        <div style={{ fontSize: 28, opacity: 0.8 }}>
          Play Hundreds of Games Online — No Download
        </div>
      </div>
    ),
    size,
  )
}

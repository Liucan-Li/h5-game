"use client"

interface Props {
  text: string
  url: string
  label?: string
}

export default function ShareButton({ text, url, label = "Share" }: Props) {
  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ text, url })
    } else {
      await navigator.clipboard.writeText(`${text}\n${url}`)
      alert("Link copied to clipboard!")
    }
  }

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center gap-2 rounded-xl border border-[var(--border-default)] px-4 py-2 text-sm font-medium text-[var(--text-primary)] hover:bg-white/[0.05] transition-all"
    >
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" />
      </svg>
      {label}
    </button>
  )
}

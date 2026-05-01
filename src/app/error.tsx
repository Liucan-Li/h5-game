"use client"

export default function Error({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl font-bold text-white">出错了</h1>
      <p className="mt-4 text-sm text-[var(--muted)]">
        页面加载失败，请稍后重试
      </p>
      <button
        onClick={reset}
        className="mt-6 rounded-xl bg-[var(--accent)] px-6 py-2.5 text-sm font-medium text-white hover:bg-[var(--accent-hover)] transition-colors"
      >
        重试
      </button>
    </div>
  )
}

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
        <p className="text-sm text-[var(--muted)]">加载中...</p>
      </div>
    </div>
  )
}

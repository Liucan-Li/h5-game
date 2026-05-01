import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-bold text-[var(--accent)]">404</h1>
      <p className="mt-4 text-lg text-[var(--muted)]">页面未找到</p>
      <Link
        href="/"
        className="mt-6 rounded-xl bg-[var(--accent)] px-6 py-2.5 text-sm font-medium text-white hover:bg-[var(--accent-hover)] transition-colors"
      >
        返回首页
      </Link>
    </div>
  )
}

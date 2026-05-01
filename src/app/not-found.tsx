import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-bold text-[var(--accent-1)]">404</h1>
      <p className="mt-4 text-lg text-[var(--text-muted)]">页面未找到</p>
      <Link
        href="/"
        className="mt-6 inline-flex rounded-xl bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)] px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90"
      >
        返回首页
      </Link>
    </div>
  )
}

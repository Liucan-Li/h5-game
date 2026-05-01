export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--accent)] text-xs font-bold text-white">
              H5
            </span>
            <span className="text-sm font-medium">H5 游戏平台</span>
          </div>
          <p className="text-xs text-[var(--muted)]">
            &copy; {new Date().getFullYear()} H5 Game Platform. All games are the property of their respective owners.
          </p>
        </div>
      </div>
    </footer>
  )
}

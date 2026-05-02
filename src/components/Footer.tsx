export default function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--border-default)]">
      {/* Gradient accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-[var(--accent-1)]/30 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-[var(--text-secondary)]">
              乐游
            </span>
          </div>
          <p className="text-xs text-[var(--text-muted)]">
            &copy; {new Date().getFullYear()} H5 Game Platform
          </p>
        </div>
      </div>
    </footer>
  )
}

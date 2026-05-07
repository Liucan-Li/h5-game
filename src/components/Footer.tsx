import { getTranslations } from "next-intl/server"

export default async function Footer() {
  const t = await getTranslations("footer")
  const year = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-[var(--border-default)]">
      <div className="h-px bg-gradient-to-r from-transparent via-[var(--accent-1)]/30 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-[var(--text-secondary)]">
              乐游
            </span>
          </div>
          <p className="text-xs text-[var(--text-muted)]">
            {t("copyright", { year })}
          </p>
        </div>
      </div>
    </footer>
  )
}

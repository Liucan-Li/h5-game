import { getTranslations } from "next-intl/server"

export default async function Footer() {
  const t = await getTranslations("footer")
  const year = new Date().getFullYear()

  return (
    <footer className="mt-auto">
      <div className="section-divider" />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)] bg-clip-text text-sm font-bold text-transparent">
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

import { getTranslations } from "next-intl/server"
import { getTodaySeed, getDailySudoku } from "@/lib/daily-challenge"
import type { Metadata } from "next"

const BASE_URL = "https://www.playgo.me"

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return {
    title: "Daily Sudoku - Free Online Puzzle Game | LeYou",
    description:
      "Play today's Sudoku online for free. A new daily puzzle — fill the grid so each row, column, and 3x3 box contains 1-9. No download needed.",
    alternates: {
      canonical: `${BASE_URL}/${locale}/daily/sudoku`,
      languages: {
        zh: `${BASE_URL}/zh/daily/sudoku`,
        "zh-TW": `${BASE_URL}/zh-TW/daily/sudoku`,
        en: `${BASE_URL}/en/daily/sudoku`,
        ja: `${BASE_URL}/ja/daily/sudoku`,
      },
    },
    openGraph: {
      title: "Daily Sudoku - LeYou",
      description: "A new Sudoku puzzle every day in your browser",
      url: `${BASE_URL}/${locale}/daily/sudoku`,
      siteName: "LeYou",
      locale,
      type: "website",
    },
  }
}

export default async function DailySudokuPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "daily" })
  const puzzle = getDailySudoku(getTodaySeed())

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <h1 className="text-2xl font-bold text-[var(--text-primary)] text-center mb-2">
        {t("sudokuTitle")}
      </h1>
      <p className="text-sm text-[var(--text-secondary)] text-center mb-6">
        {t("sudokuDesc")}
      </p>
      <div className="text-center text-xs text-[var(--text-muted)] mb-4">
        {puzzle.difficulty}
      </div>
      <iframe
        src={`/games/sudoku.html?daily=${getTodaySeed()}`}
        className="mx-auto rounded-xl border border-[var(--border-default)]"
        style={{ width: 450, height: 550 }}
        title={t("sudokuTitle")}
      />
    </div>
  )
}

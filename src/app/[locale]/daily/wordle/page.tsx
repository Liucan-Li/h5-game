import { getTranslations } from "next-intl/server"
import { getTodaySeed } from "@/lib/daily-challenge"
import type { Metadata } from "next"

const BASE_URL = "https://www.playgo.me"

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return {
    title: "Daily Wordle - Free Online Word Game | LeYou",
    description:
      "Play today's Wordle online for free. Guess the hidden 5-letter word in 5 tries. A new daily puzzle every day — no download, no sign-up.",
    alternates: {
      canonical: `${BASE_URL}/${locale}/daily/wordle`,
      languages: {
        zh: `${BASE_URL}/zh/daily/wordle`,
        "zh-TW": `${BASE_URL}/zh-TW/daily/wordle`,
        en: `${BASE_URL}/en/daily/wordle`,
        ja: `${BASE_URL}/ja/daily/wordle`,
      },
    },
    openGraph: {
      title: "Daily Wordle - LeYou",
      description: "Can you guess today's 5-letter word?",
      url: `${BASE_URL}/${locale}/daily/wordle`,
      siteName: "LeYou",
      locale,
      type: "website",
    },
  }
}

export default async function DailyWordlePage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "daily" })
  const seed = getTodaySeed()

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <h1 className="text-2xl font-bold text-[var(--text-primary)] text-center mb-2">
        {t("wordleTitle")}
      </h1>
      <p className="text-sm text-[var(--text-secondary)] text-center mb-6">
        {t("wordleDesc")}
      </p>
      <iframe
        src={`/games/wordle.html?daily=${seed}`}
        className="mx-auto rounded-xl border border-[var(--border-default)]"
        style={{ width: 400, height: 500 }}
        title={t("wordleTitle")}
      />
    </div>
  )
}

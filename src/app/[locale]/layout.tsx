import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { NextIntlClientProvider } from "next-intl"
import { getMessages, getTranslations } from "next-intl/server"
import { Analytics } from "@vercel/analytics/react"
import "../globals.css"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { routing } from "@/i18n/routing"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

const BASE_URL = "https://www.playgo.me"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "meta" })
  const siteTitle = t("siteTitle")
  const siteDesc = t("siteDesc")
  return {
    title: { default: siteTitle, template: `%s | LeYou` },
    description: siteDesc,
    alternates: {
      canonical: `${BASE_URL}/${locale}`,
      languages: {
        zh: `${BASE_URL}/zh`,
        "zh-TW": `${BASE_URL}/zh-TW`,
        en: `${BASE_URL}/en`,
        ja: `${BASE_URL}/ja`,
      },
    },
    openGraph: {
      title: siteTitle,
      description: siteDesc,
      url: `${BASE_URL}/${locale}`,
      siteName: "LeYou",
      locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: siteTitle,
      description: siteDesc,
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const messages = await getMessages()

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  )
}

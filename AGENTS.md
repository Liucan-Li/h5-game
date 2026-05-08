<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Internationalization (i18n) — MANDATORY

This project supports 4 languages: **zh** (Simplified Chinese, default), **zh-TW** (Traditional Chinese), **en** (English), **ja** (Japanese).

Every new feature MUST be i18n-compatible. No hardcoded UI strings.

## Rules

### 1. All UI text goes through next-intl

Server components:
```ts
import { getTranslations } from "next-intl/server"
const t = await getTranslations({ locale, namespace: "myNamespace" })
```

Client components:
```ts
import { useTranslations, useLocale } from "next-intl"
const t = useTranslations("myNamespace")
const locale = useLocale()
```

### 2. Every new translation key must be added to all 4 message files

- `src/messages/zh.json` — Simplified Chinese
- `src/messages/zh-TW.json` — Traditional Chinese
- `src/messages/en.json` — English
- `src/messages/ja.json` — Japanese

Never add a key to only one file. All 4 files must stay in sync.

### 3. All internal links must include the locale prefix

```ts
// Correct
href={`/${locale}/games/${slug}`}

// Wrong
href={`/games/${slug}`}
```

Get `locale` from `useLocale()` in client components, or from `params.locale` in server components/pages.

### 4. New pages must live under `src/app/[locale]/`

All pages go under `src/app/[locale]/`. The `[locale]` layout at `src/app/[locale]/layout.tsx` is the root layout — it wraps everything with `NextIntlClientProvider`.

### 5. New game metadata requires translations in all 4 message files

When adding a new game, add its `title` and `description` under the `games` key in all 4 message files:
```json
"games": {
  "your-game-slug": {
    "title": "...",
    "description": "..."
  }
}
```

### 6. Components that need locale-aware links

Pass `locale: string` as a prop rather than reading it internally (server components cannot use `useLocale()`):
```ts
// GameCard, CategoryNav, CategoryGridSection, GameGrid all follow this pattern
interface Props { locale: string }
```

## File reference

| File | Purpose |
|------|---------|
| `src/i18n/routing.ts` | Locale list and defaultLocale |
| `src/i18n/request.ts` | Server-side getRequestConfig |
| `src/proxy.ts` | next-intl middleware (Next.js 16 proxy convention) |
| `src/lib/i18n-games.ts` | `getLocalizedGame()` — overlays translated title/description |
| `src/messages/*.json` | Translation files (4 locales) |

# SEO — MANDATORY

Every new page MUST follow the SEO checklist in `SEO.md`.

Key rules at a glance:
- Implement `generateMetadata` with **title, description, canonical, hreflang (4 locales), openGraph**
- Add new routes to `src/app/sitemap.ts`
- Inject **JSON-LD** structured data in page components

See `SEO.md` for full templates and infrastructure setup.

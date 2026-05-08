# SEO 规范

本文档定义 LeYou 游戏平台的 SEO 标准，**新增任何页面或功能时必须遵循**。

---

## 当前状态

| 项目 | 状态 | 说明 |
|---|---|---|
| 页面 `generateMetadata` | ✅ 已有 | title + description，部分硬编码"乐游" |
| `robots.ts` | ❌ 缺失 | 搜索引擎无爬虫指引 |
| `sitemap.ts` | ❌ 缺失 | 200+ URL 无法被高效发现 |
| hreflang / canonical | ❌ 缺失 | 4 个语言版本可能被判重复内容 |
| OpenGraph / Twitter Card | ❌ 缺失 | 社交分享无预览图和结构化信息 |
| JSON-LD 结构化数据 | ❌ 缺失 | 无法展示 Google 富结果 |

---

## 新增页面 SEO Checklist（强制）

每次新增页面，以下三项**全部必做**：

### 1. 实现完整的 `generateMetadata`

```ts
// src/app/[locale]/your-page/page.tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  // ...获取页面数据...

  const canonicalUrl = `https://leyou.game/${locale}/your-page`

  return {
    title: `页面标题 | LeYou`,
    description: "页面描述，包含核心关键词，100-160 字符",

    // ── canonical + hreflang（4 个语言版本必填）──
    alternates: {
      canonical: canonicalUrl,
      languages: {
        zh:      "https://leyou.game/zh/your-page",
        "zh-TW": "https://leyou.game/zh-TW/your-page",
        en:      "https://leyou.game/en/your-page",
        ja:      "https://leyou.game/ja/your-page",
      },
    },

    // ── OpenGraph（社交分享）──
    openGraph: {
      title: "页面标题 | LeYou",
      description: "页面描述",
      url: canonicalUrl,
      siteName: "LeYou",
      locale,
      type: "website",           // 游戏详情页用 "article"
      images: [{ url: "封面图 URL", width: 1200, height: 630 }],
    },

    // ── Twitter Card ──
    twitter: {
      card: "summary_large_image",
      title: "页面标题 | LeYou",
      description: "页面描述",
      images: ["封面图 URL"],
    },
  }
}
```

**各页面类型的 `type` 字段**：

| 页面类型 | `openGraph.type` |
|---|---|
| 首页 / 列表页 / 分类页 | `"website"` |
| 游戏详情页 | `"article"` |

### 2. 在 `sitemap.ts` 中添加新路由

文件位置：`src/app/sitemap.ts`（待创建，见下方基础设施章节）。

每新增一类路由，在 sitemap 生成函数中补充对应条目：

```ts
// 静态页面示例
routing.locales.map((locale) => ({
  url: `${BASE_URL}/${locale}/your-page`,
  lastModified: new Date(),
  changeFrequency: "weekly" as const,
  priority: 0.8,
}))
```

### 3. 注入 JSON-LD 结构化数据

在页面 RSC 组件的 JSX 中内联 script 标签：

```tsx
// 以游戏详情页为例
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "VideoGame",
      name: localized.title,
      description: localized.description,
      url: `https://leyou.game/${locale}/games/${game.slug}`,
      image: `https://leyou.game${game.thumbnail}`,
      genre: game.category,
      playMode: "SinglePlayer",
      applicationCategory: "Game",
    }),
  }}
/>
```

---

## 各页面类型模板

### 首页（`/[locale]`）

```ts
{
  title: t("meta.siteTitle"),          // "LeYou - 免费在线 H5 游戏"
  description: t("meta.siteDesc"),
  alternates: { canonical, languages },
  openGraph: { type: "website", ... },
}
```

JSON-LD：`WebSite` + `SearchAction`（让 Google 展示站内搜索框）

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "LeYou",
  "url": "https://leyou.game",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://leyou.game/zh/games?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```

### 游戏列表页（`/[locale]/games`）

```ts
{
  title: t("meta.allGamesTitle"),      // "全部游戏 | LeYou"
  description: t("meta.siteDesc"),
  alternates: { canonical, languages },
  openGraph: { type: "website", ... },
}
```

不需要 JSON-LD（纯列表页，结构化数据价值低）。

### 游戏详情页（`/[locale]/games/[slug]`）

```ts
{
  title: `${localized.title} | LeYou`,
  description: localized.description,
  alternates: {
    canonical: `https://leyou.game/${locale}/games/${slug}`,
    languages: {
      zh:      `https://leyou.game/zh/games/${slug}`,
      "zh-TW": `https://leyou.game/zh-TW/games/${slug}`,
      en:      `https://leyou.game/en/games/${slug}`,
      ja:      `https://leyou.game/ja/games/${slug}`,
    },
  },
  openGraph: {
    type: "article",
    images: [{ url: `https://leyou.game${game.thumbnail}` }],
    ...
  },
}
```

JSON-LD：`VideoGame`（见上方示例）

### 分类页（`/[locale]/categories/[slug]`）

```ts
{
  title: `${localizedCat.name} 游戏 | LeYou`,
  description: localizedCat.description,
  alternates: {
    canonical: `https://leyou.game/${locale}/categories/${slug}`,
    languages: { ... },
  },
  openGraph: { type: "website", ... },
}
```

JSON-LD：`BreadcrumbList`

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "首页", "item": "https://leyou.game/zh" },
    { "@type": "ListItem", "position": 2, "name": "动作游戏", "item": "https://leyou.game/zh/categories/action" }
  ]
}
```

---

## 基础设施（一次性技术债）

以下文件需要创建一次，之后维护即可：

### `src/app/robots.ts`

```ts
import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://leyou.game/sitemap.xml",
  }
}
```

### `src/app/sitemap.ts`

```ts
import type { MetadataRoute } from "next"
import { getAllGames, getCategories } from "@/lib/games"
import { routing } from "@/i18n/routing"

const BASE_URL = "https://leyou.game"

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = routing.locales
  const games = getAllGames()
  const categories = getCategories()
  const now = new Date()

  // 首页
  const homeUrls = locales.map((locale) => ({
    url: `${BASE_URL}/${locale}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 1.0,
  }))

  // 游戏列表页
  const gamesListUrls = locales.map((locale) => ({
    url: `${BASE_URL}/${locale}/games`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }))

  // 分类页
  const categoryUrls = locales.flatMap((locale) =>
    categories.map((cat) => ({
      url: `${BASE_URL}/${locale}/categories/${cat.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }))
  )

  // 游戏详情页
  const gameUrls = locales.flatMap((locale) =>
    games.map((game) => ({
      url: `${BASE_URL}/${locale}/games/${game.slug}`,
      lastModified: new Date(game.createdAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }))
  )

  return [...homeUrls, ...gamesListUrls, ...categoryUrls, ...gameUrls]
}
```

### `src/app/[locale]/layout.tsx` 补充 hreflang

在 layout 的 `generateMetadata` 中加入 alternates：

```ts
export async function generateMetadata({ params }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "meta" })
  return {
    title: { default: t("siteTitle"), template: `%s | LeYou` },
    description: t("siteDesc"),
    alternates: {
      canonical: `https://leyou.game/${locale}`,
      languages: {
        zh:      "https://leyou.game/zh",
        "zh-TW": "https://leyou.game/zh-TW",
        en:      "https://leyou.game/en",
        ja:      "https://leyou.game/ja",
      },
    },
    openGraph: {
      siteName: "LeYou",
      locale,
      type: "website",
    },
  }
}
```

> **注意**：layout 中定义 `title.template`（`%s | LeYou`）后，子页面只需返回 `title: "页面名"` 即可自动拼接，无需每页重复写 `| LeYou`。

---

## title 命名规范

| 页面 | 格式 |
|---|---|
| 首页 | `LeYou - 免费在线 H5 游戏` |
| 游戏列表 | `全部游戏 | LeYou` |
| 分类页 | `动作游戏 | LeYou` |
| 游戏详情 | `2048 | LeYou` |

- title 长度：**30-60 字符**（中文约 15-30 个汉字）
- description 长度：**80-160 字符**
- 禁止在 title 中硬编码品牌名（通过 `title.template` 统一注入）

---

## 关键词策略

- **游戏详情页**：`{游戏名} + 在线玩 / play online / オンライン` 自然出现在 description 中
- **分类页**：`{分类名}游戏 / {category} games` 出现在 title 和 description 中
- **禁止堆砌关键词**，description 要对用户有价值

---

## 验证工具

| 工具 | 用途 |
|---|---|
| Google Rich Results Test | 验证 JSON-LD 结构化数据 |
| Google Search Console → URL Inspection | 验证 sitemap 和 canonical |
| Open Graph Debugger (Facebook) | 验证 OG 标签社交预览 |
| Twitter Card Validator | 验证 Twitter Card |
| `curl https://leyou.game/sitemap.xml` | 检查 sitemap URL 数量 |
| `curl https://leyou.game/robots.txt` | 检查爬虫规则 |

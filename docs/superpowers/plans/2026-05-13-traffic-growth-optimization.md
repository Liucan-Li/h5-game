# LeYou 流量增长优化 — 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 通过 SEO 优先策略分三阶段提升 LeYou H5 游戏平台自然搜索流量

**Architecture:** 基于现有 Next.js 16 + next-intl 结构，保持不变；三个阶段依次推进：技术 SEO + 内容扩充 → 长尾关键词 + 每日挑战 → 博客内容规模化

**Tech Stack:** Next.js 16, next-intl 4, TypeScript, Tailwind CSS 4, @vercel/og, Playwright (E2E)

---

## 文件清单（新增/修改总览）

| 文件 | 操作 | 职责 |
|------|------|------|
| `src/app/opengraph-image.tsx` | 新增 | 站点默认 OG 图 |
| `src/app/[locale]/games/[slug]/opengraph-image.tsx` | 新增 | 游戏详情页动态 OG 图 |
| `src/data/games.json` | 修改 | 扩充 15-20 款新游戏 + tags 英文化 |
| `src/messages/en.json` | 修改 | tags 英文化映射 + 新增游戏翻译 + metaTitle/metaDesc |
| `src/messages/zh.json` | 修改 | tags 映射 + 新增游戏翻译 |
| `src/messages/zh-TW.json` | 修改 | tags 映射 + 新增游戏翻译 |
| `src/messages/ja.json` | 修改 | tags 映射 + 新增游戏翻译 |
| `src/lib/i18n-games.ts` | 修改 | tags 查询逻辑适配英文化 |
| `src/lib/games.ts` | 修改 | 新增加权推荐函数 |
| `src/app/[locale]/categories/[slug]/page.tsx` | 修改 | 增加品类介绍 + FAQ 区块 |
| `src/app/[locale]/games/[slug]/page.tsx` | 修改 | metaTitle/metaDesc 优先逻辑 |
| `src/lib/structured-data.ts` | 新增 | FAQPage schema |
| `src/lib/daily-challenge.ts` | 新增 | 每日挑战核心逻辑 |
| `src/app/[locale]/daily/wordle/page.tsx` | 新增 | 每日 Wordle 页 |
| `src/app/[locale]/daily/sudoku/page.tsx` | 新增 | 每日数独页 |
| `src/components/ShareButton.tsx` | 新增 | 社交分享按钮 |
| `src/app/[locale]/blog/page.tsx` | 新增 | 博客列表页 |
| `src/app/[locale]/blog/[slug]/page.tsx` | 新增 | 博客详情页 |
| `src/lib/blog.ts` | 新增 | 博客数据层 |
| `src/content/blog/*.md` | 新增 | 博客文章内容 |
| `src/app/api/indexnow/route.ts` | 新增 | IndexNow 推送 API |

---

## 阶段一（第 1-4 周）：技术 SEO + 内容缺口补充

### Task 1: 动态 OG 图（游戏详情页）

**现状检查：** site-level OG 图缺失，游戏详情页 OG image 目前使用游戏缩略图（400×400），非标准 1200×630 社交分享格式。

**Files:**
- Create: `src/app/[locale]/games/[slug]/opengraph-image.tsx`
- Create: `src/app/opengraph-image.tsx`

- [ ] **Step 1: 安装 @vercel/og 依赖**

```bash
npm install @vercel/og
```

- [ ] **Step 2: 创建站点级默认 OG 图**

```tsx
// src/app/opengraph-image.tsx
import { ImageResponse } from "next/og"

export const contentType = "image/png"
export const size = { width: 1200, height: 630 }

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 64, fontWeight: 700, marginBottom: 16 }}>
          🎮 LeYou
        </div>
        <div style={{ fontSize: 28, opacity: 0.8 }}>
          Play Hundreds of Games Online — No Download
        </div>
      </div>
    ),
    size,
  )
}
```

- [ ] **Step 3: 创建游戏详情页动态 OG 图**

```tsx
// src/app/[locale]/games/[slug]/opengraph-image.tsx
import { ImageResponse } from "next/og"
import { getGameBySlug } from "@/lib/games"
import { getLocalizedGame } from "@/lib/i18n-games"

export const contentType = "image/png"
export const size = { width: 1200, height: 630 }

interface Props {
  params: { slug: string; locale: string }
}

export default async function OGImage({ params }: Props) {
  const { slug, locale } = await params
  const game = getGameBySlug(slug)
  if (!game) return new ImageResponse(<div>Not found</div>, size)
  const localized = getLocalizedGame(game, locale)

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f172a 0%, #312e81 100%)",
          color: "white",
          fontFamily: "sans-serif",
          padding: 60,
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 48, fontWeight: 700, marginBottom: 24, lineHeight: 1.2 }}>
          {localized.title}
        </div>
        <div style={{ fontSize: 22, opacity: 0.85, maxWidth: 800, lineHeight: 1.5 }}>
          {localized.description}
        </div>
        <div style={{ marginTop: 32, fontSize: 18, opacity: 0.6 }}>
          🎮 Play Free on LeYou
        </div>
      </div>
    ),
    size,
  )
}
```

- [ ] **Step 4: 验证 OG 图生成**

```bash
npm run build
```
Expected: Build 通过，opengraph-image.tsx 被正确输出。

- [ ] **Step 5: Commit**

```bash
git add src/app/opengraph-image.tsx src/app/\[locale\]/games/\[slug\]/opengraph-image.tsx package.json package-lock.json
git commit -m "feat: add dynamic OG image generation for games"
```

---

### Task 2: Tags 英文化 + 搜索适配

**现状：** `games.json` 中 tags 为中文字符串（如 `"经典"`、`"射击"`），通过 `en.json` 的 `tags` 对象映射英文。Google 实际爬取到的是中文 tags。需要改为英文 slug 作为数据源。

**Files:**
- Modify: `src/data/games.json`
- Modify: `src/messages/en.json`
- Modify: `src/messages/zh.json`
- Modify: `src/messages/zh-TW.json`
- Modify: `src/messages/ja.json`
- Read/verify: `src/lib/i18n-games.ts`
- Read/verify: `src/lib/games.ts`

- [ ] **Step 1: 建立中文→英文 tag 映射表**

```
经典 → classic, 射击 → shooter, 益智 → puzzle, 休闲 → casual
街机 → arcade, 数字 → numbers, 逻辑 → logic, 动作 → action
怀旧 → retro, 太空 → space, 音乐 → music, 文字 → word
速度 → speed, 跑酷 → parkour, 跳跃 → jump, 反应 → reflex
策略 → strategy, 体育 → sports, 躲避 → dodge, 物理 → physics
棋类 → board, 冒险 → adventure, 消除 → match, 麻将 → mahjong
记忆 → memory, 赛车 → racing, 节奏 → rhythm, 纸牌 → card
对战 → vs, 格斗 → fighting, 扑克 → poker, 数学 → math
象棋 → chess, 单词 → word, 经典 → classic, 测试 → test
```

- [ ] **Step 2: 更新 `games.json` 中所有游戏 tags 为英文 slug**

运行以下命令替换（或者逐条手动修改，约 50 款游戏需替换）：

```bash
# 将 games.json 中的中文字符串 tags 批量替换为英文
node -e "
const fs = require('fs');
const map = {
  '测试':'test','策略':'strategy','单词':'word','动作':'action',
  '对战':'vs','躲避':'dodge','反应':'reflex','格斗':'fighting',
  '怀旧':'retro','记忆':'memory','街机':'arcade','节奏':'rhythm',
  '经典':'classic','逻辑':'logic','麻将':'mahjong','冒险':'adventure',
  '跑酷':'parkour','扑克':'poker','棋类':'board','赛车':'racing',
  '射击':'shooter','数学':'math','数字':'numbers','速度':'speed',
  '太空':'space','体育':'sports','跳跃':'jump','文字':'word',
  '物理':'physics','象棋':'chess','消除':'match','休闲':'casual',
  '益智':'puzzle','音乐':'music','纸牌':'card','数字':'numbers',
  '街机':'arcade','经典':'classic','对战':'vs'
};
const data = JSON.parse(fs.readFileSync('src/data/games.json','utf8'));
data.forEach(g => {
  g.tags = g.tags.map(t => map[t] || t.toLowerCase().replace(/[\\s-]/g,''));
});
fs.writeFileSync('src/data/games.json', JSON.stringify(data, null, 2));
console.log('Done');
"
```

- [ ] **Step 3: 更新 4 个语言消息文件中的 tags 映射（key 保持不变但调整为包含所有可能出现的新 tag）**

`en.json` 的 `tags` 对象更新为：
```json
"tags": {
  "action": "Action", "arcade": "Arcade", "board": "Board",
  "card": "Card", "casual": "Casual", "chess": "Chess",
  "classic": "Classic", "dodge": "Dodge", "fighting": "Fighting",
  "jump": "Jump", "logic": "Logic", "mahjong": "Mahjong",
  "match": "Match", "math": "Math", "memory": "Memory",
  "numbers": "Numbers", "parkour": "Parkour", "physics": "Physics",
  "poker": "Poker", "puzzle": "Puzzle", "racing": "Racing",
  "reflex": "Reflex", "retro": "Retro", "rhythm": "Rhythm",
  "shooter": "Shooter", "shooting": "Shooting", "space": "Space",
  "speed": "Speed", "sports": "Sports", "strategy": "Strategy",
  "test": "Test", "vs": "VS", "word": "Word",
  "adventure": "Adventure", "music": "Music", "idle": "Idle",
  "clicker": "Clicker", "io-game": "IO Game", "multiplayer": "Multiplayer",
  "tower-defense": "Tower Defense", "platformer": "Platformer",
  "horror": "Horror", "escape": "Escape", "daily": "Daily",
  "timed": "Timed", "pvp": "PvP", "survival": "Survival",
  "educational": "Educational", "typing": "Typing"
}
```

同逻辑更新 `zh.json`、`zh-TW.json`、`ja.json` 的对应 tags 映射。

- [ ] **Step 4: 验证 tags 在 i18n-games.ts 中正常工作**

当前 `getLocalizedGame` 逻辑：
```ts
tags: tagsMap ? game.tags.map((tag) => tagsMap[tag] || tag) : game.tags
```
英文 tag slug → 映射到对应语言显示文本。对于 `zh` locale 直接返回原始（此时原始是英文 slug），需要在 `getLocalizedGame` 中修复：

```ts
// src/lib/i18n-games.ts 中修改
export function getLocalizedGame(game: Game, locale: string): LocalizedGame {
  const messages = loadMessages(locale)
  const games = messages.games as Record<string, { title: string; description: string }> | undefined
  const localized = games?.[game.slug]
  const tagsMap = messages.tags as Record<string, string> | undefined

  return {
    ...game,
    title: localized?.title || game.title,
    description: localized?.description || game.description,
    tags: tagsMap ? game.tags.map((tag) => tagsMap[tag] || tag) : game.tags,
  }
}
```
此处不需要修改代码——它已经支持了。`zh` 的 early return 可以移除，因为 `zh.json` 中也需要映射。

- [ ] **Step 5: 验证搜索函数正常工作**

`searchGames` 在 `games.ts` 中搜索 title/description/tags/category，tags 变为英文后仍正常工作——用户搜索 "classic" 可匹配到 tag `classic`。

- [ ] **Step 6: Commit**

```bash
git add src/data/games.json src/messages/en.json src/messages/zh.json src/messages/zh-TW.json src/messages/ja.json
git commit -m "refactor: convert game tags to English slugs for SEO"
```

---

### Task 3: 扩充高流量品类游戏（约 15-20 款）

**Files:**
- Modify: `src/data/games.json`
- Modify: `src/messages/en.json`
- Modify: `src/messages/zh.json`
- Modify: `src/messages/zh-TW.json`
- Modify: `src/messages/ja.json`
- Content (if needed): `public/games/*.html`

- [ ] **Step 1: 在 `games.json` 末尾追加新游戏（P0 品类先行）**

```json
// P0: .io 竞技 (id 46+)
{ "id": "46", "slug": "snake-io", "title": "Snake.io", "description": "经典的贪吃蛇竞技游戏，与其他玩家实时对战，吃掉食物不断长大！",
  "url": "/games/snake-io.html", "thumbnail": "/images/games/snake-io.svg", "category": "action",
  "tags": ["classic", "io-game", "multiplayer", "arcade"], "featured": false, "width": 600, "height": 500, "createdAt": "2025-05-01" },
{ "id": "47", "slug": "hole-io", "title": "Hole.io", "description": "控制黑洞吞噬城市中的一切！从小的物体开始，变得越来越大，吞噬整个城市！",
  "url": "/games/hole-io.html", "thumbnail": "/images/games/hole-io.svg", "category": "action",
  "tags": ["io-game", "casual", "multiplayer"], "featured": false, "width": 600, "height": 500, "createdAt": "2025-05-02" },

// P0: Idle 放置
{ "id": "48", "slug": "cookie-clicker", "title": "Cookie Clicker", "description": "经典点击放置游戏。点击生产饼干，购买升级自动生产，成为饼干大亨！",
  "url": "/games/cookie-clicker.html", "thumbnail": "/images/games/cookie-clicker.svg", "category": "casual",
  "tags": ["idle", "clicker", "casual", "classic"], "featured": false, "width": 600, "height": 500, "createdAt": "2025-05-03" },
{ "id": "49", "slug": "idle-miner", "title": "Idle Miner", "description": "经营你的矿场！雇佣工人升级设备，挖掘更深的地层，赚取更多财富！",
  "url": "/games/idle-miner.html", "thumbnail": "/images/games/idle-miner.svg", "category": "casual",
  "tags": ["idle", "clicker", "strategy"], "featured": false, "width": 600, "height": 500, "createdAt": "2025-05-04" },

// P0: 跑酷/平台跳跃
{ "id": "50", "slug": "slope-run", "title": "Slope Run", "description": "在倾斜的赛道上高速奔跑！躲避障碍物，保持平衡，看你能跑多远！",
  "url": "/games/slope-run.html", "thumbnail": "/images/games/slope-run.svg", "category": "action",
  "tags": ["parkour", "classic", "speed", "survival"], "featured": false, "width": 600, "height": 400, "createdAt": "2025-05-05" },
{ "id": "51", "slug": "geometry-dash", "title": "Geometry Dash", "description": "节奏感十足的跑酷游戏！跟随音乐节奏跳跃躲避障碍，挑战超高难度关卡！",
  "url": "/games/geometry-dash.html", "thumbnail": "/images/games/geometry-dash.svg", "category": "action",
  "tags": ["parkour", "rhythm", "action", "survival"], "featured": false, "width": 600, "height": 400, "createdAt": "2025-05-06" },

// P1: 每日挑战变种
{ "id": "52", "slug": "worldle", "title": "Worldle", "description": "Wordle 地理版！根据轮廓猜出国家名称，每日一题测试你的地理知识！",
  "url": "/games/worldle.html", "thumbnail": "/images/games/worldle.svg", "category": "puzzle",
  "tags": ["daily", "word", "educational", "puzzle"], "featured": false, "width": 400, "height": 500, "createdAt": "2025-05-07" },

// P1: 恐怖/解谜
{ "id": "53", "slug": "escape-room", "title": "Escape Room", "description": "你被困在一个神秘的房间中。寻找线索，解开谜题，找到逃出去的方法！",
  "url": "/games/escape-room.html", "thumbnail": "/images/games/escape-room.svg", "category": "puzzle",
  "tags": ["puzzle", "escape", "horror", "adventure"], "featured": false, "width": 600, "height": 500, "createdAt": "2025-05-08" },

// P2: 节奏音乐
{ "id": "54", "slug": "piano-tiles", "title": "Piano Tiles", "description": "测试你的反应速度！点击黑色瓷砖跟随音乐节奏，不要碰到白色瓷砖！",
  "url": "/games/piano-tiles.html", "thumbnail": "/images/games/piano-tiles.svg", "category": "casual",
  "tags": ["rhythm", "music", "reflex", "casual"], "featured": false, "width": 400, "height": 500, "createdAt": "2025-05-09" },

// P2: 塔防
{ "id": "55", "slug": "tower-defense", "title": "Tower Defense", "description": "建造防御塔阻止敌人前进！策略选择炮塔位置升级，守卫你的基地！",
  "url": "/games/tower-defense.html", "thumbnail": "/images/games/tower-defense.svg", "category": "strategy",
  "tags": ["strategy", "tower-defense", "classic"], "featured": false, "width": 700, "height": 500, "createdAt": "2025-05-10" },

// P1: 射击
{ "id": "56", "slug": "space-invaders", "title": "Space Invaders", "description": "经典街机射击游戏！操控飞船抵御外星人入侵，消灭所有入侵者！",
  "url": "/games/space-invaders.html", "thumbnail": "/images/games/space-invaders.svg", "category": "action",
  "tags": ["shooter", "space", "classic", "arcade"], "featured": false, "width": 600, "height": 500, "createdAt": "2025-05-11" },
{ "id": "57", "slug": "zombie-shooter", "title": "Zombie Shooter", "description": "僵尸末日来袭！使用各种武器消灭一波又一波的僵尸，生存到最后！",
  "url": "/games/zombie-shooter.html", "thumbnail": "/images/games/zombie-shooter.svg", "category": "action",
  "tags": ["shooter", "survival", "horror", "action"], "featured": false, "width": 600, "height": 500, "createdAt": "2025-05-12" },

// P2: 体育竞技
{ "id": "58", "slug": "soccer-stars", "title": "Soccer Stars", "description": "快速足球对战游戏！控制球队传球射门，先进 5 球者获胜！",
  "url": "/games/soccer-stars.html", "thumbnail": "/images/games/soccer-stars.svg", "category": "sports",
  "tags": ["sports", "multiplayer", "pvp", "action"], "featured": false, "width": 600, "height": 400, "createdAt": "2025-05-13" }
```

- [ ] **Step 2: 在 4 个消息文件中添加新游戏翻译**

在 `en.json` 的 `games` 对象中添加：
```json
"snake-io": { "title": "Snake.io", "description": "Classic snake battle royale. Compete against other players in real-time, eat food, and grow to dominate the arena!" },
"hole-io": { "title": "Hole.io", "description": "Control a black hole and consume everything in the city! Start small, grow massive, and swallow the whole city!" },
"cookie-clicker": { "title": "Cookie Clicker", "description": "Classic idle clicker game. Click to bake cookies, buy upgrades, auto-produce, and become a cookie tycoon!" },
"idle-miner": { "title": "Idle Miner", "description": "Manage your mine! Hire workers, upgrade equipment, dig deeper, and earn more wealth!" },
"slope-run": { "title": "Slope Run", "description": "Race down a steep slope! Dodge obstacles, keep your balance, and see how far you can go!" },
"geometry-dash": { "title": "Geometry Dash", "description": "Rhythm-based platformer! Jump to the beat, dodge obstacles, and conquer insanely difficult levels!" },
"worldle": { "title": "Worldle", "description": "Geography Wordle! Guess the country by its silhouette — a new daily puzzle to test your geography knowledge!" },
"escape-room": { "title": "Escape Room", "description": "You're trapped in a mysterious room. Find clues, solve puzzles, and find a way to escape!" },
"piano-tiles": { "title": "Piano Tiles", "description": "Test your reflexes! Tap the black tiles to the rhythm — don't miss any white tiles!" },
"tower-defense": { "title": "Tower Defense", "description": "Build defensive towers to stop enemy waves! Strategically place turrets and defend your base!" },
"space-invaders": { "title": "Space Invaders", "description": "Classic arcade shooter! Pilot your ship against alien invaders and save the Earth!" },
"zombie-shooter": { "title": "Zombie Shooter", "description": "The zombie apocalypse is here! Use various weapons to survive wave after wave of undead!" },
"soccer-stars": { "title": "Soccer Stars", "description": "Fast-paced soccer showdown! Control your team, pass and shoot — first to 5 goals wins!" }
```

同结构补充 `zh.json`（中文）、`zh-TW.json`（繁体中文）、`ja.json`（日语）翻译。

- [ ] **Step 3: 验证新增游戏可见**

```bash
npm run dev
```
手动访问 `http://localhost:3000/en/games` 确认新游戏出现在列表中。

- [ ] **Step 4: Commit**

```bash
git add src/data/games.json src/messages/en.json src/messages/zh.json src/messages/zh-TW.json src/messages/ja.json
git commit -m "feat: add 13 high-traffic category games (.io, idle, runner, etc.)"
```

---

### 阶段一验证

- [ ] 运行完整构建 `npm run build` — 无错误
- [ ] 运行 E2E 测试 `npx playwright test` — 全部通过（包括原有 19 测试）
- [ ] 确认游戏库 > 65 款
- [ ] 确认 Search Console 收录 URL > 200

---

## 阶段二（第 5-12 周）：长尾关键词矩阵 + 回访机制

### Task 4: 游戏页 SEO 关键词优化

**现状：** 游戏页 title/description 使用通用模板，缺乏长尾关键词密度。需要为每款游戏添加 SEO 优化的 metaTitle/metaDesc 字段。

**Files:**
- Modify: `src/messages/en.json`
- Modify: `src/messages/zh.json`
- Modify: `src/messages/zh-TW.json`
- Modify: `src/messages/ja.json`
- Modify: `src/app/[locale]/games/[slug]/page.tsx`

- [ ] **Step 1: 在 `en.json` 的每个游戏条目中添加 `metaTitle` 和 `metaDesc`**

```json
"2048": {
  "title": "2048",
  "description": "...",
  "metaTitle": "2048 - Free Online Number Puzzle Game | LeYou",
  "metaDesc": "Play 2048 online for free. Slide and merge numbered tiles to reach 2048. No download needed — instant browser play on any device."
},
"snake": {
  "title": "Snake",
  "description": "...",
  "metaTitle": "Snake Game - Free Online Classic Arcade Game | LeYou",
  "metaDesc": "Play the classic Snake game online for free. Control the snake, eat food, grow longer, and avoid walls. No download required, play instantly in your browser."
},
"tetris": {
  "title": "Tetris",
  "description": "...",
  "metaTitle": "Tetris - Free Online Classic Puzzle Game | LeYou",
  "metaDesc": "Play Tetris online for free. Rotate and place falling blocks to clear lines. The timeless puzzle game, now in your browser — no download needed."
},
"wordle": {
  "title": "Wordle",
  "description": "...",
  "metaTitle": "Wordle - Free Daily Word Game Online | LeYou",
  "metaDesc": "Play Wordle online for free. Guess the hidden 5-letter word in 5 tries. A new daily puzzle every day — no download, no sign-up needed."
}
```

（其余游戏依此类推，每款游戏含 "free online"、"no download" 关键词，description 100-160 字符。）

- [ ] **Step 2: 更新 `generateMetadata` 优先使用 metaTitle/metaDesc**

```ts
// src/app/[locale]/games/[slug]/page.tsx — generateMetadata 修改
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params
  const game = getGameBySlug(slug)
  if (!game) return { title: "Game not found" }
  const localized = getLocalizedGame(game, locale)
  const canonicalUrl = `${BASE_URL}/${locale}/games/${slug}`

  // 读取 SEO 优化字段
  const messages = loadMessages(locale)
  const gameMessages = (messages?.games as Record<string, { metaTitle?: string; metaDesc?: string }>) || {}
  const seoTitle = gameMessages[slug]?.metaTitle
  const seoDesc = gameMessages[slug]?.metaDesc

  const title = seoTitle || `${localized.title} | LeYou`
  const description = seoDesc || localized.description

  return { /* ... 使用 title, description ... */ }
}
```

需要将 `loadMessages` 函数从 `i18n-games.ts` 提取为共享函数，或在 game page 中直接 import。

- [ ] **Step 3: 验证 meta tags**

```bash
npm run dev
curl http://localhost:3000/en/games/2048 | grep -o '<title>.*</title>'
```
Expected: `<title>2048 - Free Online Number Puzzle Game | LeYou</title>`

- [ ] **Step 4: Commit**

```bash
git add src/messages/en.json src/messages/zh.json src/messages/zh-TW.json src/messages/ja.json src/app/\[locale\]/games/\[slug\]/page.tsx
git commit -m "feat: add SEO-optimized meta titles and descriptions for all games"
```

---

### Task 5: 分类页 SEO Landing Page 改造

**Files:**
- Modify: `src/messages/en.json`
- Modify: `src/messages/zh.json`
- Modify: `src/messages/zh-TW.json`
- Modify: `src/messages/ja.json`
- Modify: `src/app/[locale]/categories/[slug]/page.tsx`
- Modify: `src/lib/structured-data.ts`

- [ ] **Step 1: 在消息文件中添加品类介绍和 FAQ**

在 `en.json` 中 `categories` 对象下，为每个品类添加 `intro` 和 `faq`：

```json
"categories": {
  "puzzle": {
    "name": "Puzzle",
    "description": "Brain-training puzzle and logic games",
    "intro": "Challenge your mind with our collection of free online puzzle games. From classic Sudoku and 2048 to daily Wordle challenges, each game sharpens your logic, memory, and problem-solving skills. No download needed — just click and play in your browser.",
    "faq": [
      { "q": "What are the best free puzzle games to play online?", "a": "LeYou offers 15+ free online puzzle games including 2048, Sudoku, Tetris, Minesweeper, and Wordle. All games run directly in your browser with no download required." },
      { "q": "Can I play puzzle games without downloading anything?", "a": "Yes — every puzzle game on LeYou is HTML5 based and works instantly in your browser. No downloads, no plugins, no sign-ups needed." },
      { "q": "Are there daily puzzle challenges?", "a": "Yes! Try our daily Wordle challenge and daily Sudoku — a new puzzle every day to keep your brain sharp." }
    ]
  },
  "action": {
    "name": "Action",
    "description": "Fast-paced action games",
    "intro": "Get your adrenaline pumping with our free online action games. Shoot enemies, dodge obstacles, compete in .io arenas, and test your reflexes. Instant browser play — no download required.",
    "faq": [
      { "q": "What free action games can I play in my browser?", "a": "LeYou offers Snake.io, Space Shooter, Flappy Bird, Geometry Dash, Slope Run, and more. All are HTML5 games that run instantly in your browser." },
      { "q": "Are there multiplayer .io games?", "a": "Yes — we have Snake.io and Hole.io where you compete against other players in real-time. No account needed, just click and play." }
    ]
  },
  // ... 其他品类依此类推
}
```

同逻辑更新 `zh.json`、`zh-TW.json`、`ja.json`。

- [ ] **Step 2: 在 `structured-data.ts` 中新增 FAQPage schema**

```ts
export function faqJsonLd(items: Array<{ q: string; a: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  }
}
```

- [ ] **Step 3: 更新分类页组件——加入 intro 文字 + FAQ 区块**

```tsx
// 在文件顶部新增 import
import { faqJsonLd } from "@/lib/structured-data"

// src/app/[locale]/categories/[slug]/page.tsx 中，在 h1 header 下方、GameGrid 上方插入

const faq = localizedCat.faq as Array<{ q: string; a: string }> | undefined
const intro = localizedCat.intro as string | undefined

return (
  <div>
    {/* ... 现有 breadcrumb + header ... */}

    {/* Intro paragraph */}
    {intro && (
      <div className="mb-8 max-w-3xl text-sm leading-relaxed text-[var(--text-secondary)]">
        {intro}
      </div>
    )}

    {/* ... 现有 GameGrid ... */}

    {/* FAQ Section */}
    {faq && faq.length > 0 && (
      <section className="mt-12 border-t border-[var(--border-default)] pt-10">
        <h2 className="mb-6 text-lg font-bold text-[var(--text-primary)]">
          Frequently Asked Questions
        </h2>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(faq)) }}
        />
        <div className="space-y-4">
          {faq.map((item, i) => (
            <div key={i} className="rounded-xl border border-[var(--border-default)] bg-white/[0.02] p-4">
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">{item.q}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">{item.a}</p>
            </div>
          ))}
        </div>
      </section>
    )}
  </div>
)
```

- [ ] **Step 4: 验证分类页**

```bash
npm run dev
# 访问 http://localhost:3000/en/categories/puzzle 确认 intro + FAQ 可见
# 检查页面源代码中 FAQPage JSON-LD 存在
```

- [ ] **Step 5: Commit**

```bash
git add src/messages/en.json src/messages/zh.json src/messages/zh-TW.json src/messages/ja.json src/lib/structured-data.ts src/app/\[locale\]/categories/\[slug\]/page.tsx
git commit -m "feat: add SEO landing page content and FAQ schema to category pages"
```

---

### Task 6: 每日挑战机制（Daily Challenge）

**Files:**
- Create: `src/lib/daily-challenge.ts`
- Create: `src/app/[locale]/daily/wordle/page.tsx`
- Create: `src/app/[locale]/daily/sudoku/page.tsx`
- Modify: `src/messages/en.json`
- Modify: `src/messages/zh.json`
- Modify: `src/messages/zh-TW.json`
- Modify: `src/messages/ja.json`
- Modify: `src/app/sitemap.ts`
- Modify: `src/app/[locale]/page.tsx`（Hero 区增加每日挑战入口）

- [ ] **Step 1: 创建每日挑战核心逻辑模块**

```ts
// src/lib/daily-challenge.ts

/** 日期的日种子（用于确定性随机选择） */
export function getTodaySeed(): number {
  const now = new Date()
  return now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate()
}

/** 根据 seed 从数组中确定性选取一个值 */
function seededPick<T>(arr: T[], seed: number): T {
  return arr[Math.abs(seed) % arr.length]
}

// ── Wordle 每日词库（用于 Date-seeded 选词）──
const DAILY_WORDS = [
  "about", "above", "abuse", "actor", "acute", "admit", "adopt", "adult",
  "after", "again", "agent", "agree", "ahead", "alarm", "album", "alert",
  "alien", "align", "alive", "allow", "alone", "along", "alter", "among",
  "ample", "angel", "anger", "angle", "angry", "anime", "ankle", "apart",
  "apple", "apply", "arena", "argue", "arise", "armor", "aroma", "array",
  "arrow", "aside", "asset", "atlas", "attic", "audio", "audit", "avoid",
  "awake", "award", "aware", "awful", "bacon", "badge", "badly", "baker",
  "basic", "basis", "batch", "beach", "beard", "beast", "begin", "being",
  "below", "bench", "berry", "birth", "black", "blade", "blame", "bland",
  "blast", "blaze", "bleed", "blend", "bless", "blind", "blink", "bliss",
  "block", "blond", "blood", "bloom", "blown", "board", "bonus", "booth",
  "bound", "brain", "brand", "brave", "bread", "break", "breed", "brick",
  "brief", "bring", "broad", "broke", "brook", "brown", "brush", "buddy",
  "build", "built", "bunch", "burst", "cabin", "cable", "camel", "candy",
  "cargo", "carry", "catch", "cause", "cease", "chain", "chair", "chaos",
  "charm", "chart", "chase", "cheap", "check", "cheek", "cheer", "chess",
  "chest", "chick", "chief", "child", "chill", "china", "choir", "chord",
  "chunk", "civic", "civil", "claim", "clash", "class", "clean", "clear",
  "click", "climb", "cling", "clock", "close", "cloth", "cloud", "coach",
  "coast", "cocoa", "coral", "couch", "could", "count", "court", "cover",
  "crack", "craft", "crane", "crash", "crawl", "crazy", "cream", "creek",
  "crest", "crime", "crisp", "cross", "crowd", "crown", "crush", "curve",
  "cycle", "daily", "dance", "debut", "decay", "deduct", "defer", "degas",
  "delay", "delta", "dense", "depot", "depth", "derby", "desert", "desk",
  "devil", "diary", "dirty", "ditch", "dizzy", "dodge", "doing", "donor",
  "doubt", "dough", "draft", "drain", "drake", "drama", "drank", "drape",
  "dream", "dress", "dried", "drift", "drill", "drink", "drive", "drone",
  "drove", "drums", "drunk", "dying", "eager", "eagle", "early", "earth",
  "eaten", "ebony", "eclat", "edict", "eight", "elder", "elect", "elite",
  "elope", "ember", "empty", "enemy", "enjoy", "enter", "entry", "equal",
  "equip", "erase", "error", "essay", "estate", "evade", "event", "every",
  "evict", "exact", "exert", "exile", "exist", "extra", "fable", "facet",
  "faint", "fairy", "faith", "falsh", "fancy", "fatal", "fault", "feast",
  "fence", "ferry", "fetch", "fever", "fiber", "field", "fifth", "fifty",
  "fight", "final", "first", "fixed", "flame", "flash", "fleet", "flesh",
  "float", "flock", "flood", "floor", "flora", "flour", "fluid", "flush",
  "flyer", "focal", "focus", "force", "forge", "forth", "forum", "found",
  "frame", "frank", "fraud", "fresh", "front", "frost", "froze", "fruit",
  "fully", "funny", "ghost", "giant", "given", "glass", "globe", "gloom",
  "glory", "gloss", "glove", "going", "grace", "grade", "grain", "grand",
  "grant", "grape", "graph", "grasp", "grass", "grave", "great", "green",
  "greet", "grief", "grill", "grind", "gross", "group", "grove", "grown",
  "guard", "guess", "guest", "guide", "guild", "guilt", "graph", "graze",
  "habit", "happy", "harsh", "haste", "haunt", "haven", "heart", "heavy",
  "hedge", "heist", "hello", "hence", "honey", "honor", "horse", "hotel",
  "house", "human", "humor", "hurry", "hyper", "ideal", "image", "imply",
  "index", "indie", "inner", "input", "irony", "ivory", "jewel", "joint",
  "joker", "judge", "juice", "jumbo", "jumps", "junky", "kayak", "kebab",
  "khaki", "kinky", "kitty", "knack", "kneel", "knife", "knock", "knots",
  "known", "label", "labor", "laptop", "large", "laser", "later", "laugh",
  "layer", "learn", "lease", "leave", "legal", "lemon", "level", "lever",
  "light", "limit", "linen", "liner", "lipid", "liver", "local", "logic",
  "login", "loose", "lover", "lower", "loyal", "lucky", "lunar", "lunch",
  "lyric", "magic", "major", "maker", "manor", "maple", "march", "marry",
  "marsh", "match", "maybe", "mayor", "media", "mercy", "merge", "merit",
  "metal", "meter", "might", "minor", "minus", "mirth", "model", "money",
  "month", "moral", "motor", "mount", "mouse", "mouth", "movie", "music",
  "naive", "naked", "named", "nasty", "naval", "nerve", "never", "newly",
  "night", "noble", "noise", "north", "noted", "novel", "nurse", "nylon",
  "oasis", "occur", "ocean", "offer", "often", "olive", "onset", "opera",
  "orbit", "order", "organ", "other", "ought", "outer", "owned", "owner",
  "oxide", "ozone", "paint", "panel", "panic", "paper", "party", "pasta",
  "patch", "pause", "peace", "pearl", "penny", "phase", "phone", "photo",
  "piano", "piece", "pilot", "pinch", "pixel", "pizza", "place", "plain",
  "plane", "plant", "plate", "plaza", "plead", "pluck", "plumb", "plume",
  "plump", "plunge", "point", "polar", "pound", "power", "press", "price",
  "pride", "prime", "print", "prior", "prize", "probe", "prone", "proof",
  "prose", "proud", "prove", "proxy", "psalm", "pulse", "punch", "pupil",
  "purse", "queen", "query", "quest", "queue", "quick", "quiet", "quote",
  "radar", "radio", "raise", "rally", "ranch", "range", "rapid", "ratio",
  "reach", "react", "ready", "realm", "rebel", "refer", "reign", "relax",
  "relay", "relic", "remix", "renew", "reply", "reset", "resin", "retro",
  "revel", "rhyme", "rider", "ridge", "rifle", "right", "rigid", "rival",
  "river", "roast", "robin", "robot", "rocky", "rogue", "roman", "rough",
  "round", "route", "royal", "rugby", "ruler", "rural", "saint", "salad",
  "sauce", "scale", "scare", "scene", "scent", "scope", "score", "scout",
  "scrap", "sense", "serve", "setup", "seven", "shade", "shaft", "shake",
  "shall", "shame", "shape", "share", "shark", "sharp", "sheep", "sheer",
  "sheet", "shelf", "shell", "shift", "shine", "shirt", "shock", "shoot",
  "shore", "short", "shout", "sight", "sigma", "silly", "since", "sixth",
  "sixty", "skill", "skull", "slash", "sleep", "slice", "slide", "small",
  "smart", "smell", "smile", "smith", "smoke", "snack", "snake", "solid",
  "solve", "sorry", "sound", "south", "space", "spare", "spark", "speak",
  "speed", "spell", "spend", "spice", "spine", "spite", "split", "spoke",
  "sport", "spray", "squad", "stack", "staff", "stage", "stain", "stair",
  "stake", "stale", "stall", "stamp", "stand", "stark", "start", "state",
  "stave", "steady", "steak", "steal", "steam", "steel", "steep", "steer",
  "stern", "stick", "stiff", "still", "stock", "stone", "stood", "store",
  "storm", "story", "stove", "stuff", "style", "sugar", "suite", "sunny",
  "super", "surge", "swamp", "swarm", "swift", "swing", "swirl", "sword",
  "swore", "sworn", "syrup", "table", "taste", "taxes", "teach", "teeth",
  "tempo", "texte", "thank", "theft", "their", "theme", "there", "these",
  "thick", "thief", "thing", "think", "third", "thorn", "those", "three",
  "threw", "throw", "thumb", "tiger", "tight", "timer", "tired", "title",
  "toast", "today", "token", "total", "touch", "tough", "tower", "toxic",
  "trace", "track", "trade", "trail", "train", "trait", "trash", "treat",
  "trend", "trial", "tribe", "trick", "tried", "troop", "truce", "truck",
  "truly", "trunk", "trust", "truth", "tumor", "twice", "twist", "tying",
  "ultra", "uncle", "under", "unify", "union", "unite", "unity", "until",
  "upper", "upset", "urban", "usage", "usual", "utter", "valid", "value",
  "vapor", "vault", "venue", "verse", "video", "vigor", "vinyl", "viral",
  "virus", "visit", "vista", "vital", "vivid", "vocal", "vodka", "voice",
  "voter", "wagon", "waist", "waste", "watch", "water", "weary", "weave",
  "wedge", "weigh", "weird", "whale", "wheat", "wheel", "where", "which",
  "while", "white", "whole", "whose", "wider", "witch", "woman", "world",
  "worry", "worse", "worst", "worth", "would", "wound", "wrath", "write",
  "wrong", "wrote", "yacht", "yield", "young", "youth", "zebra", "zones"
]

const WORDLE_WORDS = DAILY_WORDS

export function getDailyWordleWord(seed: number): string {
  return seededPick(WORDLE_WORDS, seed)
}

// ── Sudoku ──
interface SudokuPuzzle {
  puzzle: number[][]
  solution: number[][]
  difficulty: "easy" | "medium" | "hard"
}

// 10 个预生成数独谜题（仅展示 2 个示例，实际需要 10+ 个以覆盖整月多样性）
const DAILY_SUDOKU_PUZZLES: SudokuPuzzle[] = [
  {
    puzzle: [
      [5,3,0,0,7,0,0,0,0],
      [6,0,0,1,9,5,0,0,0],
      [0,9,8,0,0,0,0,6,0],
      [8,0,0,0,6,0,0,0,3],
      [4,0,0,8,0,3,0,0,1],
      [7,0,0,0,2,0,0,0,6],
      [0,6,0,0,0,0,2,8,0],
      [0,0,0,4,1,9,0,0,5],
      [0,0,0,0,8,0,0,7,9],
    ],
    solution: [
      [5,3,4,6,7,8,9,1,2],
      [6,7,2,1,9,5,3,4,8],
      [1,9,8,3,4,2,5,6,7],
      [8,5,9,7,6,1,4,2,3],
      [4,2,6,8,5,3,7,9,1],
      [7,1,3,9,2,4,8,5,6],
      [9,6,1,5,3,7,2,8,4],
      [2,8,7,4,1,9,6,3,5],
      [3,4,5,2,8,6,1,7,9],
    ],
    difficulty: "easy",
  },
  // ... 更多谜题
]

export function getDailySudoku(seed: number): SudokuPuzzle {
  return seededPick(DAILY_SUDOKU_PUZZLES, seed)
}
```

- [ ] **Step 2: 创建每日 Wordle 页面**

```tsx
// src/app/[locale]/daily/wordle/page.tsx
import { getTranslations } from "next-intl/server"
import { getTodaySeed, getDailyWordleWord } from "@/lib/daily-challenge"
import type { Metadata } from "next"

const BASE_URL = "https://www.playgo.me"

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const word = getDailyWordleWord(getTodaySeed())
  // 将 word 首字母大写
  const wordDisplay = word.charAt(0).toUpperCase() + word.slice(1)
  return {
    title: `Wordle ${wordDisplay} - Free Daily Word Game | LeYou`,
    description: `Play today's Wordle online for free. Guess the hidden 5-letter word. A new daily puzzle every day — no download, no sign-up.`,
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
      title: `Daily Wordle - ${wordDisplay}`,
      description: `Can you guess today's 5-letter word?`,
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
  const word = getDailyWordleWord(seed)

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <h1 className="text-2xl font-bold text-[var(--text-primary)] text-center mb-2">
        {t("wordleTitle")}
      </h1>
      <p className="text-sm text-[var(--text-secondary)] text-center mb-6">
        {t("wordleDesc")}
      </p>
      {/* 嵌入 Wordle 游戏 HTML，传递 todayWord 参数 */}
      <iframe
        src={`/games/wordle.html?daily=${seed}`}
        className="mx-auto rounded-xl border border-[var(--border-default)]"
        style={{ width: 400, height: 500 }}
        title={t("wordleTitle")}
      />
    </div>
  )
}
```

- [ ] **Step 3: 创建每日数独页面**（同上结构，使用 `getDailySudoku`）

- [ ] **Step 4: 在消息文件中添加每日挑战翻译**

在 4 个 `messages/*.json` 中添加：
```json
"daily": {
  "wordleTitle": "Daily Wordle",
  "wordleDesc": "A new word puzzle every day. Can you guess it in 5 tries?",
  "sudokuTitle": "Daily Sudoku",
  "sudokuDesc": "A new Sudoku puzzle every day. Fill the grid so each row, column, and 3×3 box contains 1-9.",
  "shareText": "I solved today's {game} on LeYou! 🎯 Try it: playgo.me/{locale}/daily/{slug}"
}
```

- [ ] **Step 5: 更新 sitemap 加入 daily 路由**

```ts
// src/app/sitemap.ts 中追加
const dailyUrls = locales.flatMap((locale) => [
  { url: `${BASE_URL}/${locale}/daily/wordle`, lastModified: now, changeFrequency: "daily" as const, priority: 0.9 },
  { url: `${BASE_URL}/${locale}/daily/sudoku`, lastModified: now, changeFrequency: "daily" as const, priority: 0.9 },
])
```

- [ ] **Step 6: Commit**

```bash
git add src/lib/daily-challenge.ts src/app/\[locale\]/daily/wordle/page.tsx src/app/\[locale\]/daily/sudoku/page.tsx src/messages/*.json src/app/sitemap.ts
git commit -m "feat: add daily Wordle and Sudoku challenge pages"
```

---

### Task 7: 优化相关游戏推荐算法

**Files:**
- Modify: `src/lib/games.ts`

- [ ] **Step 1: 修改 `getRelatedGames` 使用加权算法**

```ts
export function getRelatedGames(game: Game, count = 6): Game[] {
  const all = gamesData as Game[]
  const scored = all
    .filter((g) => g.id !== game.id)
    .map((g) => {
      let score = 0
      if (g.category === game.category) score += 3
      g.tags.forEach((t) => {
        if (game.tags.includes(t)) score += 1
      })
      if (g.featured) score += 1
      return { game: g, score }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
  return scored.map((s) => s.game)
}
```

- [ ] **Step 2: 验证推荐结果**

```bash
npm run dev
# 访问 http://localhost:3000/en/games/2048 确认 "More Like This" 中推荐的是益智类游戏（Sudoku、Minesweeper 等优先）
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/games.ts
git commit -m "perf: improve related games algorithm with weighted scoring"
```

---

### 阶段二验证

- [ ] `npm run build` — 无错误
- [ ] 每日 Wordle / Sudoku 页可访问，title 含关键词
- [ ] 分类页显示 intro + FAQ + JSON-LD
- [ ] 相关游戏推荐质量提升
- [ ] 自然搜索点击 / 周较基准 +100%（Search Console 数据）

---

## 阶段三（第 3 个月起）：内容规模化 + 权威建设

### Task 8: 博客基础设施

**Files:**
- Create: `src/lib/blog.ts`
- Create: `src/app/[locale]/blog/page.tsx`
- Create: `src/app/[locale]/blog/[slug]/page.tsx`
- Create: `src/content/blog/`
- Modify: `src/app/sitemap.ts`
- Modify: `src/messages/en.json`（+4 个消息文件）

- [ ] **Step 1: 安装 MDX 依赖**

```bash
npm install @next/mdx@^16
```

- [ ] **Step 2: 创建博客数据层**

```ts
// src/lib/blog.ts
export interface BlogPostMeta {
  slug: string
  title: string
  description: string
  date: string
  tags: string[]
  category: string
}

export interface BlogPost extends BlogPostMeta {
  content: string
}

const POSTS: BlogPostMeta[] = [
  {
    slug: "best-free-puzzle-games-online",
    title: "10 Best Free Puzzle Games to Play Online in 2026",
    description: "Looking for the best free puzzle games online? We've curated the top 10 brain-teasers you can play instantly in your browser — no download required.",
    date: "2026-05-01",
    tags: ["puzzle", "classic", "strategy"],
    category: "guides",
  },
  {
    slug: "wordle-strategy-guide",
    title: "How to Win at Wordle Every Time — 5 Expert Strategies",
    description: "Master Wordle with these proven strategies. From optimal starting words to elimination patterns, improve your daily word game skills.",
    date: "2026-05-08",
    tags: ["word", "puzzle", "strategy"],
    category: "guides",
  },
  // 更多文章…（共计 ≥10 篇）
]

export function getAllPosts(): BlogPostMeta[] {
  return POSTS.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPostBySlug(slug: string): BlogPostMeta | undefined {
  return POSTS.find((p) => p.slug === slug)
}

// 动态加载 MDX 内容
export async function getPostContent(slug: string): Promise<string | null> {
  try {
    const md = await import(`@/content/blog/${slug}.md`)
    return md.default
  } catch {
    return null
  }
}
```

- [ ] **Step 3: 创建博客列表页**

```tsx
// src/app/[locale]/blog/page.tsx
import Link from "next/link"
import { getAllPosts } from "@/lib/blog"
import { getTranslations } from "next-intl/server"
import type { Metadata } from "next"

const BASE_URL = "https://www.playgo.me"

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "blog" })
  return {
    title: t("listTitle"),
    description: t("listDesc"),
    alternates: {
      canonical: `${BASE_URL}/${locale}/blog`,
      languages: {
        zh: `${BASE_URL}/zh/blog`, "zh-TW": `${BASE_URL}/zh-TW/blog`,
        en: `${BASE_URL}/en/blog`, ja: `${BASE_URL}/ja/blog`,
      },
    },
  }
}

export default async function BlogListPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "blog" })
  const posts = getAllPosts()

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-8">{t("listTitle")}</h1>
      <div className="space-y-6">
        {posts.map((post) => (
          <article key={post.slug} className="rounded-xl border border-[var(--border-default)] p-6 hover:border-[var(--accent-1)]/30 transition-all">
            <Link href={`/${locale}/blog/${post.slug}`}>
              <h2 className="text-lg font-semibold text-[var(--text-primary)] hover:text-[var(--accent-1)] transition-colors">{post.title}</h2>
            </Link>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">{post.description}</p>
            <div className="mt-3 flex items-center gap-3 text-xs text-[var(--text-muted)]">
              <time>{post.date}</time>
              <span>{post.category}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: 创建博客详情页**

```tsx
// src/app/[locale]/blog/[slug]/page.tsx
import { notFound } from "next/navigation"
import Link from "next/link"
import { getPostBySlug, getAllPosts, getPostContent } from "@/lib/blog"
import { getAllGames } from "@/lib/games"
import type { Metadata } from "next"

const BASE_URL = "https://www.playgo.me"

interface Props { params: Promise<{ locale: string; slug: string }> }

export function generateStaticParams() {
  const posts = getAllPosts()
  return posts.flatMap((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return { title: "Post not found" }
  return {
    title: `${post.title} | LeYou Blog`,
    description: post.description,
    alternates: {
      canonical: `${BASE_URL}/${locale}/blog/${slug}`,
      languages: {
        zh: `${BASE_URL}/zh/blog/${slug}`, "zh-TW": `${BASE_URL}/zh-TW/blog/${slug}`,
        en: `${BASE_URL}/en/blog/${slug}`, ja: `${BASE_URL}/ja/blog/${slug}`,
      },
    },
    openGraph: { title: post.title, description: post.description, url: `${BASE_URL}/${locale}/blog/${slug}`, siteName: "LeYou", locale, type: "article" },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const content = await getPostContent(slug)
  const games = getAllGames()

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link href={`/${locale}/blog`} className="text-xs text-[var(--accent-1)] hover:underline mb-4 inline-block">&larr; Back to Blog</Link>
      <article>
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">{post.title}</h1>
        <div className="flex items-center gap-3 text-xs text-[var(--text-muted)] mb-6">
          <time>{post.date}</time>
          <span>{post.category}</span>
        </div>
        {content ? (
          <div className="prose prose-sm max-w-none text-[var(--text-secondary)]" dangerouslySetInnerHTML={{ __html: content }} />
        ) : (
          <p className="text-[var(--text-secondary)]">{post.description}</p>
        )}
        {games.length > 0 && (
          <div className="mt-8 p-4 rounded-xl border border-[var(--border-default)] bg-white/[0.02]">
            <p className="text-sm text-[var(--text-primary)] font-medium mb-2">Play these games on LeYou:</p>
            <div className="flex flex-wrap gap-2">
              {games.slice(0, 5).map((g) => (
                <Link key={g.id} href={`/${locale}/games/${g.slug}`} className="text-xs text-[var(--accent-1)] hover:underline">{g.title}</Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  )
}
```

- [ ] **Step 5: 创建博客内容文件**

创建 `src/content/blog/best-free-puzzle-games-online.md` 等 ≥10 篇文章。每篇文章末尾内链回对应的游戏页。

- [ ] **Step 6: 更新 sitemap 集成博客路由**

```ts
// src/app/sitemap.ts 追加
const blogPosts = getAllPosts()
const blogUrls = locales.flatMap((locale) =>
  blogPosts.map((post) => ({
    url: `${BASE_URL}/${locale}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }))
)
const blogListUrls = locales.map((locale) => ({
  url: `${BASE_URL}/${locale}/blog`,
  lastModified: now,
  changeFrequency: "weekly" as const,
  priority: 0.7,
}))
```

- [ ] **Step 7: Commit**

```bash
git add src/lib/blog.ts src/app/\[locale\]/blog/ src/content/ src/messages/*.json src/app/sitemap.ts
git commit -m "feat: add blog infrastructure with Hub-and-Spoke SEO content"
```

---

### Task 9: 社交分享功能

**Files:**
- Create: `src/components/ShareButton.tsx`
- Modify: `src/app/[locale]/daily/wordle/page.tsx`
- Modify: `src/app/[locale]/daily/sudoku/page.tsx`
- Modify: `src/messages/en.json`（+3 消息文件）

- [ ] **Step 1: 创建 ShareButton 组件**

```tsx
// src/components/ShareButton.tsx
"use client"

interface Props {
  text: string
  url: string
  label?: string
}

export default function ShareButton({ text, url, label = "Share" }: Props) {
  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ text, url })
    } else {
      await navigator.clipboard.writeText(`${text}\n${url}`)
      alert("Link copied to clipboard!")
    }
  }

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center gap-2 rounded-xl border border-[var(--border-default)] px-4 py-2 text-sm font-medium text-[var(--text-primary)] hover:bg-white/[0.05] transition-all"
    >
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" />
      </svg>
      {label}
    </button>
  )
}
```

- [ ] **Step 2: 在每日挑战页中集成**

在 `daily/wordle/page.tsx` 和 `daily/sudoku/page.tsx` 中添加：
```tsx
import ShareButton from "@/components/ShareButton"
// ...
<ShareButton
  text={t("shareText", { game: "Wordle", locale, slug: "wordle" })}
  url={`${BASE_URL}/${locale}/daily/wordle`}
  label={t("shareLabel")}
/>
```

- [ ] **Step 3: 在消息文件中添加分享翻译**

```json
"daily": {
  // ... 现有
  "shareLabel": "Share Result"
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/ShareButton.tsx src/app/\[locale\]/daily/ src/messages/*.json
git commit -m "feat: add social sharing for daily challenge results"
```

---

### Task 10: IndexNow 主动推送

**Files:**
- Create: `src/app/api/indexnow/route.ts`
- Modify: `.env.local`（或项目配置）

- [ ] **Step 1: 创建 IndexNow API 路由**

```ts
// src/app/api/indexnow/route.ts
import { NextRequest, NextResponse } from "next/server"

const INDEXNOW_API_KEY = process.env.INDEXNOW_API_KEY || ""
const INDEXNOW_URL = "https://api.indexnow.org/indexnow"

export async function POST(request: NextRequest) {
  try {
    const { urls } = await request.json() as { urls: string[] }
    if (!Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json({ error: "Invalid urls" }, { status: 400 })
    }

    const body = {
      host: "www.playgo.me",
      key: INDEXNOW_API_KEY,
      keyLocation: `https://www.playgo.me/${INDEXNOW_API_KEY}.txt`,
      urlList: urls,
    }

    const res = await fetch(INDEXNOW_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      return NextResponse.json({ error: "IndexNow push failed" }, { status: 500 })
    }

    return NextResponse.json({ success: true, count: urls.length })
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}
```

- [ ] **Step 2: 注册 IndexNow API Key 并配置**

```bash
# 访问 https://www.indexnow.org/ 注册，获取 API Key
# 将 key 写入 public/{KEY}.txt（用于域名验证）

echo "${INDEXNOW_API_KEY}" > public/${INDEXNOW_API_KEY}.txt
```

- [ ] **Step 3: 在新增游戏/文章时自动推送**

在 `games.ts` 的 `getAllGames` 中或通过 git hook 触发推送。当前阶段可作为可选功能，后续自动化。

- [ ] **Step 4: Commit**

```bash
git add src/app/api/indexnow/route.ts
git commit -m "feat: add IndexNow URL push API"
```

---

### 阶段三验证

- [ ] `npm run build` — 无错误
- [ ] 博客列表可访问且有 ≥10 篇文章
- [ ] 每篇文章内链到游戏页
- [ ] Sitemap 包含 blog 路由
- [ ] 分享按钮在每日挑战页可见且可用
- [ ] IndexNow API 可响应 POST 请求
- [ ] Search Console 有排名关键词数 > 500

---

## E2E 测试覆盖

### Task 11: 新增 E2E 测试

**Files:**
- Modify: `e2e/` 目录（添加新测试文件）

- [ ] **Step 1: 编写每日挑战页 E2E 测试**

```ts
// e2e/daily-challenge.spec.ts
import { test, expect } from "@playwright/test"

const LOCALES = ["en", "zh", "zh-TW", "ja"]

test.describe("Daily Challenge Pages", () => {
  for (const locale of LOCALES) {
    test(`daily Wordle page loads in ${locale}`, async ({ page }) => {
      await page.goto(`/${locale}/daily/wordle`)
      await expect(page.locator("h1")).toContainText(/Wordle|word/i)
      await expect(page.locator("iframe")).toBeVisible()
    })

    test(`daily Sudoku page loads in ${locale}`, async ({ page }) => {
      await page.goto(`/${locale}/daily/sudoku`)
      await expect(page.locator("h1")).toContainText(/Sudoku|sudoku|数独/i)
    })
  }
})

test.describe("Blog Pages", () => {
  test("blog list page loads", async ({ page }) => {
    await page.goto("/en/blog")
    await expect(page.locator("h1")).toBeVisible()
  })

  test("blog post page loads", async ({ page }) => {
    await page.goto("/en/blog/best-free-puzzle-games-online")
    await expect(page.locator("article h1")).toBeVisible()
  })
})
```

- [ ] **Step 2: 编写新游戏页面可访问性测试**

```ts
// e2e/new-games.spec.ts
const NEW_GAMES = ["snake-io", "cookie-clicker", "slope-run", "worldle", "tower-defense"]

test.describe("New Game Pages", () => {
  for (const slug of NEW_GAMES) {
    test(`${slug} page loads in English`, async ({ page }) => {
      await page.goto(`/en/games/${slug}`)
      await expect(page.locator("h1")).toBeVisible()
      await expect(page.locator("iframe")).toBeVisible()
    })
  }
})
```

- [ ] **Step 3: 运行完整 E2E 测试套件**

```bash
npx playwright test
```
Expected: 所有 19 个原有测试 + 新增测试全部通过。

- [ ] **Step 4: Commit**

```bash
git add e2e/
git commit -m "test: add E2E tests for daily challenges and new games"
```

---

## 计划对照检查

| Spec 需求 | 对应 Task | 状态 |
|-----------|-----------|------|
| OG 图动态生成 | Task 1 | ✅ |
| Tags 英文化 | Task 2 | ✅ |
| 内容缺口补充（15-20 款） | Task 2 + 3 | ✅ |
| 游戏页 title/description SEO 优化 | Task 4 | ✅ |
| 分类页 intro + FAQ | Task 5 | ✅ |
| 每日 Wordle / Sudoku | Task 6 | ✅ |
| 加权相关游戏推荐 | Task 7 | ✅ |
| Hub & Spoke 博客内容 | Task 8 | ✅ |
| 社交分享功能 | Task 9 | ✅ |
| IndexNow 主动推送 | Task 10 | ✅ |
| E2E 测试覆盖 | Task 11 | ✅ |

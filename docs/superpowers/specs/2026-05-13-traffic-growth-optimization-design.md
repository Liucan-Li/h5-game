# LeYou 流量增长优化方案 — 设计文档

**日期：** 2026-05-13  
**目标：** 通过 SEO 优先策略，分三阶段提升 LeYou H5 游戏平台的自然搜索流量  
**范围：** 内容扩充 + 技术 SEO + 长尾关键词矩阵 + 内容规模化  

---

## 背景与现状

LeYou（playgo.me）是一个支持 4 语言（zh / zh-TW / en / ja）的 H5 游戏平台，基于 Next.js 16 + next-intl 构建，当前约 50 款游戏，以经典休闲/益智类为主。

**核心差距（对照欧美市场调研）：**

| 差距项 | 影响 |
|--------|------|
| 缺少 .io 多人竞技类 | 错失欧美最高流量品类 |
| 缺少 Idle 放置类 | 错失留存最高品类 |
| 缺少每日挑战机制 | 无回访驱动，用户不会主动返回 |
| OG 图 / JSON-LD 不完整 | 社交分享无预览，Google 富结果缺失 |
| 游戏 tags 为中文字符串 | 英文 SEO 信号弱，Google 爬取到中文 tag |
| 分类页无文字内容 | 纯列表页，Google 权重低 |

---

## 方案选择

采用**方案 C：分阶段全面路线**，每阶段有明确 KPI 验证节点，验证达标后推进下一阶段。

---

## 阶段一（第 1-4 周）：技术 SEO + 内容缺口补充

### 目标
- Search Console 收录 URL 数 > 200
- 游戏库总量 > 65 款

### 1.1 技术 SEO 修复

| 问题 | 修复方案 |
|------|---------|
| OG 图缺失 | 使用 Next.js `opengraph-image.tsx` 为每款游戏动态生成 1200×630 OG 图 |
| `sitemap.ts` 静态 | 改为从 `games.json` 动态读取，自动覆盖所有游戏页、分类页、4 个语言版本 |
| canonical / hreflang 不完整 | 确保每个 `[locale]/games/[slug]` 和 `[locale]/categories/[slug]` 页都有正确配置 |
| JSON-LD 不完整 | 游戏详情页补充 `VideoGame` schema（name, description, genre, url） |

### 1.2 内容缺口补充（约 15-20 款）

按市场热度优先级排序：

| 优先级 | 品类 | 目标款数 | 代表游戏方向 |
|--------|------|---------|------------|
| P0 | .io 竞技 | 3 款 | Snake.io 风格、Agar.io 风格、Hole.io 风格 |
| P0 | Idle 放置 | 2 款 | Cookie Clicker 风格、Idle 升级风格 |
| P0 | 跑酷/平台跳跃 | 3 款 | Slope 风格、Run 风格、Geometry Dash 风格 |
| P1 | 每日 Wordle 变种 | 2 款 | 数学版（Nerdle）、地理版（Worldle）|
| P1 | 恐怖/解谜 | 2 款 | Escape Room 系列 |
| P2 | 节奏音乐 | 2 款 | Piano Tiles 风格 |
| P2 | 塔防 | 2 款 | Bloons 风格 |

> 游戏内容通过嵌入已有 HTML5 游戏实现，重点在于为每款游戏建立独立 SEO landing page。

### 1.3 Tags 英文化

**现状：** `games.json` 中 tags 为中文字符串（`"经典"`、`"射击"`），通过 i18n map 翻译显示。Google 爬取到的是中文，英文 SEO 信号丢失。

**修复：**
- tags 改为英文 slug（`"classic"`、`"shooter"`、`"idle"` 等）
- `src/messages/zh.json` 等 4 个文件的 `tags` 对象反向：key 为英文 slug，value 为各语言显示文本
- `getLocalizedGame()` 和搜索逻辑同步更新

---

## 阶段二（第 5-12 周）：长尾关键词矩阵 + 回访机制

### 目标
- 自然搜索点击 / 周较阶段一基准 +100%
- 日均 PV 较基准 +50%

### 2.1 游戏页 Title/Description 关键词优化

**规则：**
- `title` 格式：`{游戏名} - Free Online {品类词} Game | LeYou`
- `description` 格式：100-160 字符，含 `play online for free`、`no download`、核心动词（`play`、`solve`、`beat`）
- 每款游戏的 meta 通过 `src/messages/*.json` 的 `games.{slug}.metaTitle` / `metaDesc` 字段管理（新增字段，不影响现有 `title`/`description`）

**示例：**
```
title: "2048 - Free Online Number Puzzle Game | LeYou"
description: "Play 2048 online for free. Slide and merge numbered tiles to reach 2048.
              No download needed — instant browser play on any device."
```

### 2.2 分类页 SEO Landing Page 改造

当前分类页 `/[locale]/categories/[slug]` 为纯游戏列表，无文字内容，Google 权重低。

**改造内容：**
- 分类页顶部加 100-200 字品类介绍，4 语言通过 i18n 管理
- 增加 FAQ 区块，使用 `FAQPage` JSON-LD schema（2-3 个 Q&A，覆盖高搜索量问题）
- "Top 5 in this category" 精选内链区块

**FAQ 示例（puzzle 分类）：**
```
Q: What are the best free puzzle games online?
A: LeYou offers 15+ free puzzle games including 2048, Sudoku, Minesweeper...

Q: Can I play puzzle games without downloading?
A: Yes — all games on LeYou run directly in your browser, no download required.
```

### 2.3 每日挑战机制（Daily Challenge）

**核心价值：** 制造回访流量。`daily wordle`、`wordle today`、`sudoku daily` 等关键词搜索量极大。

**实现方案：**

| 功能 | 实现方式 |
|------|---------|
| Wordle 每日词汇 | 基于 `new Date()` 取日期 seed，从词库中确定性选取当日单词 |
| Sudoku Daily | 按日期 seed 生成固定谜题，周一到周日难度递增 |
| 分享结果 | 生成纯文本分享（`I solved today's Sudoku on LeYou! 🎯`）+ Web Share API |
| 首页入口 | Hero 区增加 "Today's Challenge" 卡片，展示当日挑战预览 |

**SEO 结构：**
- Wordle daily 页：`/[locale]/daily/wordle`（独立路由，有利于 SEO canonical，避免参数页被 Google 忽略）
- 每日页面有独立 canonical，title 含日期（`Wordle May 13 2026 - Daily Word Game`）

### 2.4 内链网络优化

**现状：** `getRelatedGames()` 仅按 category 过滤，取前 6 个，缺乏权重排序。

**改进算法：**
```
相关度分 = 同品类 × 3 + 共享 tag 数 × 1 + (featured ? 1 : 0)
```

按相关度降序取 top 6，保证推荐质量，同时给 Google 更丰富的内链锚文本信号。

---

## 阶段三（第 3 个月起）：内容规模化 + 权威建设

### 目标
- 博客文章发布数 > 10 篇
- 有排名关键词数（Google Search Console）> 500 个

### 3.1 博客内容层（Hub & Spoke 架构）

新增 `/[locale]/blog` 路由，文章内链回对应游戏页：

| 文章类型 | 示例标题 | 目标关键词 |
|---------|---------|-----------|
| 排行榜 | "10 Best Free Puzzle Games Online (2026)" | `best puzzle games online` |
| 教程 | "How to Solve 2048 Every Time — Strategy Guide" | `2048 strategy` |
| 品类介绍 | "What Are .io Games? Top 10 to Play Free Now" | `what are io games` |
| 每日 | "Wordle Answer Today — May 13, 2026" | `wordle answer today` |

**数据层：** 文章以 MDX 文件存储于 `src/content/blog/`，通过 `generateStaticParams` 静态生成。

### 3.2 社交分享基础设施

| 功能 | 技术方案 |
|------|---------|
| 动态 OG 图（带成绩） | `@vercel/og` + `/api/og?game=wordle&score=3/6` |
| 移动端原生分享 | Web Share API（`navigator.share()`） |
| PC 端复制链接 | Clipboard API + Toast 提示 |
| 分享文本模板 | `I solved today's Sudoku on LeYou! 🎯 Can you beat my time? playgo.me/en/games/sudoku` |

### 3.3 IndexNow + Search Console 主动运营

- 新增游戏时通过 IndexNow API 主动推送 URL（覆盖 Bing + Yandex，间接加速 Google 收录）
- 定期检查 Core Web Vitals：LCP < 2.5s，CLS < 0.1，INP < 200ms
- 监控 Search Console 中高曝光低点击页面，针对性优化 CTR

---

## 验证节点汇总

| 阶段结束 | KPI | 达标线 |
|---------|-----|-------|
| 阶段一（第 4 周） | Search Console 收录 URL 数 | > 200 |
| 阶段一 | 游戏库总量 | > 65 款 |
| 阶段二（第 12 周） | 自然搜索点击 / 周 | 较基准 +100% |
| 阶段二 | 日均 PV | 较基准 +50% |
| 阶段三（第 16 周） | 博客文章发布数 | > 10 篇 |
| 阶段三 | 有排名关键词数 | > 500 |

---

## 技术约束与风险

| 风险 | 缓解措施 |
|------|---------|
| 新增游戏质量不稳定 | 上线前人工测试每款游戏可正常嵌入运行 |
| Tags 英文化导致现有 i18n 显示异常 | 迁移时保留旧 tags map 兼容过渡期，充分测试 4 语言显示 |
| 每日 Wordle 词库版权 | 使用公开词库（如 MIT 协议的 wordle 词表），避免商业词库 |
| 博客内容量需持续投入 | 阶段三优先级最低，可按流量验证结果决定是否提前启动 |

---

## 不在本方案范围内

- 广告变现（AdSense 集成）
- 用户账号 / 登录系统
- 提交到 Poki / CrazyGames 第三方平台
- 多人实时对战后端基础设施

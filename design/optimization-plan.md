# LeYou 游戏站 — 全站优化方案

*创建日期: 2026-06-20*
*状态: Draft*

---

## 项目概述

对 LeYou 游戏站现有的 63 款 H5 经典游戏进行全面优化升级，通过**统一游戏框架 + 分层渐进增强**的方式，打造精品 H5 游戏平台，提升玩家停留时长和回访率。

### 三层架构总览

```
Layer 3: 平台生态
  ├── 游戏→站点数据上报 (postMessage)
  ├── 个性化游戏推荐
  ├── 游戏内交叉推广
  └── 分享 & 社交传播

Layer 2: 游戏体验增强
  ├── 存档 & 本地记分板
  ├── 全球排行榜
  ├── 成就 / 徽章系统
  ├── 每日挑战
  └── 特效 & 动效反馈（含低配模式）

Layer 1: 统一游戏框架
  ├── 视觉系统 (毛玻璃/现代简约主题)
  ├── 性能引擎 (RAF管理 / 帧率控制)
  ├── 输入系统 (触控/键盘/手柄统一抽象)
  ├── 音频引擎 (Web Audio 音效/音乐)
  ├── 存档系统 (localStorage 封装)
  ├── UI组件库 (记分板/暂停/结算弹窗)
  └── 事件系统 (游戏状态↔站点通信)
```

---

## Core Identity

| 方面 | 内容 |
| ---- | ---- |
| **项目类型** | H5 游戏站全站优化 |
| **平台** | Web / H5（已有站点） |
| **目标用户** | 碎片时间休闲玩家 + 轻度竞技成就向玩家 |
| **游戏总数** | 63 款 |
| **技术栈** | Next.js 站点 + 独立 HTML 游戏文件 (iframe 嵌入) |
| **评估范围** | 小型（1-3个月）→ 分层推进，每层独立交付 |
| **可比参考** | Poki, CrazyGames, Coolmath Games |

---

## Current State Assessment

### 现状分析

| 维度 | 当前状态 | 问题 |
|------|---------|------|
| **视觉** | 每个游戏独立设计，风格不统一 | 玩家在不同游戏间切换时有割裂感 |
| **性能** | 各有优劣，部分游戏有内存泄漏隐患 | 长时间游戏可能卡顿 |
| **功能** | 无存档、无记分板、无成就 | 缺少留存机制 |
| **操作** | 触屏支持程度参差不齐 | 部分游戏在手机上体验不佳 |
| **音频** | 几乎无音效/音乐 | 缺少感官反馈 |
| **互通** | 游戏与站点完全隔离 | 无法做推荐/跨游戏联动 |

### 高流量游戏候选（优先迁移）

首轮 MVP 建议从以下高流量/高 featured 游戏中选取：

- 2048, Snake, Memory, Breakout, Dino Runner, Flappy Bird, Tetris, Pacman, Gomoku, Match-Three, Tank Battle, Battleship, Air Hockey, Bomberman, Chinese Chess, Texas Holdem

---

## 优化守则 (Pillars)

### 核心准则

| # | 准则 | 设计测试 |
|---|------|---------|
| 1 | **品质优先** — 每一行代码、每一个像素都经过打磨 | 如果在一个游戏上赶工降低品质，不如只做 30 款高质量游戏 |
| 2 | **渐进增强** — 框架先做基础，再层层叠加，不一步到位 | 讨论 Layer 3 功能时，如果 Layer 1 还不稳定，先回到基座 |
| 3 | **玩家即中心** — 所有优化决策以玩家体验为最终标准 | 如果一项优化让代码更"优雅"但玩家感觉不到，不值得做 |

### 不做清单 (Anti-Pillars)

| # | 不做 | 因为会损害... |
|---|------|-------------|
| 1 | 不为了统一而牺牲各游戏独特的玩法体验 | 品质优先 — 每个游戏的交互应有自己的个性 |
| 2 | 不盲目加功能导致加载时间变长 | 品质优先 — 零加载等待是 H5 游戏的核心优势 |
| 3 | 不做过深的社交系统（聊天、好友等） | 玩家即中心 — 轻量即玩才是定位 |
| 4 | 不做破坏原版经典玩法的修改 | 品质优先 — 保留经典体验是核心价值 |

---

## Visual Identity Anchor

### 视觉方向：毛玻璃现代简约 (Glassmorphism Minimal)

**一句话视觉规则**：在毛玻璃质感的底层上，用微妙的渐变和发光点缀，体现精致但不浮夸的品质感。

### 视觉原则

| # | 原则 | 设计测试 |
|---|------|---------|
| 1 | **毛玻璃基座** — 背景用磨砂玻璃效果，UI 控件半透明悬浮 | 游戏界面的主面板应看到背景透出的模糊效果 |
| 2 | **柔和渐变** — 主色用柔和的冷色渐变（蓝紫/青绿），点亮用暖色渐变（橙/粉） | 按钮和激活状态应使用渐变填充而非纯色 |
| 3 | **克制动效** — 动效服务于功能反馈，不为炫技 | 每个动效应有明确目的（状态变化/操作反馈/过渡引导） |

### 色彩哲学

- **主色**: 深蓝灰 (#1a1a2e → #16213e) — 沉稳、沉浸
- **强调色**: 青绿 (#4ecca3)、蓝紫 (#7c3aed) — 低饱和但清晰
- **点亮色**: 暖橙 (#f59e0b)、粉色 (#ec4899) — 用于成就/高分时刻
- **UI 控件**: 半透明白/灰 (rgba(255,255,255,0.05~0.15)) — 毛玻璃质感

---

## Layer 1: 统一游戏框架

### 框架结构设计

每个游戏 HTML 文件将采用以下结构：

```
┌─────────────────────────────────────────┐
│  Game Framework Shell                    │
│  ├── framework.css (统一主题变量 + 样式)  │
│  ├── framework.js (引擎 + 输入 + 音频)    │
│  └── framework-ui.js (UI组件 + 存档)      │
├─────────────────────────────────────────┤
│  Game Logic (各游戏独立逻辑)              │
│  通过 Framework API 与框架交互             │
└─────────────────────────────────────────┘
```

### Framework API 设计

```typescript
// 游戏通过以下 API 与框架交互
interface GameFrameworkAPI {
  // 视觉系统
  theme: { setTheme(mode: 'light' | 'dark'): void }
  
  // 渲染循环
  loop: { 
    start(fn: (dt: number) => void): void
    stop(): void
    getFPS(): number
  }
  
  // 输入系统
  input: {
    onKey: (key: string, callback: (pressed: boolean) => void) => void
    onTouch: (callback: (event: TouchEvent) => void) => void
    onSwipe: (callback: (dir: 'up'|'down'|'left'|'right') => void) => void
    vibrate: (ms: number) => void
  }
  
  // 音频系统
  audio: {
    playSFX(name: string): void
    playBGM(name: string, loop?: boolean): void
    stopBGM(): void
    setVolume(v: number): void
  }
  
  // 存档系统
  storage: {
    save(key: string, data: any): void
    load(key: string): any
    getHighScore(gameId: string): number
    setHighScore(gameId: string, score: number): void
  }
  
  // UI 系统
  ui: {
    showScore(score: number): void
    showPause(): void
    showGameOver(data: GameOverData): void
    showAchievement(name: string): void
    showLeaderboard(): void
  }
  
  // 事件系统 (站点通信)
  events: {
    emit(event: string, data: any): void  // postMessage to parent
    on(event: string, callback: (data: any) => void): void
  }
}
```

### 迁移策略

1. 分析每个游戏现有代码，提取核心逻辑
2. 接入 Framework API 替换原有输入/渲染/UI 逻辑
3. 逐步替换原有样式为统一主题
4. 验证功能完整性

---

## Layer 2: 游戏体验增强

### 功能模块

| 功能 | 实现方式 | 优先级 |
|------|---------|--------|
| **存档 & 记分板** | localStorage + Framework API storage | P0 |
| **全球排行榜** | 后端 API + 游戏内排行榜 UI | P1 |
| **成就系统** | 根据游戏内事件触发，站点统一展示 | P1 |
| **每日挑战** | 按天种子随机，生成独特的挑战条件 | P2 |
| **特效系统** | Canvas 粒子引擎 + CSS 动效 + 性能分级 | P1 |

### 性能分级策略

```
性能分级 (在 Framework 中自动检测):
├── 高性能模式: 60fps + 全粒子 + 屏幕震动 + 模糊效果
├── 中性能模式: 60fps + 简化粒子 + 无震动
└── 低性能模式: 30fps + 无粒子 + 基本UI
```

---

## Layer 3: 平台生态

### 通信协议

游戏通过 `postMessage` 与站点通信：

```typescript
// 游戏 → 站点消息
interface GameToSiteMessage {
  type: 'GAME_COMPLETE' | 'SCORE_UPDATE' | 'ACHIEVEMENT_UNLOCKED' | 'GAME_PAUSE' | 'GAME_RESUME'
  payload: {
    gameId: string
    score?: number
    achievement?: string
    metadata?: Record<string, any>
  }
}

// 站点 → 游戏消息
interface SiteToGameMessage {
  type: 'RECOMMEND_GAME' | 'DAILY_CHALLENGE' | 'APPLY_THEME'
  payload: Record<string, any>
}
```

### 功能模块

| 功能 | 依赖 | 说明 |
|------|------|------|
| 数据上报 | Layer 1 事件系统 | 游戏完成事件触发站点端展示/统计 |
| 个性化推荐 | 上报数据 + 标签匹配 | 根据已玩游戏的分类/标签推荐 |
| 交叉推广 | 数据上报 | 游戏结束界面推荐其他游戏 |
| 社交分享 | Canvas 截图 + URL | 生成游戏结果分享卡片 |

---

## Technical Considerations

| 考量 | 评估 |
| ---- | ---- |
| **框架分发方式** | 内联到每个游戏 HTML（单文件独立），或通过站点 CDN 加载统一 JS |
| **推荐方案** | 首日内联确保兼容性，后期可考虑 CDN 统一加载 |
| **排行榜后端** | 简单 REST API（可以考虑 Next.js API Routes 已在项目中可用） |
| **关键技术挑战** | 游戏代码质量参差不齐，解耦难度不同 |
| **音频策略** | 使用 Web Audio API + 预生成音效（不依赖外部音频文件以保持加载速度） |
| **无障碍** | 游戏内需支持键盘导航和屏幕阅读器（后续迭代） |

---

## Scope Tiers

| 层级 | 内容 | 游戏数 | 预估工期 |
| ---- | ---- | ------ | -------- |
| **MVP** | Layer 1 框架开发 + 5 款高流量游戏迁移验证 | 5 款 | 1-2 周 |
| **Phase 1** | Layer 1 覆盖 15 款 + Layer 2（存档/记分板/排行榜 API） | 15 款 | 3-4 周 |
| **Phase 2** | 剩余游戏全部迁移 + Layer 2 全功能（成就/每日挑战/特效） | 63 款全部 | 4-6 周 |
| **Phase 3** | Layer 3 平台生态（数据上报/推荐/交叉推广/分享） | 平台级 | 2-3 周 |

### MVP 定义

**核心假设**: 统一游戏框架能在不影响原有游戏体验的前提下提升视觉品质和用户体验。

**MVP 需要**:
1. 框架核心（渲染/输入/UI 主题/存档）可用
2. 5 款代表性游戏成功迁移（涵盖不同类别：动作/益智/休闲/棋牌/街机）
3. 本地记分板功能
4. 框架兼容性验证通过

**MVP 不做**:
- 全球排行榜（Phase 1）
- 成就系统（Phase 2）
- 平台通信（Phase 3）

---

## 玩家画像

| 属性 | 分析 |
| ---- | ---- |
| **主力玩家** | 休闲探索者 — 碎片时间打开玩几局的轻度玩家 |
| **次要受众** | 成就猎手 — 想要高分、解锁成就的核心向玩家 |
| **谁不适合** | 硬核 3A 玩家、需要深度叙事/社交的玩家 |
| **动机** | 放松消遣、怀旧经典、轻度挑战 |

### 玩家动机分析 (SDT)

| 需求 | 如何满足 | 强度 |
| ---- | -------- | ---- |
| **Autonomy (自主性)** | 选择想玩的游戏、自定难度/设置 | 支持性 |
| **Competence (胜任感)** | 本地记分板 + 成就 + 排行榜展示进步 | 核心 |
| **Relatedness (关联性)** | 全球排行榜（间接竞争）、分享功能 | 辅助性 |

---

## Risks and Open Questions

### 设计风险
- **风险**: 统一框架可能限制某些游戏的独特交互方式
  - *缓解*: 框架 API 设计为可选接入，游戏可选择性使用部分功能

### 技术风险
- **风险**: 部分游戏代码质量低，难以解耦接入框架
  - *缓解*: MVP 阶段选 5 款覆盖不同复杂度级别的游戏验证方案
- **风险**: 60 款游戏逐一迁移工作量巨大
  - *缓解*: 开发迁移辅助脚本，批量处理可见替换（CSS 变量、样式迁移）
- **风险**: 特效全开时低端设备性能问题
  - *缓解*: 自带性能检测 + 分级开关

### 市场风险
- **风险**: 竞品站点（Poki, CrazyGames 等）持续投入，需要差异化
  - *缓解*: 聚焦"经典游戏精品化"的独特定位，而非做更大更全

### 开放问题
- 框架中位数: 内联到每个 HTML vs CDN 统一加载？MVP 阶段可先内联验证
- 排行榜后端: 使用现有 Next.js API Routes 还是独立服务？
- 游戏迁移优先级排序: 需要接入 Google Analytics 或类似工具确认高流量游戏

---

## Next Steps

- [ ] **MVP 启动** — 设计并开发 Game Framework v1
  - 完成 Framework API 核心模块（渲染、输入、UI、存档）
  - 选取 5 款代表游戏（建议: 2048, Snake, Tetris, Flappy Bird, Tank Battle）
  - 验证框架兼容性和迁移工作流
- [ ] **框架验证** — 5 款游戏迁移完成，测试所有功能正常
- [ ] **Phase 1 规划** — 根据 MVP 经验调整后续计划
- [ ] **Phase 1 执行** — 批量迁移 15 款 + 排行榜开发
- [ ] **Phase 2 规划** — 剩余游戏 + 成就/每日挑战/特效系统
- [ ] **Phase 3 规划** — 平台数据互通、推荐系统、分享功能
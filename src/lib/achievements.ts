// 成就定义与验证逻辑

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  condition: (stats: PlayerStats) => boolean
}

export interface PlayerStats {
  gamesPlayed: string[] // game slugs
  highScores: Record<string, number> // game slug -> high score
  totalSessions: number
  bestScore: number
  dailyChallenges: number
}

// All available achievements
export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-game",
    title: "初次游戏",
    description: "完成你的第一局游戏",
    icon: "🎮",
    condition: (s) => s.totalSessions >= 1,
  },
  {
    id: "high-scorer",
    title: "高分玩家",
    description: "在任意游戏中获得 500+ 分数",
    icon: "⭐",
    condition: (s) => Object.values(s.highScores).some((v) => v >= 500),
  },
  {
    id: "veteran",
    title: "游戏老手",
    description: "在任意游戏中获得 2000+ 分数",
    icon: "🏅",
    condition: (s) => Object.values(s.highScores).some((v) => v >= 2000),
  },
  {
    id: "legend",
    title: "传说玩家",
    description: "在任意游戏中获得 5000+ 分数",
    icon: "🏆",
    condition: (s) => Object.values(s.highScores).some((v) => v >= 5000),
  },
  {
    id: "explorer",
    title: "探索者",
    description: "玩过 5 款不同的游戏",
    icon: "🔍",
    condition: (s) => s.gamesPlayed.length >= 5,
  },
  {
    id: "gamer",
    title: "核心玩家",
    description: "玩过 20 款不同的游戏",
    icon: "🎯",
    condition: (s) => s.gamesPlayed.length >= 20,
  },
  {
    id: "master",
    title: "全站大师",
    description: "玩过 50 款不同的游戏",
    icon: "👑",
    condition: (s) => s.gamesPlayed.length >= 50,
  },
  {
    id: "collector",
    title: "收藏家",
    description: "在 10 款不同游戏中获得最高分",
    icon: "💎",
    condition: (s) => Object.keys(s.highScores).length >= 10,
  },
  {
    id: "completist",
    title: "完美主义者",
    description: "在 30 款不同游戏中获得最高分",
    icon: "🌟",
    condition: (s) => Object.keys(s.highScores).length >= 30,
  },
  {
    id: "speed-demon",
    title: "速度狂魔",
    description: "单局获得 1000+ 高分",
    icon: "⚡",
    condition: (s) => s.bestScore >= 1000,
  },
]

// Check which achievements were newly unlocked
export function checkNewAchievements(
  prevStats: PlayerStats,
  currentStats: PlayerStats,
): Achievement[] {
  return ACHIEVEMENTS.filter(
    (a) => !a.condition(prevStats) && a.condition(currentStats),
  )
}

// Get all completed achievements
export function getUnlockedAchievements(stats: PlayerStats): Achievement[] {
  return ACHIEVEMENTS.filter((a) => a.condition(stats))
}

// Get completion progress
export function getProgress(stats: PlayerStats): {
  unlocked: number
  total: number
  percentage: number
} {
  const unlocked = getUnlockedAchievements(stats).length
  const total = ACHIEVEMENTS.length
  return { unlocked, total, percentage: Math.round((unlocked / total) * 100) }
}

export const ACHIEVEMENT_TOTAL = ACHIEVEMENTS.length

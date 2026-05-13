/** Daily seed from current date (deterministic) */
export function getTodaySeed(): number {
  const now = new Date()
  return now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate()
}

/** Deterministic pick from array */
function seededPick<T>(arr: T[], seed: number): T {
  return arr[Math.abs(seed) % arr.length]
}

// Wordle word list (5-letter words)
const DAILY_WORDS = [
  "about", "above", "abuse", "actor", "acute", "admit", "adopt", "adult",
  "after", "again", "agent", "agree", "ahead", "alarm", "album", "alert",
  "alien", "align", "alive", "allow", "alone", "along", "alter", "among",
  "ample", "angel", "anger", "angle", "angry", "apart", "apple", "apply",
  "arena", "argue", "arise", "armor", "array", "arrow", "aside", "asset",
  "atlas", "attic", "audio", "audit", "avoid", "awake", "award", "aware",
  "bacon", "badge", "badly", "basic", "basis", "batch", "beach", "beard",
  "beast", "begin", "being", "below", "bench", "berry", "birth", "black",
  "blade", "blame", "blast", "blaze", "bleed", "blend", "bless", "blind",
  "blink", "block", "blond", "blood", "bloom", "blown", "board", "bonus",
  "booth", "bound", "brain", "brand", "brave", "bread", "break", "breed",
  "brick", "brief", "bring", "broad", "broke", "brook", "brown", "brush",
  "buddy", "build", "built", "bunch", "burst", "cabin", "cable", "camel",
  "candy", "cargo", "carry", "catch", "cause", "cease", "chain", "chair",
  "chaos", "charm", "chart", "chase", "cheap", "check", "cheek", "cheer",
  "chess", "chest", "chick", "chief", "child", "chill", "choir", "chord",
  "civic", "civil", "claim", "clash", "class", "clean", "clear", "click",
  "climb", "cling", "clock", "close", "cloth", "cloud", "coach", "coast",
  "coral", "couch", "could", "count", "court", "cover", "crack", "craft",
  "crane", "crash", "crawl", "crazy", "cream", "creek", "crest", "crime",
  "crisp", "cross", "crowd", "crown", "crush", "curve", "cycle", "daily",
  "dance", "debut", "delay", "delta", "dense", "depot", "depth", "derby",
  "devil", "diary", "dirty", "ditch", "dizzy", "dodge", "doubt", "dough",
  "draft", "drain", "drama", "dream", "dress", "dried", "drift", "drill",
  "drink", "drive", "drone", "drove", "drums", "dying", "eager", "eagle",
  "early", "earth", "eight", "elder", "elect", "elite", "ember", "empty",
  "enemy", "enjoy", "enter", "entry", "equal", "equip", "erase", "error",
  "essay", "event", "every", "exact", "exert", "exile", "exist", "extra",
  "fable", "facet", "faint", "fairy", "faith", "fancy", "fatal", "fault",
  "feast", "fence", "ferry", "fetch", "fever", "fiber", "field", "fifth",
  "fifty", "fight", "final", "first", "fixed", "flame", "flash", "fleet",
  "flesh", "float", "flock", "flood", "floor", "flora", "flour", "fluid",
  "flush", "focus", "force", "forge", "forth", "forum", "found", "frame",
  "frank", "fraud", "fresh", "front", "frost", "fruit", "fully", "funny",
  "ghost", "giant", "given", "glass", "globe", "glory", "glove", "grace",
  "grade", "grain", "grand", "grant", "grape", "graph", "grasp", "grass",
  "grave", "great", "green", "greet", "grief", "grill", "grind", "gross",
  "group", "grove", "grown", "guard", "guess", "guest", "guide", "guild",
  "guilt", "habit", "happy", "harsh", "haste", "haunt", "heart", "heavy",
  "hedge", "hello", "honey", "honor", "horse", "hotel", "house", "human",
  "humor", "hurry", "ideal", "image", "imply", "index", "indie", "inner",
  "input", "irony", "ivory", "jewel", "joint", "joker", "judge", "juice",
  "kayak", "knack", "kneel", "knife", "knock", "known", "label", "labor",
  "laptop", "large", "laser", "later", "laugh", "layer", "learn", "lease",
  "leave", "legal", "lemon", "level", "lever", "light", "limit", "linen",
  "liver", "local", "logic", "loose", "lover", "lower", "loyal", "lucky",
  "lunar", "lunch", "lyric", "magic", "major", "maker", "manor", "maple",
  "march", "marry", "marsh", "match", "maybe", "mayor", "media", "mercy",
  "merge", "merit", "metal", "meter", "might", "minor", "minus", "model",
  "money", "month", "moral", "motor", "mount", "mouse", "mouth", "movie",
  "music", "naive", "naked", "nasty", "naval", "nerve", "never", "newly",
  "night", "noble", "noise", "north", "noted", "novel", "nurse", "nylon",
  "oasis", "occur", "ocean", "offer", "often", "olive", "onset", "opera",
  "orbit", "order", "organ", "other", "ought", "outer", "owned", "owner",
  "oxide", "paint", "panel", "panic", "paper", "party", "pasta", "patch",
  "pause", "peace", "pearl", "penny", "phase", "phone", "photo", "piano",
  "piece", "pilot", "pinch", "pixel", "pizza", "place", "plain", "plane",
  "plant", "plate", "plaza", "plead", "point", "polar", "pound", "power",
  "press", "price", "pride", "prime", "print", "prior", "prize", "probe",
  "proof", "proud", "prove", "proxy", "pulse", "punch", "pupil", "purse",
  "queen", "query", "quest", "queue", "quick", "quiet", "quote", "radar",
  "radio", "raise", "rally", "ranch", "range", "rapid", "ratio", "reach",
  "react", "ready", "realm", "rebel", "refer", "reign", "relax", "relay",
  "relic", "remix", "renew", "reply", "reset", "resin", "retro", "revel",
  "rhyme", "rider", "ridge", "rifle", "right", "rigid", "rival", "river",
  "roast", "robin", "robot", "rocky", "rogue", "roman", "rough", "round",
  "route", "royal", "rugby", "ruler", "rural", "saint", "salad", "sauce",
  "scale", "scare", "scene", "scent", "scope", "score", "scout", "scrap",
  "sense", "serve", "setup", "seven", "shade", "shaft", "shake", "shall",
  "shame", "shape", "share", "shark", "sharp", "sheep", "sheer", "sheet",
  "shelf", "shell", "shift", "shine", "shirt", "shock", "shoot", "shore",
  "short", "shout", "sight", "sigma", "silly", "since", "sixth", "sixty",
  "skill", "skull", "slash", "sleep", "slice", "slide", "small", "smart",
  "smell", "smile", "smith", "smoke", "snack", "snake", "solid", "solve",
  "sorry", "sound", "south", "space", "spare", "spark", "speak", "speed",
  "spell", "spend", "spice", "spine", "split", "spoke", "sport", "spray",
  "squad", "stack", "staff", "stage", "stain", "stair", "stake", "stale",
  "stall", "stamp", "stand", "stark", "start", "state", "steady", "steak",
  "steal", "steam", "steel", "steep", "steer", "stern", "stick", "stiff",
  "still", "stock", "stone", "stood", "store", "storm", "story", "stove",
  "stuff", "style", "sugar", "suite", "sunny", "super", "surge", "swamp",
  "swarm", "swift", "swing", "swirl", "sword", "syrup", "table", "taste",
  "teach", "teeth", "tempo", "thank", "theft", "their", "theme", "there",
  "these", "thick", "thief", "thing", "think", "third", "thorn", "those",
  "three", "threw", "throw", "thumb", "tiger", "tight", "timer", "tired",
  "title", "toast", "today", "token", "total", "touch", "tough", "tower",
  "trace", "track", "trade", "trail", "train", "trait", "trash", "treat",
  "trend", "trial", "tribe", "trick", "troop", "truce", "truck", "truly",
  "trunk", "trust", "truth", "twice", "twist", "ultra", "uncle", "under",
  "unify", "union", "unite", "unity", "until", "upper", "upset", "urban",
  "usage", "usual", "valid", "value", "vapor", "vault", "venue", "verse",
  "video", "vigor", "vinyl", "viral", "virus", "visit", "vista", "vital",
  "vivid", "vocal", "vodka", "voice", "voter", "wagon", "waist", "waste",
  "watch", "water", "weary", "weave", "wedge", "weigh", "weird", "whale",
  "wheat", "wheel", "where", "which", "while", "white", "whole", "whose",
  "wider", "witch", "woman", "world", "worry", "worse", "worst", "worth",
  "would", "wound", "wrath", "write", "wrong", "wrote", "yacht", "yield",
  "young", "youth", "zebra", "zones",
]

export function getDailyWordleWord(seed: number): string {
  return seededPick(DAILY_WORDS, seed)
}

// Sudoku type
export interface SudokuPuzzle {
  puzzle: number[][]
  solution: number[][]
  difficulty: "easy" | "medium" | "hard"
}

// Pre-generated sudoku puzzles (expanded with unique variations)
const SUDOKU_PUZZLES: SudokuPuzzle[] = [
  {
    puzzle: [[5, 3, 0, 0, 7, 0, 0, 0, 0], [6, 0, 0, 1, 9, 5, 0, 0, 0], [0, 9, 8, 0, 0, 0, 0, 6, 0], [8, 0, 0, 0, 6, 0, 0, 0, 3], [4, 0, 0, 8, 0, 3, 0, 0, 1], [7, 0, 0, 0, 2, 0, 0, 0, 6], [0, 6, 0, 0, 0, 0, 2, 8, 0], [0, 0, 0, 4, 1, 9, 0, 0, 5], [0, 0, 0, 0, 8, 0, 0, 7, 9]],
    solution: [[5, 3, 4, 6, 7, 8, 9, 1, 2], [6, 7, 2, 1, 9, 5, 3, 4, 8], [1, 9, 8, 3, 4, 2, 5, 6, 7], [8, 5, 9, 7, 6, 1, 4, 2, 3], [4, 2, 6, 8, 5, 3, 7, 9, 1], [7, 1, 3, 9, 2, 4, 8, 5, 6], [9, 6, 1, 5, 3, 7, 2, 8, 4], [2, 8, 7, 4, 1, 9, 6, 3, 5], [3, 4, 5, 2, 8, 6, 1, 7, 9]],
    difficulty: "easy",
  },
  {
    puzzle: [[0, 0, 0, 2, 6, 0, 7, 0, 1], [6, 8, 0, 0, 7, 0, 0, 9, 0], [1, 9, 0, 0, 0, 4, 5, 0, 0], [8, 2, 0, 1, 0, 0, 0, 4, 0], [0, 0, 4, 6, 0, 2, 9, 0, 0], [0, 5, 0, 0, 0, 3, 0, 2, 8], [0, 0, 9, 3, 0, 0, 0, 7, 4], [0, 4, 0, 0, 5, 0, 0, 3, 6], [7, 0, 3, 0, 1, 8, 0, 0, 0]],
    solution: [[4, 3, 5, 2, 6, 9, 7, 8, 1], [6, 8, 2, 5, 7, 1, 4, 9, 3], [1, 9, 7, 8, 3, 4, 5, 6, 2], [8, 2, 6, 1, 9, 5, 3, 4, 7], [3, 7, 4, 6, 8, 2, 9, 1, 5], [9, 5, 1, 7, 4, 3, 6, 2, 8], [5, 1, 9, 3, 2, 6, 8, 7, 4], [2, 4, 8, 9, 5, 7, 1, 3, 6], [7, 6, 3, 4, 1, 8, 2, 5, 9]],
    difficulty: "medium",
  },
  {
    puzzle: [[0, 2, 0, 6, 0, 8, 0, 0, 0], [5, 8, 0, 0, 0, 9, 7, 0, 0], [0, 0, 0, 0, 4, 0, 0, 0, 0], [3, 7, 0, 0, 0, 0, 5, 0, 0], [6, 0, 0, 0, 0, 0, 0, 0, 4], [0, 0, 8, 0, 0, 0, 0, 1, 3], [0, 0, 0, 0, 2, 0, 0, 0, 0], [0, 0, 9, 8, 0, 0, 0, 3, 6], [0, 0, 0, 3, 0, 6, 0, 9, 0]],
    solution: [[1, 2, 3, 6, 7, 8, 9, 4, 5], [5, 8, 4, 2, 3, 9, 7, 6, 1], [9, 6, 7, 1, 4, 5, 3, 2, 8], [3, 7, 2, 4, 6, 1, 5, 8, 9], [6, 9, 1, 5, 8, 3, 2, 7, 4], [4, 5, 8, 7, 9, 2, 6, 1, 3], [8, 3, 6, 9, 2, 4, 1, 5, 7], [2, 1, 9, 8, 5, 7, 4, 3, 6], [7, 4, 5, 3, 1, 6, 8, 9, 2]],
    difficulty: "hard",
  },
]

export function getDailySudoku(seed: number): SudokuPuzzle {
  return seededPick(SUDOKU_PUZZLES, seed)
}

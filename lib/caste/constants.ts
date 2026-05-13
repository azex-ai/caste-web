// $CASTE — shared constants (mirrors spec §2.2, §5, §6, §8)

export const TIER_NAMES = [
  "韭菜",
  "喊单 KOL",
  "巨鲸",
  "MEV Bot",
  "矿工",
  "项目方",
  "VC",
  "做市商",
  "监管",
  "交易所",
] as const;

export const TIER_EMOJIS = [
  "🥬",
  "🤡",
  "🐋",
  "🤖",
  "⛏️",
  "🏗️",
  "💰",
  "🦈",
  "🛂",
  "🏦",
] as const;

// Base token amount granted per tier card (units: raw token, 18dp scale applied by contract)
export const TIER_TOKEN_BASE = [
  3000n,
  6000n,
  9000n,
  12000n,
  15000n,
  18000n,
  25000n,
  35000n,
  50000n,
  80000n,
] as const;

// Tier probabilities (percent, display only)
export const TIER_PROBS = [40, 15, 10, 8, 7, 7, 5, 4, 2.5, 1.5] as const;

export const VARIANT_NAMES = ["Common", "Rare", "Mythic"] as const;
export const VARIANT_MULT = [1, 1.5, 3] as const;
// Variant probabilities (percent, display only)
export const VARIANT_PROBS = [70, 25, 5] as const;

export const SIGNATURES = [
  "CZ",
  "SBF",
  "Vitalik",
  "孙宇晨",
  "Cobie",
  "Caroline",
  "Do Kwon",
  "Su Zhu",
  "Andre Cronje",
  "Hayden Adams",
  "Brian Armstrong",
  "Roger Ver",
  "Justin Sun",
  "Mochi",
  "Tate",
  "Trump",
  "Musk",
  "Pump 创始人",
  "a16z",
  "DWF",
] as const;

export const TRAITS_BY_TIER: string[][] = [
  /* tier 0 韭菜 */ [
    "套牢 99%",
    "FTX 受害者",
    "LUNA 还在等待",
    "高位接盘侠",
    "听一姐入场",
    "BitConnect 老兵",
    "永远买在 ATH",
    "听 V 神演讲那年入场",
  ],
  /* tier 1 KOL */ [
    "卖课韭割",
    "100x 预言家",
    "删帖艺术家",
    "软广老司机",
    "推文带单",
    "TG 群主跑路前",
    "收钱发推",
    "Twitter Premium",
  ],
  /* tier 2 巨鲸 */ [
    "2013 持币至今",
    "冷钱包丢密码",
    "Mt. Gox 受害者",
    "鲸鱼地址公开",
    "一动天地变色",
    "8888 起步",
    "创世以太矿工",
    "Vitalik 邻居",
  ],
  /* tier 3 MEV Bot */ [
    "三明治大师",
    "Flashbots VIP",
    "block 末尾射手",
    "Justin Sun 都怕我",
    "gas 战艺术家",
    "JIT LP 杀手",
    "Searcher 老炮",
    "builder.eth",
  ],
  /* tier 4 矿工 */ [
    "电费比挖矿收益高",
    "停电了",
    "中国矿场迁移",
    "ASIC 矿场主",
    "显卡帝国",
    "核电站客户",
    "北美最强算力",
    "Bitmain 老客户",
  ],
  /* tier 5 项目方 */ [
    "Rugpull Survivor",
    "团队隐身中",
    "白皮书 GPT 生成",
    "路线图永远在下一季",
    "TGE 砸盘第一名",
    "审计跳过",
    "Discord 已删",
    "Telegram 已封",
  ],
  /* tier 6 VC */ [
    "a16z 投过的",
    "锁仓 4 年解禁中",
    "三箭好友",
    "Paradigm 牛人",
    "$50M Pre-seed",
    "TGE 立刻 dump",
    "Multicoin 兄弟会",
    "Tier1 VC 自称",
  ],
  /* tier 7 做市商 */ [
    "Wintermute 老熟人",
    "订单簿魔术师",
    "闪崩制造者",
    "DWF 合作伙伴",
    "Jump 兄弟",
    "深度提供者",
    "Loan-only 借贷",
    "Inventory Dump",
  ],
  /* tier 8 监管 */ [
    "Gary Gensler 来访",
    "SEC Wells Notice",
    "香港牌照申请中",
    "DOJ 都看我",
    "CFTC 关注名单",
    "FATF Travel Rule",
    "新加坡 MAS 警告",
    "MiCA 合规中",
  ],
  /* tier 9 交易所 */ [
    "上币费收割",
    "Tether 印钞机",
    "IEO 暴富者",
    "永续做市商",
    "和项目方毫无关系",
    "USDT 储备 100%（口头）",
    "破产前最后一搏",
    "客户资金挪用中",
  ],
];

// Multiplier outcomes (display labels and colours)
export const MULT_OUTCOMES = [
  "Doomed 0.3x",
  "Shrunk 0.7x",
  "Flat 1.0x",
  "Gainx 1.3x",
  "Strike 2x",
  "JACKPOT 5x",
  "LEGEND 10x",
] as const;

export const MULT_COLORS = [
  "text-red-500",
  "text-orange-400",
  "text-zinc-400",
  "text-emerald-400",
  "text-cyan-400",
  "text-fuchsia-400",
  "text-amber-400",
] as const;

// Multiplier probabilities per tier (order matches MULT_OUTCOMES)
// [doom, shrink, flat, gain, strike, jackpot, legend]
export const MULT_PROBS_BY_TIER: number[][] = [
  [25, 30, 25, 12, 5, 2.5, 0.5], // 韭菜
  [23, 29, 25, 13, 6, 3.0, 0.5], // KOL
  [22, 28, 25, 13, 7, 4.0, 1.0], // 巨鲸
  [22, 28, 25, 13, 7, 4.0, 1.0], // MEV Bot
  [21, 27, 25, 14, 8, 4.0, 1.0], // 矿工
  [20, 26, 25, 14, 9, 5.0, 1.0], // 项目方
  [15, 24, 25, 16, 13, 5.5, 1.5], // VC
  [12, 22, 25, 18, 15, 6.0, 2.0], // 做市商
  [10, 20, 25, 19, 16, 7.5, 2.5], // 监管
  [8, 18, 25, 20, 18, 8.0, 3.0], // 交易所
];

// $6.66666 USDC — 6 decimal (USDC uses 6 dp)
export const UNIT_USDC = 6_666_660n;
export const MAX_BATCH = 100;
// FOMO initial window
export const FOMO_INITIAL_SECONDS = 24 * 3600;

// Sell tax base brackets [days threshold, base pct]
export const SELL_TAX_BRACKETS = [
  { days: 7, base: 25 },
  { days: 30, base: 15 },
  { days: 90, base: 8 },
  { days: Infinity, base: 4 },
] as const;

// Contract addresses — fill after deployment
export const CONTRACTS = {
  hook: process.env.NEXT_PUBLIC_CASTE_HOOK_ADDRESS as `0x${string}` | undefined,
  token: process.env.NEXT_PUBLIC_CASTE_TOKEN_ADDRESS as
    | `0x${string}`
    | undefined,
  card: process.env.NEXT_PUBLIC_CASTE_CARD_ADDRESS as `0x${string}` | undefined,
  mintManager: process.env.NEXT_PUBLIC_MINT_MANAGER_ADDRESS as
    | `0x${string}`
    | undefined,
  usdc: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" as `0x${string}`,
} as const;

export const INDEXER_URL =
  process.env.NEXT_PUBLIC_INDEXER_URL ?? "http://localhost:42069";

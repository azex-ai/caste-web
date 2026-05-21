// $CASTE V1 mock data — typed mirror of the design bundle's en/data.js + data-extra.js + data-v1.js.
// All page data resolves from here until indexer schema gains the V1 tables.

import type { CardData, SealedCard, FlippedCard } from "./types";

export type Tier = {
  idx: number;
  key: "leek" | "kol" | "whale" | "mev" | "miner" | "team" | "vc" | "mm" | "reg" | "cex";
  emoji: string;
  cn: string;
  en: string;
  prob: number;
  base: number;
  weight: number;
  color: string;
  material: string;
};

export const TIERS: ReadonlyArray<Tier> = [
  { idx: 0, key: "leek",  emoji: "🌱", cn: "Leek",         en: "Leek",         prob: 40,  base: 3000,  weight: 1,    color: "var(--t-leek)",  material: "paper" },
  { idx: 1, key: "kol",   emoji: "🤡", cn: "Shill KOL",    en: "Shill KOL",    prob: 15,  base: 6000,  weight: 1.5,  color: "var(--t-kol)",   material: "cartoon" },
  { idx: 2, key: "whale", emoji: "🐋", cn: "Whale",        en: "Whale",        prob: 10,  base: 9000,  weight: 2,    color: "var(--t-whale)", material: "ink" },
  { idx: 3, key: "mev",   emoji: "🤖", cn: "MEV Bot",      en: "MEV Bot",      prob: 8,   base: 12000, weight: 2,    color: "var(--t-mev)",   material: "glitch" },
  { idx: 4, key: "miner", emoji: "⛏️", cn: "Miner",        en: "Miner",        prob: 7,   base: 15000, weight: 2.5,  color: "var(--t-miner)", material: "metal" },
  { idx: 5, key: "team",  emoji: "🏗️", cn: "Founder",      en: "Founder",      prob: 7,   base: 18000, weight: 3,    color: "var(--t-team)",  material: "print" },
  { idx: 6, key: "vc",    emoji: "💰", cn: "VC",           en: "VC",           prob: 5,   base: 25000, weight: 4,    color: "var(--t-vc)",    material: "foil" },
  { idx: 7, key: "mm",    emoji: "🦈", cn: "Market Maker", en: "Market Maker", prob: 4,   base: 35000, weight: 5,    color: "var(--t-mm)",    material: "silver" },
  { idx: 8, key: "reg",   emoji: "🛂", cn: "Regulator",    en: "Regulator",    prob: 2.5, base: 50000, weight: 7,    color: "var(--t-reg)",   material: "stamp" },
  { idx: 9, key: "cex",   emoji: "🏦", cn: "Exchange",     en: "CEX",          prob: 1.5, base: 80000, weight: 10,   color: "var(--t-cex)",   material: "black-gold" },
];

export type Variant = { idx: number; key: string; cn: string; mult: number; prob: number };
export const VARIANTS: ReadonlyArray<Variant> = [
  { idx: 0, key: "common", cn: "COMMON", mult: 1.0, prob: 70 },
  { idx: 1, key: "rare",   cn: "RARE",   mult: 1.5, prob: 25 },
  { idx: 2, key: "mythic", cn: "MYTHIC", mult: 3.0, prob: 5  },
];

export const SIGNATURES: ReadonlyArray<string> = [
  "CZ", "SBF", "Vitalik", "Sun", "Cobie", "Caroline", "Do Kwon", "Su Zhu",
  "Andre Cronje", "Vitalik", "Hayden", "Brian", "Roger Ver", "Justin",
  "Mochi", "Tate", "Trump", "Musk", "Pump", "a16z",
];

export const TRAITS: Record<Tier["key"], ReadonlyArray<string>> = {
  leek:  ["Stuck -99%", "FTX Victim", "Waiting on LUNA", "Top Buyer", "Followed Erin", "BitConnect Vet", "Always Buys ATH", "Entered After Vitalik Talk"],
  kol:   ["Course Shill", "100x Prophet", "Tweet Deleter", "Paid Shill Vet", "Twitter Caller", "TG Admin Pre-Rug"],
  whale: ["HODLer Since 2013", "Lost Cold Wallet Key", "Mt. Gox Victim", "Address Doxxed"],
  mev:   ["Sandwich Master", "Flashbots VIP", "Block Tail Sniper", "Even Sun Fears Me", "Gas War Artist"],
  miner: ["Power Bill > Yield", "Power's Out", "China Mine Migration", "ASIC Farm Owner", "GPU Empire"],
  team:  ["Rugpull Survivor", "Team Anon", "GPT Whitepaper", "Roadmap Next Quarter", "Top TGE Dumper"],
  vc:    ["a16z Backed", "4Y Vest Unlocking", "3AC Buddy", "Paradigm Bro", "$50M Pre-seed"],
  mm:    ["Wintermute Buddy", "Order Book Magician", "Flash Crash Maker", "DWF Partner"],
  reg:   ["Gensler Visits", "SEC Wells Notice", "HK License Pending", "DOJ On My Case"],
  cex:   ["Listing Fee Farm", "Tether Printer", "IEO Whale", "Perp MM", "Not Affiliated*"],
};

export type MultOutcome = {
  value: string;
  name: string;
  en: string;
  prob: number;
  color: string;
  kind: "loss" | "neutral" | "win" | "jackpot" | "legend";
};
export const MULT_OUTCOMES: ReadonlyArray<MultOutcome> = [
  { value: "0.3x", name: "BUST",    en: "BUST",    prob: 25,  color: "var(--blood-hi)",      kind: "loss" },
  { value: "0.7x", name: "SHRINK",  en: "SHRINK",  prob: 30,  color: "oklch(0.65 0.10 30)",  kind: "loss" },
  { value: "1.0x", name: "EVEN",    en: "EVEN",    prob: 25,  color: "var(--bone-dim)",      kind: "neutral" },
  { value: "1.3x", name: "WIN",     en: "WIN",     prob: 12,  color: "var(--jade)",          kind: "win" },
  { value: "2.0x", name: "CRIT",    en: "CRIT",    prob: 5,   color: "var(--acid)",          kind: "win" },
  { value: "5.0x", name: "JACKPOT", en: "JACKPOT", prob: 2.5, color: "var(--gold-hi)",       kind: "jackpot" },
  { value: "10x",  name: "LEGEND",  en: "LEGEND",  prob: 0.5, color: "var(--orchid)",        kind: "legend" },
];

export const MOCK_CARDS: CardData[] = [
  { id: 6969,  tier: 6, variant: 2, sig: 1,  traits: [0,1,3], swaps: 412,  jackpots: 3 },
  { id: 1337,  tier: 9, variant: 2, sig: 0,  traits: [0,1,4], swaps: 1281, jackpots: 7 },
  { id: 420,   tier: 3, variant: 1, sig: 14, traits: [0,2,4], swaps: 89,   jackpots: 1 },
  { id: 69,    tier: 1, variant: 2, sig: 4,  traits: [0,3,5], swaps: 304,  jackpots: 2 },
  { id: 21000, tier: 2, variant: 1, sig: 9,  traits: [0,1,2], swaps: 67,   jackpots: 0 },
  { id: 8421,  tier: 0, variant: 0, sig: 19, traits: [1,4,7], swaps: 8,    jackpots: 0 },
  { id: 7531,  tier: 8, variant: 1, sig: 16, traits: [0,2,3], swaps: 24,   jackpots: 0 },
  { id: 5012,  tier: 5, variant: 0, sig: 6,  traits: [0,3,4], swaps: 156,  jackpots: 1 },
  { id: 4044,  tier: 4, variant: 1, sig: 18, traits: [3,4,2], swaps: 91,   jackpots: 1 },
  { id: 3217,  tier: 7, variant: 1, sig: 8,  traits: [0,1,2], swaps: 73,   jackpots: 0 },
  { id: 2008,  tier: 2, variant: 0, sig: 0,  traits: [0,1,3], swaps: 5,    jackpots: 0 },
  { id: 1102,  tier: 0, variant: 0, sig: 5,  traits: [0,2,6], swaps: 12,   jackpots: 0 },
];

export const PHASE_STATE = {
  cardsMinted:   4019,
  cardsCap:      10000,
  isPhaseA:      true,
  phaseASellTax: 25,
  phaseBSellTax: 1.5,
  phaseAHourly:  16.67,
  phaseAMega:    8.33,
  phaseBHourly:  1.0,
  phaseBMega:    0.5,
  bufferTotal:   4_200_000_000,
  bufferLeft:    3_894_120_000,
  flipsExecuted: 1_842,
  estFlipsLeft:  280_000,
};

export const SEALED_CARDS: SealedCard[] = [
  { tokenId: 8421, commitBlock: 22140221, bought: "14s ago",      buyUnits: 12, canFlip: true,  blocksLeft: 0 },
  { tokenId: 8422, commitBlock: 22140221, bought: "14s ago",      buyUnits: 12, canFlip: true,  blocksLeft: 0 },
  { tokenId: 8423, commitBlock: 22140221, bought: "14s ago",      buyUnits: 12, canFlip: true,  blocksLeft: 0 },
  { tokenId: 8424, commitBlock: 22140221, bought: "14s ago",      buyUnits: 12, canFlip: true,  blocksLeft: 0 },
  { tokenId: 7918, commitBlock: 22140082, bought: "29 min ago",   buyUnits: 4,  canFlip: true,  blocksLeft: 0 },
  { tokenId: 7919, commitBlock: 22140082, bought: "29 min ago",   buyUnits: 4,  canFlip: true,  blocksLeft: 0 },
  { tokenId: 5104, commitBlock: 22138744, bought: "1d 4h ago",    buyUnits: 25, canFlip: true,  blocksLeft: 0 },
  { tokenId: 8512, commitBlock: 22140311, bought: "moments ago",  buyUnits: 1,  canFlip: false, blocksLeft: 1 },
];

export const FLIPPED_CARDS: FlippedCard[] = [
  { id: 6969, tier: 6, variant: 2, sig: 1,  traits: [0,1,3], swaps: 0, jackpots: 0, multBp: 50000,  payout: 287_500,   flippedAgo: "2 d" },
  { id: 1337, tier: 9, variant: 2, sig: 0,  traits: [0,1,4], swaps: 0, jackpots: 0, multBp: 100000, payout: 2_400_000, flippedAgo: "1 wk" },
  { id: 420,  tier: 3, variant: 1, sig: 14, traits: [0,2,4], swaps: 0, jackpots: 0, multBp: 20000,  payout: 36_000,    flippedAgo: "3 d" },
  { id: 8421, tier: 0, variant: 0, sig: 19, traits: [1,4,7], swaps: 0, jackpots: 0, multBp: 7000,   payout: 2_100,     flippedAgo: "2 wk" },
];

export const FLIP_DEMO = {
  sealed:      { tokenId: 8421, commitBlock: 22140221, buyUnits: 12, bought: "14s ago" } satisfies SealedCard | { tokenId: number; commitBlock: number; buyUnits: number; bought: string },
  revealed:    { id: 8421, tier: 6, variant: 2, sig: 1, traits: [0,1,3], swaps: 0, jackpots: 0 } satisfies CardData,
  tierBase: 25_000,
  variantMult: 3.0,
  multiplier: 5.0,
  payout: 375_000,
};

export const LAST_BUY_V1 = {
  tx:           "0x4a2b…ff09",
  block:        22140221,
  ago:          "14s",
  units:        12,
  usdcIn:       80.00,
  fee:          1.20,
  casteOut:     252_096,
  sealedMinted: 4,
  serialFrom:   8421,
  serialTo:     8424,
};

export const POOLS_V1 = {
  block: 22_140_221,
  epoch: 472_001,
  lp: {
    usdc:           412_840,
    caste:          16_780_000_000,
    initialCaste:   16_800_000_000,
    jitLockBlocks:  64,
    locked:         true,
  },
  buffer: {
    initial:         4_200_000_000,
    remaining:       3_894_120_000,
    drained:           305_880_000,
    avgPayout:            13_900,
    flipsExecuted:         1_842,
    flipsRemaining:      280_148,
  },
  hourly: {
    pool:            7_432.14,
    epoch:           472_001,
    drawIn:          { mm: "17", ss: "42" },
    lastBuyer:       { addr: "cz.eth", isYou: false, units: 100, txAgo: "0:42" },
    inflowRate:      "1.0% (Phase B) · 16.67% (Phase A)",
    rolledOver:      2_412.80,
    consecRollovers: 1,
  },
  mega: {
    pool:          184_213.00,
    round:         4,
    deadline:      { hh: "06", mm: "17", ss: "42", state: "warning" as const },
    lastBuyer:     { addr: "you · 0x6e91…aa83", isYou: true, units: 88, txAgo: "0:14" },
    inflowRate:    "0.5% (Phase B) · 8.33% (Phase A)",
    boostLast:     120,
    capRemaining:  23.7,
  },
};

export const SETTLE_MOMENTS = {
  hourly: {
    epoch: 471_998,
    pool: 6_188.42,
    winner: "0x6e91…aa83",
    isYou: true,
    units: 44,
    settledAtBlock: 22_140_180,
    txHash: "0xa113…8f0e",
    nextEpoch: 471_999,
    nextDrawIn: { mm: "59", ss: "12" },
  },
  mega: {
    round: 3,
    pool: 142_880,
    winner: "0x7b2c…d104",
    isYou: false,
    lastBuy: "$199.99",
    fomoExpiredAt: "2026-05-09 14:22 UTC",
    txHash: "0x66cd…40aa",
    nextRound: { round: 4, fomoStart: "24:00:00", initialPool: 0 },
  },
};

export const LASTBUYER_FEED = [
  { ago: "0:14", addr: "you · 0x6e91…aa83", isYou: true,  units: 88,  boost: 120 },
  { ago: "0:42", addr: "cz.eth",            isYou: false, units: 100, boost: 120 },
  { ago: "1:08", addr: "0x9f3a…ce21",       isYou: false, units: 12,  boost: 65  },
  { ago: "1:21", addr: "anon-degen.eth",    isYou: false, units: 50,  boost: 102 },
  { ago: "2:04", addr: "vitalik.eth",       isYou: false, units: 1,   boost: 0   },
  { ago: "2:39", addr: "0x4d11…ab07",       isYou: false, units: 24,  boost: 83  },
  { ago: "3:17", addr: "luna-bro.eth",      isYou: false, units: 8,   boost: 54  },
];

export const ME_V1 = {
  ens: "anon-degen.eth",
  addr: "0x6e91…aa83",
  packed: {
    leek: 8, kol: 3, whale: 0, mev: 2, miner: 0, team: 1, vc: 1, mm: 0, reg: 0, cex: 0,
  },
  highestTier: 6,
  totalFlipped: 15,
  totalSealed: 8,
  highestPayout: 287_500,
  lifetimeFlipPayout: 1_842_200,
  lifetimeHourlyWon: 6_188,
  lifetimeMegaWon: 0,
  casteBalance: 412_088,
  usdcBalance: 18_402,
};

export type ActivityEvent =
  | { kind: "FLIP";            ago: string; addr: string; isYou?: boolean; tier: number; variant: number; payout: number;       tone: string }
  | { kind: "FLIP_BUST";       ago: string; addr: string; isYou?: boolean; tier: number; variant: number; payout: number;       tone: string }
  | { kind: "BUY";             ago: string; addr: string; isYou?: boolean; units: number; sealed: number; txHash: string;       tone: string }
  | { kind: "PHASE_A_SELL";    ago: string; addr: string; isYou?: boolean; caste: number; usdcOut: number; tax: number;         tone: string }
  | { kind: "SETTLE_HOURLY";   ago: string; addr: string; isYou?: boolean; epoch: number; prize: number;                        tone: string }
  | { kind: "BUFFER_DEPLETED"; ago: string; addr: string; isYou?: boolean; requested: number; paid: number; shortfall: number;  tone: string };

export const ACTIVITY_V1: ActivityEvent[] = [
  { kind: "FLIP",            ago: "3s",  addr: "you · 0x6e91…aa83", isYou: true, tier: 6, variant: 2, payout: 287_500,  tone: "gold" },
  { kind: "BUY",             ago: "14s", addr: "0x9f3a…ce21",                     units: 12,  sealed: 4, txHash: "0x4a2b…ff09", tone: "acid" },
  { kind: "PHASE_A_SELL",    ago: "29s", addr: "0x4d11…ab07",                     caste: 12_400, usdcOut: 5_204, tax: 1_301, tone: "blood" },
  { kind: "FLIP",            ago: "1m",  addr: "cz.eth",                          tier: 9, variant: 2, payout: 2_400_000, tone: "orchid" },
  { kind: "BUY",             ago: "1m",  addr: "vitalik.eth",                     units: 1,   sealed: 1, txHash: "0x88f1…2230", tone: "acid" },
  { kind: "FLIP_BUST",       ago: "2m",  addr: "0x1aaa…7e80",                     tier: 0, variant: 0, payout: 900, tone: "bone-dim" },
  { kind: "BUY",             ago: "2m",  addr: "anon-degen.eth",                  units: 50,  sealed: 4, txHash: "0xc311…aa02", tone: "acid" },
  { kind: "SETTLE_HOURLY",   ago: "12m", addr: "0x6e91…aa83 (you)", isYou: true,  epoch: 471_998, prize: 6_188, tone: "jade" },
  { kind: "PHASE_A_SELL",    ago: "14m", addr: "luna-bro.eth",                    caste: 89_120, usdcOut: 37_430, tax: 9_357, tone: "blood" },
  { kind: "BUY",             ago: "16m", addr: "0xc31e…02fa",                     units: 100, sealed: 4, txHash: "0xfa01…3311", tone: "acid" },
  { kind: "BUFFER_DEPLETED", ago: "23m", addr: "0xdead…1234",                     requested: 51_000, paid: 32_010, shortfall: 18_990, tone: "blood" },
];

export const HISTORY_V1 = {
  mega: [
    { round: 3, date: "2026-05-09", winner: "0x7b2c…d104",    usdc: 142_880, lastBuy: "$199.99", phase: "A" },
    { round: 2, date: "2026-05-06", winner: "0x031a…ff12",    usdc:  98_041, lastBuy: "$53.33",  phase: "A" },
    { round: 1, date: "2026-05-02", winner: "anon-degen.eth", usdc:  72_412, lastBuy: "$666.66", phase: "A" },
  ],
  hourly: [
    { epoch: 472_000, hour: "23:00", winner: "0x9f3a…ce21",       prize: 7_842, units: 88,  rolledIn: 0,     rollover: false, isYou: false, rolloverTo: 0, amount: 0 },
    { epoch: 471_999, hour: "22:00", winner: "—",                 prize: 0,     units: 0,   rolledIn: 0,     rollover: true,  isYou: false, rolloverTo: 472_000, amount: 2_412 },
    { epoch: 471_998, hour: "21:00", winner: "0x6e91…aa83 (you)", prize: 6_188, units: 44,  rolledIn: 0,     rollover: false, isYou: true,  rolloverTo: 0, amount: 0 },
    { epoch: 471_997, hour: "20:00", winner: "vitalik.eth",       prize: 5_011, units: 16,  rolledIn: 0,     rollover: false, isYou: false, rolloverTo: 0, amount: 0 },
    { epoch: 471_996, hour: "19:00", winner: "cz.eth",            prize: 9_088, units: 100, rolledIn: 0,     rollover: false, isYou: false, rolloverTo: 0, amount: 0 },
    { epoch: 471_995, hour: "18:00", winner: "0x1aaa…7e80",       prize: 4_211, units: 24,  rolledIn: 1_840, rollover: false, isYou: false, rolloverTo: 0, amount: 0 },
    { epoch: 471_994, hour: "17:00", winner: "0xc31e…02fa",       prize: 6_022, units: 56,  rolledIn: 0,     rollover: false, isYou: false, rolloverTo: 0, amount: 0 },
    { epoch: 471_993, hour: "16:00", winner: "0x031a…ff12",       prize: 3_198, units: 12,  rolledIn: 0,     rollover: false, isYou: false, rolloverTo: 0, amount: 0 },
  ],
};

export const SECONDARY_LISTINGS = [
  { tokenId: 9911, commitBlock: 22_140_100, askEth: 0.045, askUsd: 167, ago: "2h", marketplace: "OpenSea", seller: "0xab21…9e44" },
  { tokenId: 9888, commitBlock: 22_139_998, askEth: 0.080, askUsd: 298, ago: "5h", marketplace: "Blur",    seller: "vitalik.eth" },
  { tokenId: 9820, commitBlock: 22_139_812, askEth: 0.024, askUsd:  89, ago: "1d", marketplace: "OpenSea", seller: "0x4d11…ab07" },
  { tokenId: 9760, commitBlock: 22_139_604, askEth: 0.150, askUsd: 558, ago: "2d", marketplace: "Blur",    seller: "moonshot.eth" },
];

export const CONTRACTS_V1 = [
  { name: "CasteHook",   addr: "0x666612a4f...A57e088aa", role: "v4 hook + lottery engine", verified: true },
  { name: "CasteToken",  addr: "0x666651b9c...e60541b88", role: "ERC20 · 18 dec · transfersLocked T0", verified: true },
  { name: "CasteCard",   addr: "0x6666c4f30...210be0aa1", role: "ERC721 · sealed mint + flip · packed tier counter", verified: true },
  { name: "PoolManager", addr: "0x000000000...e08A90",     role: "Uniswap v4 official · block 21,688,329", verified: true },
  { name: "USDC",        addr: "0xA0b86991c...606Eb48",     role: "currency0 · 6 dec", verified: true },
];

// ─── Helpers ────────────────────────────────────────────────────────────
export function fmtUsd(n: number, opts: { decimals?: number; k?: boolean } = {}): string {
  const { decimals = 0, k = true } = opts;
  if (k && n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (k && n >= 1e3) return `$${(n / 1e3).toFixed(1)}K`;
  return `$${n.toLocaleString(undefined, { maximumFractionDigits: decimals })}`;
}

export function fmtNum(n: number, opts: { decimals?: number; k?: boolean } = {}): string {
  const { decimals = 0, k = true } = opts;
  if (k && n >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
  if (k && n >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
  if (k && n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return n.toLocaleString(undefined, { maximumFractionDigits: decimals });
}

export function tierColorFor(tier: number): string {
  return TIERS[tier]?.color ?? "var(--bone)";
}

export const TIER_KEY_LIST = ["leek","kol","whale","mev","miner","team","vc","mm","reg","cex"] as const;

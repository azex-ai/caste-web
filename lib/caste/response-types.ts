// Response types from the Ponder indexer (Hono API at src/api/caste.ts).
//
// The Hono `serialize` helper turns every bigint column into a decimal string
// before JSON encoding, so all on-chain amounts arrive here as strings.
// Parse them with BigInt(...) at the rendering boundary.

export type Hex = `0x${string}`;

export interface StatsResponse {
  initialized: boolean;
  cardsMinted: number;
  cardsFlipped: number;
  mythicCount: number;
  bufferStart: string;
  bufferPaid: string;
  bufferRemaining: string;
  bufferShortfall: string;
  megaDeadline: string;
  fomoSecondsLeft: number;
  // Wave-3 hourly redesign — exposed by the indexer's /api/caste/stats.
  // `currentEpoch` is `floor(now / 3600)` and `currentEpochTotalWeight` is the
  // total tickets recorded so far this hour (used for "your tickets" odds).
  // `lastBuyEpoch` mirrors the on-chain pointer; null until the first buy.
  currentEpoch?: string;
  currentEpochTotalWeight?: number;
  lastBuyEpoch?: string | null;
  sqrtPriceX96Last?: string | null;
  tickLast?: number | null;
  lastSwapBlock?: string | null;
  lastSwapTime?: string | null;
}

export interface CardRow {
  tokenId: string;
  owner: Hex;
  commitBlock: string;
  mintBlock: string;
  mintTime: string;
  flipped: boolean;
  flipBlock: string | null;
  flipTime: string | null;
  tier: number | null;
  variant: number | null;
  signature: number | null;
  trait0: number | null;
  trait1: number | null;
  trait2: number | null;
  multiplierBp: number | null;
  payout: string | null;
}

export interface FlipRow {
  tokenId: string;
  owner: Hex;
  tier: number;
  variant: number;
  multiplierBp: number;
  payout: string;
  shortfall: string;
  blockNumber: string;
  blockTime: string;
  txHash: Hex;
}

export interface HourlyEpochRow {
  epochId: string;
  // Wave-3 status enum — pending until auto-settled by a subsequent buy.
  status: "pending" | "settled" | "rolledOver" | "expiredToMega";
  winner: Hex | null;
  // Prize is null while pending — only filled in once a settle event lands.
  prize: string;
  // Wave-3 lifecycle fields. Older indexer payloads will have these undefined
  // until they backfill, so consumers should treat them as optional.
  startBlock?: string;
  anchorBlock?: string | null;
  totalWeight?: number;
  settled?: boolean;
  // Rollover destination — "<epochId>" or "mega". Null on pending/settled.
  target?: string | null;
  settledBlock: string;
  settledTime: string;
}

// Wave-3: one ticket recorded per buy in an epoch. Used by the
// /api/caste/lottery/hourly/:epoch/entries endpoint for both the full epoch
// ticket list and the per-user "your tickets this hour" view.
export interface LotteryEntry {
  epochId: string;
  idx: number;
  buyer: Hex;
  cumWeight: number;
  buyBlock: string;
  buyTime: string;
  buyTxHash: Hex;
}

export interface HourlyEntriesResponse {
  epoch: string;
  owner: Hex | null;
  total: number;
  entries: LotteryEntry[];
}

export interface MegaSettlementRow {
  id: string;
  winner: Hex;
  prize: string;
  newDeadline: string;
  blockNumber: string;
  blockTime: string;
  txHash: Hex;
}

export interface TradeRow {
  id: string;
  kind: "buy" | "sell";
  sender: Hex;
  usdcAmount: string;
  casteAmount: string;
  sqrtPriceX96: string;
  tick: number;
  blockNumber: string;
  blockTime: string;
  txHash: Hex;
  logIndex: number;
}

export interface SellTaxRow {
  id: string;
  seller: Hex;
  grossUsdcOut: string;
  fee: string;
  phaseA: boolean;
  blockNumber: string;
  blockTime: string;
  txHash: Hex;
}

export interface UserPositionRow {
  address: Hex;
  cardsHeld: number;
  cardsMintedTotal: number;
  cardsFlipped: number;
  mythicCards: number;
  totalPayout: string;
  hourlyWins: number;
  hourlyWinnings: string;
  megaWins: number;
  megaWinnings: string;
  sellTaxPaidUsdc: string;
  lastActivityBlock: string;
  lastActivityTime: string;
}

export interface UserResponse {
  position: UserPositionRow | null;
  cards: CardRow[];
  flips: FlipRow[];
}

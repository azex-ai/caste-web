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
  status: "settled" | "rolledOver";
  winner: Hex | null;
  prize: string;
  settledBlock: string;
  settledTime: string;
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

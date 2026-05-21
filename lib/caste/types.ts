// $CASTE V1 — shared TypeScript types (flip-card design)
// Loosely typed for UI/mock; on-chain types use bigint and live in lib/caste/hooks.ts.

export type TierIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type VariantIndex = 0 | 1 | 2;
export type MultiplierIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface CardData {
  id: number;
  tier: number;
  variant: number;
  sig: number;
  traits: number[];
  swaps: number;
  jackpots: number;
}

export interface SealedCard {
  tokenId: number;
  commitBlock: number;
  bought: string;
  buyUnits: number;
  canFlip: boolean;
  blocksLeft: number;
}

export interface FlippedCard extends CardData {
  multBp: number;
  payout: number;
  flippedAgo: string;
}

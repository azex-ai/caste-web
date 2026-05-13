// $CASTE — shared TypeScript types

export type TierIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type VariantIndex = 0 | 1 | 2;
export type MultiplierIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface CardData {
  tokenId: bigint;
  tier: TierIndex;
  variant: VariantIndex;
  signatureIdx: number;
  trait0: number;
  trait1: number;
  trait2: number;
  mintId: bigint;
  mintNumber: bigint;
  mintTimestamp: number;
  swapCount: number;
  jackpotCount: number;
  owner?: string;
}

export interface PendingMint {
  mintId: bigint;
  size: number;
  revealBlock: bigint;
  minter: string;
  revealed: boolean;
}

export interface HourlyWinner {
  epoch: bigint;
  winner: string;
  amount: bigint;
  txHash: string;
}

export interface MegaWinner {
  round: bigint;
  winner: string;
  amount: bigint;
  txHash: string;
}

export interface CasteStats {
  totalMinted: number;
  megaPool: bigint;
  megaDeadline: number; // unix timestamp
  hourlyPool: bigint;
  queueLength: number;
}

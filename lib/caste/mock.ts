// $CASTE — mock data for UI development before contracts deploy

import type { CardData, HourlyWinner, MegaWinner, CasteStats } from "./types";
import type { TierIndex, VariantIndex } from "./types";

export const MOCK_CARDS: CardData[] = [
  {
    tokenId: 1n,
    tier: 0,
    variant: 0,
    signatureIdx: 1, // SBF
    trait0: 1, // FTX 受害者
    trait1: 2, // LUNA 还在等待
    trait2: 6, // 永远买在 ATH
    mintId: 1n,
    mintNumber: 1n,
    mintTimestamp: Math.floor(Date.now() / 1000) - 86400,
    swapCount: 3,
    jackpotCount: 0,
    owner: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
  },
  {
    tokenId: 69n,
    tier: 6,
    variant: 1,
    signatureIdx: 18, // a16z
    trait0: 0, // a16z 投过的
    trait1: 2, // 三箭好友
    trait2: 5, // TGE 立刻 dump
    mintId: 1n,
    mintNumber: 69n,
    mintTimestamp: Math.floor(Date.now() / 1000) - 43200,
    swapCount: 12,
    jackpotCount: 1,
    owner: "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B",
  },
  {
    tokenId: 420n,
    tier: 9,
    variant: 2,
    signatureIdx: 19, // DWF
    trait0: 0, // 上币费收割
    trait1: 3, // IEO 暴富者
    trait2: 5, // USDT 储备 100%（口头）
    mintId: 1n,
    mintNumber: 420n,
    mintTimestamp: Math.floor(Date.now() / 1000) - 3600,
    swapCount: 88,
    jackpotCount: 5,
    owner: "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B",
  },
  {
    tokenId: 1337n,
    tier: 3,
    variant: 0,
    signatureIdx: 0, // CZ
    trait0: 0, // 三明治大师
    trait1: 1, // Flashbots VIP
    trait2: 4, // gas 战艺术家
    mintId: 2n,
    mintNumber: 1337n,
    mintTimestamp: Math.floor(Date.now() / 1000) - 7200,
    swapCount: 42,
    jackpotCount: 2,
    owner: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
  },
  {
    tokenId: 2n,
    tier: 7,
    variant: 1,
    signatureIdx: 9, // Hayden Adams
    trait0: 3, // DWF 合作伙伴
    trait1: 6, // Loan-only 借贷
    trait2: 7, // Inventory Dump
    mintId: 1n,
    mintNumber: 2n,
    mintTimestamp: Math.floor(Date.now() / 1000) - 172800,
    swapCount: 200,
    jackpotCount: 8,
    owner: "0x1234567890123456789012345678901234567890",
  },
  {
    tokenId: 3n,
    tier: 4,
    variant: 0,
    signatureIdx: 7, // Su Zhu
    trait0: 0, // 电费比挖矿收益高
    trait1: 2, // 中国矿场迁移
    trait2: 4, // 显卡帝国
    mintId: 1n,
    mintNumber: 3n,
    mintTimestamp: Math.floor(Date.now() / 1000) - 259200,
    swapCount: 7,
    jackpotCount: 0,
    owner: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
  },
] satisfies CardData[];

export const MOCK_HOURLY_WINNERS: HourlyWinner[] = [
  {
    epoch: 450000n,
    winner: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
    amount: 1234_000000n, // $1234 USDC (6dp)
    txHash:
      "0xabc1234567890123456789012345678901234567890123456789012345678901",
  },
  {
    epoch: 449999n,
    winner: "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B",
    amount: 876_000000n,
    txHash:
      "0xdef1234567890123456789012345678901234567890123456789012345678902",
  },
  {
    epoch: 449998n,
    winner: "0x1234567890123456789012345678901234567890",
    amount: 2099_000000n,
    txHash:
      "0xfed1234567890123456789012345678901234567890123456789012345678903",
  },
];

export const MOCK_MEGA_WINNERS: MegaWinner[] = [
  {
    round: 2n,
    winner: "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B",
    amount: 133_000_000000n, // $133k USDC (6dp)
    txHash:
      "0x1111234567890123456789012345678901234567890123456789012345678904",
  },
  {
    round: 1n,
    winner: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
    amount: 66_700_000000n, // $66.7k
    txHash:
      "0x2221234567890123456789012345678901234567890123456789012345678905",
  },
];

// FOMO deadline: 18 hours from now
export const MOCK_STATS: CasteStats = {
  totalMinted: 12_847,
  megaPool: 85_700_000000n, // $85.7k
  megaDeadline: Math.floor(Date.now() / 1000) + 18 * 3600,
  hourlyPool: 3_400_000000n, // $3.4k
  queueLength: 7,
};

export function getMockCardsByOwner(owner: string): CardData[] {
  return MOCK_CARDS.filter(
    (c) => c.owner?.toLowerCase() === owner.toLowerCase(),
  );
}

export function getMockRareCards(): CardData[] {
  // variant Mythic = 2, or tier >= 7
  return MOCK_CARDS.filter((c) => c.variant === (2 as VariantIndex) || c.tier >= 7);
}

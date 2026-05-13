// USD-denominated display helpers. Mirrors the financial-display rule from
// CLAUDE.md, with compact notation for volumes.

import type { Token } from "@/lib/api/types";

const E18 = 10n ** 18n;

// Combine a token's indexer-tracked USD volume (18dp) and ETH volume (18dp)
// into a single USD-equivalent floating-point number, using a frontend-supplied
// ETH/USD spot price. Float64 has enough precision for any meme-scale volume.
export function tokenVolumeUsdEquivalent(
  token: Pick<Token, "volumeUsd18" | "volumeEth18">,
  ethUsd: number,
): number {
  const usd = Number(BigInt(token.volumeUsd18)) / Number(E18);
  const eth = Number(BigInt(token.volumeEth18)) / Number(E18);
  return usd + eth * ethUsd;
}

// $1.23M / $456K / $12.34 — compact for table rows and headline stats.
export function formatUsdCompact(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return "—";
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(2)}K`;
  if (value >= 1) return `$${value.toFixed(2)}`;
  if (value >= 0.01) return `$${value.toFixed(4)}`;
  return `$${value.toFixed(6)}`;
}

// Per-token-price style format (when we eventually display unit prices).
export function formatUsdPrice(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return "—";
  if (value >= 1000) return `$${value.toLocaleString("en-US", { maximumFractionDigits: 1 })}`;
  if (value >= 1) return `$${value.toFixed(4)}`;
  if (value >= 0.01) return `$${value.toFixed(5)}`;
  return `$${value.toPrecision(3)}`;
}

// Compact ETH amount: 1.23 ETH / 12.4 ETH / 0.001 ETH. Source is a bigint
// (wei) — we convert via string to avoid float overflow for huge wei values.
export function formatEthCompact(wei18: bigint | string): string {
  const w = typeof wei18 === "string" ? BigInt(wei18) : wei18;
  if (w === 0n) return "—";
  const eth = Number(w) / Number(E18);
  if (eth >= 1000) return `${eth.toFixed(0)} ETH`;
  if (eth >= 1) return `${eth.toFixed(2)} ETH`;
  if (eth >= 0.01) return `${eth.toFixed(4)} ETH`;
  return `${eth.toExponential(2)} ETH`;
}

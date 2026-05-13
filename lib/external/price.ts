// ETH/USD spot price.
//
// Primary source: our own Ponder indexer, which reads Chainlink on-chain at
// indexing time and exposes the latest answer via /api/stats. This keeps the
// frontend off the public internet for price lookups.
//
// Fallback: CoinGecko (used only if the indexer hasn't populated a price yet).

import { api } from "@/lib/api/client";

const TTL_MS = 60 * 1000;
const FALLBACK_PRICE = 0; // 0 == "unknown"; the UI labels it accordingly.

type Cache = { price: number; fetchedAt: number };
let cache: Cache = { price: 0, fetchedAt: 0 };

async function fetchFromIndexer(): Promise<number> {
  try {
    const stats = await api.stats();
    return stats.ethUsd && stats.ethUsd > 0 ? stats.ethUsd : 0;
  } catch {
    return 0;
  }
}

async function fetchFromCoinGecko(): Promise<number> {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd",
      { cache: "no-store" },
    );
    if (!res.ok) return 0;
    const j = (await res.json()) as { ethereum?: { usd?: number } };
    return j.ethereum?.usd ?? 0;
  } catch {
    return 0;
  }
}

export async function getEthUsd(): Promise<number> {
  if (cache.price > 0 && Date.now() - cache.fetchedAt < TTL_MS) {
    return cache.price;
  }
  const indexerPrice = await fetchFromIndexer();
  if (indexerPrice > 0) {
    cache = { price: indexerPrice, fetchedAt: Date.now() };
    return indexerPrice;
  }
  const cgPrice = await fetchFromCoinGecko();
  if (cgPrice > 0) {
    cache = { price: cgPrice, fetchedAt: Date.now() };
    return cgPrice;
  }
  return cache.price > 0 ? cache.price : FALLBACK_PRICE;
}

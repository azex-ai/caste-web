"use client";

// $CASTE — indexer API fetch wrappers (React Query-friendly)
// Indexer endpoint: NEXT_PUBLIC_INDEXER_URL (default http://localhost:42069)

import { INDEXER_URL } from "./constants";
import type { CardData, HourlyWinner, MegaWinner, CasteStats } from "./types";

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${INDEXER_URL}${path}`, {
    next: { revalidate: 15 },
  });
  if (!res.ok) {
    throw new Error(`Indexer error ${res.status}: ${path}`);
  }
  return res.json() as Promise<T>;
}

// Cards owned by address
export async function fetchCardsByOwner(owner: string): Promise<CardData[]> {
  return fetchJson<CardData[]>(`/api/caste/cards?owner=${owner}`);
}

// Globally rare cards (Mythic or tier >= 7)
export async function fetchRareCards(): Promise<CardData[]> {
  return fetchJson<CardData[]>("/api/caste/cards?rarity=rare&limit=50");
}

// Hourly winners (most recent first)
export async function fetchHourlyWinners(
  limit = 24,
): Promise<HourlyWinner[]> {
  return fetchJson<HourlyWinner[]>(
    `/api/caste/hourly-winners?limit=${limit}`,
  );
}

// Historical mega settlements
export async function fetchMegaWinners(): Promise<MegaWinner[]> {
  return fetchJson<MegaWinner[]>("/api/caste/mega-winners");
}

// Live stats: totalMinted / megaPool / megaDeadline / hourlyPool / queueLength.
// Indexer uses different field names — map them here.
interface IndexerStats {
  totalCards?: number;
  mythicCards?: number;
  buyQueueLength?: number;
  megaPoolBalance?: string;
  megaPoolDeadline?: number | null;
  fomoSecondsLeft?: number;
}
export async function fetchCasteStats(): Promise<CasteStats> {
  const raw = await fetchJson<IndexerStats>("/api/caste/stats");
  return {
    totalMinted: raw.totalCards ?? 0,
    megaPool: BigInt(raw.megaPoolBalance ?? "0"),
    megaDeadline: raw.megaPoolDeadline ?? 0,
    hourlyPool: 0n,
    queueLength: raw.buyQueueLength ?? 0,
  };
}

// Query keys for React Query
export const casteQueryKeys = {
  cardsByOwner: (owner: string) => ["caste", "cards", "owner", owner] as const,
  rareCards: () => ["caste", "cards", "rare"] as const,
  hourlyWinners: () => ["caste", "hourly-winners"] as const,
  megaWinners: () => ["caste", "mega-winners"] as const,
  stats: () => ["caste", "stats"] as const,
};

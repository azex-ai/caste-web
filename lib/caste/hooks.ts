// React Query hooks wrapping casteApi.
// Polling intervals reflect each datum's time-sensitivity:
//   - stats (FOMO countdown)        → 5s
//   - flips / sell-tax (activity)   → 5–10s
//   - user-scoped data              → 10s
//   - lottery archive / rare cards  → 30s

"use client";

import { useQuery } from "@tanstack/react-query";

import { casteApi } from "./api";
import type {
  CardRow,
  FlipRow,
  HourlyEpochRow,
  MegaSettlementRow,
  SellTaxRow,
  StatsResponse,
  TradeRow,
  UserResponse,
} from "./response-types";

export const casteKeys = {
  all: ["caste"] as const,
  stats: () => [...casteKeys.all, "stats"] as const,
  cards: (params: Record<string, unknown> = {}) =>
    [...casteKeys.all, "cards", params] as const,
  card: (tokenId: string) =>
    [...casteKeys.all, "card", tokenId] as const,
  rareCards: (limit?: number) =>
    [...casteKeys.all, "rare", limit ?? null] as const,
  flips: (limit?: number) =>
    [...casteKeys.all, "flips", limit ?? null] as const,
  hourly: (limit?: number) =>
    [...casteKeys.all, "hourly", limit ?? null] as const,
  mega: () => [...casteKeys.all, "mega"] as const,
  sellTax: (limit?: number) =>
    [...casteKeys.all, "sellTax", limit ?? null] as const,
  trades: (params: { kind?: "buy" | "sell"; limit?: number } = {}) =>
    [...casteKeys.all, "trades", params] as const,
  user: (address: string) =>
    [...casteKeys.all, "user", address.toLowerCase()] as const,
};

export function useRecentTrades(params: { kind?: "buy" | "sell"; limit?: number } = {}) {
  return useQuery<TradeRow[]>({
    queryKey: casteKeys.trades(params),
    queryFn: () => casteApi.getTrades(params),
    refetchInterval: 5_000,
    // Override the global 30s staleTime so the 5s refetchInterval actually fires.
    staleTime: 0,
  });
}

export function useStats() {
  return useQuery<StatsResponse>({
    queryKey: casteKeys.stats(),
    queryFn: () => casteApi.getStats(),
    refetchInterval: 5_000,
    // FOMO countdown depends on fresh stats every 5s; without this the global
    // 30s staleTime would mask the interval.
    staleTime: 0,
  });
}

export function useRecentFlips(limit = 50) {
  return useQuery<FlipRow[]>({
    queryKey: casteKeys.flips(limit),
    queryFn: () => casteApi.getFlips(limit),
    refetchInterval: 5_000,
    staleTime: 0,
  });
}

export function useUserCards(
  owner: string | undefined,
  opts: { flipped?: boolean; limit?: number } = {},
) {
  return useQuery<CardRow[]>({
    queryKey: casteKeys.cards({ owner, ...opts }),
    queryFn: () =>
      casteApi.getCards({
        owner,
        flipped: opts.flipped,
        limit: opts.limit ?? 100,
      }),
    enabled: !!owner,
    refetchInterval: 10_000,
    staleTime: 0,
  });
}

export function useCard(tokenId: string | undefined) {
  return useQuery<CardRow>({
    queryKey: casteKeys.card(tokenId ?? "_"),
    queryFn: () => casteApi.getCard(tokenId as string),
    enabled: !!tokenId,
    staleTime: 5_000,
  });
}

export function useRareCards(limit = 100) {
  return useQuery<CardRow[]>({
    queryKey: casteKeys.rareCards(limit),
    queryFn: () => casteApi.getRareCards(limit),
    refetchInterval: 30_000,
  });
}

export function useHourlyEpochs(limit = 24) {
  return useQuery<HourlyEpochRow[]>({
    queryKey: casteKeys.hourly(limit),
    queryFn: () => casteApi.getHourlyEpochs(limit),
    refetchInterval: 30_000,
  });
}

export function useMegaSettlements() {
  return useQuery<MegaSettlementRow[]>({
    queryKey: casteKeys.mega(),
    queryFn: () => casteApi.getMegaSettlements(),
    refetchInterval: 30_000,
  });
}

export function useSellTaxEvents(limit = 50) {
  return useQuery<SellTaxRow[]>({
    queryKey: casteKeys.sellTax(limit),
    queryFn: () => casteApi.getSellTaxEvents(limit),
    refetchInterval: 10_000,
    staleTime: 0,
  });
}

export function useUserPosition(address: string | undefined) {
  return useQuery<UserResponse>({
    queryKey: casteKeys.user(address ?? "_"),
    queryFn: () => casteApi.getUser(address as string),
    enabled: !!address,
    refetchInterval: 10_000,
    staleTime: 0,
  });
}

// Live-from-chain pool/lastBuyer state for the current epoch.
// Pulls hook.megaPool, hook.hourlyPool(epoch), hook.lastBuyer.
//
// Wave-3: `epochLastBuyer(epoch)` was removed from the contract (the hourly
// winner is now drawn via the weighted-ticket entries table during auto-settle,
// not from a per-epoch last-buyer pointer). UIs that previously surfaced
// "this hour's leader" should use the indexer's hourly entries endpoint or the
// derived `currentEpochTotalWeight` from `/api/caste/stats` instead.
import { useBlock, useReadContracts } from "wagmi";
import { formatUnits } from "viem";
import { activeChainId } from "@/lib/wagmi";
import { addresses } from "./contracts";
import { casteHookAbi } from "./abis";
import type { HourlyEntriesResponse } from "./response-types";

const HOURLY_SECONDS = 3600n;
const API_URL =
  process.env.NEXT_PUBLIC_INDEXER_URL?.replace(/\/$/, "") ??
  "http://localhost:42069";

export function useLivePoolState() {
  // Use chain timestamp (not wall clock) so the epoch we query matches what
  // the hook contract computes via `block.timestamp`. Without this, drift
  // between the client clock and the chain (especially on local anvil with
  // mined-on-demand blocks) puts us on the wrong hourly epoch.
  const { data: block } = useBlock({ chainId: activeChainId, watch: true });
  const epoch = block ? block.timestamp / HOURLY_SECONDS : undefined;
  const res = useReadContracts({
    contracts: [
      { address: addresses.hook, abi: casteHookAbi, functionName: "megaPool" },
      { address: addresses.hook, abi: casteHookAbi, functionName: "hourlyPool", args: [epoch ?? 0n] },
      { address: addresses.hook, abi: casteHookAbi, functionName: "lastBuyer" },
    ],
    query: { enabled: epoch !== undefined, refetchInterval: 5_000 },
  });
  const [megaPool, hourlyPool, lastBuyer] = res.data ?? [];
  return {
    epoch: epoch ?? 0n,
    megaPool: (megaPool?.result ?? 0n) as bigint,
    hourlyPool: (hourlyPool?.result ?? 0n) as bigint,
    lastBuyer: (lastBuyer?.result ?? null) as `0x${string}` | null,
    isLoading: res.isLoading || epoch === undefined,
  };
}

// Wave-3: "your tickets this hour" — pulls the entries the indexer recorded
// for `owner` in `epoch`. Use the current epoch from `useStats()` for the
// hourly draw probability widget.
export function useHourlyEntries(
  epoch: bigint | undefined,
  owner: `0x${string}` | undefined,
) {
  return useQuery<HourlyEntriesResponse>({
    queryKey: [
      "caste",
      "lottery",
      "hourly",
      epoch?.toString() ?? "",
      "entries",
      owner ?? "",
    ],
    enabled: !!epoch && !!owner,
    queryFn: async () => {
      const url = new URL(`${API_URL}/api/caste/lottery/hourly/${epoch}/entries`);
      if (owner) url.searchParams.set("owner", owner);
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error(`fetch failed: ${res.status}`);
      return res.json() as Promise<HourlyEntriesResponse>;
    },
    refetchInterval: 10_000,
    staleTime: 0,
  });
}

// Convert a Uniswap v4 sqrtPriceX96 into USDC-per-CASTE as a JS number.
//
// Pool layout: currency0 = USDC (6 dec), currency1 = CASTE (18 dec).
// Uniswap raw price (currency1 / currency0) = (sqrtPriceX96)^2 / 2^192.
// That gives CASTE-wei per 1 USDC-raw. We want USDC-per-CASTE in human units:
//
//   USDC_per_CASTE = (1 / raw_price) * 10^(d1 - d0)
//                  = (2^192 / sqrtPriceX96^2) * 10^(18 - 6)
//                  = (2^192 * 10^12) / sqrtPriceX96^2
//
// We pre-multiply by 10^18 to get a fixed-point bigint then formatUnits it
// down — keeps ~18 decimals of precision before float lossy-casting.
export function castePriceUsdc(sqrtPriceX96: bigint): number {
  if (sqrtPriceX96 === 0n) return 0;
  const Q192 = 1n << 192n;
  const num = Q192 * 10n ** 12n * 10n ** 18n;
  const denom = sqrtPriceX96 * sqrtPriceX96;
  const scaled = num / denom;
  return Number(formatUnits(scaled, 18));
}

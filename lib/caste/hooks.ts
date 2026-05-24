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
  user: (address: string) =>
    [...casteKeys.all, "user", address.toLowerCase()] as const,
};

export function useStats() {
  return useQuery<StatsResponse>({
    queryKey: casteKeys.stats(),
    queryFn: () => casteApi.getStats(),
    refetchInterval: 5_000,
  });
}

export function useRecentFlips(limit = 50) {
  return useQuery<FlipRow[]>({
    queryKey: casteKeys.flips(limit),
    queryFn: () => casteApi.getFlips(limit),
    refetchInterval: 5_000,
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
  });
}

export function useUserPosition(address: string | undefined) {
  return useQuery<UserResponse>({
    queryKey: casteKeys.user(address ?? "_"),
    queryFn: () => casteApi.getUser(address as string),
    enabled: !!address,
    refetchInterval: 10_000,
  });
}

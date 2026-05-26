import { useQuery } from "@tanstack/react-query";
import { addresses } from "./contracts";
import { activeChainId } from "@/lib/wagmi";

export interface MetaResponse {
  chainId: number;
  hook: string | null;
  token: string | null;
  card: string | null;
  usdc: string | null;
  poolManager: string | null;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:42069";

export function useIndexerMeta() {
  return useQuery({
    queryKey: ["caste", "meta"],
    queryFn: async (): Promise<MetaResponse> => {
      const res = await fetch(`${API_URL}/api/caste/_meta`);
      if (!res.ok) throw new Error(`Failed to fetch /_meta (${res.status})`);
      return res.json();
    },
    staleTime: 5 * 60 * 1000, // 5 min — config doesn't change often
    retry: 1,
  });
}

export interface MetaMismatch {
  chainId?: { indexer: number; frontend: number };
  hook?: { indexer: string; frontend: string };
  token?: { indexer: string; frontend: string };
  card?: { indexer: string; frontend: string };
  usdc?: { indexer: string; frontend: string };
}

export function useMetaMismatch(): MetaMismatch | null {
  const { data: meta } = useIndexerMeta();
  if (!meta) return null;
  const m: MetaMismatch = {};
  if (meta.chainId !== activeChainId) {
    m.chainId = { indexer: meta.chainId, frontend: activeChainId };
  }
  if (meta.hook && meta.hook.toLowerCase() !== addresses.hook.toLowerCase()) {
    m.hook = { indexer: meta.hook, frontend: addresses.hook };
  }
  if (meta.token && meta.token.toLowerCase() !== addresses.token.toLowerCase()) {
    m.token = { indexer: meta.token, frontend: addresses.token };
  }
  if (meta.card && meta.card.toLowerCase() !== addresses.card.toLowerCase()) {
    m.card = { indexer: meta.card, frontend: addresses.card };
  }
  if (meta.usdc && meta.usdc.toLowerCase() !== addresses.usdc.toLowerCase()) {
    m.usdc = { indexer: meta.usdc, frontend: addresses.usdc };
  }
  return Object.keys(m).length > 0 ? m : null;
}

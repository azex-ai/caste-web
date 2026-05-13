import type {
  HookDetail,
  PoolDetail,
  Stats,
  Token,
  TokenDetail,
} from "./types";

// Server-side: hit the Ponder API directly. Client-side: go through the
// Next.js rewrite at /ponder so we don't leak the internal URL.
function apiBase(): string {
  if (typeof window === "undefined") {
    return process.env.PONDER_API_URL ?? "http://localhost:42069";
  }
  return "/ponder";
}

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${apiBase()}${path}`, {
    ...init,
    headers: { Accept: "application/json", ...(init?.headers ?? {}) },
  });
  if (!res.ok) {
    throw new Error(`API ${path} → ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  stats: () => fetchJson<Stats>("/api/stats"),

  tokensCount: (params?: { includeBase?: boolean; hookedOnly?: boolean }) => {
    const sp = new URLSearchParams();
    if (params?.includeBase) sp.set("includeBase", "true");
    if (params?.hookedOnly === false) sp.set("hookedOnly", "false");
    const qs = sp.toString();
    return fetchJson<{ count: number }>(`/api/tokens/count${qs ? `?${qs}` : ""}`);
  },

  tokens: (params?: {
    limit?: number;
    offset?: number;
    includeBase?: boolean;
    hookedOnly?: boolean;
    orderBy?:
      | "swapCount"
      | "poolCount"
      | "firstSeenBlock"
      | "totalVolumeAbs"
      | "volumeUsd18"
      | "volumeEth18"
      | "volumeUsdEquivalent";
  }) => {
    const sp = new URLSearchParams();
    if (params?.limit) sp.set("limit", String(params.limit));
    if (params?.offset) sp.set("offset", String(params.offset));
    if (params?.includeBase) sp.set("includeBase", "true");
    if (params?.hookedOnly === false) sp.set("hookedOnly", "false");
    if (params?.orderBy) sp.set("orderBy", params.orderBy);
    const qs = sp.toString();
    return fetchJson<Token[]>(`/api/tokens${qs ? `?${qs}` : ""}`);
  },

  token: (address: string) =>
    fetchJson<TokenDetail>(`/api/tokens/${address.toLowerCase()}`),

  pool: (poolId: string) => fetchJson<PoolDetail>(`/api/pools/${poolId}`),

  hook: (address: string) =>
    fetchJson<HookDetail>(`/api/hooks/${address.toLowerCase()}`),
};

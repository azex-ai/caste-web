// Typed HTTP client for the $CASTE Ponder indexer.
// Mirrors the Hono routes in `src/api/caste.ts`.

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

const BASE_URL =
  process.env.NEXT_PUBLIC_INDEXER_URL?.replace(/\/$/, "") ??
  "http://localhost:42069";

class IndexerError extends Error {
  constructor(
    message: string,
    public status: number,
    public url: string,
  ) {
    super(message);
    this.name = "IndexerError";
  }
}

async function get<T>(path: string, params?: Record<string, string | number | undefined>): Promise<T> {
  const qs = new URLSearchParams();
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v === undefined || v === null || v === "") continue;
      qs.set(k, String(v));
    }
  }
  const query = qs.toString();
  const url = `${BASE_URL}/api/caste${path}${query ? `?${query}` : ""}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new IndexerError(
      `indexer ${res.status}: ${path}`,
      res.status,
      url,
    );
  }
  return res.json() as Promise<T>;
}

export const casteApi = {
  getStats: () => get<StatsResponse>("/stats"),

  getCards: (params: {
    owner?: string;
    flipped?: boolean;
    limit?: number;
    offset?: number;
  } = {}) =>
    get<CardRow[]>("/cards", {
      owner: params.owner,
      flipped: params.flipped === undefined ? undefined : String(params.flipped),
      limit: params.limit,
      offset: params.offset,
    }),

  getRareCards: (limit?: number) =>
    get<CardRow[]>("/cards/rare", { limit }),

  getCard: (tokenId: string) =>
    get<CardRow>(`/cards/${encodeURIComponent(tokenId)}`),

  getFlips: (limit?: number) =>
    get<FlipRow[]>("/flips", { limit }),

  getHourlyEpochs: (limit?: number) =>
    get<HourlyEpochRow[]>("/lottery/hourly", { limit }),

  getMegaSettlements: () =>
    get<MegaSettlementRow[]>("/lottery/mega"),

  getSellTaxEvents: (limit?: number) =>
    get<SellTaxRow[]>("/sell-tax", { limit }),

  getTrades: (params: { kind?: "buy" | "sell"; limit?: number } = {}) =>
    get<TradeRow[]>("/trades", { kind: params.kind, limit: params.limit }),

  getUser: (address: string) =>
    get<UserResponse>(`/user/${encodeURIComponent(address.toLowerCase())}`),
};

export { IndexerError };

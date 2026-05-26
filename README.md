# $CASTE Web (Next.js 16 + wagmi v2)

Frontend for the `$CASTE` flip-card meme protocol. Consumes the Hono REST/GraphQL
API on `:42069` and signs on-chain writes via wagmi + ConnectKit.

## Stack

- Next.js 16 (App Router, Turbopack, React 19)
- Tailwind v4 + shadcn-style components in `components/ui/`
- React Query v5 (server state) + zustand (UI-only state)
- wagmi v2 + viem + ConnectKit (wallet + chain)
- `next-intl` (en/ko, work-in-progress)

## Run locally

```bash
# From repo root, after scripts/bootstrap-fork.sh has populated env files:
cd web
pnpm install
pnpm dev          # http://localhost:3000
```

`web/.env.local` is auto-written by `scripts/bootstrap-fork.sh` and contains all
`NEXT_PUBLIC_*` addresses (USDC, PoolManager, hook, token, card, router).

## Commands

```bash
pnpm dev          # next dev --turbo
pnpm build
pnpm typecheck    # tsc --noEmit
pnpm lint
```

## Structure

- `app/` — App Router pages (`swap`, `sell`, `pools`, `mycards`, `account`,
  `gallery`, `leaderboard`, `stats`, `activity`, `settle`, `card/[id]`,
  plus parallel/intercepting routes for modals)
- `components/caste/` — protocol-specific UI (CasteCard, FlipModal, SettleScreen,
  LivePhaseBanner, WrongNetworkBanner, MetaMismatchBanner, ConnectButton, …)
- `components/ui/` — shadcn-style primitives (button, input, dialog, …)
- `lib/caste/` — protocol client surface:
  - `abis.ts` — hand-curated function ABIs for wagmi
  - `contracts.ts` — typed `addresses` object + `poolKey`
  - `api.ts` — REST client for indexer
  - `hooks.ts` — React Query hooks for reads (`useStats`, `useHourlyEpochs`,
    `useHourlyEntries`, `useUserCards`, `useLivePoolState`, …)
  - `writes.ts` — five user mutations: `useBuyCaste`, `useSellCaste`,
    `useFlipCard`, `useFlipBatch`, `useSettleMega`. Pattern:
    `approve → writeContract → waitForTransactionReceipt → invalidate(["caste"])`.
    (No `useSettleHourly` — hourly auto-settles inside the hook on buys.)
  - `response-types.ts` — types matching `src/api/caste.ts` shape
  - `meta.ts` — chain identity handshake against `/api/caste/_meta`

## Conventions

- All amounts are `bigint` wei; convert at the UI edge only
- Buy/sell go through `PoolSwapTest` router (`addresses.router`),
  `hookData = abi.encode(buyer)` for lottery + card credit
- `zeroForOne=true` is buy (USDC → CASTE), `false` is sell
- Use `MIN_SQRT_PRICE_X96 + 1n` / `MAX_SQRT_PRICE_X96 - 1n` as unbounded price limits

See `CLAUDE.md` at repo root for the full protocol description.

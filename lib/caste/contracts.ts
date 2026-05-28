// Typed addresses + pool config sourced from NEXT_PUBLIC_* env vars.
//
// IMPORTANT: Next.js / Turbopack can ONLY statically inline `process.env.X`
// when accessed as a direct property literal at compile time. Indirect access
// (e.g. `process.env[key]` where `key` is a variable) returns `undefined` on
// the client. So every var must be referenced by its literal name here.

import type { Address } from "viem";

const ZERO = "0x0000000000000000000000000000000000000000" as Address;
const isAddr = (v: string | undefined): v is string =>
  !!v && /^0x[0-9a-fA-F]{40}$/.test(v);

const usdcRaw = process.env.NEXT_PUBLIC_USDC_ADDRESS;
const poolManagerRaw = process.env.NEXT_PUBLIC_POOL_MANAGER;
const hookRaw = process.env.NEXT_PUBLIC_CASTE_HOOK_ADDRESS;
const tokenRaw = process.env.NEXT_PUBLIC_CASTE_TOKEN_ADDRESS;
const cardRaw = process.env.NEXT_PUBLIC_CASTE_CARD_ADDRESS;
const routerRaw = process.env.NEXT_PUBLIC_ROUTER_ADDRESS;

export const addresses = {
  usdc: (isAddr(usdcRaw) ? (usdcRaw as Address) : ZERO),
  poolManager: (isAddr(poolManagerRaw) ? (poolManagerRaw as Address) : ZERO),
  hook: (isAddr(hookRaw) ? (hookRaw as Address) : ZERO),
  token: (isAddr(tokenRaw) ? (tokenRaw as Address) : ZERO),
  card: (isAddr(cardRaw) ? (cardRaw as Address) : ZERO),
  router: (isAddr(routerRaw) ? (routerRaw as Address) : ZERO),
} as const;

// Surface missing config loudly in the browser console — silent zero-fallbacks
// caused us to hit `allowance` returned "0x" reverts during pre-launch.
if (typeof window !== "undefined") {
  // Single pass: collect missing keys via reduce — avoids the .filter().map()
  // double-iteration on the addresses entries.
  const missing = Object.entries(addresses).reduce<string[]>((acc, [k, v]) => {
    if (v === ZERO) acc.push(k);
    return acc;
  }, []);
  if (missing.length > 0) {
    // eslint-disable-next-line no-console
    console.error(
      `[caste/contracts] missing NEXT_PUBLIC_* env vars at build time: ${missing.join(", ")} — restart pnpm dev after editing .env.local`,
    );
  }
}

// The CASTE pool: USDC is always currency0 (hook addr was mined to satisfy this),
// CASTE is currency1. Fee 3000 (0.3%), tickSpacing 60.
export const poolKey = {
  currency0: addresses.usdc,
  currency1: addresses.token,
  fee: 3000,
  tickSpacing: 60,
  hooks: addresses.hook,
} as const;

// USDC is 6-dec. Hook charges $6.66666 / unit.
export const UNIT_USDC_RAW = 6_666_660n;

// Min/Max sqrtPriceX96 — used to set unbounded price limits for swaps.
// Values come from TickMath.MIN_SQRT_PRICE / MAX_SQRT_PRICE.
export const MIN_SQRT_PRICE_X96 = 4_295_128_739n;
export const MAX_SQRT_PRICE_X96 = 1_461_446_703_485_210_103_287_273_052_203_988_822_378_723_970_342n;

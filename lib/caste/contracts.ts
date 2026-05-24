// Typed addresses + pool config sourced from NEXT_PUBLIC_* env vars.

import type { Address } from "viem";

function requireEnv(key: string): Address {
  const v = process.env[key];
  if (!v || !/^0x[0-9a-fA-F]{40}$/.test(v)) {
    return "0x0000000000000000000000000000000000000000" as Address;
  }
  return v as Address;
}

export const addresses = {
  usdc: requireEnv("NEXT_PUBLIC_USDC_ADDRESS"),
  poolManager: requireEnv("NEXT_PUBLIC_POOL_MANAGER"),
  hook: requireEnv("NEXT_PUBLIC_CASTE_HOOK_ADDRESS"),
  token: requireEnv("NEXT_PUBLIC_CASTE_TOKEN_ADDRESS"),
  card: requireEnv("NEXT_PUBLIC_CASTE_CARD_ADDRESS"),
  router: requireEnv("NEXT_PUBLIC_ROUTER_ADDRESS"),
} as const;

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

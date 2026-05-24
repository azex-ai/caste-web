// Wagmi write helpers for $CASTE user actions.
//
// - buyCaste(units)        — USDC approve + PoolSwapTest.swap(zeroForOne=true)
// - sellCaste(amount)      — CASTE approve + PoolSwapTest.swap(zeroForOne=false)
// - flipCard(tokenId)      — hook.flipCard(tokenId)
// - settleHourly(epoch)    — hook.settleHourly(epoch)
// - settleMega()           — hook.settleMega()
//
// All take a wagmi config + signer; helpers encode args, returning the tx hash.

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAccount, useConfig, usePublicClient } from "wagmi";
import {
  readContract,
  waitForTransactionReceipt,
  writeContract,
} from "wagmi/actions";
import { encodeAbiParameters, type Hash } from "viem";

import {
  casteHookAbi,
  erc20Abi,
  poolSwapTestAbi,
} from "./abis";
import {
  MAX_SQRT_PRICE_X96,
  MIN_SQRT_PRICE_X96,
  UNIT_USDC_RAW,
  addresses,
  poolKey,
} from "./contracts";

const MAX_UINT256 = (1n << 256n) - 1n;

export const txKeys = {
  buy: ["caste-tx", "buy"] as const,
  sell: ["caste-tx", "sell"] as const,
  flip: ["caste-tx", "flip"] as const,
  settleHourly: ["caste-tx", "settle-hourly"] as const,
  settleMega: ["caste-tx", "settle-mega"] as const,
};

/// Encode hookData = abi.encode(address) — the buyer to credit cards to.
function encodeHookData(addr: `0x${string}`): `0x${string}` {
  return encodeAbiParameters([{ type: "address" }], [addr]);
}

async function ensureAllowance(
  config: Parameters<typeof readContract>[0],
  token: `0x${string}`,
  owner: `0x${string}`,
  spender: `0x${string}`,
  needed: bigint,
): Promise<void> {
  const current = (await readContract(config, {
    address: token,
    abi: erc20Abi,
    functionName: "allowance",
    args: [owner, spender],
  })) as bigint;
  if (current >= needed) return;
  const hash = (await writeContract(config, {
    address: token,
    abi: erc20Abi,
    functionName: "approve",
    args: [spender, MAX_UINT256],
  })) as Hash;
  await waitForTransactionReceipt(config, { hash });
}

export function useBuyCaste() {
  const config = useConfig();
  const { address } = useAccount();
  const qc = useQueryClient();
  return useMutation({
    mutationKey: txKeys.buy,
    mutationFn: async ({ units }: { units: number }) => {
      if (!address) throw new Error("wallet not connected");
      if (units < 1 || units > 100) throw new Error("units must be 1-100");
      const usdcIn = BigInt(units) * UNIT_USDC_RAW;
      await ensureAllowance(config, addresses.usdc, address, addresses.router, usdcIn);
      const hash = (await writeContract(config, {
        address: addresses.router,
        abi: poolSwapTestAbi,
        functionName: "swap",
        args: [
          poolKey,
          { zeroForOne: true, amountSpecified: -usdcIn, sqrtPriceLimitX96: MIN_SQRT_PRICE_X96 + 1n },
          { takeClaims: false, settleUsingBurn: false },
          encodeHookData(address),
        ],
      })) as Hash;
      const receipt = await waitForTransactionReceipt(config, { hash });
      return { hash, blockNumber: receipt.blockNumber };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["caste"] });
    },
  });
}

export function useSellCaste() {
  const config = useConfig();
  const { address } = useAccount();
  const qc = useQueryClient();
  return useMutation({
    mutationKey: txKeys.sell,
    mutationFn: async ({ amount }: { amount: bigint }) => {
      if (!address) throw new Error("wallet not connected");
      if (amount <= 0n) throw new Error("amount must be > 0");
      await ensureAllowance(config, addresses.token, address, addresses.router, amount);
      const hash = (await writeContract(config, {
        address: addresses.router,
        abi: poolSwapTestAbi,
        functionName: "swap",
        args: [
          poolKey,
          { zeroForOne: false, amountSpecified: -amount, sqrtPriceLimitX96: MAX_SQRT_PRICE_X96 - 1n },
          { takeClaims: false, settleUsingBurn: false },
          encodeHookData(address),
        ],
      })) as Hash;
      const receipt = await waitForTransactionReceipt(config, { hash });
      return { hash, blockNumber: receipt.blockNumber };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["caste"] });
    },
  });
}

export function useFlipCard() {
  const config = useConfig();
  const qc = useQueryClient();
  return useMutation({
    mutationKey: txKeys.flip,
    mutationFn: async ({ tokenId }: { tokenId: bigint | string }) => {
      const id = typeof tokenId === "string" ? BigInt(tokenId) : tokenId;
      const hash = (await writeContract(config, {
        address: addresses.hook,
        abi: casteHookAbi,
        functionName: "flipCard",
        args: [id],
      })) as Hash;
      const receipt = await waitForTransactionReceipt(config, { hash });
      return { hash, blockNumber: receipt.blockNumber };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["caste"] });
    },
  });
}

export function useSettleHourly() {
  const config = useConfig();
  const qc = useQueryClient();
  return useMutation({
    mutationKey: txKeys.settleHourly,
    mutationFn: async ({ epoch }: { epoch: bigint | number }) => {
      const e = typeof epoch === "number" ? BigInt(epoch) : epoch;
      const hash = (await writeContract(config, {
        address: addresses.hook,
        abi: casteHookAbi,
        functionName: "settleHourly",
        args: [e],
      })) as Hash;
      const receipt = await waitForTransactionReceipt(config, { hash });
      return { hash, blockNumber: receipt.blockNumber };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["caste"] });
    },
  });
}

export function useSettleMega() {
  const config = useConfig();
  const qc = useQueryClient();
  return useMutation({
    mutationKey: txKeys.settleMega,
    mutationFn: async () => {
      const hash = (await writeContract(config, {
        address: addresses.hook,
        abi: casteHookAbi,
        functionName: "settleMega",
        args: [],
      })) as Hash;
      const receipt = await waitForTransactionReceipt(config, { hash });
      return { hash, blockNumber: receipt.blockNumber };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["caste"] });
    },
  });
}

// Read helper — current USDC balance for the connected account.
export function useUsdcBalance() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  return useMutation({
    mutationFn: async () => {
      if (!address || !publicClient) return 0n;
      return (await publicClient.readContract({
        address: addresses.usdc,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [address],
      })) as bigint;
    },
  });
}

"use client";

// $CASTE — wagmi hooks for contract reads and writes

import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
} from "wagmi";
import { useQuery } from "@tanstack/react-query";
import { CONTRACTS, UNIT_USDC } from "./constants";
import {
  MintManagerAbi,
  CasteCardAbi,
  CasteHookAbi,
  Erc20Abi,
} from "./abis";
import {
  fetchCardsByOwner,
  fetchRareCards,
  fetchHourlyWinners,
  fetchMegaWinners,
  fetchCasteStats,
  casteQueryKeys,
} from "./api";

// ─── Read hooks ────────────────────────────────────────────────────────────

export function useHighestTier(address: `0x${string}` | undefined) {
  return useReadContract({
    address: CONTRACTS.card,
    abi: CasteCardAbi,
    functionName: "getHighestTier",
    args: address ? [address] : undefined,
    query: { enabled: !!CONTRACTS.card && !!address },
  });
}

export function usePendingQueueInfo() {
  const head = useReadContract({
    address: CONTRACTS.hook,
    abi: CasteHookAbi,
    functionName: "getPendingHead",
    query: { enabled: !!CONTRACTS.hook },
  });
  const tail = useReadContract({
    address: CONTRACTS.hook,
    abi: CasteHookAbi,
    functionName: "getPendingTail",
    query: { enabled: !!CONTRACTS.hook },
  });
  const queueLength =
    head.data !== undefined && tail.data !== undefined
      ? Number(tail.data - head.data)
      : undefined;
  return { head, tail, queueLength };
}

export function useUsdcAllowance(
  owner: `0x${string}` | undefined,
  spender: `0x${string}` | undefined,
) {
  return useReadContract({
    address: CONTRACTS.usdc,
    abi: Erc20Abi,
    functionName: "allowance",
    args: owner && spender ? [owner, spender] : undefined,
    query: { enabled: !!owner && !!spender },
  });
}

export function useUsdcBalance(address: `0x${string}` | undefined) {
  return useReadContract({
    address: CONTRACTS.usdc,
    abi: Erc20Abi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });
}

// ─── Write hooks ───────────────────────────────────────────────────────────

export function useApproveUsdc() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  function approve(spender: `0x${string}`, amount: bigint) {
    writeContract({
      address: CONTRACTS.usdc,
      abi: Erc20Abi,
      functionName: "approve",
      args: [spender, amount],
    });
  }

  return { approve, hash, isPending, isConfirming, isSuccess, error };
}

export function useBatchMint() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  function batchMint(size: number) {
    if (!CONTRACTS.mintManager) throw new Error("MintManager not deployed");
    writeContract({
      address: CONTRACTS.mintManager,
      abi: MintManagerAbi,
      functionName: "batchMint",
      args: [size],
    });
  }

  return { batchMint, hash, isPending, isConfirming, isSuccess, error };
}

export function useRevealMint() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  function revealMint(mintId: bigint) {
    if (!CONTRACTS.mintManager) throw new Error("MintManager not deployed");
    writeContract({
      address: CONTRACTS.mintManager,
      abi: MintManagerAbi,
      functionName: "revealMint",
      args: [mintId],
    });
  }

  return { revealMint, hash, isPending, isConfirming, isSuccess, error };
}

export function useSettleHourly() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  function settleHourly(epoch: bigint) {
    if (!CONTRACTS.hook) throw new Error("Hook not deployed");
    writeContract({
      address: CONTRACTS.hook,
      abi: CasteHookAbi,
      functionName: "settleHourly",
      args: [epoch],
    });
  }

  return { settleHourly, hash, isPending, isConfirming, isSuccess, error };
}

export function useSettleMega() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  function settleMega() {
    if (!CONTRACTS.hook) throw new Error("Hook not deployed");
    writeContract({
      address: CONTRACTS.hook,
      abi: CasteHookAbi,
      functionName: "settleMega",
      args: [],
    });
  }

  return { settleMega, hash, isPending, isConfirming, isSuccess, error };
}

// ─── Indexer React Query hooks ─────────────────────────────────────────────

export function useMyCards() {
  const { address } = useAccount();
  return useQuery({
    queryKey: casteQueryKeys.cardsByOwner(address ?? ""),
    queryFn: () => fetchCardsByOwner(address!),
    enabled: !!address,
    staleTime: 20_000,
  });
}

export function useRareCards() {
  return useQuery({
    queryKey: casteQueryKeys.rareCards(),
    queryFn: fetchRareCards,
    staleTime: 60_000,
  });
}

export function useHourlyWinners() {
  return useQuery({
    queryKey: casteQueryKeys.hourlyWinners(),
    queryFn: () => fetchHourlyWinners(24),
    staleTime: 30_000,
  });
}

export function useMegaWinners() {
  return useQuery({
    queryKey: casteQueryKeys.megaWinners(),
    queryFn: fetchMegaWinners,
    staleTime: 60_000,
  });
}

export function useCasteStats() {
  return useQuery({
    queryKey: casteQueryKeys.stats(),
    queryFn: fetchCasteStats,
    staleTime: 10_000,
    refetchInterval: 15_000,
  });
}

// Helper: cost for N units in USDC micro-units (6dp bigint)
export function mintCost(units: number): bigint {
  return UNIT_USDC * BigInt(units);
}

// Helper: reveal delay in blocks for a given batch size
export function revealDelayBlocks(size: number): number {
  return 4 + Math.floor(Math.sqrt(size));
}

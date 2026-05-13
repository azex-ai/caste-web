"use client";

import { useState, useCallback } from "react";
import { useAccount } from "wagmi";
import { CasteConnectButton } from "@/components/caste/connect-button";
import { CardDisplay } from "@/components/caste/card-display";
import { UNIT_USDC, CONTRACTS } from "@/lib/caste/constants";
import {
  useBatchMint,
  useRevealMint,
  useApproveUsdc,
  useUsdcAllowance,
  revealDelayBlocks,
} from "@/lib/caste/hooks";
import { MOCK_CARDS } from "@/lib/caste/mock";
import type { CardData } from "@/lib/caste/types";

function formatUsdc(micro: bigint): string {
  return `$${(Number(micro) / 1_000_000).toFixed(5)}`;
}

function MintCostDisplay({ units }: { units: number }) {
  const total = UNIT_USDC * BigInt(units);
  const delay = revealDelayBlocks(units);
  const estSeconds = delay * 12;

  return (
    <div className="rounded-xl border border-zinc-700 bg-zinc-800/50 p-4 text-sm">
      <div className="flex justify-between gap-2">
        <span className="text-zinc-400">单价</span>
        <span className="tabular-nums font-semibold text-zinc-200">
          {formatUsdc(UNIT_USDC)}
        </span>
      </div>
      <div className="mt-1 flex justify-between gap-2">
        <span className="text-zinc-400">数量</span>
        <span className="tabular-nums font-semibold text-zinc-200">
          {units} 张
        </span>
      </div>
      <div className="mt-2 border-t border-zinc-700 pt-2 flex justify-between gap-2">
        <span className="text-zinc-300 font-semibold">总计</span>
        <span className="tabular-nums text-lg font-black text-fuchsia-300">
          {formatUsdc(total)}
        </span>
      </div>
      <div className="mt-2 text-xs text-zinc-500">
        揭晓延迟：{delay} 个区块（≈ {estSeconds}s）
        <br />
        公式：4 + ⌊√{units}⌋ = {delay}
      </div>
    </div>
  );
}

function BatchStepper({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const presets = [1, 5, 10, 50, 100];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="减少数量"
          onClick={() => onChange(Math.max(1, value - 1))}
          disabled={value <= 1}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800 text-lg font-bold text-zinc-300 transition hover:bg-zinc-700 disabled:opacity-40"
        >
          −
        </button>
        <span className="tabular-nums w-12 text-center text-2xl font-black text-zinc-100">
          {value}
        </span>
        <button
          type="button"
          aria-label="增加数量"
          onClick={() => onChange(Math.min(100, value + 1))}
          disabled={value >= 100}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800 text-lg font-bold text-zinc-300 transition hover:bg-zinc-700 disabled:opacity-40"
        >
          +
        </button>
      </div>
      <div className="flex gap-2 flex-wrap">
        {presets.map((p) => (
          <button
            type="button"
            key={p}
            onClick={() => onChange(p)}
            className={[
              "rounded-full px-3 py-1 text-xs font-semibold border transition",
              value === p
                ? "border-fuchsia-500 bg-fuchsia-900/60 text-fuchsia-200"
                : "border-zinc-700 bg-zinc-800 text-zinc-400 hover:border-zinc-500",
            ].join(" ")}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}

type MintStep = "idle" | "approving" | "minting" | "pending" | "revealed";

export default function MintPage() {
  const { address, isConnected } = useAccount();
  const [units, setUnits] = useState(1);
  const [step, setStep] = useState<MintStep>("idle");
  const [revealedCards, setRevealedCards] = useState<CardData[]>([]);
  const [pendingMintId, setPendingMintId] = useState<bigint | null>(null);
  const [txError, setTxError] = useState<string | null>(null);

  const total = UNIT_USDC * BigInt(units);
  const spender = CONTRACTS.mintManager;

  const allowanceResult = useUsdcAllowance(address, spender);
  const currentAllowance = allowanceResult.data ?? 0n;
  const needsApproval = currentAllowance < total;

  const {
    approve,
    isPending: isApproving,
    isConfirming: isApproveConfirming,
    isSuccess: isApproveSuccess,
    error: approveError,
  } = useApproveUsdc();

  const {
    batchMint,
    isPending: isMinting,
    isConfirming: isMintConfirming,
    isSuccess: isMintSuccess,
    error: mintError,
  } = useBatchMint();

  const {
    revealMint,
    isPending: isRevealing,
    isConfirming: isRevealConfirming,
    isSuccess: isRevealSuccess,
    error: revealError,
  } = useRevealMint();

  const deployed = !!CONTRACTS.mintManager;

  const handleApprove = useCallback(() => {
    setTxError(null);
    setStep("approving");
    approve(spender!, total);
  }, [approve, spender, total]);

  const handleMint = useCallback(() => {
    setTxError(null);
    setStep("minting");
    batchMint(units);
  }, [batchMint, units]);

  const handleReveal = useCallback(() => {
    if (!pendingMintId) return;
    setTxError(null);
    revealMint(pendingMintId);
  }, [revealMint, pendingMintId]);

  // Mock reveal for demo
  const handleMockReveal = useCallback(() => {
    const subset = MOCK_CARDS.slice(0, Math.min(units, MOCK_CARDS.length));
    setRevealedCards(subset);
    setStep("revealed");
  }, [units]);

  const anyError = approveError ?? mintError ?? revealError;

  if (!isConnected) {
    return (
      <main className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center gap-6 px-4 py-16 text-center">
        <div className="text-5xl" aria-hidden="true">🎰</div>
        <h1 className="text-3xl font-black text-zinc-100">Mint $CASTE 卡</h1>
        <p className="text-zinc-400">连接钱包后开始抽你的命运</p>
        <CasteConnectButton />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-lg px-4 py-10 sm:px-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-black text-zinc-100">
          <span aria-hidden="true">🎰</span> Mint 卡
        </h1>
        <CasteConnectButton />
      </div>

      {!deployed && (
        <div className="mb-6 rounded-xl border border-amber-800 bg-amber-950/50 px-4 py-3 text-sm text-amber-300">
          合约尚未部署 — 演示模式（Mock 数据）
        </div>
      )}

      {/* Step 1: Choose size */}
      <section className="mb-6 rounded-2xl border border-zinc-700 bg-zinc-900 p-5">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-zinc-500">
          1. 选择数量（1-100）
        </h2>
        <BatchStepper value={units} onChange={setUnits} />
      </section>

      {/* Cost display */}
      <MintCostDisplay units={units} />

      {/* Step 2: Approve + Mint */}
      <section className="mt-6 flex flex-col gap-3">
        {anyError && (
          <div
            role="alert"
            className="rounded-xl border border-red-800 bg-red-950/50 px-4 py-3 text-sm text-red-300"
          >
            {anyError.message.slice(0, 120)}
          </div>
        )}

        {deployed ? (
          <>
            {needsApproval && step !== "minting" && step !== "pending" && (
              <button
                type="button"
                onClick={handleApprove}
                disabled={isApproving || isApproveConfirming}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-700 py-3 font-semibold text-zinc-100 transition hover:bg-zinc-600 disabled:opacity-50"
              >
                {isApproving || isApproveConfirming ? (
                  <>
                    <span
                      className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-400 border-t-white"
                      aria-hidden="true"
                    />
                    {isApproving ? "签名授权…" : "确认中…"}
                  </>
                ) : (
                  "① 授权 USDC"
                )}
              </button>
            )}

            <button
              type="button"
              onClick={handleMint}
              disabled={
                (needsApproval && !isApproveSuccess) ||
                isMinting ||
                isMintConfirming ||
                step === "pending"
              }
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-fuchsia-600 py-3 font-bold text-white shadow-[0_0_20px_rgb(168_85_247/0.4)] transition hover:bg-fuchsia-500 disabled:opacity-40 active:scale-95"
            >
              {isMinting || isMintConfirming ? (
                <>
                  <span
                    className="h-4 w-4 animate-spin rounded-full border-2 border-fuchsia-300 border-t-white"
                    aria-hidden="true"
                  />
                  {isMinting ? "签名中…" : "链上确认…"}
                </>
              ) : (
                `② Mint ${units} 张 — ${formatUsdc(total)}`
              )}
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={handleMockReveal}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-fuchsia-600 py-3 font-bold text-white shadow-[0_0_20px_rgb(168_85_247/0.4)] transition hover:bg-fuchsia-500 active:scale-95"
          >
            🎲 模拟 Mint（Demo）
          </button>
        )}

        {/* Reveal button — shown when mint confirmed and pending */}
        {(isMintSuccess || step === "pending") && !revealedCards.length && (
          <div className="rounded-xl border border-zinc-700 bg-zinc-800/50 p-4">
            <p className="mb-3 text-sm text-zinc-400">
              Mint 已提交，等待 {revealDelayBlocks(units)} 个区块后可揭晓…
            </p>
            {deployed ? (
              <button
                type="button"
                onClick={handleReveal}
                disabled={isRevealing || isRevealConfirming || !pendingMintId}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-600 py-3 font-bold text-white transition hover:bg-amber-500 disabled:opacity-40"
              >
                {isRevealing || isRevealConfirming ? (
                  <>
                    <span
                      className="h-4 w-4 animate-spin rounded-full border-2 border-amber-300 border-t-white"
                      aria-hidden="true"
                    />
                    揭晓中…
                  </>
                ) : (
                  "🎴 揭晓卡面"
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleMockReveal}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-600 py-3 font-bold text-white transition hover:bg-amber-500"
              >
                🎴 揭晓（Demo）
              </button>
            )}
          </div>
        )}
      </section>

      {/* Revealed cards */}
      {revealedCards.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-4 text-center text-lg font-black text-zinc-100">
            🎉 你的新卡
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {revealedCards.map((card) => (
              <CardDisplay key={card.tokenId.toString()} card={card} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

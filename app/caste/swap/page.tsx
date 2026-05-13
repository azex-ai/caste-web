"use client";

import { useState, useCallback } from "react";
import { useAccount } from "wagmi";
import { CasteConnectButton } from "@/components/caste/connect-button";
import { MultiplierReel } from "@/components/caste/multiplier-reel";
import { TierBadge } from "@/components/caste/tier-badge";
import {
  UNIT_USDC,
  TIER_NAMES,
  TIER_EMOJIS,
  MULT_OUTCOMES,
  MULT_COLORS,
  MULT_PROBS_BY_TIER,
  SELL_TAX_BRACKETS,
} from "@/lib/caste/constants";
import { useHighestTier } from "@/lib/caste/hooks";
import { CONTRACTS } from "@/lib/caste/constants";
import type { MultiplierIndex, TierIndex } from "@/lib/caste/types";

function formatUsdc(micro: bigint): string {
  const usd = Number(micro) / 1_000_000;
  if (usd >= 1000) return `$${(usd / 1000).toFixed(2)}K`;
  return `$${usd.toFixed(5)}`;
}

function getSellTax(holdingDays: number, tierIdx: number): number {
  const tierDiscounts = [0, -2, -3, -3, -4, -5, -10, -13, -15, -17];
  const discount = tierDiscounts[tierIdx] ?? 0;
  for (const { days, base } of SELL_TAX_BRACKETS) {
    if (holdingDays < days) return Math.max(0, base + discount);
  }
  return Math.max(0, 4 + discount);
}

function MultiplierTable({ tierIdx }: { tierIdx: TierIndex }) {
  const probs = MULT_PROBS_BY_TIER[tierIdx];
  return (
    <div className="rounded-xl border border-zinc-700 bg-zinc-800/50 p-4">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">
        Multiplier 概率表 — {TIER_EMOJIS[tierIdx]} {TIER_NAMES[tierIdx]}
      </h3>
      <div className="flex flex-col gap-1">
        {MULT_OUTCOMES.map((outcome, i) => (
          <div key={outcome} className="flex items-center gap-3">
            <div className="w-32">
              <span className={["text-sm font-semibold", MULT_COLORS[i]].join(" ")}>
                {outcome}
              </span>
            </div>
            <div className="flex-1 overflow-hidden rounded-full bg-zinc-700 h-1.5">
              <div
                className={["h-1.5 rounded-full", MULT_COLORS[i].replace("text-", "bg-")].join(" ")}
                style={{ width: `${Math.min(100, (probs[i] ?? 0) * 3)}%` }}
                role="presentation"
              />
            </div>
            <span className="tabular-nums w-10 text-right text-xs text-zinc-400">
              {probs[i] ?? 0}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SellTaxTable({ tierIdx }: { tierIdx: TierIndex }) {
  const brackets = [
    { label: "0-7 天", days: 3 },
    { label: "7-30 天", days: 15 },
    { label: "30-90 天", days: 60 },
    { label: ">90 天", days: 120 },
  ];
  return (
    <div className="rounded-xl border border-zinc-700 bg-zinc-800/50 p-4">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">
        Sell Tax 阶梯（100% burn）
      </h3>
      <div className="flex flex-col gap-1.5">
        {brackets.map(({ label, days }) => {
          const tax = getSellTax(days, tierIdx);
          return (
            <div key={label} className="flex items-center justify-between gap-2 text-sm">
              <span className="text-zinc-400">{label}</span>
              <span
                className={
                  tax <= 5
                    ? "font-bold text-emerald-400"
                    : tax <= 15
                    ? "font-bold text-amber-400"
                    : "font-bold text-red-400"
                }
              >
                {tax}%
              </span>
            </div>
          );
        })}
      </div>
      <p className="mt-2 text-[10px] text-zinc-600">
        高等级卡享受更低 sell tax。Sell tax 100% burn，不进任何池。
      </p>
    </div>
  );
}

type Mode = "buy" | "sell";

export default function SwapPage() {
  const { address, isConnected } = useAccount();
  const [mode, setMode] = useState<Mode>("buy");
  const [units, setUnits] = useState(1);
  const [sellAmount, setSellAmount] = useState("");
  const [txState, setTxState] = useState<
    "idle" | "pending" | "confirming" | "success" | "error"
  >("idle");
  const [mockResult, setMockResult] = useState<MultiplierIndex | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [txError, setTxError] = useState<string | null>(null);

  const tierResult = useHighestTier(address);
  const tierIdx: TierIndex = (tierResult.data ?? 0) as TierIndex;

  const cost = UNIT_USDC * BigInt(units);
  const deployed = !!CONTRACTS.hook;

  // Estimated base output: unit × TIER_TOKEN_BASE[tier] (simplified)
  const estTokenBase = units * Number(
    [3000n, 6000n, 9000n, 12000n, 15000n, 18000n, 25000n, 35000n, 50000n, 80000n][tierIdx] ?? 3000n
  );

  const handleMockBuy = useCallback(() => {
    setIsSpinning(true);
    setMockResult(null);
    setTxState("pending");

    setTimeout(() => {
      // Weighted random roll based on tier probs
      const probs = MULT_PROBS_BY_TIER[tierIdx];
      const roll = Math.random() * 100;
      let cumulative = 0;
      let resultIdx: MultiplierIndex = 2;
      for (let i = 0; i < probs.length; i++) {
        cumulative += probs[i] ?? 0;
        if (roll < cumulative) {
          resultIdx = i as MultiplierIndex;
          break;
        }
      }
      setMockResult(resultIdx);
      setIsSpinning(false);
      setTxState("success");
    }, 2200);
  }, [tierIdx]);

  const handleMockSell = useCallback(() => {
    setTxState("pending");
    setTimeout(() => setTxState("success"), 1200);
  }, []);

  if (!isConnected) {
    return (
      <main className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center gap-6 px-4 py-16 text-center">
        <div className="text-5xl" aria-hidden="true">⚡</div>
        <h1 className="text-3xl font-black text-zinc-100">Swap $CASTE</h1>
        <p className="text-zinc-400">连接钱包后开始时时彩交易</p>
        <CasteConnectButton />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-lg px-4 py-10 sm:px-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-black text-zinc-100">
          <span aria-hidden="true">⚡</span> Swap
        </h1>
        <CasteConnectButton />
      </div>

      {!deployed && (
        <div className="mb-4 rounded-xl border border-amber-800 bg-amber-950/50 px-4 py-3 text-sm text-amber-300">
          合约尚未部署 — 演示模式
        </div>
      )}

      {/* Highest tier badge */}
      {address && (
        <div className="mb-4 flex items-center gap-2 text-sm text-zinc-400">
          <span>你的最高级卡：</span>
          <TierBadge tier={tierIdx} variant={0} size="sm" />
        </div>
      )}

      {/* Mode toggle */}
      <div
        role="tablist"
        aria-label="交易方向"
        className="mb-6 flex rounded-xl border border-zinc-700 bg-zinc-800 p-1"
      >
        {(["buy", "sell"] as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            role="tab"
            aria-selected={mode === m}
            onClick={() => {
              setMode(m);
              setTxState("idle");
              setMockResult(null);
            }}
            className={[
              "flex-1 rounded-lg py-2 text-sm font-semibold transition",
              mode === m
                ? m === "buy"
                  ? "bg-emerald-700 text-white shadow"
                  : "bg-red-700 text-white shadow"
                : "text-zinc-400 hover:text-zinc-200",
            ].join(" ")}
          >
            {m === "buy" ? "📈 买入" : "📉 卖出"}
          </button>
        ))}
      </div>

      {mode === "buy" ? (
        <section className="flex flex-col gap-4">
          {/* Unit stepper */}
          <div className="rounded-2xl border border-zinc-700 bg-zinc-900 p-5">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-500">
              购买数量（Unit）
            </h2>
            <div className="flex items-center gap-4">
              <button
                type="button"
                aria-label="减少"
                onClick={() => setUnits(Math.max(1, units - 1))}
                disabled={units <= 1}
                className="h-9 w-9 rounded-full border border-zinc-700 bg-zinc-800 text-lg font-bold text-zinc-300 hover:bg-zinc-700 disabled:opacity-40"
              >
                −
              </button>
              <span className="tabular-nums w-16 text-center text-2xl font-black text-zinc-100">
                {units}
              </span>
              <button
                type="button"
                aria-label="增加"
                onClick={() => setUnits(Math.min(100, units + 1))}
                disabled={units >= 100}
                className="h-9 w-9 rounded-full border border-zinc-700 bg-zinc-800 text-lg font-bold text-zinc-300 hover:bg-zinc-700 disabled:opacity-40"
              >
                +
              </button>
              <div className="flex-1 text-right">
                <div className="tabular-nums text-lg font-bold text-emerald-300">
                  {formatUsdc(cost)}
                </div>
                <div className="text-xs text-zinc-500">
                  ≈ {estTokenBase.toLocaleString()} $CASTE (base)
                </div>
              </div>
            </div>
          </div>

          {/* Multiplier table */}
          <MultiplierTable tierIdx={tierIdx} />

          {/* Multiplier reel result */}
          {(isSpinning || mockResult !== null) && (
            <div className="flex justify-center py-4">
              <MultiplierReel result={mockResult} spinning={isSpinning} />
            </div>
          )}

          {txError && (
            <div role="alert" className="rounded-xl border border-red-800 bg-red-950/50 px-4 py-3 text-sm text-red-300">
              {txError}
            </div>
          )}

          {txState === "success" && mockResult !== null && (
            <div className={["rounded-xl border px-4 py-3 text-center font-bold", MULT_COLORS[mockResult]].join(" ")
              .replace("text-", "border-").split(" ").join(" ") + " bg-zinc-900"}>
              交易成功！Multiplier: {MULT_OUTCOMES[mockResult]}
            </div>
          )}

          {/* Swap button */}
          <button
            type="button"
            onClick={deployed ? undefined : handleMockBuy}
            disabled={txState === "pending" || txState === "confirming"}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 font-bold text-white shadow-[0_0_20px_rgb(52_211_153/0.3)] transition hover:bg-emerald-500 disabled:opacity-40 active:scale-95"
          >
            {txState === "pending" || txState === "confirming" ? (
              <>
                <span
                  className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-300 border-t-white"
                  aria-hidden="true"
                />
                {txState === "pending" ? "签名中…" : "链上确认…"}
              </>
            ) : (
              `📈 Buy ${units} Unit — ${formatUsdc(cost)}`
            )}
          </button>
          <p className="text-center text-xs text-zinc-600">
            买入 2 区块后异步 execute，由下一笔 swap piggyback 结算
          </p>
        </section>
      ) : (
        <section className="flex flex-col gap-4">
          {/* Sell amount input */}
          <div className="rounded-2xl border border-zinc-700 bg-zinc-900 p-5">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">
              卖出数量（$CASTE）
            </h2>
            <input
              type="number"
              min="0"
              placeholder="输入 $CASTE 数量"
              value={sellAmount}
              onChange={(e) => setSellAmount(e.target.value)}
              aria-label="卖出 $CASTE 数量"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-lg font-semibold text-zinc-100 placeholder-zinc-600 focus:border-zinc-500 focus:outline-none"
            />
          </div>

          {/* Sell tax table */}
          <SellTaxTable tierIdx={tierIdx} />

          <div className="rounded-xl border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-400">
            ⚠️ Sell Tax 100% burn — 不进任何奖池，纯通缩。持仓越久税率越低。
          </div>

          {txState === "success" && (
            <div className="rounded-xl border border-emerald-800 bg-emerald-950/50 px-4 py-3 text-center text-sm font-bold text-emerald-300">
              卖出成功！
            </div>
          )}

          <button
            type="button"
            onClick={deployed ? undefined : handleMockSell}
            disabled={
              (!sellAmount || Number(sellAmount) <= 0) ||
              txState === "pending" ||
              txState === "confirming"
            }
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-700 py-3.5 font-bold text-white transition hover:bg-red-600 disabled:opacity-40 active:scale-95"
          >
            {txState === "pending" || txState === "confirming" ? (
              <>
                <span
                  className="h-4 w-4 animate-spin rounded-full border-2 border-red-300 border-t-white"
                  aria-hidden="true"
                />
                {txState === "pending" ? "签名中…" : "确认中…"}
              </>
            ) : (
              "📉 Sell — 立即执行"
            )}
          </button>
        </section>
      )}
    </main>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { useAccount } from "wagmi";

import { Ticker, Footer } from "@/components/caste/caste-chrome";
import { TierBadge } from "@/components/caste/tier-badge";
import { useStats, useMegaSettlements, useLivePoolState, useRecentTrades, useUserCards, useHourlyEntries } from "@/lib/caste/hooks";
import { useBuyCaste } from "@/lib/caste/writes";
import { useIsMounted } from "@/lib/use-is-mounted";

const USDC_1E6 = 1_000_000;
const HOURLY_SECONDS = 3600;

function shortAddr(a?: string | null): string {
  if (!a || a.length < 12) return a ?? "—";
  return `${a.slice(0, 6)}…${a.slice(-4)}`;
}
function fmtAgoSec(d: number): string {
  if (d < 60) return `${Math.max(d, 0)}s`;
  if (d < 3600) return `${Math.floor(d / 60)}m`;
  return `${Math.floor(d / 3600)}h`;
}

const ONE_E18 = 10n ** 18n;
const UNIT_USDC = 6.66666;
const CASTE_PER_USDC = 21008;
// Wave-3: protocol-wide sealed-card cap. Each buy now mints 1 card per unit
// (no per-buy cap), so the only ceiling is the global supply limit.
const MAX_CARDS = 10_000;

const fmt = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 2 });
const fmtCaste = (n: number) =>
  n >= 1e6 ? `${(n / 1e6).toFixed(2)}M` : n >= 1e3 ? `${(n / 1e3).toFixed(0)}K` : Math.round(n).toLocaleString();
const log10 = (u: number) => Math.log10(Math.max(1, u));

export default function SwapV1Page() {
  const mounted = useIsMounted();
  const { data: stats } = useStats();
  const { data: megaSettlements = [] } = useMegaSettlements();
  const { data: recentBuys = [] } = useRecentTrades({ kind: "buy", limit: 6 });
  const live = useLivePoolState();
  const megaPoolUsd = Number(live.megaPool) / USDC_1E6;
  const hourlyPoolUsd = Number(live.hourlyPool) / USDC_1E6;
  const ZERO_ADDR = "0x0000000000000000000000000000000000000000";
  const lastBuyerAddr = live.lastBuyer && live.lastBuyer !== ZERO_ADDR ? live.lastBuyer : null;
  const { address: rawAddress } = useAccount();
  // Gate wallet state behind mount to avoid SSR/CSR hydration mismatch on the
  // buy button's `disabled` prop. Server has no wallet ⇒ disabled=true ⇒ if we
  // expose the live address on first paint, the button flips to enabled and
  // React throws "Hydration failed".
  const address = mounted ? rawAddress : undefined;

  // Real "highest flipped tier" — pulled from indexer-tracked CardFlipped rows.
  // Single-pass max instead of sort()[0]: O(n) vs O(n log n), and skips the
  // intermediate filter array.
  const { data: flippedCards = [] } = useUserCards(address, { flipped: true });
  const highest = flippedCards.reduce<(typeof flippedCards)[number] | undefined>((best, c) => {
    if (c.tier == null || c.variant == null) return best;
    if (!best) return c;
    const t = (c.tier ?? 0) - (best.tier ?? 0);
    if (t > 0) return c;
    if (t === 0 && (c.variant ?? 0) > (best.variant ?? 0)) return c;
    return best;
  }, undefined);
  const buy = useBuyCaste();
  const [units, setUnits] = useState(12);
  const usdcIn = units * UNIT_USDC;
  const fee = usdcIn * 0.015;
  const swappable = usdcIn - fee;
  const casteOut = swappable * CASTE_PER_USDC;
  // Wave-3: 1 unit = 1 card. Capped only by the protocol-wide MAX_CARDS supply.
  // We over-credit on partial-mint so the supply bound dictates `willMint`.
  const cardsMintedNow = stats?.cardsMinted ?? 0;
  const cardsRemaining = Math.max(0, MAX_CARDS - cardsMintedNow);
  const willMint = Math.min(units, cardsRemaining);
  const willPartialMint = units > cardsRemaining;

  const nowSec = Math.floor(Date.now() / 1000);
  const currentEpoch = Math.floor(nowSec / HOURLY_SECONDS);
  const drawInSec = Math.max((currentEpoch + 1) * HOURLY_SECONDS - nowSec, 0);
  const drawMm = Math.floor(drawInSec / 60).toString().padStart(2, "0");
  const drawSs = (drawInSec % 60).toString().padStart(2, "0");

  const megaRound = megaSettlements.length + 1;
  const latestMega = megaSettlements[0];

  // Wave-3: your tickets so far this hour, derived from indexer entries +
  // current-epoch totalWeight on /api/caste/stats. We prefer the indexer's
  // `currentEpoch` (sourced from server-side floor(now/3600)) but fall back to
  // the local JS-side calc so the widget still renders before stats loads.
  const currentEpochBig = stats?.currentEpoch
    ? BigInt(stats.currentEpoch)
    : BigInt(currentEpoch);
  const currentEpochTotalWeight = stats?.currentEpochTotalWeight ?? 0;
  const { data: myTickets } = useHourlyEntries(currentEpochBig, address);
  const myTicketCount = myTickets?.total ?? 0;
  const winProbability = currentEpochTotalWeight > 0
    ? (myTicketCount / currentEpochTotalWeight) * 100
    : 0;

  const cardsMinted = cardsMintedNow;
  const bufferRemaining = stats ? Number(BigInt(stats.bufferRemaining) / ONE_E18) : 0;
  const bufferStart = stats ? Number(BigInt(stats.bufferStart) / ONE_E18) : 4_200_000_000;
  const flipsRemaining = stats ? Number(BigInt(stats.bufferRemaining) / (13_900n * ONE_E18)) : 0;
  const fomoLeft = stats?.fomoSecondsLeft ?? 0;
  const fomoHh = Math.floor(fomoLeft / 3600).toString().padStart(2, "0");
  const fomoMm = Math.floor((fomoLeft % 3600) / 60).toString().padStart(2, "0");
  const fomoSs = (fomoLeft % 60).toString().padStart(2, "0");

  const tickerItems = [
    { tag: "▸ PHASE A", text: `${cardsMinted.toLocaleString()} / 10,000 sealed cards minted · sell tax 25%`, color: "var(--blood-hi)" },
    { tag: "▸ BUFFER",  text: `${(bufferRemaining / 1e9).toFixed(2)}B / ${(bufferStart / 1e9).toFixed(1)}B CASTE · ~${(flipsRemaining / 1000).toFixed(0)}k flips remain`, color: "var(--gold-hi)" },
    { tag: "▸ FOMO",    text: `deadline ${fomoHh}:${fomoMm}:${fomoSs} → last buyer wins mega`, color: "var(--blood-hi)" },
  ];

  return (
    <div>
      <Ticker items={tickerItems} />

      <section style={{ padding: "28px 40px 12px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 40, flexWrap: "wrap" }}>
        <div>
          <div className="mono" style={{ fontSize: 11, letterSpacing: "0.3em", color: "var(--ink-600)", marginBottom: 8 }}>
            /CASTE/SWAP · QUIET MARKET BUY · SEALED CARDS APPEND
          </div>
          <h1 style={{ margin: 0, display: "flex", alignItems: "baseline", gap: 16, flexWrap: "wrap" }}>
            <span className="display" style={{ fontSize: 56, color: "var(--bone)", lineHeight: 1 }}>Buy In.</span>
            <span className="display" style={{ fontSize: 32, color: "var(--acid)" }}>/ TICKET, NOT REVEAL</span>
          </h1>
          <p style={{ fontSize: 15, color: "var(--ink-700)", maxWidth: 760, marginTop: 12, lineHeight: 1.55 }}>
            1 unit = <span className="led" style={{ color: "var(--bone)", fontSize: 16 }}>$6.66666</span>. Buy 1–100. You get the{" "}
            <strong style={{ color: "var(--bone)" }}>pure pool curve</strong> in $CASTE — no multiplier, no surprise. One{" "}
            <strong style={{ color: "var(--blood-hi)" }}>sealed card</strong> is minted per unit (capped at 10,000 protocol-wide); flip them on your own time.
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <div className="mono" style={{ fontSize: 10, color: "var(--ink-600)", letterSpacing: "0.2em", marginBottom: 4 }}>
            YOUR HIGHEST FLIPPED TIER
          </div>
          {highest ? (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "flex-end" }}>
                <TierBadge tier={highest.tier as number} variant={highest.variant as number} size="md" />
                <span className="mono" style={{ fontSize: 13, color: "var(--bone)" }}>#{highest.tokenId}</span>
              </div>
              <div className="mono" style={{ fontSize: 10, color: "var(--ink-700)", marginTop: 6, letterSpacing: "0.1em" }}>
                (drives V2 buffs — reserved interface)
              </div>
            </>
          ) : (
            <div className="mono" style={{ fontSize: 11, color: "var(--ink-700)", letterSpacing: "0.1em", lineHeight: 1.6 }}>
              {address ? (
                <>
                  — no flipped cards yet —<br />
                  <Link href="/mycards" style={{ color: "var(--acid)", textDecoration: "none" }}>→ FLIP YOUR SEALED CARDS</Link>
                </>
              ) : (
                <>connect wallet to see your top flip</>
              )}
            </div>
          )}
        </div>
      </section>

      <section style={{ padding: "14px 40px 24px", display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 28, alignItems: "flex-start" }}>
        <div style={{ border: "1px solid var(--ink-400)", borderRadius: 8, background: "var(--ink-200)", padding: 24, display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "flex", borderBottom: "1px solid var(--ink-400)" }}>
            <div style={{ padding: "10px 18px", fontFamily: "var(--f-display)", fontSize: 14, color: "var(--acid)", borderBottom: "2px solid var(--acid)", marginBottom: -1, letterSpacing: "0.1em" }}>
              BUY
            </div>
            <Link href="/sell" style={{ padding: "10px 18px", fontFamily: "var(--f-display)", fontSize: 14, color: "var(--blood-hi)", textDecoration: "none", letterSpacing: "0.1em" }}>
              SELL · 25%
            </Link>
          </div>

          <UnitStepper units={units} onChange={setUnits} />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ padding: 14, background: "var(--ink-100)", border: "1px solid var(--ink-400)", borderRadius: 4 }}>
              <div className="mono" style={{ fontSize: 9, color: "var(--ink-600)", letterSpacing: "0.2em" }}>YOU PAY · USDC</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 4 }}>
                <div className="led" style={{ fontSize: 32, color: "var(--bone)" }}>${fmt(usdcIn)}</div>
                <div className="mono" style={{ fontSize: 10, color: "var(--ink-700)" }}>= {units} × $6.66666</div>
              </div>
            </div>
            <div style={{ padding: 14, background: "linear-gradient(135deg, oklch(0.20 0.06 115 / 0.4), var(--ink-100))", border: "1px solid var(--acid-lo)", borderRadius: 4 }}>
              <div className="mono" style={{ fontSize: 9, color: "var(--ink-600)", letterSpacing: "0.2em" }}>YOU GET · $CASTE (CURVE)</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 4 }}>
                <div className="led" style={{ fontSize: 32, color: "var(--acid)" }}>{fmtCaste(casteOut)}</div>
                <div className="mono" style={{ fontSize: 10, color: "var(--bone-dim)" }}>· no roll, no bonus</div>
              </div>
            </div>
          </div>

          <div style={{ padding: 12, background: "var(--ink-100)", border: "1px dashed var(--ink-400)", borderRadius: 3, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
            {([
              ["pool curve", fmtCaste(casteOut), "var(--acid)"],
              ["1.5% fee", `−$${fmt(fee)}`, "var(--blood-hi)"],
              ["sealed cards", `+${willMint}`, "var(--bone)"],
              ["price impact", "0.04%", "var(--ink-700)"],
            ] as const).map(([l, v, c]) => (
              <div key={l}>
                <div className="mono" style={{ fontSize: 8, color: "var(--ink-600)", letterSpacing: "0.15em" }}>{l.toUpperCase()}</div>
                <div className="mono" style={{ fontSize: 12, color: c, marginTop: 2 }}>{v}</div>
              </div>
            ))}
          </div>

          <button type="button"
            disabled={!address || buy.isPending}
            onClick={() => buy.mutate({ units })}
            style={{
              padding: "20px 0",
              background: !address || buy.isPending ? "var(--ink-300)" : "var(--acid)",
              color: !address || buy.isPending ? "var(--ink-600)" : "var(--ink-000)",
              fontFamily: "var(--f-display)",
              fontSize: 18,
              letterSpacing: "0.12em",
              border: "none",
              borderRadius: 4,
              boxShadow: !address || buy.isPending ? "none" : "0 6px 0 var(--acid-lo), 0 16px 32px oklch(0.90 0.20 115 / 0.35)",
              cursor: !address || buy.isPending ? "not-allowed" : "pointer",
            }}
          >
            {!address
              ? "CONNECT WALLET TO BUY"
              : buy.isPending
              ? "BUYING…"
              : `BUY ${units} UNITS · $${fmt(usdcIn)} → ${fmtCaste(casteOut)} CASTE + ${willMint} SEALED`}
          </button>
          {buy.isError && (
            <div className="mono" style={{ fontSize: 11, color: "var(--blood-hi)", letterSpacing: "0.05em", textAlign: "center", padding: 8, border: "1px dashed var(--blood-lo)", borderRadius: 4 }}>
              ✗ {buy.error?.message ?? "tx failed"}
            </div>
          )}
          {buy.isSuccess && (
            <div className="mono" style={{ fontSize: 11, color: "var(--jade)", letterSpacing: "0.05em", textAlign: "center", padding: 8, border: "1px dashed var(--jade)", borderRadius: 4 }}>
              ✓ buy confirmed at block {buy.data.blockNumber.toString()}
            </div>
          )}
          <div className="mono" style={{ fontSize: 10, color: "var(--ink-600)", letterSpacing: "0.15em", textAlign: "center" }}>
            ▸ executes in 1 tx · no multiplier roll · flip cards anytime from /mycards
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <SealedPreview units={units} willMint={willMint} willPartialMint={willPartialMint} />
          <FeeAndFomo units={units} usdcIn={usdcIn} />
        </div>
      </section>

      <section style={{ padding: "14px 40px 22px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 14 }}>
          <span className="display" style={{ fontSize: 24, color: "var(--bone)" }}>Last Buyer Status</span>
          <span className="mono" style={{ fontSize: 11, color: "var(--ink-700)", letterSpacing: "0.15em" }}>
            · BOTH POOLS SETTLE TO LASTBUYER (V1 simplification)
          </span>
          <div style={{ flex: 1, height: 1, background: "var(--ink-400)" }} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div style={{ position: "relative", padding: 22, border: "1px solid var(--gold-hi)", borderRadius: 8, background: "linear-gradient(135deg, oklch(0.20 0.08 82 / 0.4), var(--ink-200))", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, var(--gold-hi), var(--gold), var(--gold-hi))" }} />
            <div className="mono" style={{ fontSize: 10, color: "var(--gold-hi)", letterSpacing: "0.25em", marginBottom: 6 }}>
              MEGA POOL · ROUND {megaRound.toString().padStart(2, "0")}
            </div>
            <div className="led" style={{ fontSize: 46, color: "var(--gold-hi)", textShadow: "0 0 18px var(--gold)" }}>
              ${megaPoolUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </div>
            {lastBuyerAddr ? (
              <div className="mono" style={{ fontSize: 10, color: "var(--gold-hi)", marginTop: 6, letterSpacing: "0.1em" }}>
                ★ KING · <strong>{shortAddr(lastBuyerAddr)}</strong>{lastBuyerAddr.toLowerCase() === address?.toLowerCase() && " (YOU)"}
              </div>
            ) : (
              <div className="mono" style={{ fontSize: 9, color: "var(--ink-700)", letterSpacing: "0.12em", marginTop: 4 }}>
                ▸ no buyer yet — be first to claim lastBuyer
              </div>
            )}
            <div className="mono" style={{ fontSize: 10, color: "var(--ink-700)", marginTop: 10, letterSpacing: "0.05em", lineHeight: 1.6 }}>
              ▸ If FOMO countdown hits 0 with no buy after the current lastBuyer, the entire mega pool transfers to them.
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 12 }}>
              <span className="mono" style={{ fontSize: 9, color: "var(--ink-600)", letterSpacing: "0.18em" }}>COUNTDOWN</span>
              <span className="led" style={{ fontSize: 22, color: "var(--blood-hi)" }}>
                {fomoHh}:{fomoMm}:{fomoSs}
              </span>
            </div>
            {latestMega && (
              <div className="mono" style={{ fontSize: 9, color: "var(--ink-700)", marginTop: 10 }}>
                last mega: {shortAddr(latestMega.winner)} · ${(Number(BigInt(latestMega.prize)) / USDC_1E6).toLocaleString(undefined, { maximumFractionDigits: 2 })} · {fmtAgoSec(nowSec - Number(latestMega.blockTime))} ago
              </div>
            )}
          </div>

          <div style={{ padding: 22, border: "1px solid var(--ink-400)", borderRadius: 8, background: "var(--ink-200)" }}>
            <div className="mono" style={{ fontSize: 10, color: "var(--jade)", letterSpacing: "0.25em", marginBottom: 6 }}>
              THIS HOUR&apos;S POOL · epoch {currentEpoch}
            </div>
            <div className="led" style={{ fontSize: 46, color: "var(--jade)" }}>${hourlyPoolUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
            {address && (
              <div
                className="mono"
                style={{
                  fontSize: 10,
                  color: "var(--jade)",
                  marginTop: 8,
                  letterSpacing: "0.1em",
                  padding: "6px 8px",
                  background: "oklch(0.20 0.08 155 / 0.18)",
                  border: "1px dashed var(--jade)",
                  borderRadius: 3,
                }}
              >
                YOUR TICKETS THIS HOUR · <strong style={{ color: "var(--bone)" }}>{myTicketCount}</strong>
                {" / "}
                {currentEpochTotalWeight}
                {currentEpochTotalWeight > 0 && (
                  <>
                    {" · "}
                    <span style={{ color: "var(--acid)" }}>{winProbability.toFixed(1)}% odds</span>
                  </>
                )}
              </div>
            )}
            <div className="mono" style={{ fontSize: 10, color: "var(--ink-700)", marginTop: 10, letterSpacing: "0.05em", lineHeight: 1.6 }}>
              ▸ Every buy logs a weighted ticket for this epoch. Auto-settles on the next buy after the hour rolls — winner drawn proportional to tickets.<br />
              ▸ Settles in {drawMm}:{drawSs}.
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "10px 40px 24px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 14 }}>
          <span className="display" style={{ fontSize: 22, color: "var(--bone)" }}>Recent Buys</span>
          <span className="mono" style={{ fontSize: 11, color: "var(--ink-700)", letterSpacing: "0.15em" }}>
            · live PoolManager.Swap feed
          </span>
          <div style={{ flex: 1, height: 1, background: "var(--ink-400)" }} />
        </div>
        <div style={{ border: "1px solid var(--ink-400)", borderRadius: 6, background: "var(--ink-200)", padding: 18 }}>
          {recentBuys.length === 0 && (
            <div className="mono" style={{ fontSize: 11, color: "var(--ink-700)", padding: "16px 0", textAlign: "center" }}>
              — no buys yet · be the first —
            </div>
          )}
          {recentBuys.map((t) => {
            const usdc = Number(BigInt(t.usdcAmount)) / USDC_1E6;
            const caste = Number(BigInt(t.casteAmount)) / 1e18;
            const ts = Number(t.blockTime);
            return (
              <div key={t.id} style={{ display: "grid", gridTemplateColumns: "60px 1fr auto auto", gap: 12, alignItems: "center", padding: "8px 0", borderBottom: "1px dashed var(--ink-400)" }}>
                <span className="mono" style={{ fontSize: 10, color: "var(--ink-700)" }}>−{fmtAgoSec(nowSec - ts)}</span>
                <span className="mono" style={{ fontSize: 11, color: "var(--bone-dim)" }}>{shortAddr(t.sender)}</span>
                <span className="mono" style={{ fontSize: 11, color: "var(--ink-700)" }}>−${usdc.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                <span className="led" style={{ fontSize: 14, color: "var(--acid)" }}>+{caste >= 1e6 ? `${(caste / 1e6).toFixed(2)}M` : caste >= 1e3 ? `${(caste / 1e3).toFixed(1)}K` : Math.round(caste).toLocaleString()}</span>
              </div>
            );
          })}
        </div>
      </section>

      <Footer />
    </div>
  );
}

const stepBtn: React.CSSProperties = {
  background: "var(--ink-300)",
  border: "1px solid var(--ink-400)",
  color: "var(--acid)",
  fontFamily: "var(--f-display)",
  fontSize: 28,
  borderRadius: 4,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

function UnitStepper({ units, onChange }: { units: number; onChange?: (u: number) => void }) {
  const presets = [1, 4, 10, 25, 50, 100];
  const setUnits = (u: number) => onChange?.(Math.max(1, Math.min(100, u)));
  return (
    <div style={{ border: "1px solid var(--ink-400)", borderRadius: 6, background: "var(--ink-100)", padding: "20px 22px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
        <span className="mono" style={{ fontSize: 10, letterSpacing: "0.25em", color: "var(--ink-600)" }}>
          UNITS · 1 UNIT = $6.66666
        </span>
        <span className="mono" style={{ fontSize: 10, color: "var(--ink-600)" }}>range 1–100</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "56px 1fr 56px", gap: 14, alignItems: "stretch" }}>
        <button type="button" style={stepBtn} onClick={() => setUnits(units - 1)} aria-label="decrement">−</button>
        <div style={{ textAlign: "center", padding: "6px 0", background: "var(--ink-000)", border: "1px solid var(--ink-400)", borderRadius: 4 }}>
          <div className="led" style={{ fontSize: 56, color: "var(--acid)", lineHeight: 1, textShadow: "0 0 16px oklch(0.90 0.20 115 / 0.45)" }}>
            {units}
          </div>
          <div className="mono" style={{ fontSize: 10, letterSpacing: "0.35em", color: "var(--ink-600)", marginTop: 4 }}>UNITS</div>
        </div>
        <button type="button" style={stepBtn} onClick={() => setUnits(units + 1)} aria-label="increment">+</button>
      </div>

      <div style={{ marginTop: 18, position: "relative" }}>
        <div style={{ height: 8, background: "var(--ink-300)", borderRadius: 4, border: "1px solid var(--ink-400)", overflow: "hidden", position: "relative" }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${units}%`, background: "linear-gradient(90deg, var(--acid-lo), var(--acid))" }} />
        </div>
        <div style={{ position: "absolute", top: 2, left: `${units}%`, transform: "translate(-50%, -2px)", width: 14, height: 16, background: "var(--acid)", borderRadius: 2, boxShadow: "0 0 10px var(--acid)", border: "1px solid var(--ink-000)" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
        <span className="mono" style={{ fontSize: 9, color: "var(--ink-600)" }}>1</span>
        <span className="mono" style={{ fontSize: 9, color: "var(--blood-hi)" }}>↑ 1 unit = 1 sealed card</span>
        <span className="mono" style={{ fontSize: 9, color: "var(--ink-600)" }}>100 max</span>
      </div>

      <div style={{ display: "flex", gap: 6, marginTop: 16 }}>
        {presets.map((p) => (
          <button type="button"
            key={p}
            onClick={() => setUnits(p)}
            style={{
              flex: 1,
              padding: "8px 0",
              background: p === units ? "var(--acid)" : "var(--ink-300)",
              color: p === units ? "var(--ink-000)" : "var(--ink-700)",
              border: `1px solid ${p === units ? "var(--acid)" : "var(--ink-400)"}`,
              fontFamily: "var(--f-mono)",
              fontSize: 11,
              letterSpacing: "0.1em",
              borderRadius: 3,
              cursor: "pointer",
            }}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}

function SealedPreview({
  units,
  willMint,
  willPartialMint,
}: {
  units: number;
  willMint: number;
  willPartialMint: boolean;
}) {
  // Cap the visual stack so we don't render hundreds of overlapping cards.
  const visualCount = Math.min(willMint, 6);
  return (
    <div style={{ border: "1px solid var(--ink-400)", borderRadius: 6, background: "var(--ink-200)", padding: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
        <span className="mono" style={{ fontSize: 10, letterSpacing: "0.25em", color: "var(--ink-600)" }}>
          YOU&apos;LL RECEIVE · SEALED CARDS
        </span>
        <span className="mono" style={{ fontSize: 9, color: "var(--blood-hi)", letterSpacing: "0.15em" }}>
          FLIP LATER FROM /MYCARDS
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 18, alignItems: "center" }}>
        <div style={{ position: "relative", width: 130, height: 130 }}>
          {/* purely visual placeholder stack, no stable id — index is OK */}
          {Array.from({ length: visualCount }).map((_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: i * 10,
                top: i * 8,
                width: 80,
                height: 112,
                background: "linear-gradient(160deg, var(--ink-300), var(--ink-100))",
                border: "1px solid var(--ink-500)",
                borderRadius: 4,
                boxShadow: "0 6px 14px oklch(0 0 0 / 0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div className="halftone" style={{ position: "absolute", inset: 0, opacity: 0.3, borderRadius: 4 }} />
              <span className="display" style={{ fontSize: 36, color: "oklch(1 0 0 / 0.4)" }}>?</span>
              <div
                style={{
                  position: "absolute",
                  top: 4,
                  left: 4,
                  padding: "1px 4px",
                  background: "var(--blood)",
                  color: "var(--bone)",
                  fontFamily: "var(--f-mono)",
                  fontSize: 6,
                  letterSpacing: "0.15em",
                }}
              >
                SEALED
              </div>
            </div>
          ))}
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span className="led" style={{ fontSize: 40, color: "var(--bone)", lineHeight: 1 }}>
              {willMint}
            </span>
            <span className="display" style={{ fontSize: 16, color: "var(--bone-dim)", letterSpacing: "0.05em" }}>
              sealed card{willMint === 1 ? "" : "s"} minted
            </span>
          </div>
          <div className="mono" style={{ fontSize: 10, color: "var(--ink-700)", marginTop: 8, lineHeight: 1.6 }}>
            ▸ <strong style={{ color: "var(--bone)" }}>No attributes</strong> until you flip — same look as everyone else&apos;s cover.<br />
            ▸ Flip later (any block ≥ commit + 2). Payout from buffer, sent same tx.<br />
            {willPartialMint ? (
              <span style={{ color: "var(--blood-hi)" }}>
                ▸ Supply cap nearly reached — {willMint} of {units} units will mint a card. Excess units still buy CASTE.
              </span>
            ) : (
              <span>▸ 1 unit = 1 sealed card (capped at {MAX_CARDS.toLocaleString()} protocol-wide).</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FeeAndFomo({ units, usdcIn }: { units: number; usdcIn: number }) {
  const fee = usdcIn * 0.015;
  const toHourly = usdcIn * 0.01;
  const toMega = usdcIn * 0.005;
  const fomoAdd = Math.round(60 * log10(units) * 10) / 10;

  return (
    <div style={{ border: "1px solid var(--ink-400)", borderRadius: 6, background: "var(--ink-200)", padding: 18 }}>
      <div className="mono" style={{ fontSize: 10, letterSpacing: "0.25em", color: "var(--ink-600)", marginBottom: 12 }}>
        FEE + FOMO IMPACT
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <span className="display" style={{ fontSize: 26, color: "var(--bone)" }}>1.5%</span>
        <span className="mono" style={{ fontSize: 10, color: "var(--ink-700)" }}>buy fee · ${fmt(fee)}</span>
        <div style={{ flex: 1, height: 8, display: "flex", border: "1px solid var(--ink-400)", borderRadius: 2, overflow: "hidden" }}>
          <div style={{ flex: 2, background: "var(--jade)" }} />
          <div style={{ flex: 1, background: "var(--gold-hi)" }} />
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ borderLeft: "2px solid var(--jade)", paddingLeft: 10 }}>
          <div className="mono" style={{ fontSize: 9, color: "var(--ink-600)", letterSpacing: "0.15em" }}>1.0% → HOURLY · lastBuyer wins</div>
          <div className="led" style={{ fontSize: 18, color: "var(--jade)" }}>${fmt(toHourly)}</div>
        </div>
        <div style={{ borderLeft: "2px solid var(--gold-hi)", paddingLeft: 10 }}>
          <div className="mono" style={{ fontSize: 9, color: "var(--ink-600)", letterSpacing: "0.15em" }}>0.5% → MEGA · last on FOMO=0</div>
          <div className="led" style={{ fontSize: 18, color: "var(--gold-hi)" }}>${fmt(toMega)}</div>
        </div>
      </div>
      <div
        style={{
          marginTop: 14,
          padding: 10,
          background: "oklch(0.18 0.06 25 / 0.18)",
          border: "1px solid var(--blood-lo)",
          borderRadius: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span className="mono" style={{ fontSize: 10, color: "var(--blood-hi)", letterSpacing: "0.2em" }}>▸ FOMO DEADLINE</span>
        <span style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
          <span className="led" style={{ fontSize: 22, color: "var(--blood-hi)" }}>+{fomoAdd}s</span>
          <span className="mono" style={{ fontSize: 9, color: "var(--ink-700)" }}>= 60 × log10({units})</span>
        </span>
      </div>
      <div className="mono" style={{ fontSize: 9, color: "var(--ink-700)", marginTop: 10, letterSpacing: "0.05em", lineHeight: 1.6 }}>
        ▸ <strong style={{ color: "var(--bone)" }}>Each buy makes YOU the lastBuyer</strong> of this epoch (hourly) and globally (mega).<br />
        ▸ Buy more → push the deadline further. Be the last → win the pot.
      </div>
    </div>
  );
}


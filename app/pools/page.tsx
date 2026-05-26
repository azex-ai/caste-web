"use client";

import { Ticker, Footer } from "@/components/caste/caste-chrome";
import { Countdown } from "@/components/caste/countdown-clock";
import { useStats, useHourlyEpochs, useMegaSettlements, useLivePoolState } from "@/lib/caste/hooks";

const ONE_E18 = 10n ** 18n;
const USDC_1E6 = 1_000_000;
const HOURLY_SECONDS = 3600;

function shortAddr(a?: string | null): string {
  if (!a || a.length < 12) return a ?? "—";
  return `${a.slice(0, 6)}…${a.slice(-4)}`;
}

function fmtAgo(tsSec: number, nowSec: number): string {
  const d = nowSec - tsSec;
  if (d < 60) return `${Math.max(d, 0)}s`;
  if (d < 3600) return `${Math.floor(d / 60)}m`;
  if (d < 86400) return `${Math.floor(d / 3600)}h`;
  return `${Math.floor(d / 86400)}d`;
}

export default function PoolsV1Page() {
  const { data: stats } = useStats();
  const { data: hourlyEpochs = [] } = useHourlyEpochs(5);
  const { data: megaSettlements = [] } = useMegaSettlements();
  const live = useLivePoolState();
  const megaPoolUsd = Number(live.megaPool) / USDC_1E6;
  const hourlyPoolUsd = Number(live.hourlyPool) / USDC_1E6;
  const ZERO_ADDR = "0x0000000000000000000000000000000000000000";
  const lastBuyerAddr = live.lastBuyer && live.lastBuyer !== ZERO_ADDR ? live.lastBuyer : null;
  const epochLastBuyerAddr = live.epochLastBuyer && live.epochLastBuyer !== ZERO_ADDR ? live.epochLastBuyer : null;

  const nowSec = Math.floor(Date.now() / 1000);
  const currentEpoch = Math.floor(nowSec / HOURLY_SECONDS);
  const nextDraw = (currentEpoch + 1) * HOURLY_SECONDS;
  const drawInSec = Math.max(nextDraw - nowSec, 0);
  const drawMm = Math.floor(drawInSec / 60).toString().padStart(2, "0");
  const drawSs = (drawInSec % 60).toString().padStart(2, "0");

  const bufferRemaining = stats ? Number(BigInt(stats.bufferRemaining) / ONE_E18) : 0;
  const bufferStart = stats ? Number(BigInt(stats.bufferStart) / ONE_E18) : 4_200_000_000;
  const bufferDrained = stats ? Number(BigInt(stats.bufferPaid) / ONE_E18) : 0;
  const bufferPct = bufferStart > 0 ? (bufferRemaining / bufferStart) * 100 : 0;
  const flipsExecuted = stats?.cardsFlipped ?? 0;
  // ~13.9k CASTE / flip avg payout used to estimate remaining capacity.
  const flipsRemaining = stats ? Number(BigInt(stats.bufferRemaining) / (13_900n * ONE_E18)) : 0;
  const avgPayoutCaste = flipsExecuted > 0 ? bufferDrained / flipsExecuted : 13_900;
  const fomoLeft = stats?.fomoSecondsLeft ?? 0;
  const fomoHh = Math.floor(fomoLeft / 3600).toString().padStart(2, "0");
  const fomoMm = Math.floor((fomoLeft % 3600) / 60).toString().padStart(2, "0");
  const fomoSs = (fomoLeft % 60).toString().padStart(2, "0");
  const fomoState: "calm" | "warning" | "critical" =
    fomoLeft <= 0 ? "critical" : fomoLeft < 60 * 5 ? "warning" : "calm";

  const megaRound = megaSettlements.length;
  const latestMega = megaSettlements[0];
  const latestEpoch = hourlyEpochs[0];
  const rolledOver = latestEpoch?.status === "rolledOver" ? Number(BigInt(latestEpoch.prize)) / USDC_1E6 : 0;

  const tickerItems = [
    { tag: "▸ BUFFER", text: `${(bufferRemaining / 1e9).toFixed(2)}B CASTE · ${flipsExecuted.toLocaleString()} flips paid · ~${(flipsRemaining / 1000).toFixed(0)}k left`, color: "var(--orchid)" },
    { tag: "▸ FOMO",   text: `mega deadline ${fomoHh}:${fomoMm}:${fomoSs}`, color: "var(--gold-hi)" },
    { tag: "▸ CARDS",  text: `${(stats?.cardsMinted ?? 0).toLocaleString()} / 10,000 minted · ${(stats?.mythicCount ?? 0)} mythic flips`, color: "var(--jade)" },
  ];

  return (
    <div>
      <Ticker items={tickerItems} />

      <section style={{ padding: "44px 60px 16px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 40, flexWrap: "wrap" }}>
        <div>
          <div className="mono" style={{ fontSize: 11, letterSpacing: "0.3em", color: "var(--ink-600)", marginBottom: 8 }}>/CASTE/POOLS · 4-POOL ARCHITECTURE</div>
          <h1 style={{ margin: 0 }}>
            <span className="display" style={{ fontSize: 80, color: "var(--bone)", lineHeight: 1 }}>The Four Pools.</span>
          </h1>
          <p style={{ fontSize: 15, color: "var(--ink-700)", maxWidth: 820, marginTop: 12, lineHeight: 1.65 }}>
            V1 collapses the old five-bucket fee model into <strong style={{ color: "var(--bone)" }}>four pools, two flows</strong>:
            <strong style={{ color: "var(--cobalt)" }}> LP</strong> + <strong style={{ color: "var(--orchid)" }}>Card Buffer</strong> hold the token supply;
            <strong style={{ color: "var(--jade)" }}> Hourly</strong> + <strong style={{ color: "var(--gold-hi)" }}>Mega</strong> hold the USDC from buy/sell fees.
            Both lotteries pay the <strong style={{ color: "var(--acid)" }}>lastBuyer</strong> — no tickets, no weights.
          </p>
        </div>
        <div className="chip chip--gold" style={{ fontSize: 12, padding: "8px 16px" }}>
          EPOCH {currentEpoch.toLocaleString()}
        </div>
      </section>

      <section style={{ padding: "20px 60px 28px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 14 }}>
          <PoolSummaryCard color="var(--cobalt)"  label="01 · LP"          value="16.8B"                                                       subValue="USDC fill from chain" meta="single-sided · permanent · JIT-locked 64 blk · live read pending" emoji="LP" />
          <PoolSummaryCard color="var(--orchid)"  label="02 · CARD BUFFER" value={`${(bufferRemaining / 1e9).toFixed(2)}B`}                    subValue={`${bufferPct.toFixed(1)}% remaining`}      meta="one-way drain · flip payouts only" emoji="BUF" />
          <PoolSummaryCard color="var(--jade)"    label="03 · HOURLY"      value={`$${hourlyPoolUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })}`} subValue={`epoch ${currentEpoch}`}                  meta="→ lastBuyer · settles every hour" emoji="HR" />
          <PoolSummaryCard color="var(--gold-hi)" label="04 · MEGA"        value={`$${megaPoolUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}   subValue={`FOMO ${fomoHh}:${fomoMm}:${fomoSs}`}      meta="→ lastBuyer · settles at deadline" emoji="★" />
        </div>
      </section>

      <section style={{ padding: "12px 60px 24px" }}>
        <div style={{ position: "relative", padding: "32px 36px", borderRadius: 8, background: "linear-gradient(135deg, oklch(0.20 0.10 82) 0%, oklch(0.08 0.02 60) 100%)", border: "1px solid var(--gold)", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg, var(--gold-hi), var(--gold), var(--gold-hi))" }} />
          <div className="halftone" style={{ position: "absolute", inset: 0, opacity: 0.12 }} />

          <div style={{ position: "relative", display: "grid", gridTemplateColumns: "1.5fr auto 1fr", gap: 36, alignItems: "center" }}>
            <div>
              <div className="mono" style={{ fontSize: 11, color: "var(--gold-hi)", letterSpacing: "0.3em", marginBottom: 6 }}>
                ★ MEGA POOL · ROUND {(megaRound + 1).toString().padStart(2, "0")}
              </div>
              <div className="display" style={{ fontSize: 14, color: "var(--ink-700)", letterSpacing: "0.15em", marginBottom: 6 }}>
                WHOEVER BUYS LAST AT DEADLINE-ZERO TAKES IT ALL
              </div>
              <div className="led" style={{ fontSize: 128, color: "var(--gold-hi)", lineHeight: 0.85, textShadow: "var(--glow-gold)" }}>
                ${megaPoolUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </div>
              <div className="mono" style={{ fontSize: 11, color: "var(--bone-dim)", marginTop: 10 }}>
                inflow: 0.5% of buys · 8.33% of Phase A sells · cap 24h from last buy
              </div>

              {lastBuyerAddr && (
                <div style={{ marginTop: 14, padding: 14, background: "oklch(0.18 0.10 60 / 0.25)", border: "1px solid var(--gold-hi)", borderRadius: 4 }}>
                  <div className="mono" style={{ fontSize: 10, color: "var(--gold-hi)", letterSpacing: "0.25em", marginBottom: 4 }}>
                    CURRENT LASTBUYER · KING
                  </div>
                  <div className="display" style={{ fontSize: 22, color: "var(--bone)" }}>
                    {shortAddr(lastBuyerAddr)}
                  </div>
                  <div className="mono" style={{ fontSize: 10, color: "var(--bone-dim)", marginTop: 4 }}>
                    wins entire mega pool if FOMO deadline reaches 0
                  </div>
                </div>
              )}

              <div style={{ marginTop: 14, padding: 14, background: "oklch(0 0 0 / 0.3)", border: "1px dashed var(--gold-hi)", borderRadius: 4 }}>
                <div className="mono" style={{ fontSize: 10, color: "var(--gold-hi)", letterSpacing: "0.25em", marginBottom: 4 }}>
                  LAST MEGA WINNER · PRIOR ROUND
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span className="display" style={{ fontSize: 22, color: "var(--bone)" }}>
                    {latestMega ? shortAddr(latestMega.winner) : "— none yet —"}
                  </span>
                  {latestMega && (
                    <span className="mono" style={{ fontSize: 11, color: "var(--bone-dim)" }}>
                      ${(Number(BigInt(latestMega.prize)) / USDC_1E6).toLocaleString(undefined, { maximumFractionDigits: 2 })} · {fmtAgo(Number(latestMega.blockTime), nowSec)} ago
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div style={{ width: 1, alignSelf: "stretch", background: "linear-gradient(180deg, transparent, var(--gold), transparent)" }} />
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
              <Countdown hh={fomoHh} mm={fomoMm} ss={fomoSs} state={fomoState} label="FOMO DEADLINE" />
              <div className="mono" style={{ fontSize: 9, color: "var(--ink-700)", letterSpacing: "0.15em", textAlign: "center", lineHeight: 1.6 }}>
                +60s × log10(units) per buy<br />
                cap = NOW + 24h
              </div>
              <button
                disabled
                style={{
                  padding: "14px 26px",
                  background: "var(--ink-300)",
                  color: "var(--ink-600)",
                  border: "1px solid var(--ink-500)",
                  borderRadius: 4,
                  fontFamily: "var(--f-display)",
                  fontSize: 12,
                  letterSpacing: "0.15em",
                  cursor: "not-allowed",
                }}
              >
                settleMega() · LOCKED
              </button>
              <div className="mono" style={{ fontSize: 9, color: "var(--ink-600)", letterSpacing: "0.1em", textAlign: "center" }}>
                unlocks at 00:00:00
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "20px 60px 28px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>
        <div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 18 }}>
            <span className="display" style={{ fontSize: 32, color: "var(--bone)" }}>Card Buffer</span>
            <span className="mono" style={{ fontSize: 11, color: "var(--orchid)", letterSpacing: "0.2em" }}>· ONE-WAY DRAIN</span>
            <div style={{ flex: 1, height: 1, background: "var(--ink-400)" }} />
          </div>
          <div style={{ padding: 24, border: "1px solid var(--orchid)", borderRadius: 8, background: "linear-gradient(135deg, oklch(0.22 0.12 320 / 0.18), var(--ink-200))" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 14 }}>
              <div>
                <div className="mono" style={{ fontSize: 10, color: "var(--orchid)", letterSpacing: "0.25em", marginBottom: 4 }}>
                  REMAINING · OF 4.2B INITIAL
                </div>
                <div className="led" style={{ fontSize: 52, color: "var(--bone)", lineHeight: 0.9 }}>
                  {(bufferRemaining / 1e9).toFixed(2)}B
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div className="mono" style={{ fontSize: 10, color: "var(--ink-600)", letterSpacing: "0.2em" }}>DRAINED LIFETIME</div>
                <div className="led" style={{ fontSize: 32, color: "var(--orchid)" }}>{(bufferDrained / 1e6).toFixed(0)}M</div>
                <div className="mono" style={{ fontSize: 9, color: "var(--ink-700)" }}>
                  {flipsExecuted.toLocaleString()} flips · avg {(avgPayoutCaste / 1000).toFixed(1)}k / flip
                </div>
              </div>
            </div>

            <div style={{ position: "relative", height: 22, background: "var(--ink-300)", borderRadius: 2, overflow: "hidden", border: "1px solid var(--ink-400)" }}>
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  left: 0,
                  width: `${100 - bufferPct}%`,
                  background:
                    "repeating-linear-gradient(45deg, oklch(0.20 0.10 320 / 0.4), oklch(0.20 0.10 320 / 0.4) 6px, transparent 6px, transparent 12px)",
                }}
              />
              <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: `${100 - bufferPct}%`, borderRight: "2px solid var(--orchid)" }} />
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span className="mono" style={{ fontSize: 10, color: "var(--bone)", letterSpacing: "0.15em" }}>
                  {bufferPct.toFixed(2)}% LEFT
                </span>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 14, padding: 12, background: "var(--ink-100)", borderRadius: 4, border: "1px dashed var(--ink-400)" }}>
              <div>
                <div className="mono" style={{ fontSize: 9, color: "var(--ink-600)", letterSpacing: "0.2em" }}>EST. FLIPS LEFT</div>
                <div className="led" style={{ fontSize: 24, color: "var(--orchid)", marginTop: 2 }}>
                  {(flipsRemaining / 1000).toFixed(0)}k
                </div>
              </div>
              <div>
                <div className="mono" style={{ fontSize: 9, color: "var(--ink-600)", letterSpacing: "0.2em" }}>BUFFER POLICY</div>
                <div className="mono" style={{ fontSize: 10, color: "var(--bone-dim)", lineHeight: 1.5, marginTop: 2 }}>
                  on deplete: payout capped + <code>BufferDepleted</code> event emitted
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 18 }}>
            <span className="display" style={{ fontSize: 32, color: "var(--bone)" }}>Hourly · lastBuyer</span>
            <span className="mono" style={{ fontSize: 11, color: "var(--jade)", letterSpacing: "0.2em" }}>· EPOCH {currentEpoch}</span>
            <div style={{ flex: 1, height: 1, background: "var(--ink-400)" }} />
          </div>
          <div style={{ padding: 24, border: "1px solid var(--jade)", borderRadius: 8, background: "linear-gradient(135deg, oklch(0.20 0.08 155 / 0.18), var(--ink-200))" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
              <div>
                <div className="mono" style={{ fontSize: 10, color: "var(--jade)", letterSpacing: "0.25em" }}>THIS HOUR · POOL</div>
                <div className="led" style={{ fontSize: 48, color: "var(--bone)", lineHeight: 0.9, marginTop: 6 }}>
                  ${hourlyPoolUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </div>
                <div className="mono" style={{ fontSize: 10, color: "var(--ink-700)", marginTop: 4 }}>inflow: 1% of buys · 16.67% of Phase A sells</div>
                {epochLastBuyerAddr && (
                  <div className="mono" style={{ fontSize: 10, color: "var(--jade)", marginTop: 6 }}>
                    epoch lastBuyer: <strong>{shortAddr(epochLastBuyerAddr)}</strong>
                  </div>
                )}
              </div>
              <div style={{ textAlign: "right" }}>
                <div className="mono" style={{ fontSize: 10, color: "var(--ink-600)", letterSpacing: "0.25em" }}>DRAWS IN</div>
                <div className="led" style={{ fontSize: 40, color: "var(--gold-hi)", lineHeight: 0.9, marginTop: 6 }}>
                  {drawMm}:{drawSs}
                </div>
                <button
                  style={{
                    marginTop: 8,
                    padding: "6px 14px",
                    background: "transparent",
                    color: "var(--jade)",
                    border: "1px solid var(--jade)",
                    fontFamily: "var(--f-mono)",
                    fontSize: 10,
                    letterSpacing: "0.15em",
                    borderRadius: 3,
                    cursor: "pointer",
                  }}
                >
                  settleHourly(epoch) at draw
                </button>
              </div>
            </div>

            <div style={{ borderTop: "1px dashed var(--jade)", paddingTop: 14 }}>
              <div className="mono" style={{ fontSize: 10, color: "var(--ink-700)", letterSpacing: "0.2em", marginBottom: 10 }}>
                RECENT HOURLY SETTLEMENTS · LAST 5 EPOCHS
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {hourlyEpochs.length === 0 && (
                  <div className="mono" style={{ fontSize: 11, color: "var(--ink-700)", padding: "12px 10px", textAlign: "center" }}>
                    — no settled epochs yet —
                  </div>
                )}
                {hourlyEpochs.slice(0, 5).map((e, i) => {
                  const prizeUsd = Number(BigInt(e.prize)) / USDC_1E6;
                  const settledTs = Number(e.settledTime);
                  return (
                    <div
                      key={e.epochId}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "80px 1fr 100px 80px",
                        gap: 10,
                        alignItems: "center",
                        padding: "8px 10px",
                        borderRadius: 3,
                        background: i === 0 ? "oklch(0.30 0.18 115 / 0.18)" : "transparent",
                      }}
                    >
                      <span className="mono" style={{ fontSize: 10, color: i === 0 ? "var(--acid)" : "var(--ink-700)", letterSpacing: "0.1em" }}>
                        ep {e.epochId}
                      </span>
                      <span className="mono" style={{ fontSize: 11, color: i === 0 ? "var(--bone)" : "var(--bone-dim)" }}>
                        {e.status === "rolledOver" ? "— rolled over —" : shortAddr(e.winner)}
                      </span>
                      <span className="mono" style={{ fontSize: 10, color: "var(--ink-700)", textAlign: "right" }}>
                        {fmtAgo(settledTs, nowSec)} ago
                      </span>
                      <span className="led" style={{ fontSize: 12, color: e.status === "settled" ? "var(--jade)" : "var(--gold-hi)", textAlign: "right" }}>
                        ${prizeUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {rolledOver > 0 && (
              <div style={{ marginTop: 12, padding: 10, border: "1px dashed var(--gold-hi)", borderRadius: 4, background: "oklch(0.18 0.08 82 / 0.18)" }}>
                <div className="mono" style={{ fontSize: 10, color: "var(--gold-hi)", letterSpacing: "0.15em" }}>
                  ▸ ROLLOVER · ${rolledOver.toLocaleString(undefined, { maximumFractionDigits: 2 })} carried forward from prior empty epoch
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section style={{ padding: "20px 60px 28px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 18 }}>
          <span className="display" style={{ fontSize: 32, color: "var(--bone)" }}>LP · Single-Sided · Permanently Locked</span>
          <span className="mono" style={{ fontSize: 11, color: "var(--cobalt)", letterSpacing: "0.2em" }}>· NO WITHDRAW FN · JIT 64 BLK</span>
          <div style={{ flex: 1, height: 1, background: "var(--ink-400)" }} />
        </div>
        <div
          style={{
            padding: 24,
            border: "1px solid var(--cobalt)",
            borderRadius: 8,
            background: "linear-gradient(135deg, oklch(0.20 0.10 245 / 0.15), var(--ink-200))",
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr auto",
            gap: 22,
            alignItems: "center",
          }}
        >
          <div>
            <div className="mono" style={{ fontSize: 10, color: "var(--acid)", letterSpacing: "0.25em", marginBottom: 6 }}>CASTE SIDE · ASKS-ONLY</div>
            <div className="led" style={{ fontSize: 44, color: "var(--bone)" }}>16.8B</div>
            <div className="mono" style={{ fontSize: 10, color: "var(--ink-700)", marginTop: 4 }}>
              initial · placed in [startTick − 46020, startTick − 1] · live read pending
            </div>
          </div>
          <div>
            <div className="mono" style={{ fontSize: 10, color: "var(--cobalt)", letterSpacing: "0.25em", marginBottom: 6 }}>USDC ACCUMULATED</div>
            <div className="led" style={{ fontSize: 44, color: "var(--bone)" }}>—</div>
            <div className="mono" style={{ fontSize: 10, color: "var(--ink-700)", marginTop: 4 }}>fills as buyers walk up the ask ladder · live read pending</div>
          </div>
          <div>
            <div className="mono" style={{ fontSize: 10, color: "var(--ink-700)", letterSpacing: "0.25em", marginBottom: 6 }}>JIT LOCKOUT</div>
            <div className="led" style={{ fontSize: 44, color: "var(--blood-hi)" }}>64 BLK</div>
            <div className="mono" style={{ fontSize: 10, color: "var(--ink-700)", marginTop: 4 }}>beforeRemoveLiquidity reverts if lpAddBlock + 64 ≥ now</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <div style={{ width: 80, height: 80, borderRadius: 8, border: "1px solid var(--cobalt)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--f-display)", fontSize: 16, letterSpacing: "0.15em", color: "var(--cobalt)" }}>
              LOCKED
            </div>
            <div className="mono" style={{ fontSize: 9, color: "var(--cobalt)", letterSpacing: "0.2em", textAlign: "center", lineHeight: 1.4 }}>
              LP HELD BY HOOK<br />
              NO <code>withdraw()</code>
              <br />
              FUNCTION EXISTS
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "20px 60px 40px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 18 }}>
          <span className="display" style={{ fontSize: 32, color: "var(--bone)" }}>Where Each Dollar Goes</span>
          <span className="mono" style={{ fontSize: 11, color: "var(--ink-600)", letterSpacing: "0.2em" }}>· 1.5% BUY · 25% / 1.5% SELL</span>
          <div style={{ flex: 1, height: 1, background: "var(--ink-400)" }} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
          <FundCol title="BUY · $6.66666" subtitle="Phase A AND B" tone="var(--acid)"
            lanes={[
              { pct: 98.5, l: "→ LP CURVE", v: "$6.566", c: "var(--cobalt)" },
              { pct: 1.0,  l: "→ HOURLY",   v: "$0.067", c: "var(--jade)" },
              { pct: 0.5,  l: "→ MEGA",     v: "$0.033", c: "var(--gold-hi)" },
            ]}
          />
          <FundCol title="PHASE A SELL · 25%" subtitle="while cards < 10k" tone="var(--blood-hi)" hot
            lanes={[
              { pct: 75.0,  l: "→ SELLER", v: "≈ $3.75", c: "var(--bone-dim)" },
              { pct: 16.67, l: "→ HOURLY", v: "≈ $0.84", c: "var(--jade)" },
              { pct: 8.33,  l: "→ MEGA",   v: "≈ $0.42", c: "var(--gold-hi)" },
            ]}
          />
          <FundCol title="PHASE B SELL · 1.5%" subtitle="after 10k cards minted" tone="var(--jade)"
            lanes={[
              { pct: 98.5, l: "→ SELLER", v: "≈ $4.93",  c: "var(--bone-dim)" },
              { pct: 1.0,  l: "→ HOURLY", v: "≈ $0.05",  c: "var(--jade)" },
              { pct: 0.5,  l: "→ MEGA",   v: "≈ $0.025", c: "var(--gold-hi)" },
            ]}
          />
        </div>

        <div style={{ marginTop: 16, padding: 14, border: "1px dashed var(--ink-400)", borderRadius: 6, background: "var(--ink-200)" }}>
          <div className="mono" style={{ fontSize: 11, color: "var(--bone-dim)", lineHeight: 1.7, letterSpacing: "0.03em" }}>
            <strong style={{ color: "var(--orchid)" }}>Card Buffer never sees fees.</strong> Its 4.2B CASTE is allocated once at T0 and only drains via <code>flipCard()</code> payouts.
            <span style={{ color: "var(--ink-700)" }}> &nbsp;Fees are USDC; Buffer is CASTE — they don&apos;t intersect.</span>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function PoolSummaryCard({ color, label, value, subValue, meta, emoji }: { color: string; label: string; value: string; subValue: string; meta: string; emoji: string }) {
  return (
    <div style={{ padding: 18, border: `1px solid ${color}`, borderRadius: 6, background: "var(--ink-200)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: color }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span className="mono" style={{ fontSize: 9, color, letterSpacing: "0.25em" }}>{label}</span>
        <span style={{ fontSize: 18 }}>{emoji}</span>
      </div>
      <div className="led" style={{ fontSize: 38, color: "var(--bone)", lineHeight: 0.95, marginTop: 8 }}>{value}</div>
      <div className="mono" style={{ fontSize: 10, color, marginTop: 4, letterSpacing: "0.05em" }}>{subValue}</div>
      <div className="mono" style={{ fontSize: 9, color: "var(--ink-700)", marginTop: 8, lineHeight: 1.5 }}>{meta}</div>
    </div>
  );
}

type Lane = { pct: number; l: string; v: string; c: string };
function FundCol({ title, subtitle, tone, lanes, hot }: { title: string; subtitle: string; tone: string; lanes: Lane[]; hot?: boolean }) {
  return (
    <div style={{ padding: 18, border: hot ? "1px solid var(--blood-lo)" : "1px solid var(--ink-400)", borderRadius: 6, background: hot ? "oklch(0.16 0.04 25 / 0.15)" : "var(--ink-200)" }}>
      <div className="mono" style={{ fontSize: 10, color: tone, letterSpacing: "0.25em" }}>{title}</div>
      <div className="mono" style={{ fontSize: 10, color: "var(--ink-700)", marginTop: 2, marginBottom: 12 }}>{subtitle}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {lanes.map((b) => (
          <div key={b.l} style={{ display: "grid", gridTemplateColumns: "56px 1fr 70px", gap: 10, alignItems: "center", padding: "8px 10px", background: "var(--ink-100)", borderLeft: `4px solid ${b.c}`, borderRadius: 3 }}>
            <span className="led" style={{ fontSize: 16, color: b.c }}>{b.pct}%</span>
            <span className="display" style={{ fontSize: 12, color: "var(--bone)", letterSpacing: "0.08em" }}>{b.l}</span>
            <span className="led" style={{ fontSize: 13, color: "var(--bone)", textAlign: "right" }}>{b.v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

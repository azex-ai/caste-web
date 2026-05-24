"use client";

import { useState } from "react";
import Link from "next/link";
import { useAccount } from "wagmi";

import { Ticker, Footer } from "@/components/caste/caste-chrome";
import { TierBadge } from "@/components/caste/tier-badge";
import { LAST_BUY_V1, POOLS_V1 } from "@/lib/caste/mock";
import { useStats } from "@/lib/caste/hooks";
import { useBuyCaste } from "@/lib/caste/writes";

const ONE_E18 = 10n ** 18n;
const UNIT_USDC = 6.66666;
const CASTE_PER_USDC = 21008;
const MAX_CARDS_PER_BUY = 4;

const fmt = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 2 });
const fmtCaste = (n: number) =>
  n >= 1e6 ? `${(n / 1e6).toFixed(2)}M` : n >= 1e3 ? `${(n / 1e3).toFixed(0)}K` : Math.round(n).toLocaleString();
const log10 = (u: number) => Math.log10(Math.max(1, u));

export default function SwapV1Page() {
  const { data: stats } = useStats();
  const { address } = useAccount();
  const buy = useBuyCaste();
  const [units, setUnits] = useState(12);
  const usdcIn = units * UNIT_USDC;
  const fee = usdcIn * 0.015;
  const swappable = usdcIn - fee;
  const casteOut = swappable * CASTE_PER_USDC;
  const willMint = Math.min(units, MAX_CARDS_PER_BUY);
  const m = POOLS_V1.mega;
  const h = POOLS_V1.hourly;

  const cardsMinted = stats?.cardsMinted ?? 0;
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

      <section style={{ padding: "44px 60px 16px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 40, flexWrap: "wrap" }}>
        <div>
          <div className="mono" style={{ fontSize: 11, letterSpacing: "0.3em", color: "var(--ink-600)", marginBottom: 8 }}>
            /CASTE/SWAP · QUIET MARKET BUY · SEALED CARDS APPEND
          </div>
          <h1 style={{ margin: 0, display: "flex", alignItems: "baseline", gap: 16, flexWrap: "wrap" }}>
            <span className="display" style={{ fontSize: 80, color: "var(--bone)", lineHeight: 1 }}>Buy In.</span>
            <span className="display" style={{ fontSize: 32, color: "var(--acid)" }}>/ TICKET, NOT REVEAL</span>
          </h1>
          <p style={{ fontSize: 15, color: "var(--ink-700)", maxWidth: 760, marginTop: 12, lineHeight: 1.55 }}>
            1 unit = <span className="led" style={{ color: "var(--bone)", fontSize: 16 }}>$6.66666</span>. Buy 1–100. You get the{" "}
            <strong style={{ color: "var(--bone)" }}>pure pool curve</strong> in $CASTE — no multiplier, no surprise. Up to 4{" "}
            <strong style={{ color: "var(--blood-hi)" }}>sealed cards</strong> are minted as a side-effect; flip them on your own time.
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <div className="mono" style={{ fontSize: 10, color: "var(--ink-600)", letterSpacing: "0.2em", marginBottom: 4 }}>
            YOUR HIGHEST FLIPPED TIER
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "flex-end" }}>
            <TierBadge tier={6} variant={2} size="md" />
            <span className="mono" style={{ fontSize: 13, color: "var(--bone)" }}>#6969</span>
          </div>
          <div className="mono" style={{ fontSize: 10, color: "var(--ink-700)", marginTop: 6, letterSpacing: "0.1em" }}>
            (drives V2 buffs — reserved interface)
          </div>
        </div>
      </section>

      <section style={{ padding: "20px 60px 36px", display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 28, alignItems: "flex-start" }}>
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
            ] as const).map(([l, v, c], i) => (
              <div key={i}>
                <div className="mono" style={{ fontSize: 8, color: "var(--ink-600)", letterSpacing: "0.15em" }}>{l.toUpperCase()}</div>
                <div className="mono" style={{ fontSize: 12, color: c, marginTop: 2 }}>{v}</div>
              </div>
            ))}
          </div>

          <button
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
          <SealedPreview units={units} />
          <FeeAndFomo units={units} usdcIn={usdcIn} />
        </div>
      </section>

      <QuietBuyReceipt />

      <section style={{ padding: "20px 60px 32px" }}>
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
              MEGA POOL · ROUND {m.round}
            </div>
            <div className="led" style={{ fontSize: 46, color: "var(--gold-hi)", textShadow: "0 0 18px var(--gold)" }}>
              ${(m.pool / 1e3).toFixed(1)}K
            </div>
            <div className="breathe" style={{ marginTop: 12, padding: "10px 14px", background: "var(--jade)", color: "var(--ink-000)", borderRadius: 4, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 20 }}>👑</span>
              <div>
                <div className="display" style={{ fontSize: 14, letterSpacing: "0.18em" }}>YOU ARE LAST BUYER</div>
                <div className="mono" style={{ fontSize: 9, color: "oklch(0.20 0.04 60)", letterSpacing: "0.12em" }}>
                  your last buy · {m.lastBuyer.txAgo} ago · +{m.boostLast}s
                </div>
              </div>
            </div>
            <div className="mono" style={{ fontSize: 10, color: "var(--ink-700)", marginTop: 10, letterSpacing: "0.05em", lineHeight: 1.6 }}>
              ▸ If FOMO countdown hits 0 with no buy after you, the entire mega pool transfers to your wallet.
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 12 }}>
              <span className="mono" style={{ fontSize: 9, color: "var(--ink-600)", letterSpacing: "0.18em" }}>COUNTDOWN</span>
              <span className="led" style={{ fontSize: 22, color: "var(--blood-hi)" }}>
                {m.deadline.hh}:{m.deadline.mm}:{m.deadline.ss}
              </span>
            </div>
          </div>

          <div style={{ padding: 22, border: "1px solid var(--ink-400)", borderRadius: 8, background: "var(--ink-200)" }}>
            <div className="mono" style={{ fontSize: 10, color: "var(--jade)", letterSpacing: "0.25em", marginBottom: 6 }}>
              THIS HOUR&apos;S POOL · epoch {h.epoch}
            </div>
            <div className="led" style={{ fontSize: 46, color: "var(--jade)" }}>${(h.pool / 1e3).toFixed(1)}K</div>
            <div style={{ marginTop: 12, padding: "10px 14px", background: "var(--ink-100)", border: "1px solid var(--ink-400)", borderRadius: 4, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 18, opacity: 0.4 }}>👑</span>
              <div>
                <div className="display" style={{ fontSize: 14, color: "var(--bone-dim)", letterSpacing: "0.1em" }}>
                  LAST BUYER · <span style={{ color: "var(--bone)" }}>{h.lastBuyer.addr}</span>
                </div>
                <div className="mono" style={{ fontSize: 9, color: "var(--ink-700)", letterSpacing: "0.12em" }}>
                  · bought {h.lastBuyer.units}u · {h.lastBuyer.txAgo} ago · not you
                </div>
              </div>
            </div>
            <div className="mono" style={{ fontSize: 10, color: "var(--ink-700)", marginTop: 10, letterSpacing: "0.05em", lineHeight: 1.6 }}>
              ▸ Buy now to overtake them as this hour&apos;s last buyer.<br />
              ▸ Settles in {h.drawIn.mm}:{h.drawIn.ss}.
            </div>
          </div>
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
        <button style={stepBtn} onClick={() => setUnits(units - 1)} aria-label="decrement">−</button>
        <div style={{ textAlign: "center", padding: "6px 0", background: "var(--ink-000)", border: "1px solid var(--ink-400)", borderRadius: 4 }}>
          <div className="led" style={{ fontSize: 84, color: "var(--acid)", lineHeight: 1, textShadow: "0 0 16px oklch(0.90 0.20 115 / 0.45)" }}>
            {units}
          </div>
          <div className="mono" style={{ fontSize: 10, letterSpacing: "0.35em", color: "var(--ink-600)", marginTop: 4 }}>UNITS</div>
        </div>
        <button style={stepBtn} onClick={() => setUnits(units + 1)} aria-label="increment">+</button>
      </div>

      <div style={{ marginTop: 18, position: "relative" }}>
        <div style={{ height: 8, background: "var(--ink-300)", borderRadius: 4, border: "1px solid var(--ink-400)", overflow: "hidden", position: "relative" }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${units}%`, background: "linear-gradient(90deg, var(--acid-lo), var(--acid))" }} />
          <div style={{ position: "absolute", left: "4%", top: 0, bottom: 0, width: 2, background: "var(--blood-hi)", opacity: 0.6 }} />
        </div>
        <div style={{ position: "absolute", top: 2, left: `${units}%`, transform: "translate(-50%, -2px)", width: 14, height: 16, background: "var(--acid)", borderRadius: 2, boxShadow: "0 0 10px var(--acid)", border: "1px solid var(--ink-000)" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
        <span className="mono" style={{ fontSize: 9, color: "var(--ink-600)" }}>1</span>
        <span className="mono" style={{ fontSize: 9, color: "var(--blood-hi)" }}>↑ 4 = max sealed cards / buy</span>
        <span className="mono" style={{ fontSize: 9, color: "var(--ink-600)" }}>100 max</span>
      </div>

      <div style={{ display: "flex", gap: 6, marginTop: 16 }}>
        {presets.map((p) => (
          <button
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

function SealedPreview({ units }: { units: number }) {
  const willMint = Math.min(units, MAX_CARDS_PER_BUY);
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
          {Array.from({ length: willMint }).map((_, i) => (
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
            <span className="led" style={{ fontSize: 56, color: "var(--bone)", lineHeight: 1 }}>
              {willMint}
            </span>
            <span className="display" style={{ fontSize: 16, color: "var(--bone-dim)", letterSpacing: "0.05em" }}>
              sealed cards minted
            </span>
          </div>
          <div className="mono" style={{ fontSize: 10, color: "var(--ink-700)", marginTop: 8, lineHeight: 1.6 }}>
            ▸ <strong style={{ color: "var(--bone)" }}>No attributes</strong> until you flip — same look as everyone else&apos;s cover.<br />
            ▸ Flip later (any block ≥ commit + 2). Payout from buffer, sent same tx.<br />
            {units > MAX_CARDS_PER_BUY ? (
              <span style={{ color: "var(--blood-hi)" }}>
                ▸ Excess units ({units - MAX_CARDS_PER_BUY}) buy CASTE but no extra cards.
              </span>
            ) : (
              <span>▸ Cap is 4 per buy — extra units only buy CASTE.</span>
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
        <span className="mono" style={{ fontSize: 10, color: "var(--blood-hi)", letterSpacing: "0.2em" }}>🔥 FOMO DEADLINE</span>
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

function QuietBuyReceipt() {
  const b = LAST_BUY_V1;
  return (
    <section style={{ padding: "20px 60px 32px" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 14 }}>
        <span className="mono" style={{ fontSize: 11, letterSpacing: "0.3em", color: "var(--ink-700)" }}>● LAST TX · QUIET RECEIPT</span>
        <div style={{ flex: 1, height: 1, background: "var(--ink-400)" }} />
        <span className="mono" style={{ fontSize: 10, color: "var(--ink-700)", letterSpacing: "0.15em" }}>
          {b.tx} · block {b.block.toLocaleString()} · {b.ago} ago
        </span>
      </div>

      <div style={{ border: "1px solid var(--ink-400)", borderRadius: 6, background: "var(--ink-200)", padding: 20, position: "relative" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, var(--jade), transparent 60%)" }} />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1.2fr", gap: 18, alignItems: "center" }}>
          <div>
            <div className="mono" style={{ fontSize: 9, color: "var(--ink-600)", letterSpacing: "0.2em" }}>PAID</div>
            <div className="led" style={{ fontSize: 28, color: "var(--bone-dim)", marginTop: 4 }}>−${fmt(b.usdcIn)}</div>
            <div className="mono" style={{ fontSize: 9, color: "var(--ink-700)", marginTop: 2 }}>
              {b.units} units · 1.5% fee ${fmt(b.fee)}
            </div>
          </div>
          <div>
            <div className="mono" style={{ fontSize: 9, color: "var(--jade)", letterSpacing: "0.2em" }}>+ CASTE · POOL CURVE</div>
            <div className="led" style={{ fontSize: 28, color: "var(--jade)", marginTop: 4 }}>+{fmtCaste(b.casteOut)}</div>
            <div className="mono" style={{ fontSize: 9, color: "var(--ink-700)", marginTop: 2 }}>credited to balance · no bonus, no roll</div>
          </div>
          <div>
            <div className="mono" style={{ fontSize: 9, color: "var(--blood-hi)", letterSpacing: "0.2em" }}>+ SEALED CARDS</div>
            <div className="led" style={{ fontSize: 28, color: "var(--blood-hi)", marginTop: 4 }}>+{b.sealedMinted}</div>
            <div className="mono" style={{ fontSize: 9, color: "var(--ink-700)", marginTop: 2 }}>#{b.serialFrom} – #{b.serialTo}</div>
          </div>

          <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
            {Array.from({ length: b.sealedMinted }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: 56,
                  height: 78,
                  background: "linear-gradient(160deg, var(--ink-300), var(--ink-100))",
                  border: "1px solid var(--ink-500)",
                  borderRadius: 3,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div className="halftone" style={{ position: "absolute", inset: 0, opacity: 0.4 }} />
                <span
                  className="display"
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                    color: "oklch(1 0 0 / 0.5)",
                  }}
                >
                  ?
                </span>
                <div className="mono" style={{ position: "absolute", bottom: 2, right: 3, fontSize: 6, color: "oklch(1 0 0 / 0.5)" }}>
                  #{b.serialFrom + i}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            marginTop: 18,
            padding: "10px 14px",
            borderTop: "1px dashed var(--ink-400)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--jade)", boxShadow: "0 0 8px var(--jade)" }} />
            <span className="mono" style={{ fontSize: 11, color: "var(--bone-dim)" }}>
              BuyExecuted({b.units}u, {Math.floor(b.casteOut / 1e3)}k CASTE) · 4× CardMinted
            </span>
          </div>
          <Link
            href="/mycards"
            style={{
              padding: "6px 14px",
              background: "var(--ink-300)",
              color: "var(--acid)",
              border: "1px solid var(--acid-lo)",
              borderRadius: 3,
              fontFamily: "var(--f-mono)",
              fontSize: 11,
              letterSpacing: "0.15em",
              textDecoration: "none",
            }}
          >
            → FLIP IN /MYCARDS
          </Link>
        </div>
      </div>
    </section>
  );
}

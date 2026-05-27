"use client";

import { Ticker, Footer } from "@/components/caste/caste-chrome";
import { Countdown } from "@/components/caste/countdown-clock";
import { CasteCard } from "@/components/caste/caste-card";
import { TIERS, VARIANTS, SIGNATURES } from "@/lib/caste/mock";
import {
  useHourlyEpochs,
  useMegaSettlements,
  useRecentFlips,
  useStats,
} from "@/lib/caste/hooks";
import type { CardData } from "@/lib/caste/types";

const ONE_E18 = 10n ** 18n;
const ONE_E6 = 10n ** 6n;

function shortAddr(a?: string | null): string {
  if (!a || a.length < 12) return a ?? "—";
  return `${a.slice(0, 6)}…${a.slice(-4)}`;
}

function bigToNum(s: string | null | undefined, scale: bigint): number {
  // Hourly epoch rows can carry a null prize when the indexer hasn't seen
  // a HourlySettled / FomoDeadlineUpdated event for that epoch yet — treat
  // missing values as 0 instead of crashing the page on BigInt(null).
  if (s == null) return 0;
  return Number(BigInt(s) / scale);
}

function fmtAgo(ts: bigint, nowSec: number): string {
  const diff = nowSec - Number(ts);
  if (diff < 60) return `${Math.max(diff, 0)}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}

function fmtUsd(n: number): string {
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(1)}K`;
  return `$${n.toLocaleString()}`;
}

function fmtCaste(n: number): string {
  if (n >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(0)}K`;
  return n.toLocaleString();
}

export default function LeaderboardV1Page() {
  const nowSec = Math.floor(Date.now() / 1000);
  const { data: stats } = useStats();
  const { data: flips = [] } = useRecentFlips(100);
  const { data: hourlyEpochs = [] } = useHourlyEpochs(8);
  const { data: megaSettles = [] } = useMegaSettlements();

  // Mega countdown derived from stats.fomoSecondsLeft
  const fomoLeft = stats?.fomoSecondsLeft ?? 0;
  const megaHh = Math.floor(fomoLeft / 3600).toString().padStart(2, "0");
  const megaMm = Math.floor((fomoLeft % 3600) / 60).toString().padStart(2, "0");
  const megaSs = (fomoLeft % 60).toString().padStart(2, "0");
  const megaState: "calm" | "warning" | "critical" = fomoLeft < 600 ? "critical" : fomoLeft < 3600 ? "warning" : "calm";

  // Hourly countdown — current epoch ends at next 3600-aligned timestamp
  const nextEpochAt = Math.floor(nowSec / 3600 + 1) * 3600;
  const hourlyLeft = Math.max(0, nextEpochAt - nowSec);
  const hourlyMm = Math.floor(hourlyLeft / 60).toString().padStart(2, "0");
  const hourlySs = (hourlyLeft % 60).toString().padStart(2, "0");

  // Top flippers — sort by payout desc, take top 4
  const topFlippers = [...flips]
    .sort((a, b) => (BigInt(a.payout) < BigInt(b.payout) ? 1 : -1))
    .slice(0, 4);

  const hourlyTotal = hourlyEpochs.reduce(
    (acc, h) => (h.status === "settled" ? acc + bigToNum(h.prize, ONE_E6) : acc),
    0,
  );
  const rolloverCount = hourlyEpochs.filter((h) => h.status === "rolledOver").length;
  const settledHourly = hourlyEpochs.filter((h) => h.status === "settled");
  const uniqueWinners = new Set(settledHourly.map((h) => h.winner)).size;
  const avgPrize = settledHourly.length > 0 ? hourlyTotal / settledHourly.length : 0;

  const megaAllTime = megaSettles.reduce((acc, m) => acc + bigToNum(m.prize, ONE_E6), 0);

  const latestHourly = settledHourly[0];
  const latestMega = megaSettles[0];

  const tickerItems = [
    {
      tag: "▸ HOURLY",
      text: latestHourly
        ? `${shortAddr(latestHourly.winner)} won ${fmtUsd(bigToNum(latestHourly.prize, ONE_E6))} · epoch #${latestHourly.epochId.slice(-4)}`
        : "no hourly settles yet",
      color: "var(--jade)",
    },
    {
      tag: "▸ MEGA",
      text: latestMega
        ? `${shortAddr(latestMega.winner)} took ${fmtUsd(bigToNum(latestMega.prize, ONE_E6))}`
        : "no mega settles yet",
      color: "var(--gold-hi)",
    },
    {
      tag: "▸ ROLLOVERS",
      text: `${rolloverCount} of last ${hourlyEpochs.length} epochs rolled forward`,
      color: "var(--orchid)",
    },
  ];

  return (
    <div>
      <Ticker items={tickerItems} />

      <section style={{ padding: "28px 40px 20px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 40, flexWrap: "wrap" }}>
        <div>
          <div className="mono" style={{ fontSize: 11, letterSpacing: "0.3em", color: "var(--ink-600)", marginBottom: 8 }}>/CASTE/LEADERBOARD · LAST-BUYER WINS</div>
          <h1 style={{ margin: 0, display: "flex", alignItems: "baseline", gap: 16, flexWrap: "wrap" }}>
            <span className="display" style={{ fontSize: 56, color: "var(--bone)", lineHeight: 1 }}>Winners</span>
            <span className="display" style={{ fontSize: 28, color: "var(--gold-hi)" }}>/ V1 · LAST-BUYER MODEL</span>
          </h1>
          <p style={{ fontSize: 15, color: "var(--ink-700)", marginTop: 12, maxWidth: 820, lineHeight: 1.65 }}>
            Whoever bought last in an epoch wins Hourly. Whoever bought last globally wins Mega.
            Empty epochs <strong style={{ color: "var(--gold-hi)" }}>roll forward</strong> — the pot grows until someone buys.
          </p>
        </div>
        <Countdown hh="00" mm={hourlyMm} ss={hourlySs} state="warning" label="NEXT HOURLY DRAW" />
      </section>

      <section style={{ padding: "10px 40px 20px" }}>
        <div style={{ position: "relative", padding: 28, borderRadius: 8, background: "linear-gradient(135deg, oklch(0.18 0.06 82) 0%, oklch(0.10 0.02 60) 100%)", border: "1px solid var(--gold)", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg, var(--gold-hi), var(--gold), var(--gold-hi))" }} />
          <div style={{ position: "relative", display: "grid", gridTemplateColumns: "1fr auto", gap: 36, alignItems: "center" }}>
            <div>
              <div className="mono" style={{ fontSize: 10, color: "var(--gold-hi)", letterSpacing: "0.3em", marginBottom: 6 }}>
                👑 MEGA POOL · FOMO COUNTDOWN
              </div>
              <div className="display" style={{ fontSize: 12, color: "var(--ink-700)", letterSpacing: "0.1em" }}>
                WHOEVER IS lastBuyer AT DEADLINE-ZERO TAKES THE FULL POT
              </div>
              <div className="led" style={{ fontSize: 88, color: "var(--gold-hi)", textShadow: "var(--glow-gold)", lineHeight: 0.9, marginTop: 14 }}>
                {stats ? `Round ${megaSettles.length + 1}` : "—"}
              </div>
              <div className="mono" style={{ fontSize: 11, color: "var(--bone-dim)", marginTop: 8, letterSpacing: "0.1em" }}>
                ▸ buys extend deadline by 60s × log₁₀(units) · cap NOW + 24h
              </div>
            </div>
            <Countdown hh={megaHh} mm={megaMm} ss={megaSs} state={megaState} label="DEADLINE" />
          </div>
        </div>
      </section>

      <section style={{ padding: "14px 40px 28px", display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 28 }}>
        <div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 18 }}>
            <span className="display" style={{ fontSize: 32, color: "var(--bone)" }}>Hourly · Last {hourlyEpochs.length || 8} Epochs</span>
            <span className="display" style={{ fontSize: 14, color: "var(--jade)", letterSpacing: "0.2em" }}>EPOCH-LAST-BUYER</span>
            <div style={{ flex: 1, height: 1, background: "var(--ink-400)" }} />
            <span className="chip">
              <span className="breathe">●</span> NEXT {hourlyMm}:{hourlySs}
            </span>
          </div>

          <div style={{ border: "1px solid var(--ink-400)", borderRadius: 6, overflow: "hidden", background: "var(--ink-200)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "80px 1fr 110px 80px", gap: 12, padding: "10px 18px", borderBottom: "1px solid var(--ink-400)", background: "var(--ink-300)" }}>
              {["EPOCH", "LAST BUYER", "PAID OUT", "STATUS"].map((h) => (
                <span key={h} className="mono" style={{ fontSize: 9, color: "var(--ink-600)", letterSpacing: "0.2em" }}>
                  {h}
                </span>
              ))}
            </div>
            {hourlyEpochs.length === 0 && (
              <div style={{ padding: 24, textAlign: "center", color: "var(--ink-600)", fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: "0.15em" }}>
                NO HOURLY EPOCHS YET
              </div>
            )}
            {hourlyEpochs.map((w, i, arr) => {
              const prize = bigToNum(w.prize, ONE_E6);
              const isSettled = w.status === "settled";
              return (
                <div
                  key={w.epochId}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "80px 1fr 110px 80px",
                    gap: 12,
                    padding: "12px 18px",
                    borderBottom: i < arr.length - 1 ? "1px solid var(--ink-300)" : "none",
                    alignItems: "center",
                    background: i === 0 ? "oklch(0.30 0.08 82 / 0.15)" : !isSettled ? "oklch(0.22 0.10 320 / 0.15)" : "transparent",
                  }}
                >
                  <span className="mono" style={{ fontSize: 10, color: "var(--ink-700)" }}>#{w.epochId.slice(-4)}</span>
                  <span className="mono" style={{ fontSize: 12, color: isSettled ? "var(--bone)" : "var(--orchid)" }}>
                    {isSettled ? shortAddr(w.winner) : "rolled forward"}
                  </span>
                  <span className="led" style={{ fontSize: 18, color: isSettled ? "var(--gold-hi)" : "var(--orchid)" }}>
                    {fmtUsd(prize)}
                  </span>
                  <span className="mono" style={{ fontSize: 9, color: isSettled ? "var(--jade)" : "var(--orchid)", letterSpacing: "0.15em" }}>
                    {isSettled ? "SETTLED" : "ROLLED"}
                  </span>
                </div>
              );
            })}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginTop: 14 }}>
            <MiniStat label="TOTAL" value={fmtUsd(hourlyTotal)} tone="gold" />
            <MiniStat label="ROLLOVERS" value={`${rolloverCount} / ${hourlyEpochs.length || 8}`} tone="orchid" />
            <MiniStat label="UNIQUE WINS" value={uniqueWinners.toString()} tone="bone" />
            <MiniStat label="AVG PRIZE" value={fmtUsd(avgPrize)} tone="bone" />
          </div>

          <div style={{ marginTop: 14, padding: 14, border: "1px dashed var(--jade)", borderRadius: 6, background: "oklch(0.20 0.08 155 / 0.12)" }}>
            <div className="mono" style={{ fontSize: 11, color: "var(--jade)", letterSpacing: "0.15em", lineHeight: 1.7 }}>
              ▸ <strong>How it works:</strong> every buy logs a weighted ticket in the current hourly epoch. After the hour rolls, the next buy{" "}
              <strong>auto-settles</strong> the prior epoch inside <code>beforeSwap</code> — winner is drawn proportional to ticket weight. Empty epochs roll the pool forward into the next epoch&apos;s pot.
            </div>
          </div>
        </div>

        <div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 18 }}>
            <span className="display" style={{ fontSize: 32, color: "var(--bone)" }}>Mega · Rounds</span>
            <span className="display" style={{ fontSize: 14, color: "var(--gold-hi)", letterSpacing: "0.2em" }}>FOMO HISTORY</span>
            <div style={{ flex: 1, height: 1, background: "var(--ink-400)" }} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {megaSettles.length === 0 && (
              <div style={{ padding: 24, textAlign: "center", color: "var(--ink-600)", fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: "0.15em", border: "1px dashed var(--ink-400)", borderRadius: 6 }}>
                NO MEGA SETTLES YET
              </div>
            )}
            {megaSettles.map((m, i) => (
              <div
                key={m.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  gap: 14,
                  padding: 16,
                  border: i === 0 ? "1px solid var(--gold)" : "1px solid var(--ink-400)",
                  borderRadius: 6,
                  background: i === 0 ? "oklch(0.18 0.06 82 / 0.2)" : "var(--ink-200)",
                }}
              >
                <div>
                  <div className="mono" style={{ fontSize: 9, color: "var(--ink-600)", letterSpacing: "0.2em" }}>
                    ROUND {(megaSettles.length - i).toString().padStart(2, "0")} · {fmtAgo(BigInt(m.blockTime), nowSec)} ago
                  </div>
                  <div className="display" style={{ fontSize: 18, color: "var(--bone)", letterSpacing: "-0.01em", marginTop: 4 }}>
                    {shortAddr(m.winner)}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div className="led" style={{ fontSize: 32, color: i === 0 ? "var(--gold-hi)" : "var(--bone)", lineHeight: 1 }}>
                    {fmtUsd(bigToNum(m.prize, ONE_E6))}
                  </div>
                  <div className="mono" style={{ fontSize: 9, color: "var(--ink-600)", letterSpacing: "0.15em", marginTop: 4 }}>
                    USDC PAID
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 16, padding: 18, border: "1px dashed var(--ink-400)", borderRadius: 6 }}>
            <div className="mono" style={{ fontSize: 10, color: "var(--ink-600)", letterSpacing: "0.25em", marginBottom: 10 }}>ALL-TIME MEGA</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <div className="led" style={{ fontSize: 28, color: "var(--gold-hi)" }}>{fmtUsd(megaAllTime)}</div>
                <div className="mono" style={{ fontSize: 10, color: "var(--ink-700)" }}>total paid · {megaSettles.length} round{megaSettles.length === 1 ? "" : "s"}</div>
              </div>
              <div>
                <div className="led" style={{ fontSize: 28, color: "var(--bone)" }}>{stats?.cardsMinted ?? 0}</div>
                <div className="mono" style={{ fontSize: 10, color: "var(--ink-700)" }}>cards minted</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "8px 40px 40px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 18 }}>
          <span className="display" style={{ fontSize: 32, color: "var(--bone)" }}>Top Flippers</span>
          <span className="display" style={{ fontSize: 14, color: "var(--orchid)", letterSpacing: "0.2em" }}>
            BIGGEST BUFFER DRAINS
          </span>
          <div style={{ flex: 1, height: 1, background: "var(--ink-400)" }} />
          <span className="mono" style={{ fontSize: 11, color: "var(--ink-600)" }}>from 4.2B Card Buffer</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
          {topFlippers.length === 0 && (
            <div style={{ gridColumn: "1 / -1", padding: 24, textAlign: "center", color: "var(--ink-600)", fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: "0.15em", border: "1px dashed var(--ink-400)", borderRadius: 6 }}>
              NO FLIPS YET — BUFFER UNTOUCHED
            </div>
          )}
          {topFlippers.map((f, i) => {
            const card: CardData = {
              id: Number(f.tokenId),
              tier: f.tier,
              variant: f.variant,
              sig: 0,
              traits: [0, 1, 2],
              swaps: 0,
              jackpots: 0,
            };
            const payoutCaste = bigToNum(f.payout, ONE_E18);
            const multX = f.multiplierBp / 10000;
            return (
              <div
                key={f.tokenId}
                style={{
                  padding: 14,
                  border: i === 0 ? "1px solid var(--orchid)" : "1px solid var(--ink-400)",
                  borderRadius: 6,
                  background: i === 0 ? "oklch(0.22 0.12 320 / 0.18)" : "var(--ink-200)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
                  <span className="mono" style={{ fontSize: 11, color: "var(--bone)" }}>{shortAddr(f.owner)}</span>
                  <span className="mono" style={{ fontSize: 9, color: "var(--ink-700)" }}>#{i + 1}</span>
                </div>
                <CasteCard card={card} w={210} h={300} />
                <div style={{ marginTop: 10 }}>
                  <div className="mono" style={{ fontSize: 9, color: "var(--gold-hi)", letterSpacing: "0.2em" }}>FLIP PAYOUT</div>
                  <div className="led" style={{ fontSize: 28, color: "var(--gold-hi)", textShadow: "var(--glow-gold)" }}>
                    +{fmtCaste(payoutCaste)}
                  </div>
                  <div className="mono" style={{ fontSize: 10, color: "var(--ink-700)", marginTop: 4 }}>
                    ×{multX.toFixed(1)} multiplier · {VARIANTS[f.variant]?.cn} {TIERS[f.tier]?.cn} · {SIGNATURES[0] && "—"}{fmtAgo(BigInt(f.blockTime), nowSec)} ago
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <Footer />
    </div>
  );
}

function MiniStat({ label, value, tone }: { label: string; value: string; tone: "gold" | "orchid" | "bone" }) {
  const c = tone === "gold" ? "var(--gold-hi)" : tone === "orchid" ? "var(--orchid)" : "var(--bone)";
  return (
    <div style={{ padding: "10px 12px", border: "1px solid var(--ink-400)", borderRadius: 4, background: "var(--ink-200)" }}>
      <div className="mono" style={{ fontSize: 9, color: "var(--ink-600)", letterSpacing: "0.2em" }}>{label}</div>
      <div className="led" style={{ fontSize: 22, color: c, marginTop: 4 }}>{value}</div>
    </div>
  );
}

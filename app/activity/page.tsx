"use client";

import { Ticker, Footer } from "@/components/caste/caste-chrome";
import { StatCard } from "@/components/caste/stat-card";
import { TIERS } from "@/lib/caste/mock";
import {
  useHourlyEpochs,
  useMegaSettlements,
  useRecentFlips,
  useSellTaxEvents,
  useStats,
} from "@/lib/caste/hooks";
import type {
  FlipRow,
  HourlyEpochRow,
  MegaSettlementRow,
  SellTaxRow,
} from "@/lib/caste/response-types";

type Meta = { label: string; color: string };
const EVENT_META: Record<string, Meta> = {
  FLIP:             { label: "FLIP · WIN",      color: "var(--gold-hi)" },
  FLIP_BUST:        { label: "FLIP · COMMON",   color: "var(--bone-dim)" },
  PHASE_A_SELL:     { label: "SELL · PHASE A",  color: "var(--blood-hi)" },
  PHASE_B_SELL:     { label: "SELL · PHASE B",  color: "var(--blood-hi)" },
  SETTLE_HOURLY:    { label: "SETTLE · HOURLY", color: "var(--jade)" },
  SETTLE_MEGA:      { label: "SETTLE · MEGA",   color: "var(--gold-hi)" },
};

type TimelineEvent =
  | { kind: "FLIP" | "FLIP_BUST"; ts: bigint; addr: string; tier: number; variant: number; payout: bigint; txHash: string }
  | { kind: "PHASE_A_SELL" | "PHASE_B_SELL"; ts: bigint; addr: string; usdcOut: bigint; fee: bigint; txHash: string }
  | { kind: "SETTLE_HOURLY"; ts: bigint; addr: string; epoch: string; prize: bigint }
  | { kind: "SETTLE_MEGA"; ts: bigint; addr: string; prize: bigint; txHash: string };

function shortAddr(a?: string | null): string {
  if (!a || a.length < 12) return a ?? "—";
  return `${a.slice(0, 6)}…${a.slice(-4)}`;
}

function fmtAgo(blockTime: bigint, nowSec: number): string {
  const diff = nowSec - Number(blockTime);
  if (diff < 60) return `${Math.max(diff, 0)}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}

function fmtBig(amount: bigint, scale: bigint): string {
  const n = Number(amount / scale);
  if (n >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return n.toLocaleString();
}

function buildTimeline(
  flips: FlipRow[],
  sellTax: SellTaxRow[],
  hourly: HourlyEpochRow[],
  mega: MegaSettlementRow[],
): TimelineEvent[] {
  const out: TimelineEvent[] = [];
  for (const f of flips) {
    const bust = f.variant === 0 && f.tier === 0;
    out.push({
      kind: bust ? "FLIP_BUST" : "FLIP",
      ts: BigInt(f.blockTime),
      addr: f.owner,
      tier: f.tier,
      variant: f.variant,
      payout: BigInt(f.payout),
      txHash: f.txHash,
    });
  }
  for (const s of sellTax) {
    out.push({
      kind: s.phaseA ? "PHASE_A_SELL" : "PHASE_B_SELL",
      ts: BigInt(s.blockTime),
      addr: s.seller,
      usdcOut: BigInt(s.grossUsdcOut),
      fee: BigInt(s.fee),
      txHash: s.txHash,
    });
  }
  for (const h of hourly) {
    if (h.status !== "settled" || !h.winner) continue;
    out.push({
      kind: "SETTLE_HOURLY",
      ts: BigInt(h.settledTime),
      addr: h.winner,
      epoch: h.epochId,
      prize: BigInt(h.prize),
    });
  }
  for (const m of mega) {
    out.push({
      kind: "SETTLE_MEGA",
      ts: BigInt(m.blockTime),
      addr: m.winner,
      prize: BigInt(m.prize),
      txHash: m.txHash,
    });
  }
  out.sort((a, b) => (a.ts < b.ts ? 1 : a.ts > b.ts ? -1 : 0));
  return out;
}

const ONE_E18 = 10n ** 18n;
const ONE_E6 = 10n ** 6n;

export default function ActivityV1Page() {
  const { data: stats } = useStats();
  const { data: flips = [] } = useRecentFlips(100);
  const { data: sellTax = [] } = useSellTaxEvents(100);
  const { data: hourly = [] } = useHourlyEpochs(50);
  const { data: mega = [] } = useMegaSettlements();

  const nowSec = Math.floor(Date.now() / 1000);
  const timeline = buildTimeline(flips, sellTax, hourly, mega);

  const counts = {
    flips: flips.length,
    sells: sellTax.length,
    settles: hourly.filter((h) => h.status === "settled").length + mega.length,
    mythics: stats?.mythicCount ?? 0,
    bufferShortfalls: stats && BigInt(stats.bufferShortfall) > 0n ? 1 : 0,
  };

  const tickerItems = [
    { tag: "▸ LIVE",   text: `events refresh every 5s · ${timeline.length} in window`, color: "var(--acid)" },
    { tag: "▸ FLIPS",  text: `${counts.flips} flips · ${counts.mythics} mythics`, color: "var(--gold-hi)" },
    { tag: "▸ BUFFER", text: stats ? `${counts.bufferShortfalls} BufferDepleted${counts.bufferShortfalls === 1 ? "" : "s"} · shortfall ${stats.bufferShortfall}` : "—", color: "var(--blood-hi)" },
  ];

  return (
    <div>
      <Ticker items={tickerItems} />

      <section style={{ padding: "28px 40px 20px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 40, flexWrap: "wrap" }}>
        <div>
          <div className="mono" style={{ fontSize: 11, letterSpacing: "0.3em", color: "var(--ink-600)", marginBottom: 8 }}>/CASTE/ACTIVITY · LIVE EVENT STREAM</div>
          <h1 style={{ margin: 0 }}>
            <span className="display" style={{ fontSize: 56, color: "var(--bone)", lineHeight: 1 }}>The Feed.</span>
          </h1>
          <p style={{ fontSize: 15, color: "var(--ink-700)", maxWidth: 820, marginTop: 12, lineHeight: 1.65 }}>
            Every on-chain event the hook + card emit, in time order.{" "}
            <strong style={{ color: "var(--gold-hi)" }}>FLIP</strong> (the cinema reveal),{" "}
            <strong style={{ color: "var(--blood-hi)" }}>PHASE_A_SELL</strong> (25% tax), and lottery settles.
          </p>
        </div>
      </section>

      <section style={{ padding: "10px 40px 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 14 }}>
          <StatCard label="FLIPS"    value={counts.flips.toLocaleString()}   meta="cinema moments" tone="gold" />
          <StatCard label="SELLS"    value={counts.sells.toLocaleString()}   meta="sell tax events" tone="blood" />
          <StatCard label="SETTLES"  value={counts.settles.toLocaleString()} meta="hourly + mega" tone="jade" />
          <StatCard label="MYTHICS"  value={counts.mythics.toLocaleString()} meta="lifetime mythic flips" tone="orchid" />
        </div>
      </section>

      <section style={{ padding: "0 40px 32px" }}>
        <div style={{ border: "1px solid var(--ink-400)", borderRadius: 6, overflow: "hidden", background: "var(--ink-200)" }}>
          {timeline.length === 0 && (
            <div style={{ padding: 24, textAlign: "center", color: "var(--ink-600)", fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: "0.15em" }}>
              NO EVENTS YET · WAITING FOR CHAIN ACTIVITY
            </div>
          )}
          {timeline.map((e, i) => (
            <EventRow key={`${e.kind}-${i}`} event={e} last={i === timeline.length - 1} nowSec={nowSec} />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}

function EventRow({ event: e, last, nowSec }: { event: TimelineEvent; last: boolean; nowSec: number }) {
  const meta = EVENT_META[e.kind]!;
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "70px 150px 1fr auto",
        gap: 14,
        padding: "14px 18px",
        borderBottom: last ? "none" : "1px solid var(--ink-300)",
        alignItems: "center",
      }}
    >
      <span className="mono" style={{ fontSize: 10, color: "var(--ink-700)", letterSpacing: "0.1em" }}>{fmtAgo(e.ts, nowSec)}</span>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ width: 6, height: 6, borderRadius: 999, background: meta.color, boxShadow: `0 0 6px ${meta.color}` }} />
        <span className="display" style={{ fontSize: 11, color: meta.color, letterSpacing: "0.15em" }}>{meta.label}</span>
      </div>

      <div>{renderEventBody(e)}</div>

      <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
        {renderEventValue(e, meta)}
        {"txHash" in e && e.txHash && (
          <span className="mono" style={{ fontSize: 10, color: "var(--cobalt)", letterSpacing: "0.05em" }}>
            {e.txHash.slice(0, 8)}… ↗
          </span>
        )}
      </div>
    </div>
  );
}

function addrPill(addr: string) {
  return (
    <span className="mono" style={{ fontSize: 12, color: "var(--bone)" }}>
      {shortAddr(addr)}
    </span>
  );
}

function renderEventBody(e: TimelineEvent): React.ReactNode {
  switch (e.kind) {
    case "FLIP":
    case "FLIP_BUST": {
      const tier = TIERS[e.tier];
      return (
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          {addrPill(e.addr)}
          <span className="mono" style={{ fontSize: 10, color: "var(--ink-700)" }}>flipped →</span>
          <span style={{ fontSize: 14 }}>{tier?.emoji ?? "?"}</span>
          <span className="display" style={{ fontSize: 12, color: tier?.color ?? "var(--bone)", letterSpacing: "0.05em" }}>
            {e.variant === 2 ? "MYTHIC" : e.variant === 1 ? "RARE" : "COMMON"} {(tier?.cn ?? "?").toUpperCase()}
          </span>
        </div>
      );
    }
    case "PHASE_A_SELL":
    case "PHASE_B_SELL":
      return (
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          {addrPill(e.addr)}
          <span className="mono" style={{ fontSize: 10, color: "var(--ink-700)" }}>sold · received</span>
          <span className="led" style={{ fontSize: 14, color: "var(--jade)" }}>${fmtBig(e.usdcOut, ONE_E6)}</span>
        </div>
      );
    case "SETTLE_HOURLY":
      return (
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <span className="mono" style={{ fontSize: 10, color: "var(--jade)", letterSpacing: "0.15em" }}>EPOCH {e.epoch} →</span>
          {addrPill(e.addr)}
          <span className="mono" style={{ fontSize: 10, color: "var(--ink-700)" }}>paid lastBuyer</span>
        </div>
      );
    case "SETTLE_MEGA":
      return (
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <span className="mono" style={{ fontSize: 10, color: "var(--gold-hi)", letterSpacing: "0.15em" }}>MEGA · FOMO →</span>
          {addrPill(e.addr)}
        </div>
      );
    default:
      return null;
  }
}

function renderEventValue(e: TimelineEvent, meta: Meta): React.ReactNode {
  switch (e.kind) {
    case "FLIP":
    case "FLIP_BUST":
      return (
        <div style={{ textAlign: "right" }}>
          <div className="led" style={{ fontSize: 18, color: meta.color, lineHeight: 1 }}>
            +{fmtBig(e.payout, ONE_E18)}
          </div>
          <div className="mono" style={{ fontSize: 8, color: "var(--ink-600)", letterSpacing: "0.1em" }}>$CASTE · buffer</div>
        </div>
      );
    case "PHASE_A_SELL":
    case "PHASE_B_SELL":
      return (
        <div style={{ textAlign: "right" }}>
          <div className="led" style={{ fontSize: 18, color: meta.color, lineHeight: 1 }}>−${fmtBig(e.fee, ONE_E6)}</div>
          <div className="mono" style={{ fontSize: 8, color: "var(--ink-600)", letterSpacing: "0.1em" }}>tax → pools</div>
        </div>
      );
    case "SETTLE_HOURLY":
    case "SETTLE_MEGA":
      return (
        <div style={{ textAlign: "right" }}>
          <div className="led" style={{ fontSize: 18, color: meta.color, lineHeight: 1 }}>+${fmtBig(e.prize, ONE_E6)}</div>
          <div className="mono" style={{ fontSize: 8, color: "var(--ink-600)", letterSpacing: "0.1em" }}>USDC · {e.kind === "SETTLE_HOURLY" ? "hourly" : "mega"}</div>
        </div>
      );
    default:
      return null;
  }
}

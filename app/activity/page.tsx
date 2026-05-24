import { Ticker, Footer } from "@/components/caste/caste-chrome";
import { StatCard } from "@/components/caste/stat-card";
import { TIERS, ACTIVITY_V1, POOLS_V1 } from "@/lib/caste/mock";
import type { ActivityEvent } from "@/lib/caste/mock";

export const dynamic = "force-static";

type Meta = { label: string; color: string };
const EVENT_META: Record<string, Meta> = {
  FLIP:             { label: "FLIP · WIN",      color: "var(--gold-hi)" },
  FLIP_BUST:        { label: "FLIP · COMMON",   color: "var(--bone-dim)" },
  BUY:              { label: "BUY · SEALED",    color: "var(--acid)" },
  PHASE_A_SELL:     { label: "SELL · PHASE A",  color: "var(--blood-hi)" },
  SETTLE_HOURLY:    { label: "SETTLE · HOURLY", color: "var(--jade)" },
  SETTLE_MEGA:      { label: "SETTLE · MEGA",   color: "var(--gold-hi)" },
  BUFFER_DEPLETED:  { label: "BUFFER · CAPPED", color: "var(--blood-hi)" },
};

export default function ActivityV1Page() {
  const tickerItems = [
    { tag: "▸ LIVE",   text: "events updating every block · last refresh 1s ago", color: "var(--acid)" },
    { tag: "▸ FILTER", text: "showing 11/2,412 events · 24h window · all addresses", color: "var(--bone-dim)" },
    { tag: "▸ BUFFER", text: "1 BufferDepleted event in last 24h · ~$18.9k CASTE shortfall · graceful cap engaged", color: "var(--blood-hi)" },
  ];
  const counts = { buys: 412, flips: 183, sells: 89, settles: 23 };

  return (
    <div>
      <Ticker items={tickerItems} />

      <section style={{ padding: "44px 60px 28px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 40, flexWrap: "wrap" }}>
        <div>
          <div className="mono" style={{ fontSize: 11, letterSpacing: "0.3em", color: "var(--ink-600)", marginBottom: 8 }}>/CASTE/ACTIVITY · LIVE EVENT STREAM</div>
          <h1 style={{ margin: 0 }}>
            <span className="display" style={{ fontSize: 80, color: "var(--bone)", lineHeight: 1 }}>The Feed.</span>
          </h1>
          <p style={{ fontSize: 15, color: "var(--ink-700)", maxWidth: 820, marginTop: 12, lineHeight: 1.65 }}>
            Every on-chain event the hook + card emit, in time order. V1 trades the buy-time multiplier roll for two punchier events:{" "}
            <strong style={{ color: "var(--gold-hi)" }}>FLIP</strong> (the cinema reveal) and <strong style={{ color: "var(--blood-hi)" }}>PHASE_A_SELL</strong> (the 25% tax burn).
          </p>
        </div>
        <div className="chip">
          <span className="breathe">●</span> STREAMING · BLOCK {POOLS_V1.block.toLocaleString()}
        </div>
      </section>

      <section style={{ padding: "12px 60px 28px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", gap: 14 }}>
          <StatCard label="24H BUYS"     value={counts.buys.toLocaleString()}  meta={`avg 4.2 sealed / buy · ${counts.buys * 4} sealed minted`} tone="acid" />
          <StatCard label="24H FLIPS"    value={counts.flips.toLocaleString()} meta="183 cinema moments" tone="gold" />
          <StatCard label="24H SELLS"    value={counts.sells.toLocaleString()} meta="all Phase A · 25% tax" tone="blood" />
          <StatCard label="SETTLES"      value={counts.settles}                meta="22 hourly · 1 mega" tone="jade" />
          <StatCard label="BUFFER ALERT" value="1"                              meta="BufferDepleted event · last 24h" tone="orchid" />
        </div>
      </section>

      <section style={{ padding: "0 60px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", border: "1px solid var(--ink-400)", borderRadius: 4, background: "var(--ink-200)" }}>
          <span className="mono" style={{ fontSize: 10, color: "var(--ink-600)", letterSpacing: "0.2em" }}>FILTER ▸</span>
          {["ALL", "FLIP", "BUY", "SELL", "SETTLE", "BUFFER"].map((f, i) => (
            <span
              key={f}
              style={{
                padding: "5px 12px",
                fontFamily: "var(--f-mono)",
                fontSize: 10,
                letterSpacing: "0.1em",
                borderRadius: 2,
                cursor: "pointer",
                background: i === 0 ? "var(--acid)" : "transparent",
                color: i === 0 ? "var(--ink-000)" : "var(--bone-dim)",
                border: i === 0 ? "none" : "1px solid var(--ink-400)",
              }}
            >
              {f}
            </span>
          ))}
          <div style={{ flex: 1 }} />
          <span className="mono" style={{ fontSize: 10, color: "var(--ink-600)", letterSpacing: "0.15em" }}>
            window: 24h · sort: newest ↓ · my events only ☐
          </span>
        </div>
      </section>

      <section style={{ padding: "0 60px 48px" }}>
        <div style={{ border: "1px solid var(--ink-400)", borderRadius: 6, overflow: "hidden", background: "var(--ink-200)" }}>
          {ACTIVITY_V1.map((e, i) => (
            <EventRow key={i} event={e} last={i === ACTIVITY_V1.length - 1} />
          ))}
        </div>

        <div style={{ marginTop: 14, padding: 14, border: "1px dashed var(--ink-400)", borderRadius: 6, background: "var(--ink-200)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span className="mono" style={{ fontSize: 11, color: "var(--bone-dim)", letterSpacing: "0.05em" }}>
              ▸ Showing latest {ACTIVITY_V1.length} events · scroll for more
            </span>
            <button
              style={{
                padding: "6px 14px",
                background: "transparent",
                color: "var(--acid)",
                border: "1px solid var(--acid-lo)",
                fontFamily: "var(--f-mono)",
                fontSize: 10,
                letterSpacing: "0.15em",
                borderRadius: 2,
                cursor: "pointer",
              }}
            >
              LOAD OLDER →
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function EventRow({ event: e, last }: { event: ActivityEvent; last: boolean }) {
  const meta = EVENT_META[e.kind]!;
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "70px 130px 1fr auto",
        gap: 14,
        padding: "14px 18px",
        borderBottom: last ? "none" : "1px solid var(--ink-300)",
        alignItems: "center",
        background: e.isYou ? "oklch(0.30 0.18 115 / 0.10)" : "transparent",
      }}
    >
      <span className="mono" style={{ fontSize: 10, color: "var(--ink-700)", letterSpacing: "0.1em" }}>{e.ago}</span>

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

function addrPill(e: ActivityEvent) {
  return (
    <span className="mono" style={{ fontSize: 12, color: e.isYou ? "var(--acid)" : "var(--bone)" }}>
      {e.addr}
      {e.isYou && (
        <span className="mono" style={{ marginLeft: 6, fontSize: 7, padding: "1px 4px", background: "var(--acid)", color: "var(--ink-000)", letterSpacing: "0.1em", borderRadius: 2 }}>
          YOU
        </span>
      )}
    </span>
  );
}

function renderEventBody(e: ActivityEvent): React.ReactNode {
  switch (e.kind) {
    case "FLIP":
    case "FLIP_BUST": {
      const tier = TIERS[e.tier]!;
      return (
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          {addrPill(e)}
          <span className="mono" style={{ fontSize: 10, color: "var(--ink-700)" }}>flipped →</span>
          <span style={{ fontSize: 14 }}>{tier.emoji}</span>
          <span className="display" style={{ fontSize: 12, color: tier.color, letterSpacing: "0.05em" }}>
            {e.variant === 2 ? "MYTHIC" : e.variant === 1 ? "RARE" : "COMMON"} {tier.cn.toUpperCase()}
          </span>
        </div>
      );
    }
    case "BUY":
      return (
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          {addrPill(e)}
          <span className="mono" style={{ fontSize: 10, color: "var(--ink-700)" }}>bought</span>
          <span className="led" style={{ fontSize: 14, color: "var(--bone)" }}>{e.units}u</span>
          <span className="mono" style={{ fontSize: 10, color: "var(--ink-700)" }}>· minted</span>
          <span className="mono" style={{ fontSize: 11, color: "var(--blood-hi)" }}>{e.sealed} sealed</span>
        </div>
      );
    case "PHASE_A_SELL":
      return (
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          {addrPill(e)}
          <span className="mono" style={{ fontSize: 10, color: "var(--ink-700)" }}>sold</span>
          <span className="led" style={{ fontSize: 14, color: "var(--bone)" }}>{(e.caste / 1000).toFixed(1)}K</span>
          <span className="mono" style={{ fontSize: 10, color: "var(--ink-700)" }}>$CASTE · received</span>
          <span className="led" style={{ fontSize: 14, color: "var(--jade)" }}>${e.usdcOut.toLocaleString()}</span>
        </div>
      );
    case "SETTLE_HOURLY":
      return (
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <span className="mono" style={{ fontSize: 10, color: "var(--jade)", letterSpacing: "0.15em" }}>EPOCH {e.epoch.toLocaleString()} →</span>
          {addrPill(e)}
          <span className="mono" style={{ fontSize: 10, color: "var(--ink-700)" }}>paid lastBuyer</span>
        </div>
      );
    case "BUFFER_DEPLETED":
      return (
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          {addrPill(e)}
          <span className="mono" style={{ fontSize: 10, color: "var(--blood-hi)", letterSpacing: "0.15em" }}>
            flip capped · requested {e.requested.toLocaleString()}, paid {e.paid.toLocaleString()}
          </span>
        </div>
      );
    default:
      return null;
  }
}

function renderEventValue(e: ActivityEvent, meta: Meta): React.ReactNode {
  switch (e.kind) {
    case "FLIP":
    case "FLIP_BUST":
      return (
        <div style={{ textAlign: "right" }}>
          <div className="led" style={{ fontSize: 18, color: meta.color, lineHeight: 1 }}>
            +{e.payout >= 1e6 ? `${(e.payout / 1e6).toFixed(2)}M` : e.payout >= 1e3 ? `${(e.payout / 1e3).toFixed(0)}K` : e.payout}
          </div>
          <div className="mono" style={{ fontSize: 8, color: "var(--ink-600)", letterSpacing: "0.1em" }}>$CASTE · buffer</div>
        </div>
      );
    case "BUY":
      return (
        <div style={{ textAlign: "right" }}>
          <div className="led" style={{ fontSize: 18, color: "var(--acid)", lineHeight: 1 }}>${(e.units * 6.66666).toFixed(2)}</div>
          <div className="mono" style={{ fontSize: 8, color: "var(--ink-600)", letterSpacing: "0.1em" }}>USDC in</div>
        </div>
      );
    case "PHASE_A_SELL":
      return (
        <div style={{ textAlign: "right" }}>
          <div className="led" style={{ fontSize: 18, color: meta.color, lineHeight: 1 }}>−${e.tax.toLocaleString()}</div>
          <div className="mono" style={{ fontSize: 8, color: "var(--ink-600)", letterSpacing: "0.1em" }}>25% tax → pools</div>
        </div>
      );
    case "SETTLE_HOURLY":
      return (
        <div style={{ textAlign: "right" }}>
          <div className="led" style={{ fontSize: 18, color: meta.color, lineHeight: 1 }}>+${e.prize.toLocaleString()}</div>
          <div className="mono" style={{ fontSize: 8, color: "var(--ink-600)", letterSpacing: "0.1em" }}>USDC · hourly</div>
        </div>
      );
    case "BUFFER_DEPLETED":
      return (
        <div style={{ textAlign: "right" }}>
          <div className="led" style={{ fontSize: 16, color: "var(--blood-hi)" }}>−{e.shortfall.toLocaleString()}</div>
          <div className="mono" style={{ fontSize: 8, color: "var(--ink-600)", letterSpacing: "0.1em" }}>shortfall · CASTE</div>
        </div>
      );
    default:
      return null;
  }
}

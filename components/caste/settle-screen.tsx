"use client";

import { useHourlyEpochs, useMegaSettlements, useStats } from "@/lib/caste/hooks";
import { useSettleHourly, useSettleMega } from "@/lib/caste/writes";

const ONE_E6 = 10n ** 6n;

function shortAddr(a?: string | null): string {
  if (!a || a.length < 12) return a ?? "—";
  return `${a.slice(0, 6)}…${a.slice(-4)}`;
}

function bigToNum(s: string): number {
  return Number(BigInt(s) / ONE_E6);
}

export function SettleScreen({ kind = "hourly" }: { kind?: "hourly" | "mega" }) {
  const isHourly = kind === "hourly";
  const { data: hourly = [] } = useHourlyEpochs(20);
  const { data: mega = [] } = useMegaSettlements();
  const { data: stats } = useStats();
  const settleHourly = useSettleHourly();
  const settleMega = useSettleMega();
  // The most-recent completed hourly epoch ID is (now/3600) - 1; we offer to settle it.
  const settleableEpoch = Math.floor(Date.now() / 1000 / 3600) - 1;
  const canSettleMega = (stats?.fomoSecondsLeft ?? 1) === 0;

  const latestHourly = hourly.find((h) => h.status === "settled");
  const latestMega = mega[0];

  const tone = isHourly ? "var(--jade)" : "var(--gold-hi)";
  const toneSoft = isHourly ? "oklch(0.20 0.08 155 / 0.4)" : "oklch(0.20 0.10 82 / 0.4)";
  const title = isHourly ? "HOURLY · LATEST SETTLE" : "MEGA POOL · LATEST SETTLE";

  const winner = isHourly ? latestHourly?.winner : latestMega?.winner;
  const prize = isHourly && latestHourly ? bigToNum(latestHourly.prize) : latestMega ? bigToNum(latestMega.prize) : 0;
  const block = isHourly ? latestHourly?.settledBlock : latestMega?.blockNumber;
  const epoch = latestHourly?.epochId;

  const hasData = isHourly ? !!latestHourly : !!latestMega;

  if (!hasData) {
    return (
      <div
        style={{
          width: "100%",
          maxWidth: 1100,
          minHeight: 720,
          margin: "40px auto",
          background: "var(--ink-100)",
          border: `1px solid ${tone}`,
          borderRadius: 6,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 40,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div className="display" style={{ fontSize: 36, color: tone, letterSpacing: "0.15em" }}>
            {title}
          </div>
          <div className="mono" style={{ fontSize: 14, color: "var(--ink-700)", letterSpacing: "0.2em", marginTop: 18 }}>
            NO {isHourly ? "HOURLY EPOCHS" : "MEGA ROUNDS"} SETTLED YET
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 1100,
        minHeight: 720,
        margin: "40px auto",
        position: "relative",
        overflow: "hidden",
        background: isHourly
          ? "radial-gradient(circle at 50% 30%, oklch(0.18 0.08 155 / 0.5), oklch(0.07 0.005 60))"
          : "radial-gradient(circle at 50% 30%, oklch(0.20 0.10 82 / 0.5), oklch(0.07 0.005 60))",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "var(--f-body)",
        color: "var(--bone)",
        borderRadius: 6,
        border: `1px solid ${tone}`,
      }}
    >
      <div style={{ position: "absolute", inset: 28, border: `1px dashed ${tone}`, borderRadius: 4, opacity: 0.4 }} />
      <div className="gridbg" style={{ position: "absolute", inset: 0, opacity: 0.25 }} />
      <div className="halftone" style={{ position: "absolute", inset: 0, opacity: 0.15 }} />

      <div style={{ position: "absolute", top: 36, left: "50%", transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: 14 }}>
        <span className="mono" style={{ fontSize: 11, letterSpacing: "0.3em", color: tone }}>
          ● BLOCK {block ? Number(block).toLocaleString() : "—"}
        </span>
        <span className="mono" style={{ fontSize: 11, letterSpacing: "0.3em", color: "var(--ink-700)" }}>
          · {title}{epoch ? ` · EPOCH #${epoch.slice(-6)}` : ""}
        </span>
      </div>

      <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, padding: "80px 60px", textAlign: "center" }}>
        <div className="mono" style={{ fontSize: 13, color: tone, letterSpacing: "0.4em" }}>
          {isHourly ? "settleHourly(epoch)" : "settleMega()"} · CONFIRMED
        </div>

        <h1 style={{ margin: 0, lineHeight: 0.86 }}>
          <span className="display" style={{ display: "block", fontSize: 56, color: "var(--bone)", letterSpacing: "-0.01em" }}>
            {shortAddr(winner)}
          </span>
          <span className="display" style={{ display: "block", fontSize: 22, color: tone, letterSpacing: "0.2em", marginTop: 4 }}>
            {isHourly ? "WON THE HOURLY POOL" : "WON THE MEGA JACKPOT"}
          </span>
        </h1>

        <div style={{ position: "relative", marginTop: 8 }}>
          <div
            className="led"
            style={{
              fontSize: 168,
              color: tone,
              lineHeight: 0.85,
              letterSpacing: "-0.04em",
              textShadow: `0 0 60px ${tone}, 0 0 120px ${tone}`,
            }}
          >
            ${prize.toLocaleString()}
          </div>
          <div className="mono" style={{ fontSize: 12, letterSpacing: "0.35em", color: "var(--bone-dim)", marginTop: -4 }}>
            USDC · TRANSFERRED IN SAME TX
          </div>
        </div>

        <div style={{ marginTop: 18, display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", alignItems: "center" }}>
          {isHourly ? (
            <button
              disabled={settleHourly.isPending}
              onClick={() => settleHourly.mutate({ epoch: settleableEpoch })}
              style={{
                padding: "14px 28px",
                background: settleHourly.isPending ? "var(--ink-300)" : tone,
                color: settleHourly.isPending ? "var(--ink-600)" : "var(--ink-000)",
                fontFamily: "var(--f-display)",
                fontSize: 14,
                letterSpacing: "0.15em",
                border: "none",
                borderRadius: 4,
                cursor: settleHourly.isPending ? "not-allowed" : "pointer",
                boxShadow: settleHourly.isPending ? "none" : `0 6px 0 ${toneSoft}`,
              }}
            >
              {settleHourly.isPending ? "SETTLING…" : `▸ settleHourly(${settleableEpoch})`}
            </button>
          ) : (
            <button
              disabled={!canSettleMega || settleMega.isPending}
              onClick={() => settleMega.mutate()}
              style={{
                padding: "14px 28px",
                background: !canSettleMega || settleMega.isPending ? "var(--ink-300)" : tone,
                color: !canSettleMega || settleMega.isPending ? "var(--ink-600)" : "var(--ink-000)",
                fontFamily: "var(--f-display)",
                fontSize: 14,
                letterSpacing: "0.15em",
                border: "none",
                borderRadius: 4,
                cursor: !canSettleMega || settleMega.isPending ? "not-allowed" : "pointer",
                boxShadow: !canSettleMega || settleMega.isPending ? "none" : `0 6px 0 ${toneSoft}`,
              }}
            >
              {settleMega.isPending ? "SETTLING…" : canSettleMega ? "▸ settleMega()" : "FOMO NOT EXPIRED"}
            </button>
          )}
          {(isHourly ? settleHourly : settleMega).isError && (
            <span className="mono" style={{ fontSize: 11, color: "var(--blood-hi)" }}>
              ✗ {(isHourly ? settleHourly : settleMega).error?.message ?? "tx failed"}
            </span>
          )}
          {(isHourly ? settleHourly : settleMega).isSuccess && (
            <span className="mono" style={{ fontSize: 11, color: "var(--jade)" }}>
              ✓ settled
            </span>
          )}
        </div>
      </div>

      <div style={{ position: "absolute", bottom: 36, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div className="mono" style={{ fontSize: 10, letterSpacing: "0.25em", color: "var(--ink-700)" }}>
          {isHourly
            ? "▸ HOURLY ROLLS FORWARD ON EMPTY EPOCH · NEXT BUY BECOMES NEXT WINNER"
            : "▸ MEGA ROUND RESETS · FOMO DEADLINE = NOW + 24h · POOL STARTS AT $0"}
        </div>
      </div>
    </div>
  );
}

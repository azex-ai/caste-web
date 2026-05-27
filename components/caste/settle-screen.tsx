"use client";

import { useAccount } from "wagmi";

import { useHourlyEpochs, useMegaSettlements, useStats } from "@/lib/caste/hooks";
import { useSettleMega } from "@/lib/caste/writes";
import type { HourlyEpochRow } from "@/lib/caste/response-types";

const ONE_E6 = 10n ** 6n;

function shortAddr(a?: string | null): string {
  if (!a || a.length < 12) return a ?? "—";
  return `${a.slice(0, 6)}…${a.slice(-4)}`;
}

function bigToNum(s: string | null | undefined): number {
  if (!s) return 0;
  return Number(BigInt(s) / ONE_E6);
}

// One-line status summary for a recent epoch row. Handles all four Wave-3
// states so a glance at the list communicates each round's fate.
function epochStatusLine(e: HourlyEpochRow): { label: string; tone: string } {
  const prizeUsd = bigToNum(e.prize);
  const prizeStr = `$${prizeUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  switch (e.status) {
    case "settled":
      return {
        label: `Won by ${shortAddr(e.winner)} for ${prizeStr}`,
        tone: "var(--jade)",
      };
    case "rolledOver":
      return {
        label: `Rolled to ${e.target === "mega" ? "mega pool" : `epoch ${e.target}`} (${prizeStr})`,
        tone: "var(--gold-hi)",
      };
    case "expiredToMega":
      return {
        label: `Expired → mega pool (${prizeStr})`,
        tone: "var(--gold-hi)",
      };
    case "pending":
    default:
      return {
        label: "Pending settle",
        tone: "var(--ink-700)",
      };
  }
}

export function SettleScreen({ kind = "hourly" }: { kind?: "hourly" | "mega" }) {
  const isHourly = kind === "hourly";
  const { isConnected } = useAccount();
  const { data: hourly = [] } = useHourlyEpochs(20);
  const { data: mega = [] } = useMegaSettlements();
  const { data: stats } = useStats();
  const settleMega = useSettleMega();
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
          {isHourly && (
            <div className="mono" style={{ fontSize: 11, color: "var(--ink-600)", letterSpacing: "0.15em", marginTop: 12, lineHeight: 1.6, maxWidth: 520 }}>
              ▸ Hourly draws auto-settle inside the next buy after the hour rolls.
              <br />▸ Winner is drawn from tickets recorded that hour — proportional to weight.
            </div>
          )}
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
          {isHourly ? "auto-settled in beforeBuy" : "settleMega()"} · CONFIRMED
        </div>

        <h1 style={{ margin: 0, lineHeight: 0.86 }}>
          <span className="display" style={{ display: "block", fontSize: 40, color: "var(--bone)", letterSpacing: "-0.01em" }}>
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
            <div
              style={{
                padding: "14px 28px",
                background: "transparent",
                color: tone,
                fontFamily: "var(--f-display)",
                fontSize: 13,
                letterSpacing: "0.15em",
                border: `1px dashed ${tone}`,
                borderRadius: 4,
              }}
            >
              ▸ HOURLY AUTO-SETTLES ON NEXT BUY · NO USER ACTION NEEDED
            </div>
          ) : (
            <button
              disabled={!isConnected || !canSettleMega || settleMega.isPending}
              onClick={() => settleMega.mutate()}
              title={!isConnected ? "Connect wallet to settle" : ""}
              style={{
                padding: "14px 28px",
                background:
                  !isConnected || !canSettleMega || settleMega.isPending ? "var(--ink-300)" : tone,
                color:
                  !isConnected || !canSettleMega || settleMega.isPending
                    ? "var(--ink-600)"
                    : "var(--ink-000)",
                fontFamily: "var(--f-display)",
                fontSize: 14,
                letterSpacing: "0.15em",
                border: "none",
                borderRadius: 4,
                cursor:
                  !isConnected || !canSettleMega || settleMega.isPending ? "not-allowed" : "pointer",
                boxShadow:
                  !isConnected || !canSettleMega || settleMega.isPending
                    ? "none"
                    : `0 6px 0 ${toneSoft}`,
              }}
            >
              {!isConnected
                ? "CONNECT WALLET TO SETTLE"
                : settleMega.isPending
                ? "SETTLING…"
                : canSettleMega
                ? "▸ settleMega()"
                : "FOMO NOT EXPIRED"}
            </button>
          )}
          {!isHourly && settleMega.isError && (
            <span className="mono" style={{ fontSize: 11, color: "var(--blood-hi)" }}>
              ✗ {settleMega.error?.message ?? "tx failed"}
            </span>
          )}
          {!isHourly && settleMega.isSuccess && (
            <span className="mono" style={{ fontSize: 11, color: "var(--jade)" }}>
              ✓ settled
            </span>
          )}
        </div>

        {isHourly && hourly.length > 0 && (
          <div
            style={{
              marginTop: 24,
              width: "100%",
              maxWidth: 760,
              padding: 18,
              border: `1px solid ${tone}`,
              borderRadius: 6,
              background: "oklch(0.10 0.02 60 / 0.6)",
            }}
          >
            <div
              className="mono"
              style={{ fontSize: 11, color: tone, letterSpacing: "0.25em", marginBottom: 10, textAlign: "left" }}
            >
              RECENT EPOCHS · LAST {Math.min(hourly.length, 8)}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {hourly.slice(0, 8).map((e) => {
                const { label, tone: rowTone } = epochStatusLine(e);
                return (
                  <div
                    key={e.epochId}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "100px 1fr 80px",
                      gap: 10,
                      padding: "6px 8px",
                      borderBottom: "1px dashed var(--ink-400)",
                      alignItems: "center",
                      textAlign: "left",
                    }}
                  >
                    <span className="mono" style={{ fontSize: 10, color: "var(--ink-700)", letterSpacing: "0.1em" }}>
                      ep {e.epochId.slice(-6)}
                    </span>
                    <span className="mono" style={{ fontSize: 11, color: rowTone, letterSpacing: "0.05em" }}>
                      {label}
                    </span>
                    <span className="mono" style={{ fontSize: 10, color: "var(--ink-700)", textAlign: "right" }}>
                      {typeof e.totalWeight === "number" ? `${e.totalWeight} tix` : "—"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div style={{ position: "absolute", bottom: 36, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div className="mono" style={{ fontSize: 10, letterSpacing: "0.25em", color: "var(--ink-700)" }}>
          {isHourly
            ? "▸ HOURLY ROLLS FORWARD ON EMPTY EPOCH · AUTO-SETTLES INSIDE THE NEXT BUY"
            : "▸ MEGA ROUND RESETS · FOMO DEADLINE = NOW + 24h · POOL STARTS AT $0"}
        </div>
      </div>
    </div>
  );
}

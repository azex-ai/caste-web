import { SETTLE_MOMENTS, POOLS_V1 } from "@/lib/caste/mock";

export function SettleScreen({ kind = "hourly" }: { kind?: "hourly" | "mega" }) {
  const isHourly = kind === "hourly";
  const m = isHourly ? SETTLE_MOMENTS.hourly : SETTLE_MOMENTS.mega;
  const tone = isHourly ? "var(--jade)" : "var(--gold-hi)";
  const toneSoft = isHourly ? "oklch(0.20 0.08 155 / 0.4)" : "oklch(0.20 0.10 82 / 0.4)";
  const title = isHourly ? "HOURLY · SETTLED" : "MEGA POOL · SETTLED";
  const sub = isHourly
    ? `EPOCH ${(m as typeof SETTLE_MOMENTS.hourly).epoch.toLocaleString()}`
    : `ROUND ${(m as typeof SETTLE_MOMENTS.mega).round.toString().padStart(2, "0")} · FOMO EXPIRED`;
  const youWon = m.isYou;

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

      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 1400,
          height: 1400,
          marginLeft: -700,
          marginTop: -700,
          background: `repeating-conic-gradient(from 0deg, ${tone} 0deg 2deg, transparent 2deg 12deg)`,
          opacity: 0.1,
          mixBlendMode: "screen",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "absolute", top: 36, left: "50%", transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: 14 }}>
        <span className="mono" style={{ fontSize: 11, letterSpacing: "0.3em", color: tone }}>
          ● LIVE · BLOCK {(("settledAtBlock" in m ? m.settledAtBlock : POOLS_V1.block)).toLocaleString()}
        </span>
        <span className="mono" style={{ fontSize: 11, letterSpacing: "0.3em", color: "var(--ink-700)" }}>
          · {title} · {sub}
        </span>
      </div>

      <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, padding: "80px 60px", textAlign: "center" }}>
        <div className="mono" style={{ fontSize: 13, color: tone, letterSpacing: "0.4em" }}>
          {isHourly ? "settleHourly(epoch)" : "settleMega()"} · CONFIRMED
        </div>

        <h1 style={{ margin: 0, lineHeight: 0.86 }}>
          <span className="display" style={{ display: "block", fontSize: 56, color: "var(--bone)", letterSpacing: "-0.01em" }}>
            {youWon ? "YOU WON" : m.winner}
          </span>
          <span className="display" style={{ display: "block", fontSize: 22, color: tone, letterSpacing: "0.2em", marginTop: 4 }}>
            {isHourly ? "THE HOURLY POOL" : "THE MEGA JACKPOT"}
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
            ${m.pool.toLocaleString()}
          </div>
          <div className="mono" style={{ fontSize: 12, letterSpacing: "0.35em", color: "var(--bone-dim)", marginTop: -4 }}>
            USDC · TRANSFERRED IN SAME TX
          </div>
        </div>

        <div
          style={{
            marginTop: 20,
            padding: "14px 24px",
            background: "oklch(0 0 0 / 0.5)",
            border: `1px solid ${tone}`,
            borderRadius: 6,
            display: "flex",
            gap: 28,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <div>
            <div className="mono" style={{ fontSize: 9, color: "var(--ink-700)", letterSpacing: "0.25em" }}>WINNER</div>
            <div className="display" style={{ fontSize: 18, color: youWon ? "var(--acid)" : "var(--bone)" }}>{m.winner}</div>
          </div>
          <div style={{ width: 1, alignSelf: "stretch", background: tone, opacity: 0.5 }} />
          {isHourly ? (
            <>
              <div>
                <div className="mono" style={{ fontSize: 9, color: "var(--ink-700)", letterSpacing: "0.25em" }}>QUALIFIED BY</div>
                <div className="mono" style={{ fontSize: 13, color: "var(--bone-dim)" }}>
                  last buy · {(m as typeof SETTLE_MOMENTS.hourly).units} units
                </div>
              </div>
              <div>
                <div className="mono" style={{ fontSize: 9, color: "var(--ink-700)", letterSpacing: "0.25em" }}>NEXT EPOCH</div>
                <div className="mono" style={{ fontSize: 13, color: "var(--bone-dim)" }}>
                  #{(m as typeof SETTLE_MOMENTS.hourly).nextEpoch} draws in {(m as typeof SETTLE_MOMENTS.hourly).nextDrawIn.mm}:{(m as typeof SETTLE_MOMENTS.hourly).nextDrawIn.ss}
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <div className="mono" style={{ fontSize: 9, color: "var(--ink-700)", letterSpacing: "0.25em" }}>QUALIFIED BY</div>
                <div className="mono" style={{ fontSize: 13, color: "var(--bone-dim)" }}>
                  last buy · {(m as typeof SETTLE_MOMENTS.mega).lastBuy}
                </div>
              </div>
              <div>
                <div className="mono" style={{ fontSize: 9, color: "var(--ink-700)", letterSpacing: "0.25em" }}>NEXT ROUND</div>
                <div className="mono" style={{ fontSize: 13, color: "var(--bone-dim)" }}>
                  #{(m as typeof SETTLE_MOMENTS.mega).nextRound.round} · FOMO restart {(m as typeof SETTLE_MOMENTS.mega).nextRound.fomoStart}
                </div>
              </div>
            </>
          )}
        </div>

        <div style={{ marginTop: 14, display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap", justifyContent: "center" }}>
          <span className="mono" style={{ fontSize: 10, color: "var(--ink-600)", letterSpacing: "0.25em" }}>TX</span>
          <span className="mono" style={{ fontSize: 11, color: "var(--cobalt)", letterSpacing: "0.1em" }}>{m.txHash} ↗</span>
          <span className="mono" style={{ fontSize: 10, color: "var(--ink-700)" }}>· ERC-6909 burn → USDC out</span>
        </div>

        <div style={{ marginTop: 18, display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
          {youWon ? (
            <>
              <button
                style={{
                  padding: "14px 28px",
                  background: tone,
                  color: "var(--ink-000)",
                  fontFamily: "var(--f-display)",
                  fontSize: 14,
                  letterSpacing: "0.15em",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                  boxShadow: `0 6px 0 ${toneSoft}, 0 16px 28px ${toneSoft}`,
                }}
              >
                SHARE WIN ↗
              </button>
              <button
                style={{
                  padding: "14px 28px",
                  background: "transparent",
                  color: "var(--bone)",
                  fontFamily: "var(--f-display)",
                  fontSize: 14,
                  letterSpacing: "0.15em",
                  border: "1px solid var(--ink-500)",
                  borderRadius: 4,
                  cursor: "pointer",
                }}
              >
                BACK TO {isHourly ? "/CASTE" : "/POOLS"}
              </button>
            </>
          ) : (
            <button
              style={{
                padding: "14px 28px",
                background: "transparent",
                color: tone,
                fontFamily: "var(--f-display)",
                fontSize: 14,
                letterSpacing: "0.15em",
                border: `1px solid ${tone}`,
                borderRadius: 4,
                cursor: "pointer",
              }}
            >
              {isHourly ? "BUY → BE NEXT LASTBUYER" : `JOIN ROUND ${(m as typeof SETTLE_MOMENTS.mega).nextRound.round}`}
            </button>
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

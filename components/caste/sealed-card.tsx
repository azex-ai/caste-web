export function SealedCard({
  tokenId = 8421,
  commitBlock,
  buyUnits,
  bought,
  w = 220,
  h = 320,
  canFlip = true,
  showFlipBtn = true,
  compact = false,
  onFlip,
}: {
  tokenId?: number;
  commitBlock?: number;
  buyUnits?: number;
  bought?: string;
  w?: number;
  h?: number;
  canFlip?: boolean;
  showFlipBtn?: boolean;
  compact?: boolean;
  onFlip?: () => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "stretch", width: w }}>
      <div
        style={{
          width: w,
          height: h,
          borderRadius: "var(--r-card)",
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(160deg, var(--ink-300) 0%, var(--ink-100) 60%, var(--ink-200) 100%)",
          border: "1px solid var(--ink-500)",
          boxShadow: "0 12px 32px oklch(0 0 0 / 0.45), inset 0 0 60px oklch(0 0 0 / 0.45)",
        }}
      >
        <div className="halftone" style={{ position: "absolute", inset: 0, opacity: 0.35 }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "var(--tex-scanline)", opacity: 0.5 }} />
        <div style={{ position: "absolute", inset: 8, border: "1px dashed oklch(1 0 0 / 0.18)", borderRadius: "calc(var(--r-card) - 6px)" }} />

        <div
          style={{
            position: "absolute",
            top: 14,
            right: -34,
            padding: "4px 36px",
            background: "var(--blood)",
            color: "var(--bone)",
            fontFamily: "var(--f-display)",
            fontSize: 12,
            letterSpacing: "0.25em",
            transform: "rotate(28deg)",
            boxShadow: "0 4px 14px oklch(0 0 0 / 0.5)",
            border: "1px solid oklch(0 0 0 / 0.5)",
          }}
        >
          SEALED
        </div>

        <div style={{ position: "absolute", top: 16, left: 16, right: 90 }}>
          <div className="mono" style={{ fontSize: 9, color: "oklch(1 0 0 / 0.45)", letterSpacing: "0.2em" }}>
            CASTE · GENESIS · Q2/2026
          </div>
          <div className="display" style={{ fontSize: 22, color: "var(--bone)", lineHeight: 1, marginTop: 4 }}>
            Sealed Card
          </div>
          <div className="display" style={{ fontSize: 10, color: "oklch(1 0 0 / 0.4)", letterSpacing: "0.2em", marginTop: 2 }}>
            FLIP TO REVEAL
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 4,
          }}
        >
          <div
            style={{
              width: w * 0.42,
              height: w * 0.42,
              borderRadius: "50%",
              border: "1.5px dashed oklch(1 0 0 / 0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <div
              style={{
                fontFamily: "var(--f-display)",
                fontSize: w * 0.34,
                color: "var(--bone)",
                opacity: 0.85,
                textShadow: "0 0 24px oklch(0 0 0 / 0.5)",
                lineHeight: 1,
              }}
            >
              ?
            </div>
            {[
              [0, 0],
              [1, 0],
              [0, 1],
              [1, 1],
            ].map(([x, y], i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  top: y ? "100%" : 0,
                  left: x ? "100%" : 0,
                  transform: `translate(${x ? "-50%" : "-50%"}, ${y ? "-50%" : "-50%"})`,
                  width: 6,
                  height: 6,
                  background: "var(--bone)",
                  opacity: 0.5,
                }}
              />
            ))}
          </div>
          <div className="mono" style={{ fontSize: 9, color: "oklch(1 0 0 / 0.4)", letterSpacing: "0.3em", marginTop: 10 }}>
            TIER · VARIANT · TRAITS
          </div>
          <div className="mono" style={{ fontSize: 9, color: "oklch(1 0 0 / 0.4)", letterSpacing: "0.3em" }}>
            MULTIPLIER · PAYOUT
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 14,
            left: 16,
            right: 16,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div>
            <div className="mono" style={{ fontSize: 8, color: "oklch(1 0 0 / 0.45)", letterSpacing: "0.18em" }}>
              TOKEN
            </div>
            <div className="led" style={{ fontSize: 24, color: "var(--bone)", lineHeight: 1 }}>
              #{tokenId}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div className="mono" style={{ fontSize: 8, color: "oklch(1 0 0 / 0.45)", letterSpacing: "0.18em" }}>
              COMMIT BLOCK
            </div>
            <div className="mono" style={{ fontSize: 10, color: "oklch(1 0 0 / 0.7)", marginTop: 2 }}>
              #{commitBlock?.toLocaleString() ?? "—"}
            </div>
          </div>
        </div>
      </div>

      {!compact && (
        <>
          <div
            className="mono"
            style={{
              fontSize: 9,
              color: "var(--ink-700)",
              letterSpacing: "0.1em",
              textAlign: "center",
              lineHeight: 1.5,
            }}
          >
            Bought block #{commitBlock?.toLocaleString() ?? "—"} · {buyUnits ?? 0} unit{buyUnits !== 1 ? "s" : ""} buy · {bought ?? "—"}
          </div>
          {showFlipBtn && (
            <button
              onClick={onFlip}
              disabled={!canFlip}
              style={{
                padding: "12px 0",
                background: canFlip ? "var(--acid)" : "var(--ink-300)",
                color: canFlip ? "var(--ink-000)" : "var(--ink-600)",
                fontFamily: "var(--f-display)",
                fontSize: 13,
                letterSpacing: "0.18em",
                border: "none",
                borderRadius: 3,
                cursor: canFlip ? "pointer" : "not-allowed",
                boxShadow: canFlip
                  ? "0 4px 0 var(--acid-lo), 0 0 18px oklch(0.90 0.20 115 / 0.35)"
                  : "none",
              }}
            >
              {canFlip ? "▸ FLIP CARD" : "● WAITING · 1 BLK"}
            </button>
          )}
        </>
      )}
    </div>
  );
}

import { MULT_OUTCOMES } from "@/lib/caste/mock";

type Size = "sm" | "md" | "lg";

export function MultiplierReel({
  result = 5,
  spinning = false,
  label = true,
  size = "md",
}: {
  result?: number;
  spinning?: boolean;
  label?: boolean;
  size?: Size;
}) {
  const sizes = {
    sm: { w: 140, h: 100, font: 30 },
    md: { w: 200, h: 150, font: 44 },
    lg: { w: 280, h: 220, font: 64 },
  }[size];

  const M = MULT_OUTCOMES;
  const idx = result;
  const prev = (idx - 1 + M.length) % M.length;
  const next = (idx + 1) % M.length;
  const winner = M[idx]!;

  return (
    <div style={{ width: sizes.w, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      {label && (
        <div className="mono" style={{ fontSize: 9, letterSpacing: "0.25em", color: "var(--ink-600)" }}>
          ▼ MULTIPLIER ▼
        </div>
      )}
      <div
        style={{
          width: sizes.w,
          height: sizes.h,
          background:
            "linear-gradient(180deg, var(--ink-000) 0%, var(--ink-200) 50%, var(--ink-000) 100%)",
          border: "1px solid var(--ink-400)",
          borderRadius: 6,
          position: "relative",
          overflow: "hidden",
          boxShadow: "inset 0 0 28px rgb(0 0 0 / 0.7)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div className="led" style={{ fontSize: sizes.font * 0.5, color: "var(--ink-600)", opacity: 0.5, lineHeight: 1, marginBottom: 4 }}>
            {M[prev]!.value}
          </div>
          <div
            className="led"
            style={{
              fontSize: sizes.font,
              color: winner.color,
              lineHeight: 1,
              textShadow:
                winner.kind === "jackpot" || winner.kind === "legend"
                  ? `0 0 18px ${winner.color}, 0 0 4px ${winner.color}`
                  : winner.kind === "loss"
                  ? `0 0 12px ${winner.color}`
                  : "none",
            }}
          >
            {winner.value}
          </div>
          <div className="led" style={{ fontSize: sizes.font * 0.5, color: "var(--ink-600)", opacity: 0.5, lineHeight: 1, marginTop: 4 }}>
            {M[next]!.value}
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            right: 0,
            transform: "translateY(-50%)",
            height: sizes.font * 1.15,
            borderTop: `1px solid ${winner.color}`,
            borderBottom: `1px solid ${winner.color}`,
            pointerEvents: "none",
            opacity: 0.6,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, var(--ink-000) 0%, transparent 30%, transparent 70%, var(--ink-000) 100%)",
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "var(--tex-scanline)", opacity: 0.5, pointerEvents: "none" }} />
        {spinning && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              backdropFilter: "blur(1px)",
              background: "linear-gradient(180deg, transparent, oklch(1 0 0 / 0.04), transparent)",
            }}
          />
        )}
      </div>
      {label && (
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div className="display" style={{ fontSize: 16, color: winner.color }}>{winner.name}</div>
          <span className="mono" style={{ fontSize: 9, color: "var(--ink-600)" }}>· {winner.en}</span>
        </div>
      )}
    </div>
  );
}

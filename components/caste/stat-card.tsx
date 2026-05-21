import type { ReactNode } from "react";

type Tone = "neutral" | "acid" | "blood" | "gold" | "jade" | "orchid" | "cobalt";

const TONES: Record<Tone, { accent: string; border: string }> = {
  neutral: { accent: "var(--bone)",     border: "var(--ink-400)" },
  acid:    { accent: "var(--acid)",     border: "var(--acid-lo)" },
  blood:   { accent: "var(--blood-hi)", border: "var(--blood-lo)" },
  gold:    { accent: "var(--gold-hi)",  border: "oklch(0.58 0.10 82)" },
  jade:    { accent: "var(--jade)",     border: "oklch(0.45 0.10 155)" },
  orchid:  { accent: "var(--orchid)",   border: "oklch(0.45 0.14 320)" },
  cobalt:  { accent: "var(--cobalt)",   border: "oklch(0.45 0.14 245)" },
};

export function StatCard({
  label,
  value,
  meta,
  tone = "neutral",
  deltaPos = false,
  w,
  size = "md",
}: {
  label: ReactNode;
  value: ReactNode;
  meta?: ReactNode;
  tone?: Tone;
  deltaPos?: boolean;
  w?: number | string;
  size?: "md" | "lg";
}) {
  const tones = TONES[tone] ?? TONES.neutral;
  return (
    <div
      style={{
        width: w ?? "auto",
        padding: size === "lg" ? "20px 22px" : "14px 16px",
        background: "linear-gradient(180deg, var(--ink-200), var(--ink-100))",
        border: `1px solid ${tones.border}`,
        borderRadius: 6,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 6,
          right: 6,
          width: 8,
          height: 8,
          borderTop: `1px solid ${tones.accent}`,
          borderRight: `1px solid ${tones.accent}`,
          opacity: 0.6,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 6,
          left: 6,
          width: 8,
          height: 8,
          borderBottom: `1px solid ${tones.accent}`,
          borderLeft: `1px solid ${tones.accent}`,
          opacity: 0.6,
        }}
      />
      <div
        className="mono"
        style={{
          fontSize: 9,
          letterSpacing: "0.25em",
          color: "var(--ink-600)",
          textTransform: "uppercase",
          marginBottom: 8,
        }}
      >
        {label}
      </div>
      <div
        className="led"
        style={{
          fontSize: size === "lg" ? 56 : 38,
          color: tones.accent,
          lineHeight: 1,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
      </div>
      {meta && (
        <div
          className="mono"
          style={{
            fontSize: 10,
            color: deltaPos ? "var(--jade)" : "var(--ink-700)",
            marginTop: 8,
            letterSpacing: "0.05em",
          }}
        >
          {meta}
        </div>
      )}
    </div>
  );
}

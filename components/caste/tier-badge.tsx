import { TIERS, VARIANTS } from "@/lib/caste/mock";

type Size = "sm" | "md" | "lg";

export function TierBadge({ tier, variant = 0, size = "md" }: { tier: number; variant?: number; size?: Size }) {
  const t = TIERS[tier];
  const v = VARIANTS[variant];
  if (!t || !v) return null;
  const sizes = {
    sm: { pad: "3px 8px", font: 10, emoji: 11 },
    md: { pad: "5px 12px", font: 12, emoji: 14 },
    lg: { pad: "8px 18px", font: 16, emoji: 20 },
  }[size];

  const ringColor =
    variant === 2 ? "var(--orchid)" : variant === 1 ? "var(--gold)" : "var(--ink-400)";
  const ringGlow =
    variant === 2
      ? "0 0 14px oklch(0.62 0.24 320 / 0.5)"
      : variant === 1
      ? "0 0 10px oklch(0.82 0.16 82 / 0.35)"
      : "none";

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: sizes.pad,
        borderRadius: 999,
        border: `1px solid ${ringColor}`,
        background: `linear-gradient(180deg, ${t.color} 0%, oklch(0.20 0.01 60) 100%)`,
        backgroundBlendMode: "multiply",
        boxShadow: ringGlow,
        fontFamily: "var(--f-body)",
        fontWeight: 700,
        fontSize: sizes.font,
        color: "var(--bone)",
        letterSpacing: "0.02em",
        textShadow: "0 1px 0 rgb(0 0 0 / 0.5)",
      }}
    >
      <span style={{ fontSize: sizes.emoji }}>{t.emoji}</span>
      <span className="display">{t.cn}</span>
      {variant > 0 && (
        <span
          className="mono"
          style={{
            fontSize: sizes.font - 2,
            color: variant === 2 ? "var(--orchid)" : "var(--gold-hi)",
            letterSpacing: "0.1em",
          }}
        >
          · {v.cn === "RARE" ? "RARE" : "MYTHIC"}
        </span>
      )}
    </span>
  );
}

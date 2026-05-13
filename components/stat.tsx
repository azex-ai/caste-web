import type { ReactNode } from "react";

export function Stat({
  label,
  value,
  hint,
  tone = "default",
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  tone?: "default" | "accent" | "positive" | "violet";
}) {
  const toneClass = {
    default: "from-white to-[var(--color-bg-muted)]",
    accent:
      "from-[color-mix(in_oklch,var(--color-accent)_10%,white)] to-white",
    positive:
      "from-[color-mix(in_oklch,var(--color-positive)_12%,white)] to-white",
    violet:
      "from-[color-mix(in_oklch,var(--color-violet)_10%,white)] to-white",
  }[tone];

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-[var(--color-border)] bg-gradient-to-br ${toneClass} px-5 py-4 shadow-[0_16px_34px_rgb(92_20_70/0.08)]`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="text-[11px] font-medium uppercase tracking-wider text-[var(--color-text-dim)]">
          {label}
        </div>
        <span className="h-2 w-2 rounded-full bg-[var(--color-accent)] opacity-70" />
      </div>
      <div className="tabular mt-2 text-2xl font-semibold leading-none text-[var(--color-text)]">
        {value}
      </div>
      {hint ? (
        <div className="mt-1.5 text-xs text-[var(--color-text-muted)]">
          {hint}
        </div>
      ) : null}
    </div>
  );
}

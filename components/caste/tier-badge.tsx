import { TIER_EMOJIS, TIER_NAMES, VARIANT_NAMES } from "@/lib/caste/constants";
import type { TierIndex, VariantIndex } from "@/lib/caste/types";

const VARIANT_RING: Record<number, string> = {
  0: "ring-zinc-700",       // Common
  1: "ring-cyan-500",       // Rare
  2: "ring-fuchsia-500",    // Mythic
};

const VARIANT_GLOW: Record<number, string> = {
  0: "",
  1: "shadow-[0_0_12px_rgb(6_182_212/0.5)]",
  2: "shadow-[0_0_20px_rgb(192_38_211/0.7)]",
};

export function TierBadge({
  tier,
  variant,
  size = "md",
}: {
  tier: TierIndex;
  variant: VariantIndex;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClass = {
    sm: "px-2 py-0.5 text-xs gap-1",
    md: "px-3 py-1 text-sm gap-1.5",
    lg: "px-4 py-1.5 text-base gap-2",
  }[size];

  return (
    <span
      className={[
        "inline-flex items-center rounded-full font-semibold ring-1",
        "bg-zinc-800/80 text-zinc-100",
        VARIANT_RING[variant],
        VARIANT_GLOW[variant],
        sizeClass,
      ].join(" ")}
    >
      <span aria-hidden="true">{TIER_EMOJIS[tier]}</span>
      <span>{TIER_NAMES[tier]}</span>
      {variant > 0 && (
        <span
          className={
            variant === 2 ? "text-fuchsia-400" : "text-cyan-400"
          }
        >
          · {VARIANT_NAMES[variant]}
        </span>
      )}
    </span>
  );
}

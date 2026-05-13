import {
  TIER_EMOJIS,
  TIER_NAMES,
  VARIANT_NAMES,
  SIGNATURES,
  TRAITS_BY_TIER,
} from "@/lib/caste/constants";
import type { CardData } from "@/lib/caste/types";
import { TierBadge } from "./tier-badge";

const VARIANT_FRAME: Record<number, string> = {
  0: "border-zinc-700 bg-gradient-to-br from-zinc-900 to-zinc-800",
  1: "border-cyan-600 bg-gradient-to-br from-zinc-900 via-cyan-950 to-zinc-900",
  2: "border-fuchsia-500 bg-gradient-to-br from-zinc-900 via-fuchsia-950 to-zinc-900",
};

const VARIANT_GLOW: Record<number, string> = {
  0: "",
  1: "shadow-[0_0_18px_rgb(6_182_212/0.35)]",
  2: "shadow-[0_0_30px_rgb(192_38_211/0.55)]",
};

function formatUsdcMicro(micro: bigint): string {
  const usd = Number(micro) / 1_000_000;
  if (usd >= 1000) return `$${(usd / 1000).toFixed(1)}K`;
  return `$${usd.toFixed(4)}`;
}

export function CardDisplay({
  card,
  compact = false,
}: {
  card: CardData;
  compact?: boolean;
}) {
  const traits = [card.trait0, card.trait1, card.trait2].map(
    (idx) => TRAITS_BY_TIER[card.tier]?.[idx] ?? "???",
  );
  const signature = SIGNATURES[card.signatureIdx] ?? "Unknown";

  return (
    <article
      className={[
        "relative flex flex-col overflow-hidden rounded-2xl border",
        VARIANT_FRAME[card.variant],
        VARIANT_GLOW[card.variant],
        compact ? "p-3" : "p-4",
      ].join(" ")}
      aria-label={`Card #${card.mintNumber} ${TIER_NAMES[card.tier]}`}
    >
      {/* Header */}
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex flex-col gap-1">
          <TierBadge tier={card.tier} variant={card.variant} size="sm" />
          <span className="text-xs text-zinc-500">
            #{card.mintNumber.toString()}
          </span>
        </div>
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-800 text-2xl"
          aria-hidden="true"
        >
          {TIER_EMOJIS[card.tier]}
        </div>
      </div>

      {/* Signature */}
      <div className="mb-3 flex items-center gap-2">
        <div
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-zinc-600 bg-zinc-800 text-xs font-bold text-zinc-300"
          aria-label={`签名: ${signature}`}
        >
          {signature.slice(0, 2)}
        </div>
        <span className="text-xs text-zinc-400">
          Signed by <span className="font-semibold text-zinc-200">{signature}</span>
        </span>
      </div>

      {/* Traits */}
      {!compact && (
        <div className="mb-3 flex flex-wrap gap-1.5">
          {traits.map((t) => (
            <span
              key={t}
              className="rounded-full border border-zinc-700 bg-zinc-800/60 px-2 py-0.5 text-xs text-zinc-300"
            >
              {t}
            </span>
          ))}
        </div>
      )}

      {/* XP counters */}
      <div className="mt-auto flex items-center justify-between text-[11px] text-zinc-500">
        <span>Swaps: <span className="text-zinc-300">{card.swapCount}</span></span>
        {card.jackpotCount > 0 && (
          <span className="text-amber-400">
            ⚡ {card.jackpotCount}× JACKPOT
          </span>
        )}
      </div>

      {/* Mythic glow overlay */}
      {card.variant === 2 && (
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-tr from-fuchsia-600/10 to-transparent"
          aria-hidden="true"
        />
      )}
    </article>
  );
}

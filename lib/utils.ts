import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shortAddr(addr: string, head = 6, tail = 4): string {
  if (!addr || addr.length < head + tail + 2) return addr;
  return `${addr.slice(0, head)}…${addr.slice(-tail)}`;
}

// Mirror of the financial-display rule from CLAUDE.md, adapted for v4 contexts.
// Token amounts arrive as bigints (or stringified bigints) in native units.
export function formatAmount(
  rawAmount: bigint | string,
  decimals: number,
  maxFractionDigits = 4,
): string {
  const raw = typeof rawAmount === "string" ? BigInt(rawAmount) : rawAmount;
  const negative = raw < 0n;
  const abs = negative ? -raw : raw;
  const base = 10n ** BigInt(decimals);
  const whole = abs / base;
  const frac = abs % base;
  const fracStr = frac
    .toString()
    .padStart(decimals, "0")
    .slice(0, maxFractionDigits)
    .replace(/0+$/, "");
  const out = fracStr ? `${whole}.${fracStr}` : whole.toString();
  return negative ? `-${out}` : out;
}

export function formatCount(n: number | string): string {
  const num = typeof n === "string" ? Number(n) : n;
  if (!Number.isFinite(num)) return "0";
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(2)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
}

export function timeAgo(secondsTimestamp: bigint | string): string {
  const ts =
    typeof secondsTimestamp === "string"
      ? Number(secondsTimestamp)
      : Number(secondsTimestamp);
  const diff = Math.max(0, Math.floor(Date.now() / 1000 - ts));
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

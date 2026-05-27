"use client";

import { castePriceUsdc, useStats } from "@/lib/caste/hooks";

// Format $ per CASTE with the precision the magnitude deserves. We're
// designing for a deploy where 1 CASTE ≈ $0.001-$0.01, so default to 4-6
// significant decimals; degrade to scientific notation only if absurdly small.
function fmtUsdc(p: number): string {
  if (p === 0) return "—";
  if (p >= 1) return `$${p.toFixed(2)}`;
  if (p >= 0.01) return `$${p.toFixed(4)}`;
  if (p >= 0.0001) return `$${p.toFixed(6)}`;
  return `$${p.toExponential(2)}`;
}

export function PricePill() {
  const { data: stats } = useStats();
  const sqrtRaw = stats?.sqrtPriceX96Last;
  const price = sqrtRaw ? castePriceUsdc(BigInt(sqrtRaw)) : 0;
  const live = !!sqrtRaw;

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 10px",
        border: "1px solid var(--ink-400)",
        borderRadius: 3,
        background: "var(--ink-100)",
        fontFamily: "var(--f-mono)",
      }}
      title={live ? "Last observed pool price" : "No swap indexed yet — price will update after first buy/sell"}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: live ? "var(--jade)" : "var(--ink-600)",
          boxShadow: live ? "0 0 6px var(--jade)" : "none",
        }}
      />
      <span style={{ fontSize: 9, letterSpacing: "0.2em", color: "var(--ink-600)" }}>CASTE</span>
      <span className="led" style={{ fontSize: 13, color: live ? "var(--acid)" : "var(--ink-600)" }}>
        {live ? fmtUsdc(price) : "—"}
      </span>
    </div>
  );
}

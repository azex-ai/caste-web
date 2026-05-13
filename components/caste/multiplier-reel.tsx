"use client";

import { useEffect, useRef, useState } from "react";
import { MULT_OUTCOMES, MULT_COLORS } from "@/lib/caste/constants";
import type { MultiplierIndex } from "@/lib/caste/types";

// Spin through all outcomes before landing on the final result
const SPIN_DURATION_MS = 1800;
const TICK_INTERVAL_MS = 80;

export function MultiplierReel({
  result,
  spinning,
}: {
  result: MultiplierIndex | null;
  spinning: boolean;
}) {
  const [displayIdx, setDisplayIdx] = useState<number>(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (spinning) {
      intervalRef.current = setInterval(() => {
        setDisplayIdx((prev) => (prev + 1) % MULT_OUTCOMES.length);
      }, TICK_INTERVAL_MS);

      const timeout = setTimeout(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (result !== null) setDisplayIdx(result);
      }, SPIN_DURATION_MS);

      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        clearTimeout(timeout);
      };
    } else if (result !== null) {
      setDisplayIdx(result);
    }
  }, [spinning, result]);

  const label = MULT_OUTCOMES[displayIdx];
  const color = MULT_COLORS[displayIdx];

  return (
    <div
      className="flex flex-col items-center gap-1"
      role="status"
      aria-live="polite"
      aria-label={spinning ? "抽奖中…" : `结果: ${label}`}
    >
      <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
        Multiplier
      </span>
      <div
        className={[
          "tabular-nums text-3xl font-black transition-all duration-75",
          spinning ? "opacity-70 blur-[0.5px]" : "opacity-100",
          color,
        ].join(" ")}
        style={{ minWidth: "180px", textAlign: "center" }}
      >
        {label}
      </div>
    </div>
  );
}

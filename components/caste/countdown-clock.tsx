"use client";

import { useState, useEffect } from "react";

function formatDuration(seconds: number): string {
  if (seconds <= 0) return "已结束";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const parts: string[] = [];
  if (h > 0) parts.push(`${h}h`);
  if (m > 0 || h > 0) parts.push(`${m}m`);
  parts.push(`${s}s`);
  return parts.join(" ");
}

export function CountdownClock({
  deadlineUnix,
  label = "FOMO 截止",
}: {
  deadlineUnix: number;
  label?: string;
}) {
  const [remaining, setRemaining] = useState<number>(
    Math.max(0, deadlineUnix - Math.floor(Date.now() / 1000)),
  );

  useEffect(() => {
    const id = setInterval(() => {
      setRemaining(Math.max(0, deadlineUnix - Math.floor(Date.now() / 1000)));
    }, 1000);
    return () => clearInterval(id);
  }, [deadlineUnix]);

  const urgent = remaining < 3600;

  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
        {label}
      </span>
      <span
        className={[
          "tabular-nums text-2xl font-bold",
          urgent ? "text-red-400 animate-pulse" : "text-zinc-100",
        ].join(" ")}
        aria-live="polite"
        aria-label={`${label}: ${formatDuration(remaining)}`}
      >
        {formatDuration(remaining)}
      </span>
    </div>
  );
}

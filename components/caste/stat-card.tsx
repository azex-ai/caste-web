import type { ReactNode } from "react";

export function StatCard({
  label,
  value,
  sub,
  tone = "default",
}: {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  tone?: "default" | "fuchsia" | "amber" | "emerald" | "red";
}) {
  const toneClass: Record<string, string> = {
    default: "border-zinc-700 bg-zinc-800/60",
    fuchsia: "border-fuchsia-800 bg-fuchsia-950/60",
    amber: "border-amber-800 bg-amber-950/60",
    emerald: "border-emerald-800 bg-emerald-950/60",
    red: "border-red-800 bg-red-950/60",
  };

  const dotClass: Record<string, string> = {
    default: "bg-zinc-500",
    fuchsia: "bg-fuchsia-400",
    amber: "bg-amber-400",
    emerald: "bg-emerald-400",
    red: "bg-red-400",
  };

  return (
    <div
      className={[
        "flex flex-col gap-1.5 rounded-2xl border p-4",
        toneClass[tone],
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
          {label}
        </span>
        <span
          className={["h-2 w-2 rounded-full", dotClass[tone]].join(" ")}
          aria-hidden="true"
        />
      </div>
      <div className="tabular-nums text-xl font-bold text-zinc-100">{value}</div>
      {sub ? (
        <div className="text-xs text-zinc-500">{sub}</div>
      ) : null}
    </div>
  );
}

import Link from "next/link";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HookBehaviorBadge } from "@/components/hook-behavior-badge";
import { HookFlagsGrid } from "@/components/hook-flags-grid";
import type { HookDetail as HookDetailData } from "@/lib/api/types";
import { formatCount, shortAddr, timeAgo } from "@/lib/utils";

export function HookDetail({
  data,
  variant = "page",
}: {
  data: HookDetailData;
  variant?: "page" | "modal";
}) {
  const { hook, pools } = data;

  return (
    <div className={variant === "modal" ? "p-6" : "mx-auto max-w-5xl px-4 py-10"}>
      <header className="mb-6">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-xl font-semibold tracking-tight text-[var(--color-text)]">
            Hook
          </h1>
          <HookBehaviorBadge behavior={hook.behavior} />
        </div>
        <a
          href={`https://etherscan.io/address/${hook.address}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 inline-block tabular text-xs text-[var(--color-text-dim)] hover:text-[var(--color-text)]"
        >
          {hook.address}
        </a>
        <div className="mt-1 flex items-center gap-3 text-xs text-[var(--color-text-dim)] tabular flex-wrap">
          <span>first seen {timeAgo(hook.firstSeenAt)}</span>
          <span>·</span>
          <span>flags {`0x${hook.flags.toString(16).padStart(4, "0")}`}</span>
        </div>
      </header>

      <section className="mb-6">
        <h2 className="text-sm uppercase tracking-wider text-[var(--color-text-dim)] mb-2">
          Lifecycle callbacks
        </h2>
        <Card>
          <CardBody>
            <HookFlagsGrid flags={hook.decodedFlags} />
          </CardBody>
        </Card>
      </section>

      <section className="grid grid-cols-3 gap-3 mb-6">
        <MetricCard label="Pools" value={String(hook.poolCount)} />
        <MetricCard label="Swaps" value={formatCount(hook.swapCount)} />
        <MetricCard
          label="Behavior"
          value={hook.behavior.replace(/-/g, " ")}
          mono={false}
        />
      </section>

      <section>
        <h2 className="text-sm uppercase tracking-wider text-[var(--color-text-dim)] mb-2">
          Pools using this hook ({pools.length})
        </h2>
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[var(--color-bg-muted)] text-[var(--color-text-dim)] text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-2 text-left font-normal">Pool</th>
                  <th className="px-4 py-2 text-left font-normal">Quote</th>
                  <th className="px-4 py-2 text-right font-normal">Fee</th>
                  <th className="px-4 py-2 text-right font-normal">Swaps</th>
                </tr>
              </thead>
              <tbody>
                {pools.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-6 text-center text-[var(--color-text-muted)]"
                    >
                      No pools yet.
                    </td>
                  </tr>
                ) : (
                  pools.map((p) => (
                    <tr
                      key={p.poolId}
                      className="border-t border-[var(--color-border)] hover:bg-[var(--color-bg-muted)]"
                    >
                      <td className="px-4 py-3">
                        <Link
                          href={`/pool/${p.poolId}`}
                          className="tabular hover:underline"
                        >
                          {shortAddr(p.poolId, 8, 6)}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline">{p.quoteKind}</Badge>
                      </td>
                      <td className="px-4 py-3 tabular text-right text-[var(--color-text-muted)]">
                        {(p.fee / 10_000).toFixed(2)}%
                      </td>
                      <td className="px-4 py-3 tabular text-right">
                        {formatCount(p.swapCount)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </section>
    </div>
  );
}

function MetricCard({
  label,
  value,
  mono = true,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <Card>
      <CardBody>
        <div className="text-xs uppercase tracking-wider text-[var(--color-text-dim)]">
          {label}
        </div>
        <div
          className={`mt-1 text-xl font-medium text-[var(--color-text)] ${
            mono ? "tabular" : ""
          }`}
        >
          {value}
        </div>
      </CardBody>
    </Card>
  );
}

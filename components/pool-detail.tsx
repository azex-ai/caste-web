import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { HookBehaviorBadge } from "@/components/hook-behavior-badge";
import { HookFlagsGrid } from "@/components/hook-flags-grid";
import type { PoolDetail as PoolDetailData } from "@/lib/api/types";
import { formatAmount, formatCount, shortAddr, timeAgo } from "@/lib/utils";

function TokenLink({
  address,
  symbol,
}: {
  address: string;
  symbol: string | null | undefined;
}) {
  return (
    <Link
      href={`/token/${address}`}
      className="font-medium text-[var(--color-text)] hover:underline"
    >
      {symbol ?? shortAddr(address)}
    </Link>
  );
}

export function PoolDetail({
  data,
  variant = "page",
}: {
  data: PoolDetailData;
  variant?: "page" | "modal";
}) {
  const { pool, token0, token1, hook, swaps } = data;

  return (
    <div className={variant === "modal" ? "p-6" : "mx-auto max-w-5xl px-4 py-10"}>
      <header className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight text-[var(--color-text)] flex items-center gap-2">
          <TokenLink address={pool.currency0} symbol={token0?.symbol} />
          <span className="text-[var(--color-text-dim)] font-normal">/</span>
          <TokenLink address={pool.currency1} symbol={token1?.symbol} />
          <Badge variant="outline" className="ml-2">
            {(pool.fee / 10_000).toFixed(2)}% fee
          </Badge>
        </h1>
        <div className="mt-1 flex items-center gap-3 text-xs text-[var(--color-text-dim)] tabular flex-wrap">
          <span>poolId {shortAddr(pool.poolId, 10, 8)}</span>
          <span>·</span>
          <span>tickSpacing {pool.tickSpacing}</span>
          <span>·</span>
          <span>created {timeAgo(pool.createdAt)}</span>
        </div>
      </header>

      {hook ? (
        <section className="mb-6">
          <h2 className="text-sm uppercase tracking-wider text-[var(--color-text-dim)] mb-2">
            Hook
          </h2>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-2">
                <Link
                  href={`/hook/${hook.address}`}
                  className="tabular text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                >
                  {hook.address}
                </Link>
                <HookBehaviorBadge behavior={hook.behavior} />
              </div>
            </CardHeader>
            <CardBody>
              <HookFlagsGrid flags={hook.decodedFlags} />
            </CardBody>
          </Card>
        </section>
      ) : null}

      <section>
        <h2 className="text-sm uppercase tracking-wider text-[var(--color-text-dim)] mb-2">
          Recent swaps ({swaps.length})
        </h2>
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[var(--color-bg-muted)] text-[var(--color-text-dim)] text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-2 text-left font-normal">Tx</th>
                  <th className="px-4 py-2 text-left font-normal">Sender</th>
                  <th className="px-4 py-2 text-right font-normal">
                    {token0?.symbol ?? "amount0"}
                  </th>
                  <th className="px-4 py-2 text-right font-normal">
                    {token1?.symbol ?? "amount1"}
                  </th>
                  <th className="px-4 py-2 text-right font-normal">When</th>
                </tr>
              </thead>
              <tbody>
                {swaps.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-6 text-center text-[var(--color-text-muted)]"
                    >
                      No swaps yet.
                    </td>
                  </tr>
                ) : (
                  swaps.map((s) => (
                    <tr
                      key={s.id}
                      className="border-t border-[var(--color-border)] hover:bg-[var(--color-bg-muted)]"
                    >
                      <td className="px-4 py-3">
                        <a
                          href={`https://etherscan.io/tx/${s.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="tabular text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                        >
                          {shortAddr(s.txHash, 6, 4)}
                        </a>
                      </td>
                      <td className="px-4 py-3 tabular text-xs text-[var(--color-text-muted)]">
                        {shortAddr(s.sender)}
                      </td>
                      <td className="px-4 py-3 tabular text-right">
                        <span
                          className={
                            BigInt(s.amount0) > 0n
                              ? "text-[var(--color-positive)]"
                              : "text-[var(--color-negative)]"
                          }
                        >
                          {formatAmount(s.amount0, token0?.decimals ?? 18, 4)}
                        </span>
                      </td>
                      <td className="px-4 py-3 tabular text-right">
                        <span
                          className={
                            BigInt(s.amount1) > 0n
                              ? "text-[var(--color-positive)]"
                              : "text-[var(--color-negative)]"
                          }
                        >
                          {formatAmount(s.amount1, token1?.decimals ?? 18, 4)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-xs text-[var(--color-text-dim)]">
                        {timeAgo(s.blockTimestamp)}
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

import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight, Layers, ShieldCheck, Waves } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardBody } from "@/components/ui/card";
import { HookBehaviorBadge } from "@/components/hook-behavior-badge";
import { HookFlagsGrid } from "@/components/hook-flags-grid";
import type { Pool, TokenDetail as TokenDetailData } from "@/lib/api/types";
import {
  formatEthCompact,
  formatUsdCompact,
  tokenVolumeUsdEquivalent,
} from "@/lib/format";
import { formatCount, shortAddr, timeAgo } from "@/lib/utils";

const ZERO_ADDR = "0x0000000000000000000000000000000000000000";

function QuoteKindBadge({ kind }: { kind: "usd" | "eth" | "none" }) {
  if (kind === "usd") return <Badge variant="positive">USD pair</Badge>;
  if (kind === "eth") return <Badge variant="accent">ETH pair</Badge>;
  return <Badge variant="outline">exotic</Badge>;
}

export function TokenDetail({
  data,
  ethUsd,
  variant = "page",
}: {
  data: TokenDetailData;
  ethUsd: number;
  variant?: "page" | "modal";
}) {
  const { token, pools, hooks } = data;
  const usdEq = tokenVolumeUsdEquivalent(token, ethUsd);
  const hooksByAddr = new Map(hooks.map((h) => [h.address, h]));
  const sortedPools = [...pools].sort((a, b) => b.swapCount - a.swapCount);
  const primaryPool = sortedPools[0] ?? null;
  const visiblePools = variant === "modal" ? sortedPools.slice(0, 8) : sortedPools;
  const hiddenPoolCount = Math.max(0, sortedPools.length - visiblePools.length);
  const hookedPoolCount = pools.filter((p) => p.hook !== ZERO_ADDR).length;
  const usdPairCount = pools.filter((p) => p.quoteKind === "usd").length;
  const ethPairCount = pools.filter((p) => p.quoteKind === "eth").length;

  return (
    <div
      className={
        variant === "modal"
          ? "p-5 sm:p-6"
          : "mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10"
      }
    >
      <header className="mb-5 flex flex-col gap-3 pr-10 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-baseline gap-3">
            <h1 className="truncate text-2xl font-bold tracking-tight text-[var(--color-text)]">
              {token.symbol ?? "?"}
            </h1>
            {token.name ? (
              <span className="truncate text-sm font-medium text-[var(--color-text-muted)]">
                {token.name}
              </span>
            ) : null}
            {token.isBase ? <Badge variant="positive">base/quote</Badge> : null}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[var(--color-text-dim)]">
            <a
              href={`https://etherscan.io/token/${token.address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="tabular max-w-full truncate hover:text-[var(--color-accent)]"
            >
              {token.address}
            </a>
            <span aria-hidden="true">·</span>
            <span>{token.decimals} decimals</span>
            <span aria-hidden="true">·</span>
            <span>first seen {timeAgo(token.firstSeenAt)}</span>
          </div>
        </div>
        {variant === "modal" ? (
          <Link
            href={`/token/${token.address}`}
            className="inline-flex w-fit items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--color-text-muted)] hover:border-[color-mix(in_oklch,var(--color-accent)_30%,transparent)] hover:text-[var(--color-accent)]"
          >
            Full page
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        ) : null}
      </header>

      <section className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <MetricCard
          label="USD-eq volume"
          primary={formatUsdCompact(usdEq)}
          secondary={
            BigInt(token.volumeEth18) > 0n
              ? formatEthCompact(token.volumeEth18)
              : null
          }
        />
        <MetricCard label="Swaps" primary={formatCount(token.swapCount)} />
        <MetricCard label="Pools" primary={String(token.poolCount)} />
        <MetricCard
          label="USD on-pair"
          primary={
            BigInt(token.volumeUsd18) > 0n
              ? formatUsdCompact(Number(BigInt(token.volumeUsd18)) / 1e18)
              : "-"
          }
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-4">
          <PrimaryPoolCard
            pool={primaryPool}
            hook={primaryPool ? hooksByAddr.get(primaryPool.hook) : undefined}
          />

          <Card className="overflow-hidden">
            <div className="flex items-center justify-between gap-3 border-b border-[var(--color-border)] bg-[color-mix(in_oklch,var(--color-accent)_5%,white)] px-4 py-3">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--color-text)]">
                  Pools
                </h2>
                <p className="mt-0.5 text-xs text-[var(--color-text-dim)]">
                  Ranked by swaps so the active pools stay at the top.
                </p>
              </div>
              <Badge variant="outline" className="tabular shrink-0">
                {pools.length}
              </Badge>
            </div>

            {visiblePools.length === 0 ? (
              <EmptyState>No pools yet.</EmptyState>
            ) : (
              <div
                className={
                  variant === "modal"
                    ? "max-h-[22rem] overflow-y-auto"
                    : "overflow-hidden"
                }
              >
                <div className="hidden grid-cols-[minmax(9rem,1fr)_7rem_minmax(9rem,1fr)_5.5rem] gap-3 border-b border-[var(--color-border)] px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-dim)] md:grid">
                  <span>Pool</span>
                  <span>Quote</span>
                  <span>Hook</span>
                  <span className="text-right">Swaps</span>
                </div>
                <div className="divide-y divide-[var(--color-border)]">
                  {visiblePools.map((pool) => (
                    <PoolRow
                      key={pool.poolId}
                      pool={pool}
                      hook={hooksByAddr.get(pool.hook)}
                    />
                  ))}
                </div>
              </div>
            )}

            {hiddenPoolCount > 0 ? (
              <div className="border-t border-[var(--color-border)] bg-white/70 px-4 py-3 text-center text-xs text-[var(--color-text-dim)]">
                Showing top {visiblePools.length} pools. Open the full page for{" "}
                {hiddenPoolCount} more.
              </div>
            ) : null}
          </Card>
        </div>

        <aside className="space-y-4">
          <Card>
            <CardBody className="space-y-3">
              <SectionLabel icon={<Layers className="h-4 w-4" />}>
                Pool mix
              </SectionLabel>
              <CompactStat label="Hooked pools" value={hookedPoolCount} />
              <CompactStat label="USD pairs" value={usdPairCount} />
              <CompactStat label="ETH pairs" value={ethPairCount} />
            </CardBody>
          </Card>

          <Card>
            <CardBody className="space-y-3">
              <SectionLabel icon={<ShieldCheck className="h-4 w-4" />}>
                Hooks
              </SectionLabel>
              {hooks.length === 0 ? (
                <p className="text-sm text-[var(--color-text-dim)]">
                  No hook contracts linked to these pools.
                </p>
              ) : (
                <div className="space-y-3">
                  {hooks.slice(0, variant === "modal" ? 2 : hooks.length).map((h) => (
                    <Link
                      key={h.address}
                      href={`/hook/${h.address}`}
                      className="block rounded-2xl border border-[var(--color-border)] bg-white/70 p-3 hover:border-[color-mix(in_oklch,var(--color-accent)_30%,transparent)] hover:bg-[color-mix(in_oklch,var(--color-accent)_4%,white)]"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="tabular truncate text-xs font-semibold text-[var(--color-text-muted)]">
                          {shortAddr(h.address, 8, 6)}
                        </span>
                        <HookBehaviorBadge behavior={h.behavior} />
                      </div>
                      <div className="mt-3">
                        <HookFlagsGrid flags={h.decodedFlags} />
                      </div>
                      <div className="tabular mt-3 flex justify-between text-xs text-[var(--color-text-dim)]">
                        <span>{h.poolCount} pools</span>
                        <span>{formatCount(h.swapCount)} swaps</span>
                      </div>
                    </Link>
                  ))}
                  {variant === "modal" && hooks.length > 2 ? (
                    <p className="text-xs text-[var(--color-text-dim)]">
                      +{hooks.length - 2} more hooks on the full page.
                    </p>
                  ) : null}
                </div>
              )}
            </CardBody>
          </Card>
        </aside>
      </section>
    </div>
  );
}

function PrimaryPoolCard({
  pool,
  hook,
}: {
  pool: Pool | null;
  hook?: TokenDetailData["hooks"][number];
}) {
  if (!pool) {
    return (
      <Card>
        <EmptyState>No primary pool yet.</EmptyState>
      </Card>
    );
  }

  return (
    <Card>
      <CardBody className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
        <div className="min-w-0">
          <SectionLabel icon={<Waves className="h-4 w-4" />}>
            Primary pool
          </SectionLabel>
          <Link
            href={`/pool/${pool.poolId}`}
            className="tabular mt-2 inline-flex max-w-full items-center gap-2 truncate text-lg font-bold text-[var(--color-text)] hover:text-[var(--color-accent)]"
          >
            {shortAddr(pool.poolId, 10, 8)}
            <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
          </Link>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <QuoteKindBadge kind={pool.quoteKind} />
            {hook ? (
              <HookBehaviorBadge behavior={hook.behavior} />
            ) : (
              <Badge variant="outline">no hook</Badge>
            )}
            <Badge variant="outline" className="tabular">
              {(pool.fee / 10_000).toFixed(2)}% fee
            </Badge>
          </div>
        </div>
        <div className="flex items-center justify-between gap-5 rounded-2xl border border-[var(--color-border)] bg-[color-mix(in_oklch,var(--color-accent)_6%,white)] px-4 py-3 md:block md:rounded-3xl md:px-5 md:py-4 md:text-right">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-dim)]">
            Swaps
          </div>
          <div className="tabular text-2xl font-bold text-[var(--color-text)] md:mt-1">
            {formatCount(pool.swapCount)}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

function PoolRow({
  pool,
  hook,
}: {
  pool: Pool;
  hook?: TokenDetailData["hooks"][number];
}) {
  return (
    <Link
      href={`/pool/${pool.poolId}`}
      className="block px-4 py-3 hover:bg-[color-mix(in_oklch,var(--color-accent)_5%,white)]"
    >
      <div className="grid gap-3 md:grid-cols-[minmax(9rem,1fr)_7rem_minmax(9rem,1fr)_5.5rem] md:items-center">
        <div className="min-w-0">
          <div className="tabular truncate font-semibold text-[var(--color-text)]">
            {shortAddr(pool.poolId, 8, 6)}
          </div>
          <div className="mt-0.5 text-xs text-[var(--color-text-dim)]">
            {(pool.fee / 10_000).toFixed(2)}% fee · {formatCount(pool.swapCount)} swaps
          </div>
        </div>
        <div>
          <QuoteKindBadge kind={pool.quoteKind} />
        </div>
        <div className="min-w-0">
          {hook ? (
            <span className="inline-flex max-w-full items-center gap-2">
              <HookBehaviorBadge behavior={hook.behavior} />
              <span className="tabular truncate text-xs text-[var(--color-text-dim)]">
                {shortAddr(hook.address)}
              </span>
            </span>
          ) : (
            <span className="text-xs text-[var(--color-text-dim)]">no hook</span>
          )}
        </div>
        <div className="tabular hidden text-right font-semibold text-[var(--color-text)] md:block">
          {formatCount(pool.swapCount)}
        </div>
      </div>
    </Link>
  );
}

function MetricCard({
  label,
  primary,
  secondary,
}: {
  label: string;
  primary: string;
  secondary?: string | null;
}) {
  return (
    <Card>
      <CardBody>
        <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-dim)]">
          {label}
        </div>
        <div className="tabular mt-1 text-xl font-bold text-[var(--color-text)]">
          {primary}
        </div>
        {secondary ? (
          <div className="tabular mt-0.5 text-xs text-[var(--color-text-dim)]">
            {secondary}
          </div>
        ) : null}
      </CardBody>
    </Card>
  );
}

function CompactStat({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-[var(--color-bg-muted)] px-3 py-2">
      <span className="text-sm text-[var(--color-text-muted)]">{label}</span>
      <span className="tabular font-bold text-[var(--color-text)]">{value}</span>
    </div>
  );
}

function SectionLabel({
  children,
  icon,
}: {
  children: ReactNode;
  icon: ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--color-accent)]">
      {icon}
      {children}
    </div>
  );
}

function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div className="px-4 py-8 text-center text-sm text-[var(--color-text-muted)]">
      {children}
    </div>
  );
}

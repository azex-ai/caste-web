import Link from "next/link";
import {
  Activity,
  ArrowDownUp,
  ChevronLeft,
  ChevronRight,
  Gauge,
  Sparkles,
  Waves,
} from "lucide-react";
import { api } from "@/lib/api/client";
import { getEthUsd } from "@/lib/external/price";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Stat } from "@/components/stat";
import {
  formatEthCompact,
  formatUsdCompact,
  tokenVolumeUsdEquivalent,
} from "@/lib/format";
import { formatCount, shortAddr, timeAgo } from "@/lib/utils";
import type { Token } from "@/lib/api/types";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 25;

type SortKey = "volume" | "swapCount" | "poolCount" | "firstSeenBlock";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "volume", label: "Volume" },
  { key: "swapCount", label: "Swaps" },
  { key: "poolCount", label: "Pools" },
  { key: "firstSeenBlock", label: "Newest" },
];

type TokenWithUsd = Token & { usdEquivalent: number };

export default async function HomePage(props: {
  searchParams: Promise<{ orderBy?: string; page?: string }>;
}) {
  const sp = await props.searchParams;
  const orderBy: SortKey =
    sp.orderBy === "swapCount" ||
    sp.orderBy === "poolCount" ||
    sp.orderBy === "firstSeenBlock"
      ? sp.orderBy
      : "volume";
  const requestedPage = Math.max(1, Number.parseInt(sp.page ?? "1", 10) || 1);

  const [stats, tokenCountResult, ethUsd] = await Promise.all([
    api.stats().catch(() => null),
    api.tokensCount({ hookedOnly: true }).catch(() => null),
    getEthUsd(),
  ]);

  const tokenTotal = tokenCountResult?.count ?? stats?.memeCount ?? 0;
  const totalPages = Math.max(1, Math.ceil(tokenTotal / PAGE_SIZE));
  const page = Math.min(requestedPage, totalPages);
  const offset = (page - 1) * PAGE_SIZE;
  const serverOrderBy = orderBy === "volume" ? "volumeUsdEquivalent" : orderBy;

  const tokensRaw = await api
    .tokens({
      limit: PAGE_SIZE,
      offset,
      orderBy: serverOrderBy,
      hookedOnly: true,
    })
    .catch(() => []);

  const tokens = tokensRaw.map((t) => ({
    ...t,
    usdEquivalent: tokenVolumeUsdEquivalent(t, ethUsd),
  }));
  const startRank = offset + 1;
  const endRank = offset + tokens.length;

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-4 sm:px-6 sm:py-6">
      <header className="mb-5 rounded-[2rem] border border-white/70 bg-white/60 p-5 shadow-[0_20px_55px_rgb(255_0_122/0.07)] backdrop-blur-md sm:p-6">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div className="min-w-0">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[color-mix(in_oklch,var(--color-accent)_18%,transparent)] bg-[color-mix(in_oklch,var(--color-accent)_8%,white)] px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-accent)]">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Live v4 hook index
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-4xl font-bold tracking-tight text-[var(--color-text)] sm:text-5xl">
                  univ4-meme
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-text-muted)] sm:text-base">
                  Hooked Uniswap v4 meme launches, ranked by activity and pool
                  structure.
                </p>
              </div>
              <div className="inline-flex w-fit items-center gap-3 rounded-full border border-[var(--color-border)] bg-white px-4 py-2.5 text-xs shadow-[0_12px_30px_rgb(92_20_70/0.08)]">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-positive)] opacity-30" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[var(--color-positive)]" />
                </span>
                <span className="text-[var(--color-text-dim)]">ETH/USD</span>
                <span className="tabular font-medium text-[var(--color-text)]">
                  {ethUsd > 0 ? `$${ethUsd.toFixed(2)}` : "syncing..."}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {stats ? (
        <section className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Stat
            label="Meme tokens"
            value={formatCount(stats.memeCount)}
            tone="accent"
          />
          <Stat label="Hooks" value={formatCount(stats.hookCount)} tone="violet" />
          <Stat
            label="Hooked pools"
            value={formatCount(stats.hookedPoolCount)}
            hint={`of ${formatCount(stats.totalPoolCount)} total`}
            tone="positive"
          />
          <Stat
            label="Hook swaps"
            value={formatCount(stats.swapsThroughHookedPools)}
          />
        </section>
      ) : null}

      <section className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Activity
              className="h-4 w-4 text-[var(--color-accent)]"
              aria-hidden="true"
            />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-text)]">
              Meme tokens
            </h2>
            <Badge variant="outline" className="tabular">
              {formatCount(tokenTotal)}
            </Badge>
            <span className="text-xs text-[var(--color-text-dim)]">
              showing {tokens.length > 0 ? `${startRank}-${endRank}` : "0"}
            </span>
          </div>
          <p className="mt-1 text-xs text-[var(--color-text-dim)]">
            Page {page} of {totalPages}. Sort changes reset to the first page.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:items-end">
          <nav
            aria-label="Sort meme tokens"
            className="inline-flex w-full gap-1 rounded-full border border-[var(--color-border)] bg-white p-1 text-xs shadow-[0_14px_34px_rgb(92_20_70/0.08)] sm:w-auto"
          >
            {SORT_OPTIONS.map(({ key, label }) => {
              const active = orderBy === key;
              return (
                <Link
                  key={key}
                  href={{ query: { orderBy: key, page: 1 } }}
                  aria-current={active ? "page" : undefined}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-1.5 font-medium sm:flex-none ${
                    active
                      ? "bg-[var(--color-accent)] text-[var(--color-accent-fg)] shadow-[0_10px_22px_rgb(255_0_122/0.22)]"
                      : "text-[var(--color-text-muted)] hover:bg-[var(--color-bg-muted)] hover:text-[var(--color-text)]"
                  }`}
                >
                  {active ? (
                    <ArrowDownUp className="h-3 w-3" aria-hidden="true" />
                  ) : null}
                  {label}
                </Link>
              );
            })}
          </nav>
          <PaginationNav orderBy={orderBy} page={page} totalPages={totalPages} />
        </div>
      </section>

      <Card className="overflow-hidden">
        <TokenMobileList tokens={tokens} startRank={startRank} />
        <TokenTable tokens={tokens} startRank={startRank} />
        <PaginationFooter
          orderBy={orderBy}
          page={page}
          totalPages={totalPages}
          startRank={tokens.length > 0 ? startRank : 0}
          endRank={endRank}
          tokenTotal={tokenTotal}
        />
      </Card>
    </main>
  );
}

function TokenMobileList({
  tokens,
  startRank,
}: {
  tokens: TokenWithUsd[];
  startRank: number;
}) {
  return (
    <div className="md:hidden">
      {tokens.length === 0 ? (
        <EmptyTokens />
      ) : (
        <div className="divide-y divide-[var(--color-border)]">
          {tokens.map((t, index) => (
            <Link
              key={t.address}
              href={`/token/${t.address}`}
              className="block px-4 py-4 hover:bg-[color-mix(in_oklch,var(--color-accent)_5%,white)]"
            >
              <div className="flex items-start gap-3">
                <RankPill rank={startRank + index} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="truncate font-semibold text-[var(--color-text)]">
                      {t.symbol ?? "?"}
                    </span>
                    {t.name ? (
                      <span className="truncate text-xs text-[var(--color-text-muted)]">
                        {t.name}
                      </span>
                    ) : null}
                  </div>
                  <div className="tabular mt-0.5 text-xs text-[var(--color-text-dim)]">
                    {shortAddr(t.address)}
                  </div>
                </div>
                <div className="tabular shrink-0 text-right">
                  <div className="font-semibold text-[var(--color-text)]">
                    {formatUsdCompact(t.usdEquivalent)}
                  </div>
                  <div className="text-xs text-[var(--color-text-dim)]">
                    {formatCount(t.swapCount)} swaps
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between gap-3 text-xs text-[var(--color-text-muted)]">
                <Badge variant={t.poolCount > 1 ? "accent" : "outline"}>
                  {t.poolCount} pools
                </Badge>
                <span className="inline-flex items-center gap-1.5">
                  <Waves
                    className="h-3.5 w-3.5 text-[var(--color-text-dim)]"
                    aria-hidden="true"
                  />
                  {timeAgo(t.firstSeenAt)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function TokenTable({
  tokens,
  startRank,
}: {
  tokens: TokenWithUsd[];
  startRank: number;
}) {
  return (
    <div className="hidden overflow-x-auto md:block">
      <table className="w-full min-w-[760px] text-sm">
        <thead className="bg-[color-mix(in_oklch,var(--color-bg-muted)_82%,transparent)] text-[11px] uppercase tracking-wider text-[var(--color-text-dim)]">
          <tr>
            <th className="px-4 py-3 text-left font-semibold">Token</th>
            <th className="px-4 py-3 text-right font-semibold">Volume</th>
            <th className="px-4 py-3 text-right font-semibold">Swaps</th>
            <th className="px-4 py-3 text-right font-semibold">Pools</th>
            <th className="px-4 py-3 text-left font-semibold">First seen</th>
          </tr>
        </thead>
        <tbody>
          {tokens.length === 0 ? (
            <tr>
              <td colSpan={5}>
                <EmptyTokens />
              </td>
            </tr>
          ) : (
            tokens.map((t, index) => (
              <tr
                key={t.address}
                className="group border-t border-[var(--color-border)] hover:bg-[color-mix(in_oklch,var(--color-accent)_5%,white)]"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/token/${t.address}`}
                    className="flex items-center gap-3"
                  >
                    <RankPill rank={startRank + index} />
                    <span className="min-w-0">
                      <span className="flex items-baseline gap-2">
                        <span className="truncate font-semibold text-[var(--color-text)] group-hover:text-[var(--color-accent)]">
                          {t.symbol ?? "?"}
                        </span>
                        {t.name ? (
                          <span className="max-w-[16rem] truncate text-xs font-normal text-[var(--color-text-muted)]">
                            {t.name}
                          </span>
                        ) : null}
                      </span>
                      <span className="tabular mt-0.5 block text-xs text-[var(--color-text-dim)]">
                        {shortAddr(t.address)}
                      </span>
                    </span>
                  </Link>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="tabular font-semibold text-[var(--color-text)]">
                    {formatUsdCompact(t.usdEquivalent)}
                  </div>
                  {BigInt(t.volumeEth18) > 0n ? (
                    <div className="tabular text-xs text-[var(--color-text-dim)]">
                      {formatEthCompact(t.volumeEth18)}
                    </div>
                  ) : null}
                </td>
                <td className="tabular px-4 py-3 text-right">
                  {formatCount(t.swapCount)}
                </td>
                <td className="tabular px-4 py-3 text-right">
                  <Badge variant={t.poolCount > 1 ? "accent" : "outline"}>
                    {t.poolCount}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-xs text-[var(--color-text-muted)]">
                  <span className="inline-flex items-center gap-2">
                    <Waves
                      className="h-3.5 w-3.5 text-[var(--color-text-dim)]"
                      aria-hidden="true"
                    />
                    {timeAgo(t.firstSeenAt)}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function PaginationFooter({
  orderBy,
  page,
  totalPages,
  startRank,
  endRank,
  tokenTotal,
}: {
  orderBy: SortKey;
  page: number;
  totalPages: number;
  startRank: number;
  endRank: number;
  tokenTotal: number;
}) {
  return (
    <div className="flex flex-col gap-3 border-t border-[var(--color-border)] bg-white/70 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-xs text-[var(--color-text-dim)]">
        Showing{" "}
        <span className="tabular font-semibold text-[var(--color-text-muted)]">
          {startRank}-{endRank}
        </span>{" "}
        of{" "}
        <span className="tabular font-semibold text-[var(--color-text-muted)]">
          {formatCount(tokenTotal)}
        </span>{" "}
        hooked tokens
      </div>
      <div className="flex items-center justify-between gap-2 sm:justify-end">
        <PaginationNav orderBy={orderBy} page={page} totalPages={totalPages} />
      </div>
    </div>
  );
}

function PaginationNav({
  orderBy,
  page,
  totalPages,
}: {
  orderBy: SortKey;
  page: number;
  totalPages: number;
}) {
  return (
    <nav
      aria-label="Token pagination"
      className="inline-flex items-center gap-2"
    >
      <PageButton
        orderBy={orderBy}
        page={page - 1}
        disabled={page <= 1}
        label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        Prev
      </PageButton>
      <span className="tabular rounded-full border border-[var(--color-border)] bg-white px-3 py-2 text-xs font-semibold text-[var(--color-text-muted)]">
        {page} / {totalPages}
      </span>
      <PageButton
        orderBy={orderBy}
        page={page + 1}
        disabled={page >= totalPages}
        label="Next page"
      >
        Next
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </PageButton>
    </nav>
  );
}

function PageButton({
  orderBy,
  page,
  disabled,
  label,
  children,
}: {
  orderBy: SortKey;
  page: number;
  disabled: boolean;
  label: string;
  children: React.ReactNode;
}) {
  const className =
    "inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-white px-3 py-2 text-xs font-semibold text-[var(--color-text-muted)] shadow-[0_10px_24px_rgb(92_20_70/0.08)]";
  if (disabled) {
    return (
      <span aria-disabled="true" className={`${className} opacity-45`}>
        {children}
      </span>
    );
  }
  return (
    <Link
      href={{ query: { orderBy, page } }}
      aria-label={label}
      className={`${className} hover:border-[color-mix(in_oklch,var(--color-accent)_30%,transparent)] hover:text-[var(--color-accent)]`}
    >
      {children}
    </Link>
  );
}

function RankPill({ rank }: { rank: number }) {
  return (
    <span className="tabular flex h-8 min-w-8 shrink-0 items-center justify-center rounded-full border border-[color-mix(in_oklch,var(--color-accent)_24%,transparent)] bg-[color-mix(in_oklch,var(--color-accent)_8%,white)] px-2 text-xs font-semibold text-[var(--color-accent)]">
      {rank}
    </span>
  );
}

function EmptyTokens() {
  return (
    <div className="px-4 py-14 text-center text-[var(--color-text-muted)]">
      <div className="mx-auto flex max-w-sm flex-col items-center">
        <div className="mb-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-muted)] p-3 text-[var(--color-accent)]">
          <Gauge className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="font-medium text-[var(--color-text)]">
          No hooked meme tokens indexed yet
        </div>
        <div className="mt-1 text-xs leading-5 text-[var(--color-text-dim)]">
          Start the indexer with{" "}
          <code className="tabular text-[var(--color-text-muted)]">pnpm dev</code>{" "}
          and this list will populate as pools arrive.
        </div>
      </div>
    </div>
  );
}

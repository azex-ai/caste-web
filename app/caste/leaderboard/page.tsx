"use client";

import { useQuery } from "@tanstack/react-query";
import { CasteConnectButton } from "@/components/caste/connect-button";
import {
  fetchHourlyWinners,
  fetchMegaWinners,
  casteQueryKeys,
} from "@/lib/caste/api";
import {
  MOCK_HOURLY_WINNERS,
  MOCK_MEGA_WINNERS,
} from "@/lib/caste/mock";
import type { HourlyWinner, MegaWinner } from "@/lib/caste/types";

function shortAddr(addr: string): string {
  if (addr.length < 10) return addr;
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

function formatUsdcMicro(micro: bigint): string {
  const usd = Number(micro) / 1_000_000;
  if (usd >= 1_000_000) return `$${(usd / 1_000_000).toFixed(2)}M`;
  if (usd >= 1_000) return `$${(usd / 1_000).toFixed(2)}K`;
  return `$${usd.toFixed(2)}`;
}

function epochToTime(epoch: bigint): string {
  const ts = Number(epoch) * 3600;
  const d = new Date(ts * 1000);
  return d.toLocaleString("zh-CN", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function HourlyTable({ winners }: { winners: HourlyWinner[] }) {
  if (winners.length === 0) {
    return (
      <div className="py-10 text-center text-zinc-500">
        <p>暂无 Hourly 抽奖记录</p>
      </div>
    );
  }
  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-700">
      <table className="w-full min-w-[480px] text-sm">
        <thead className="bg-zinc-800/80 text-[11px] uppercase tracking-wider text-zinc-500">
          <tr>
            <th className="px-4 py-3 text-left font-semibold">Epoch</th>
            <th className="px-4 py-3 text-left font-semibold">赢家</th>
            <th className="px-4 py-3 text-right font-semibold">奖励</th>
          </tr>
        </thead>
        <tbody>
          {winners.map((w) => (
            <tr
              key={w.epoch.toString()}
              className="border-t border-zinc-800 hover:bg-zinc-800/40"
            >
              <td className="tabular-nums px-4 py-3 text-zinc-400">
                #{w.epoch.toString()}
                <br />
                <span className="text-[10px] text-zinc-600">
                  {epochToTime(w.epoch)}
                </span>
              </td>
              <td className="px-4 py-3">
                <a
                  href={`https://etherscan.io/address/${w.winner}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-zinc-300 hover:text-fuchsia-400"
                  aria-label={`查看地址 ${w.winner} 的 Etherscan`}
                >
                  {shortAddr(w.winner)}
                </a>
              </td>
              <td className="tabular-nums px-4 py-3 text-right font-bold text-emerald-400">
                {formatUsdcMicro(w.amount)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MegaTable({ winners }: { winners: MegaWinner[] }) {
  if (winners.length === 0) {
    return (
      <div className="py-10 text-center text-zinc-500">
        <p>首个 Mega 结算尚未触发</p>
      </div>
    );
  }
  return (
    <div className="overflow-x-auto rounded-xl border border-amber-900/50">
      <table className="w-full min-w-[480px] text-sm">
        <thead className="bg-amber-950/60 text-[11px] uppercase tracking-wider text-amber-600">
          <tr>
            <th className="px-4 py-3 text-left font-semibold">Round</th>
            <th className="px-4 py-3 text-left font-semibold">赢家</th>
            <th className="px-4 py-3 text-right font-semibold">大奖</th>
          </tr>
        </thead>
        <tbody>
          {winners.map((w) => (
            <tr
              key={w.round.toString()}
              className="border-t border-amber-900/30 hover:bg-amber-950/30"
            >
              <td className="tabular-nums px-4 py-3 text-amber-400">
                Round #{w.round.toString()}
              </td>
              <td className="px-4 py-3">
                <a
                  href={`https://etherscan.io/address/${w.winner}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-zinc-300 hover:text-amber-400"
                  aria-label={`查看地址 ${w.winner} 的 Etherscan`}
                >
                  {shortAddr(w.winner)}
                </a>
              </td>
              <td className="tabular-nums px-4 py-3 text-right font-black text-2xl text-amber-300">
                {formatUsdcMicro(w.amount)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function LeaderboardPage() {
  const hourlyQuery = useQuery({
    queryKey: casteQueryKeys.hourlyWinners(),
    queryFn: async () => {
      try {
        return await fetchHourlyWinners(24);
      } catch {
        return MOCK_HOURLY_WINNERS;
      }
    },
    staleTime: 30_000,
    placeholderData: MOCK_HOURLY_WINNERS,
  });

  const megaQuery = useQuery({
    queryKey: casteQueryKeys.megaWinners(),
    queryFn: async () => {
      try {
        return await fetchMegaWinners();
      } catch {
        return MOCK_MEGA_WINNERS;
      }
    },
    staleTime: 60_000,
    placeholderData: MOCK_MEGA_WINNERS,
  });

  const hourlyWinners = hourlyQuery.data ?? MOCK_HOURLY_WINNERS;
  const megaWinners = megaQuery.data ?? MOCK_MEGA_WINNERS;

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-black text-zinc-100">
          <span aria-hidden="true">🏆</span> Leaderboard
        </h1>
        <CasteConnectButton />
      </div>

      {/* Mega winners */}
      <section className="mb-10">
        <div className="mb-4 flex items-center gap-2">
          <span className="text-xl" aria-hidden="true">💥</span>
          <h2 className="text-lg font-bold text-amber-300">Mega Pool 历史</h2>
          <span className="rounded-full border border-amber-800 bg-amber-950/60 px-2 py-0.5 text-xs text-amber-400">
            {megaWinners.length} 轮
          </span>
        </div>
        {megaQuery.isLoading ? (
          <div className="h-32 animate-pulse rounded-xl border border-amber-900/40 bg-amber-950/20" aria-hidden="true" />
        ) : (
          <MegaTable winners={megaWinners} />
        )}
      </section>

      {/* Hourly winners */}
      <section>
        <div className="mb-4 flex items-center gap-2">
          <span className="text-xl" aria-hidden="true">⏰</span>
          <h2 className="text-lg font-bold text-zinc-200">最近 24h Hourly 赢家</h2>
          <span className="rounded-full border border-zinc-700 bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400">
            {hourlyWinners.length} 次
          </span>
        </div>
        {hourlyQuery.isLoading ? (
          <div className="h-48 animate-pulse rounded-xl border border-zinc-700 bg-zinc-800" aria-hidden="true" />
        ) : (
          <HourlyTable winners={hourlyWinners} />
        )}
      </section>
    </main>
  );
}

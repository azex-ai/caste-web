import Link from "next/link";
import { StatCard } from "@/components/caste/stat-card";
import { CountdownClock } from "@/components/caste/countdown-clock";
import { MOCK_STATS } from "@/lib/caste/mock";

export const dynamic = "force-dynamic";

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

function formatUsdcMicro(micro: bigint): string {
  const usd = Number(micro) / 1_000_000;
  if (usd >= 1_000_000) return `$${(usd / 1_000_000).toFixed(2)}M`;
  if (usd >= 1_000) return `$${(usd / 1_000).toFixed(1)}K`;
  return `$${usd.toFixed(2)}`;
}

// Server component — falls back to mock data when indexer not reachable
async function fetchStats() {
  try {
    const base =
      process.env.NEXT_PUBLIC_INDEXER_URL ?? "http://localhost:42069";
    const res = await fetch(`${base}/api/caste/stats`, {
      next: { revalidate: 15 },
    });
    if (!res.ok) throw new Error("indexer down");
    return res.json() as Promise<typeof MOCK_STATS>;
  } catch {
    return MOCK_STATS;
  }
}

const CTA_ITEMS = [
  {
    href: "/caste/mint",
    emoji: "🎰",
    label: "Mint",
    desc: "抽你的命运卡 — $6.66666 / 张",
    color:
      "border-fuchsia-700 bg-fuchsia-950/60 hover:bg-fuchsia-900/60 shadow-[0_0_20px_rgb(168_85_247/0.2)]",
    labelColor: "text-fuchsia-300",
  },
  {
    href: "/caste/swap",
    emoji: "⚡",
    label: "Swap",
    desc: "买入时时彩 — 最高 10x LEGEND",
    color:
      "border-amber-700 bg-amber-950/60 hover:bg-amber-900/60 shadow-[0_0_20px_rgb(245_158_11/0.2)]",
    labelColor: "text-amber-300",
  },
  {
    href: "/caste/gallery",
    emoji: "🖼️",
    label: "Gallery",
    desc: "查看你的 NFT 卡 + 全网稀有卡",
    color:
      "border-cyan-700 bg-cyan-950/60 hover:bg-cyan-900/60 shadow-[0_0_20px_rgb(6_182_212/0.2)]",
    labelColor: "text-cyan-300",
  },
  {
    href: "/caste/leaderboard",
    emoji: "🏆",
    label: "Leaderboard",
    desc: "Hourly 赢家 + Mega 大奖历史",
    color:
      "border-emerald-700 bg-emerald-950/60 hover:bg-emerald-900/60 shadow-[0_0_20px_rgb(52_211_153/0.2)]",
    labelColor: "text-emerald-300",
  },
] as const;

export default async function CasteLandingPage() {
  const stats = await fetchStats();

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-10 sm:px-6 sm:py-16">
      {/* Hero */}
      <section className="mb-12 text-center">
        <div
          className="mb-4 inline-flex items-center gap-2 rounded-full border border-fuchsia-800 bg-fuchsia-950/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-fuchsia-300"
          aria-label="$CASTE 项目标签"
        >
          <span aria-hidden="true">🎲</span> v4 Hook Meme · Ethereum Mainnet
        </div>

        <h1 className="mb-3 text-5xl font-black tracking-tight text-zinc-100 sm:text-7xl">
          $CASTE
        </h1>
        <p className="mb-2 text-lg font-medium text-zinc-400 sm:text-xl">
          加密世界的种姓制度
        </p>
        <p className="text-2xl font-bold text-zinc-200 sm:text-3xl">
          "Roll your caste. Trade your fate."
        </p>

        {/* Glowing background orb */}
        <div
          className="pointer-events-none absolute left-1/2 top-32 -translate-x-1/2 h-64 w-64 rounded-full bg-fuchsia-600/20 blur-3xl"
          aria-hidden="true"
        />
      </section>

      {/* Stats bar */}
      <section
        className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-4"
        aria-label="实时统计"
      >
        <StatCard
          label="已 Mint 总量"
          value={formatCount(stats.totalMinted)}
          sub="NFT 卡片"
          tone="fuchsia"
        />
        <StatCard
          label="Mega Pool"
          value={formatUsdcMicro(stats.megaPool)}
          sub="USDC 奖池"
          tone="amber"
        />
        <div className="flex items-center justify-center rounded-2xl border border-red-800 bg-red-950/60 p-4">
          <CountdownClock
            deadlineUnix={stats.megaDeadline}
            label="FOMO 截止"
          />
        </div>
        <StatCard
          label="队列长度"
          value={stats.queueLength}
          sub={`Hourly Pool: ${formatUsdcMicro(stats.hourlyPool)}`}
          tone="emerald"
        />
      </section>

      {/* CTA grid */}
      <section
        className="grid grid-cols-1 gap-4 sm:grid-cols-2"
        aria-label="功能入口"
      >
        {CTA_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={[
              "group flex flex-col gap-3 rounded-3xl border p-6 transition-all",
              item.color,
            ].join(" ")}
          >
            <div className="flex items-center gap-3">
              <span className="text-4xl" aria-hidden="true">
                {item.emoji}
              </span>
              <span
                className={[
                  "text-xl font-black group-hover:underline",
                  item.labelColor,
                ].join(" ")}
              >
                {item.label}
              </span>
            </div>
            <p className="text-sm text-zinc-400">{item.desc}</p>
          </Link>
        ))}
      </section>

      {/* Footer tagline */}
      <footer className="mt-12 text-center text-xs text-zinc-600">
        $CASTE — Uniswap v4 Hook Meme · 不构成投资建议 · DYOR
      </footer>
    </main>
  );
}

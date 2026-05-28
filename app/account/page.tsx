"use client";

import Link from "next/link";
import { useAccount } from "wagmi";

import { Ticker, Footer } from "@/components/caste/caste-chrome";
import { CasteCard } from "@/components/caste/caste-card";
import { TierBadge } from "@/components/caste/tier-badge";
import { StatCard } from "@/components/caste/stat-card";
import { TIERS } from "@/lib/caste/mock";
import { useUserPosition } from "@/lib/caste/hooks";
import type { CardData } from "@/lib/caste/types";
import type { CardRow } from "@/lib/caste/response-types";

const ONE_E18 = 10n ** 18n;
const ONE_E6 = 10n ** 6n;
const TIER_KEYS = ["leek", "kol", "whale", "mev", "miner", "team", "vc", "mm", "reg", "cex"] as const;

function shortAddr(a?: string): string {
  if (!a || a.length < 12) return a ?? "—";
  return `${a.slice(0, 6)}…${a.slice(-4)}`;
}

function bigToNum(s: string | null | undefined, scale: bigint): number {
  // Mirror leaderboard's guard: indexer rows can carry null amount strings
  // before the corresponding settle event lands. Treat as 0 instead of
  // throwing on BigInt(null).
  if (s == null) return 0;
  return Number(BigInt(s) / scale);
}

function fmtAgo(secAgo: number): string {
  if (secAgo < 60) return `${Math.max(secAgo, 0)}s`;
  if (secAgo < 3600) return `${Math.floor(secAgo / 60)}m`;
  if (secAgo < 86400) return `${Math.floor(secAgo / 3600)}h`;
  return `${Math.floor(secAgo / 86400)}d`;
}

function cardRowToCard(row: CardRow): CardData {
  return {
    id: Number(row.tokenId),
    tier: row.tier ?? 0,
    variant: row.variant ?? 0,
    sig: row.signature ?? 0,
    traits: [row.trait0 ?? 0, row.trait1 ?? 1, row.trait2 ?? 2],
    swaps: 0,
    jackpots: 0,
  };
}

export default function AccountV1Page() {
  const { address } = useAccount();
  const { data: user } = useUserPosition(address);
  const nowSec = Math.floor(Date.now() / 1000);

  const pos = user?.position;
  const flippedCards = (user?.cards ?? []).filter((c) => c.flipped);
  const sealedCount = (user?.cards ?? []).filter((c) => !c.flipped).length;

  // Derive packed tier counts from flipped cards.
  const tierCounts: number[] = TIER_KEYS.map((_, i) => flippedCards.filter((c) => c.tier === i).length);
  const totalFlipped = pos?.cardsFlipped ?? flippedCards.length;
  const highest = tierCounts.reduceRight((acc, c, i) => (acc < 0 && c > 0 ? i : acc), -1);
  const tHi = highest >= 0 ? TIERS[highest] : null;

  const totalPayout = pos ? bigToNum(pos.totalPayout, ONE_E18) : 0;
  const hourlyWinnings = pos ? bigToNum(pos.hourlyWinnings, ONE_E6) : 0;
  const megaWinnings = pos ? bigToNum(pos.megaWinnings, ONE_E6) : 0;

  // Top 4 flipped by payout. toSorted returns a new array — no need for spread.
  const topFlipped = flippedCards
    .toSorted((a, b) => (BigInt(a.payout ?? "0") < BigInt(b.payout ?? "0") ? 1 : -1))
    .slice(0, 4);

  const tickerItems = [
    { tag: "▸ YOU", text: address ? `${sealedCount} sealed · ${totalFlipped} flipped · highest ${tHi?.cn.toUpperCase() ?? "—"}` : "connect wallet", color: "var(--acid)" },
    { tag: "▸ getHighestTier()", text: "O(1) lookup · 1 SLOAD · ~5,100 gas", color: "var(--orchid)" },
    { tag: "▸ LIFETIME", text: `+${(totalPayout / 1e3).toFixed(0)}K CASTE flip payout · $${hourlyWinnings.toLocaleString()} hourly`, color: "var(--jade)" },
  ];

  return (
    <div>
      <Ticker items={tickerItems} />

      <section style={{ padding: "28px 40px 20px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 40, flexWrap: "wrap" }}>
        <div>
          <div className="mono" style={{ fontSize: 11, letterSpacing: "0.3em", color: "var(--ink-600)", marginBottom: 8 }}>/CASTE/ACCOUNT · V1</div>
          <h1 style={{ margin: 0, display: "flex", alignItems: "baseline", gap: 16, flexWrap: "wrap" }}>
            <span className="display" style={{ fontSize: 48, color: "var(--bone)", lineHeight: 1 }}>{shortAddr(address)}</span>
          </h1>
          {tHi && (
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 14 }}>
              <TierBadge tier={highest} variant={2} size="md" />
              <span className="mono" style={{ fontSize: 11, color: "var(--ink-700)", letterSpacing: "0.1em" }}>HIGHEST TIER · RESERVED FOR V2 BUFFS</span>
            </div>
          )}
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link href="/swap" style={{ padding: "12px 22px", background: "var(--acid)", color: "var(--ink-000)", fontFamily: "var(--f-display)", fontSize: 13, letterSpacing: "0.12em", borderRadius: 4, textDecoration: "none" }}>
            BUY → MINT SEALED
          </Link>
          <Link href="/mycards" style={{ padding: "12px 22px", background: "transparent", color: "var(--gold-hi)", border: "1px solid var(--gold)", fontFamily: "var(--f-mono)", fontSize: 12, letterSpacing: "0.18em", borderRadius: 4, textDecoration: "none" }}>
            FLIP MY {sealedCount} →
          </Link>
        </div>
      </section>

      {!address && (
        <section style={{ padding: "0 40px 40px" }}>
          <div style={{ padding: 24, textAlign: "center", color: "var(--ink-600)", fontFamily: "var(--f-mono)", fontSize: 12, letterSpacing: "0.15em", border: "1px dashed var(--ink-400)", borderRadius: 6 }}>
            CONNECT WALLET TO SEE YOUR POSITION
          </div>
        </section>
      )}

      {address && (
        <>
          <section style={{ padding: "10px 40px 20px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr 1fr", gap: 14 }}>
              <div style={{ padding: 22, background: "linear-gradient(135deg, oklch(0.20 0.12 115 / 0.25), var(--ink-200))", border: "1px solid var(--acid-lo)", borderRadius: 6, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, var(--acid-lo), var(--acid), var(--acid-lo))" }} />
                <div className="mono" style={{ fontSize: 10, letterSpacing: "0.25em", color: "var(--acid)", marginBottom: 8 }}>FLIP PAYOUTS</div>
                <div className="led" style={{ fontSize: 40, color: "var(--bone)", lineHeight: 0.9 }}>+{(totalPayout / 1e3).toFixed(0)}K</div>
                <div className="mono" style={{ fontSize: 11, color: "var(--jade)", marginTop: 14 }}>
                  lifetime CASTE from buffer · {totalFlipped} flips
                </div>
              </div>
              <StatCard label="CARDS HELD" value={pos?.cardsHeld ?? 0} meta={`${pos?.cardsMintedTotal ?? 0} all-time mints`} tone="neutral" />
              <StatCard label="SEALED · UNFLIPPED" value={sealedCount} meta="pack-rips waiting" tone="blood" />
              <StatCard label="FLIPPED" value={totalFlipped} meta={`${pos?.mythicCards ?? 0} mythics`} tone="acid" />
              <StatCard label="LOTTERY WON" value={`$${(hourlyWinnings / 1000).toFixed(1)}K`} meta={`${pos?.hourlyWins ?? 0}× hourly · ${pos?.megaWins ?? 0}× mega`} tone="gold" />
            </div>
          </section>

          <section style={{ padding: "14px 40px 20px" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 18 }}>
              <span className="display" style={{ fontSize: 32, color: "var(--bone)" }}>Tier Counter</span>
              <span className="display" style={{ fontSize: 14, color: "var(--orchid)", letterSpacing: "0.2em" }}>
                10 × uint16 / SLOT · ON-CHAIN STORAGE SHAPE
              </span>
              <div style={{ flex: 1, height: 1, background: "var(--ink-400)" }} />
              <span className="chip">getHighestTier · O(1)</span>
            </div>

            <div style={{ padding: 24, border: "1px solid var(--orchid)", borderRadius: 8, background: "linear-gradient(135deg, oklch(0.22 0.10 320 / 0.18), var(--ink-200))" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(10, 1fr)", gap: 8 }}>
                {TIER_KEYS.map((tk, i) => {
                  const tier = TIERS[i]!;
                  const count = tierCounts[i] ?? 0;
                  const isHighest = i === highest;
                  return (
                    <div
                      key={tk}
                      style={{
                        padding: 14,
                        borderRadius: 6,
                        background: count > 0 ? "var(--ink-100)" : "var(--ink-200)",
                        border: isHighest ? "2px solid var(--orchid)" : `1px solid ${count > 0 ? tier.color : "var(--ink-400)"}`,
                        position: "relative",
                        overflow: "hidden",
                        boxShadow: isHighest ? "0 0 16px oklch(0.62 0.24 320 / 0.4)" : "none",
                      }}
                    >
                      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: tier.color, opacity: count > 0 ? 1 : 0.3 }} />
                      <div className="mono" style={{ fontSize: 8, color: "var(--ink-600)", letterSpacing: "0.15em", marginTop: 2 }}>
                        BIT {i * 16}-{i * 16 + 15}
                      </div>
                      <div style={{ textAlign: "center", marginTop: 4, fontSize: 22 }}>{tier.emoji}</div>
                      <div className="display" style={{ fontSize: 11, color: count > 0 ? "var(--bone)" : "var(--ink-600)", textAlign: "center", marginTop: 2, letterSpacing: "0.05em" }}>
                        {tier.cn.toUpperCase()}
                      </div>
                      <div className="led" style={{ fontSize: 28, color: count > 0 ? tier.color : "var(--ink-500)", textAlign: "center", marginTop: 6, lineHeight: 1 }}>
                        {count.toString().padStart(2, "0")}
                      </div>
                      {isHighest && (
                        <div style={{ position: "absolute", bottom: 4, left: 0, right: 0, textAlign: "center" }}>
                          <span className="mono" style={{ fontSize: 7, padding: "1px 5px", background: "var(--orchid)", color: "var(--bone)", letterSpacing: "0.15em", borderRadius: 2 }}>
                            ★ HIGHEST
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <section style={{ padding: "14px 40px 28px" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 18 }}>
              <span className="display" style={{ fontSize: 28, color: "var(--bone)" }}>Top Flips</span>
              <span className="mono" style={{ fontSize: 10, color: "var(--gold-hi)", letterSpacing: "0.2em" }}>· TOP {topFlipped.length} BY PAYOUT</span>
              <div style={{ flex: 1, height: 1, background: "var(--ink-400)" }} />
              <Link href="/gallery" style={{ fontFamily: "var(--f-mono)", fontSize: 11, color: "var(--acid)", letterSpacing: "0.15em", textDecoration: "none" }}>
                VIEW ALL →
              </Link>
            </div>
            {topFlipped.length === 0 && (
              <div style={{ padding: 24, textAlign: "center", color: "var(--ink-600)", fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: "0.15em", border: "1px dashed var(--ink-400)", borderRadius: 6 }}>
                NO FLIPS YET
              </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
              {topFlipped.map((c) => {
                const card = cardRowToCard(c);
                const payout = c.payout ? bigToNum(c.payout, ONE_E18) : 0;
                const multX = (c.multiplierBp ?? 10000) / 10000;
                const ago = c.flipTime ? fmtAgo(nowSec - Number(c.flipTime)) : "—";
                return (
                  <div key={c.tokenId}>
                    <CasteCard card={card} w={170} h={244} />
                    <div style={{ marginTop: 6 }}>
                      <div className="mono" style={{ fontSize: 9, color: "var(--gold-hi)", letterSpacing: "0.15em" }}>
                        +{payout >= 1e6 ? `${(payout / 1e6).toFixed(2)}M` : `${(payout / 1e3).toFixed(0)}K`}
                      </div>
                      <div className="mono" style={{ fontSize: 8, color: "var(--ink-700)" }}>
                        ×{multX.toFixed(1)} · {ago} ago
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {(pos?.megaWins ?? 0) + (pos?.hourlyWins ?? 0) > 0 && (
            <section style={{ padding: "0 40px 28px" }}>
              <div style={{ border: "1px solid var(--jade)", borderRadius: 6, background: "oklch(0.20 0.08 155 / 0.10)", padding: 18 }}>
                <div className="display" style={{ fontSize: 13, color: "var(--jade)", letterSpacing: "0.1em", marginBottom: 8 }}>
                  LOTTERY · LIFETIME
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <div className="led" style={{ fontSize: 22, color: "var(--jade)" }}>{pos?.hourlyWins ?? 0}× · ${hourlyWinnings.toLocaleString()}</div>
                    <div className="mono" style={{ fontSize: 10, color: "var(--ink-700)" }}>hourly settles</div>
                  </div>
                  <div>
                    <div className="led" style={{ fontSize: 22, color: "var(--gold-hi)" }}>{pos?.megaWins ?? 0}× · ${megaWinnings.toLocaleString()}</div>
                    <div className="mono" style={{ fontSize: 10, color: "var(--ink-700)" }}>mega settles</div>
                  </div>
                </div>
              </div>
            </section>
          )}
        </>
      )}

      <Footer />
    </div>
  );
}

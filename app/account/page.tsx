import Link from "next/link";
import { Ticker, Footer } from "@/components/caste/caste-chrome";
import { CasteCard } from "@/components/caste/caste-card";
import { TierBadge } from "@/components/caste/tier-badge";
import { StatCard } from "@/components/caste/stat-card";
import { TIERS, FLIPPED_CARDS, SEALED_CARDS, ME_V1 } from "@/lib/caste/mock";

export const dynamic = "force-static";

const TIER_KEYS = ["leek", "kol", "whale", "mev", "miner", "team", "vc", "mm", "reg", "cex"] as const;

export default function AccountV1Page() {
  const me = ME_V1;
  const counts = TIER_KEYS.map((k) => me.packed[k]);
  const totalFlipped = counts.reduce((a, b) => a + b, 0);
  const highest = me.highestTier;
  const tHi = TIERS[highest]!;

  const tickerItems = [
    { tag: "▸ YOU",      text: `${me.totalSealed} sealed · ${me.totalFlipped} flipped · highest tier ${tHi.cn.toUpperCase()} ${tHi.emoji}`, color: "var(--acid)" },
    { tag: "▸ getHighestTier()", text: `O(1) lookup · 1 SLOAD · ${(2100 + 3000).toLocaleString()} gas`, color: "var(--orchid)" },
    { tag: "▸ LIFETIME", text: `+${(me.lifetimeFlipPayout / 1e6).toFixed(2)}M CASTE from flips · $${me.lifetimeHourlyWon.toLocaleString()} hourly wins`, color: "var(--jade)" },
  ];

  return (
    <div>
      <Ticker items={tickerItems} />

      <section style={{ padding: "44px 60px 28px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 40, flexWrap: "wrap" }}>
        <div>
          <div className="mono" style={{ fontSize: 11, letterSpacing: "0.3em", color: "var(--ink-600)", marginBottom: 8 }}>/CASTE/ACCOUNT · V1</div>
          <h1 style={{ margin: 0, display: "flex", alignItems: "baseline", gap: 16, flexWrap: "wrap" }}>
            <span className="display" style={{ fontSize: 80, color: "var(--bone)", lineHeight: 1 }}>{me.ens}</span>
            <span className="display" style={{ fontSize: 24, color: "var(--ink-700)" }}>· {me.addr}</span>
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 14 }}>
            <TierBadge tier={highest} variant={2} size="md" />
            <span className="mono" style={{ fontSize: 11, color: "var(--ink-700)", letterSpacing: "0.1em" }}>HIGHEST TIER · RESERVED FOR V2 BUFFS</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link href="/swap" style={{ padding: "12px 22px", background: "var(--acid)", color: "var(--ink-000)", fontFamily: "var(--f-display)", fontSize: 13, letterSpacing: "0.12em", borderRadius: 4, textDecoration: "none" }}>
            BUY → MINT SEALED
          </Link>
          <Link href="/mycards" style={{ padding: "12px 22px", background: "transparent", color: "var(--gold-hi)", border: "1px solid var(--gold)", fontFamily: "var(--f-mono)", fontSize: 12, letterSpacing: "0.18em", borderRadius: 4, textDecoration: "none" }}>
            FLIP MY {me.totalSealed} →
          </Link>
        </div>
      </section>

      <section style={{ padding: "12px 60px 28px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr 1fr", gap: 14 }}>
          <div style={{ padding: 22, background: "linear-gradient(135deg, oklch(0.20 0.12 115 / 0.25), var(--ink-200))", border: "1px solid var(--acid-lo)", borderRadius: 6, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, var(--acid-lo), var(--acid), var(--acid-lo))" }} />
            <div className="mono" style={{ fontSize: 10, letterSpacing: "0.25em", color: "var(--acid)", marginBottom: 8 }}>$CASTE BALANCE</div>
            <div className="led" style={{ fontSize: 64, color: "var(--bone)", lineHeight: 0.9 }}>{me.casteBalance.toLocaleString()}</div>
            <div className="mono" style={{ fontSize: 11, color: "var(--jade)", marginTop: 14 }}>
              + {(me.lifetimeFlipPayout / 1e6).toFixed(2)}M from flips · all-time
            </div>
          </div>
          <StatCard label="USDC" value={`$${me.usdcBalance.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} meta="ready to buy" tone="neutral" />
          <StatCard label="SEALED · UNFLIPPED" value={me.totalSealed} meta="pack-rips waiting" tone="blood" />
          <StatCard label="FLIPPED" value={me.totalFlipped} meta={`across ${counts.filter((c) => c > 0).length} tiers`} tone="acid" />
          <StatCard label="LOTTERY WON" value={`$${(me.lifetimeHourlyWon / 1000).toFixed(1)}K`} meta="1× hourly · 0× mega" tone="gold" />
        </div>
      </section>

      <section style={{ padding: "20px 60px 28px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 18 }}>
          <span className="display" style={{ fontSize: 32, color: "var(--bone)" }}>Packed Tier Counter</span>
          <span className="display" style={{ fontSize: 14, color: "var(--orchid)", letterSpacing: "0.2em" }}>
            10 × uint16 / SLOT · ON-CHAIN STORAGE SHAPE
          </span>
          <div style={{ flex: 1, height: 1, background: "var(--ink-400)" }} />
          <span className="chip">getHighestTier · O(1)</span>
        </div>

        <div style={{ padding: 24, border: "1px solid var(--orchid)", borderRadius: 8, background: "linear-gradient(135deg, oklch(0.22 0.10 320 / 0.18), var(--ink-200))" }}>
          <div style={{ marginBottom: 16, padding: 14, background: "var(--ink-100)", borderRadius: 4, border: "1px dashed var(--orchid)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
              <span className="mono" style={{ fontSize: 10, color: "var(--orchid)", letterSpacing: "0.25em" }}>_packedTierCounts[{me.addr}]</span>
              <span className="mono" style={{ fontSize: 10, color: "var(--ink-700)" }}>uint256 · 1 SLOAD</span>
            </div>
            <div className="mono" style={{ fontSize: 13, color: "var(--bone)", letterSpacing: "0.05em", wordBreak: "break-all" }}>
              0x0000_0000_0000_<span style={{ color: "var(--t-cex)" }}>0000</span>_<span style={{ color: "var(--t-reg)" }}>0000</span>_<span style={{ color: "var(--t-mm)" }}>0000</span>_<span style={{ color: "var(--t-vc)" }}>0001</span>_<span style={{ color: "var(--t-team)" }}>0001</span>_<span style={{ color: "var(--t-miner)" }}>0000</span>_<span style={{ color: "var(--t-mev)" }}>0002</span>_<span style={{ color: "var(--t-whale)" }}>0000</span>_<span style={{ color: "var(--t-kol)" }}>0003</span>_<span style={{ color: "var(--t-leek)" }}>0008</span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(10, 1fr)", gap: 8 }}>
            {TIER_KEYS.map((tk, i) => {
              const tier = TIERS[i]!;
              const count = me.packed[tk];
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
                      <span
                        className="mono"
                        style={{
                          fontSize: 7,
                          padding: "1px 5px",
                          background: "var(--orchid)",
                          color: "var(--bone)",
                          letterSpacing: "0.15em",
                          borderRadius: 2,
                        }}
                      >
                        ★ HIGHEST
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, padding: 14, background: "var(--ink-100)", borderRadius: 4 }}>
            <div>
              <div className="mono" style={{ fontSize: 9, color: "var(--ink-600)", letterSpacing: "0.2em" }}>TOTAL FLIPPED</div>
              <div className="led" style={{ fontSize: 22, color: "var(--bone)", marginTop: 2 }}>{totalFlipped}</div>
            </div>
            <div>
              <div className="mono" style={{ fontSize: 9, color: "var(--ink-600)", letterSpacing: "0.2em" }}>TIERS REACHED</div>
              <div className="led" style={{ fontSize: 22, color: "var(--bone)", marginTop: 2 }}>{counts.filter((c) => c > 0).length} / 10</div>
            </div>
            <div>
              <div className="mono" style={{ fontSize: 9, color: "var(--ink-600)", letterSpacing: "0.2em" }}>getHighestTier()</div>
              <div className="display" style={{ fontSize: 16, color: tHi.color, marginTop: 4 }}>
                {tHi.cn} {tHi.emoji}
              </div>
            </div>
            <div>
              <div className="mono" style={{ fontSize: 9, color: "var(--ink-600)", letterSpacing: "0.2em" }}>UNFLIPPED EXCLUDED</div>
              <div className="mono" style={{ fontSize: 11, color: "var(--bone-dim)", marginTop: 4, lineHeight: 1.4 }}>
                only flipped cards count · {me.totalSealed} sealed don&apos;t
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 14, padding: 14, border: "1px dashed var(--orchid)", borderRadius: 6, background: "oklch(0.22 0.10 320 / 0.10)" }}>
          <div className="mono" style={{ fontSize: 11, color: "var(--orchid)", letterSpacing: "0.15em", lineHeight: 1.7 }}>
            ▸ <strong>Reserved for V2:</strong> Phase-B sell-tax discount, milestone airdrops, buy multiplier upgrade. V1 only exposes the surface — no consumers yet.
          </div>
        </div>
      </section>

      <section style={{ padding: "20px 60px 40px", display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 28 }}>
        <div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 18 }}>
            <span className="display" style={{ fontSize: 28, color: "var(--bone)" }}>Your Flipped</span>
            <span className="mono" style={{ fontSize: 10, color: "var(--gold-hi)", letterSpacing: "0.2em" }}>
              · {FLIPPED_CARDS.length} REVEALED · TOP 4
            </span>
            <div style={{ flex: 1, height: 1, background: "var(--ink-400)" }} />
            <Link href="/gallery" style={{ fontFamily: "var(--f-mono)", fontSize: 11, color: "var(--acid)", letterSpacing: "0.15em", textDecoration: "none" }}>
              VIEW ALL →
            </Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
            {FLIPPED_CARDS.map((c) => (
              <div key={c.id}>
                <CasteCard card={c} w={170} h={244} />
                <div style={{ marginTop: 6 }}>
                  <div className="mono" style={{ fontSize: 9, color: "var(--gold-hi)", letterSpacing: "0.15em" }}>
                    +{c.payout >= 1e6 ? `${(c.payout / 1e6).toFixed(2)}M` : c.payout >= 1e3 ? `${(c.payout / 1e3).toFixed(0)}K` : c.payout}
                  </div>
                  <div className="mono" style={{ fontSize: 8, color: "var(--ink-700)" }}>
                    ×{(c.multBp / 1e4).toFixed(1)} · {c.flippedAgo} ago
                  </div>
                </div>
              </div>
            ))}
          </div>

          {SEALED_CARDS.length > 0 && (
            <div style={{ marginTop: 22, padding: 18, border: "1px solid var(--blood-lo)", borderRadius: 6, background: "linear-gradient(135deg, oklch(0.20 0.10 25 / 0.12), var(--ink-200))" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span className="display" style={{ fontSize: 16, color: "var(--blood-hi)", letterSpacing: "0.1em" }}>
                  {SEALED_CARDS.length} SEALED · AWAITING FLIP
                </span>
                <span className="chip chip--blood breathe">● {SEALED_CARDS.filter((c) => c.canFlip).length} READY</span>
              </div>
              <div className="mono" style={{ fontSize: 10, color: "var(--ink-700)", lineHeight: 1.6 }}>
                Each sealed card hides a tier × variant × multiplier roll worth ~900–2.4M CASTE.
                <span style={{ color: "var(--bone-dim)" }}> &nbsp;Until you flip, this counter won&apos;t move.</span>
              </div>
              <Link
                href="/mycards"
                style={{
                  display: "inline-block",
                  marginTop: 12,
                  padding: "10px 22px",
                  background: "var(--acid)",
                  color: "var(--ink-000)",
                  fontFamily: "var(--f-display)",
                  fontSize: 12,
                  letterSpacing: "0.18em",
                  border: "none",
                  borderRadius: 4,
                  textDecoration: "none",
                }}
              >
                ▸ GO TO /MYCARDS
              </Link>
            </div>
          )}
        </div>

        <div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 18 }}>
            <span className="display" style={{ fontSize: 28, color: "var(--bone)" }}>Your Activity</span>
            <div style={{ flex: 1, height: 1, background: "var(--ink-400)" }} />
          </div>

          <div style={{ border: "1px solid var(--ink-400)", borderRadius: 6, background: "var(--ink-200)", overflow: "hidden" }}>
            <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--ink-400)", display: "flex", justifyContent: "space-between" }}>
              <span className="display" style={{ fontSize: 13, color: "var(--gold-hi)", letterSpacing: "0.1em" }}>RECENT FLIPS · TOP PAYOUTS</span>
              <span className="mono" style={{ fontSize: 10, color: "var(--ink-600)" }}>{me.totalFlipped} lifetime</span>
            </div>
            {FLIPPED_CARDS.map((c, i) => (
              <div
                key={c.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "60px 1fr auto",
                  gap: 12,
                  padding: "10px 16px",
                  borderBottom: i < FLIPPED_CARDS.length - 1 ? "1px dashed var(--ink-400)" : "none",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 56,
                    borderRadius: 3,
                    background: TIERS[c.tier]!.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                  }}
                >
                  {TIERS[c.tier]!.emoji}
                </div>
                <div>
                  <div className="display" style={{ fontSize: 13, color: "var(--bone)", letterSpacing: "0.05em" }}>
                    {TIERS[c.tier]!.cn} · ×{(c.multBp / 1e4).toFixed(1)}
                  </div>
                  <div className="mono" style={{ fontSize: 9, color: "var(--ink-700)", marginTop: 2 }}>
                    id #{c.id} · flipped {c.flippedAgo} ago
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div className="led" style={{ fontSize: 18, color: "var(--gold-hi)" }}>
                    +{c.payout >= 1e6 ? `${(c.payout / 1e6).toFixed(2)}M` : `${(c.payout / 1000).toFixed(0)}K`}
                  </div>
                  <div className="mono" style={{ fontSize: 8, color: "var(--ink-600)" }}>$CASTE · from buffer</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 14, border: "1px solid var(--ink-400)", borderRadius: 6, background: "var(--ink-200)" }}>
            <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--ink-400)" }}>
              <span className="display" style={{ fontSize: 13, color: "var(--jade)", letterSpacing: "0.1em" }}>HOURLY WINS · 1 LIFETIME</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", padding: "12px 16px" }}>
              <div>
                <div className="display" style={{ fontSize: 14, color: "var(--bone)" }}>Epoch 471,998 · 21:00</div>
                <div className="mono" style={{ fontSize: 10, color: "var(--ink-700)", marginTop: 2 }}>lastBuyer · 44 units · settled 12m ago</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div className="led" style={{ fontSize: 22, color: "var(--jade)" }}>+$6,188</div>
                <div className="mono" style={{ fontSize: 9, color: "var(--ink-600)" }}>USDC · settled</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

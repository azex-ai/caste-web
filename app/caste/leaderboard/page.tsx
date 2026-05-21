import { Ticker, Footer } from "@/components/caste/caste-chrome";
import { Countdown } from "@/components/caste/countdown-clock";
import { CasteCard } from "@/components/caste/caste-card";
import { POOLS_V1, HISTORY_V1, MOCK_CARDS } from "@/lib/caste/mock";

export const dynamic = "force-static";

export default function LeaderboardV1Page() {
  const p = POOLS_V1;
  const tickerItems = [
    { tag: "▸ EPOCH 472,000", text: "0x9f3a…ce21 won $7,842 hourly — lastBuyer of the hour with 88 units", color: "var(--jade)" },
    { tag: "▸ MEGA 03",       text: "0x7b2c…d104 took $142,880 with a $199 last buy", color: "var(--gold-hi)" },
    { tag: "▸ ROLLOVER",      text: "Epoch 471,999 had zero buys — $2,412 rolled into 472,000", color: "var(--orchid)" },
  ];

  return (
    <div>
      <Ticker items={tickerItems} />

      <section style={{ padding: "44px 60px 28px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 40, flexWrap: "wrap" }}>
        <div>
          <div className="mono" style={{ fontSize: 11, letterSpacing: "0.3em", color: "var(--ink-600)", marginBottom: 8 }}>/CASTE/LEADERBOARD · LAST-BUYER WINS</div>
          <h1 style={{ margin: 0, display: "flex", alignItems: "baseline", gap: 16, flexWrap: "wrap" }}>
            <span className="display" style={{ fontSize: 80, color: "var(--bone)", lineHeight: 1 }}>Winners</span>
            <span className="display" style={{ fontSize: 28, color: "var(--gold-hi)" }}>/ V1 · LAST-BUYER MODEL</span>
          </h1>
          <p style={{ fontSize: 15, color: "var(--ink-700)", marginTop: 12, maxWidth: 820, lineHeight: 1.65 }}>
            V1 throws out the weighted-tickets model. Whoever bought last in an epoch wins Hourly. Whoever bought last globally wins Mega.
            Empty epochs <strong style={{ color: "var(--gold-hi)" }}>roll forward</strong> — the pot grows until someone buys.
          </p>
        </div>
        <Countdown hh="00" mm={p.hourly.drawIn.mm} ss={p.hourly.drawIn.ss} state="warning" label="NEXT HOURLY DRAW" />
      </section>

      <section style={{ padding: "12px 60px 28px" }}>
        <div style={{ position: "relative", padding: 28, borderRadius: 8, background: "linear-gradient(135deg, oklch(0.18 0.06 82) 0%, oklch(0.10 0.02 60) 100%)", border: "1px solid var(--gold)", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg, var(--gold-hi), var(--gold), var(--gold-hi))" }} />
          <div style={{ position: "absolute", top: -100, right: -100, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, oklch(0.82 0.16 82 / 0.15), transparent 70%)" }} />

          <div style={{ position: "relative", display: "grid", gridTemplateColumns: "1fr auto auto", gap: 36, alignItems: "center" }}>
            <div>
              <div className="mono" style={{ fontSize: 10, color: "var(--gold-hi)", letterSpacing: "0.3em", marginBottom: 6 }}>
                👑 CURRENT MEGA POOL · ROUND {p.mega.round.toString().padStart(2, "0")} · LIVE
              </div>
              <div className="display" style={{ fontSize: 12, color: "var(--ink-700)", letterSpacing: "0.1em" }}>
                WHOEVER IS lastBuyer AT DEADLINE-ZERO TAKES THE FULL POT
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginTop: 12, flexWrap: "wrap" }}>
                <span className="display" style={{ fontSize: 28, color: p.mega.lastBuyer.isYou ? "var(--acid)" : "var(--bone)", letterSpacing: "-0.02em" }}>
                  {p.mega.lastBuyer.addr}
                </span>
                <span className="chip chip--gold">LAST BUY · {p.mega.lastBuyer.units}u · {p.mega.lastBuyer.txAgo} ago</span>
              </div>
              <div className="led" style={{ fontSize: 88, color: "var(--gold-hi)", textShadow: "var(--glow-gold)", lineHeight: 0.9, marginTop: 14 }}>
                ${p.mega.pool.toLocaleString()}
              </div>
              <div className="mono" style={{ fontSize: 11, color: "var(--bone-dim)", marginTop: 8, letterSpacing: "0.1em" }}>
                ▸ inflow {p.mega.inflowRate} · cap NOW + 24h
              </div>
            </div>
            <Countdown hh={p.mega.deadline.hh} mm={p.mega.deadline.mm} ss={p.mega.deadline.ss} state={p.mega.deadline.state} label="DEADLINE" />
            <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "center" }}>
              <button
                disabled
                style={{
                  padding: "10px 22px",
                  background: "var(--ink-300)",
                  color: "var(--ink-600)",
                  border: "1px solid var(--ink-500)",
                  borderRadius: 4,
                  fontFamily: "var(--f-display)",
                  fontSize: 11,
                  letterSpacing: "0.15em",
                  cursor: "not-allowed",
                }}
              >
                settleMega()
              </button>
              <span className="mono" style={{ fontSize: 9, color: "var(--ink-600)", letterSpacing: "0.1em" }}>UNLOCKS @ 0:00:00</span>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "20px 60px 40px", display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 28 }}>
        <div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 18 }}>
            <span className="display" style={{ fontSize: 32, color: "var(--bone)" }}>Hourly · Last 8 Epochs</span>
            <span className="display" style={{ fontSize: 14, color: "var(--jade)", letterSpacing: "0.2em" }}>EPOCH-LAST-BUYER</span>
            <div style={{ flex: 1, height: 1, background: "var(--ink-400)" }} />
            <span className="chip">
              <span className="breathe">●</span> NEXT {p.hourly.drawIn.mm}:{p.hourly.drawIn.ss}
            </span>
          </div>

          <div style={{ border: "1px solid var(--ink-400)", borderRadius: 6, overflow: "hidden", background: "var(--ink-200)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "60px 80px 1fr 80px 110px 80px", gap: 12, padding: "10px 18px", borderBottom: "1px solid var(--ink-400)", background: "var(--ink-300)" }}>
              {["HOUR", "EPOCH", "LAST BUYER", "UNITS", "PAID OUT", "STATUS"].map((h) => (
                <span key={h} className="mono" style={{ fontSize: 9, color: "var(--ink-600)", letterSpacing: "0.2em" }}>
                  {h}
                </span>
              ))}
            </div>
            {HISTORY_V1.hourly.map((w, i, arr) => (
              <div
                key={w.epoch}
                style={{
                  display: "grid",
                  gridTemplateColumns: "60px 80px 1fr 80px 110px 80px",
                  gap: 12,
                  padding: "12px 18px",
                  borderBottom: i < arr.length - 1 ? "1px solid var(--ink-300)" : "none",
                  alignItems: "center",
                  background: i === 0 ? "oklch(0.30 0.08 82 / 0.15)" : w.rollover ? "oklch(0.22 0.10 320 / 0.15)" : w.isYou ? "oklch(0.30 0.18 115 / 0.18)" : "transparent",
                }}
              >
                <span className="led" style={{ fontSize: 18, color: i === 0 ? "var(--gold-hi)" : w.isYou ? "var(--acid)" : "var(--bone)" }}>{w.hour}</span>
                <span className="mono" style={{ fontSize: 10, color: "var(--ink-700)" }}>#{w.epoch.toString().slice(-4)}</span>
                <div>
                  <div className="mono" style={{ fontSize: 12, color: w.isYou ? "var(--acid)" : w.rollover ? "var(--orchid)" : "var(--bone)" }}>{w.winner}</div>
                  {w.rolledIn > 0 && (
                    <div className="mono" style={{ fontSize: 9, color: "var(--gold-hi)", marginTop: 2 }}>
                      + ${w.rolledIn.toLocaleString()} rolled in from prev epoch
                    </div>
                  )}
                  {w.rollover && (
                    <div className="mono" style={{ fontSize: 9, color: "var(--orchid)", marginTop: 2 }}>
                      → rolled ${w.amount.toLocaleString()} into #{w.rolloverTo}
                    </div>
                  )}
                </div>
                <span className="led" style={{ fontSize: 16, color: w.units > 0 ? "var(--bone)" : "var(--ink-600)" }}>{w.units > 0 ? w.units : "—"}</span>
                <span className="led" style={{ fontSize: 20, color: w.prize > 0 ? "var(--gold-hi)" : "var(--ink-600)" }}>
                  {w.prize > 0 ? `$${w.prize.toLocaleString()}` : "—"}
                </span>
                <span className="mono" style={{ fontSize: 9, color: w.rollover ? "var(--orchid)" : w.prize > 0 ? "var(--jade)" : "var(--ink-600)", letterSpacing: "0.15em" }}>
                  {w.rollover ? "ROLLED" : w.prize > 0 ? "SETTLED" : "—"}
                </span>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginTop: 14 }}>
            <MiniStat label="8h TOTAL" value="$41.6K" tone="gold" />
            <MiniStat label="ROLLOVERS" value="1 / 8" tone="orchid" />
            <MiniStat label="UNIQUE WINS" value="7" tone="bone" />
            <MiniStat label="AVG PRIZE" value="$5.9K" tone="bone" />
          </div>

          <div style={{ marginTop: 14, padding: 14, border: "1px dashed var(--jade)", borderRadius: 6, background: "oklch(0.20 0.08 155 / 0.12)" }}>
            <div className="mono" style={{ fontSize: 11, color: "var(--jade)", letterSpacing: "0.15em", lineHeight: 1.7 }}>
              ▸ <strong>How it works:</strong> every buy writes <code>epochLastBuyer[block.timestamp / 1h] = buyer</code>. After the epoch ends, anyone can call{" "}
              <code>settleHourly(epoch)</code> to pay that buyer the full pool. Empty epochs roll the pool into the next epoch&apos;s pot.
            </div>
          </div>
        </div>

        <div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 18 }}>
            <span className="display" style={{ fontSize: 32, color: "var(--bone)" }}>Mega · Rounds</span>
            <span className="display" style={{ fontSize: 14, color: "var(--gold-hi)", letterSpacing: "0.2em" }}>FOMO HISTORY</span>
            <div style={{ flex: 1, height: 1, background: "var(--ink-400)" }} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {HISTORY_V1.mega.map((w, i) => (
              <div
                key={w.round}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  gap: 14,
                  padding: 16,
                  border: i === 0 ? "1px solid var(--gold)" : "1px solid var(--ink-400)",
                  borderRadius: 6,
                  background: i === 0 ? "oklch(0.18 0.06 82 / 0.2)" : "var(--ink-200)",
                }}
              >
                <div>
                  <div className="mono" style={{ fontSize: 9, color: "var(--ink-600)", letterSpacing: "0.2em" }}>
                    ROUND {w.round.toString().padStart(2, "0")} · {w.date}
                  </div>
                  <div className="display" style={{ fontSize: 18, color: "var(--bone)", letterSpacing: "-0.01em", marginTop: 4 }}>
                    {w.winner}
                  </div>
                  <div className="mono" style={{ fontSize: 10, color: "var(--ink-700)", marginTop: 4 }}>
                    last buy {w.lastBuy} · phase {w.phase}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div className="led" style={{ fontSize: 32, color: i === 0 ? "var(--gold-hi)" : "var(--bone)", lineHeight: 1 }}>
                    ${(w.usdc / 1000).toFixed(0)}K
                  </div>
                  <div className="mono" style={{ fontSize: 9, color: "var(--ink-600)", letterSpacing: "0.15em", marginTop: 4 }}>
                    USDC PAID
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 16, padding: 18, border: "1px dashed var(--ink-400)", borderRadius: 6 }}>
            <div className="mono" style={{ fontSize: 10, color: "var(--ink-600)", letterSpacing: "0.25em", marginBottom: 10 }}>ALL-TIME MEGA</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <div className="led" style={{ fontSize: 28, color: "var(--gold-hi)" }}>$313K</div>
                <div className="mono" style={{ fontSize: 10, color: "var(--ink-700)" }}>total paid · 3 rounds</div>
              </div>
              <div>
                <div className="led" style={{ fontSize: 28, color: "var(--bone)" }}>17.8d</div>
                <div className="mono" style={{ fontSize: 10, color: "var(--ink-700)" }}>avg round length</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "10px 60px 60px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 18 }}>
          <span className="display" style={{ fontSize: 32, color: "var(--bone)" }}>Top Flippers</span>
          <span className="display" style={{ fontSize: 14, color: "var(--orchid)", letterSpacing: "0.2em" }}>
            BIGGEST BUFFER DRAINS · 24H
          </span>
          <div style={{ flex: 1, height: 1, background: "var(--ink-400)" }} />
          <span className="mono" style={{ fontSize: 11, color: "var(--ink-600)" }}>from 4.2B Card Buffer</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
          {([
            { card: MOCK_CARDS[1]!, addr: "cz.eth",              isYou: false, payout: 2_400_000, mult: 10.0, ago: "1m" },
            { card: MOCK_CARDS[0]!, addr: "0x6e91…aa83 (you)",   isYou: true,  payout: 287_500,   mult: 5.0,  ago: "3s" },
            { card: MOCK_CARDS[3]!, addr: "vitalik.eth",          isYou: false, payout: 92_100,    mult: 5.0,  ago: "8m" },
            { card: MOCK_CARDS[7]!, addr: "0x9f3a…ce21",          isYou: false, payout: 54_000,    mult: 3.0,  ago: "12m" },
          ]).map((f, i) => (
            <div
              key={i}
              style={{
                padding: 14,
                border: i === 0 ? "1px solid var(--orchid)" : "1px solid var(--ink-400)",
                borderRadius: 6,
                background: i === 0 ? "oklch(0.22 0.12 320 / 0.18)" : "var(--ink-200)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
                <span className="mono" style={{ fontSize: 11, color: f.isYou ? "var(--acid)" : "var(--bone)" }}>{f.addr}</span>
                <span className="mono" style={{ fontSize: 9, color: "var(--ink-700)" }}>#{i + 1}</span>
              </div>
              <CasteCard card={f.card} w={210} h={300} />
              <div style={{ marginTop: 10 }}>
                <div className="mono" style={{ fontSize: 9, color: "var(--gold-hi)", letterSpacing: "0.2em" }}>FLIP PAYOUT</div>
                <div className="led" style={{ fontSize: 28, color: "var(--gold-hi)", textShadow: "var(--glow-gold)" }}>
                  +{f.payout >= 1e6 ? `${(f.payout / 1e6).toFixed(2)}M` : `${(f.payout / 1000).toFixed(0)}K`}
                </div>
                <div className="mono" style={{ fontSize: 10, color: "var(--ink-700)", marginTop: 4 }}>
                  ×{f.mult.toFixed(1)} multiplier · flipped {f.ago} ago
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}

function MiniStat({ label, value, tone }: { label: string; value: string; tone: "gold" | "orchid" | "bone" }) {
  const c = tone === "gold" ? "var(--gold-hi)" : tone === "orchid" ? "var(--orchid)" : "var(--bone)";
  return (
    <div style={{ padding: "10px 12px", border: "1px solid var(--ink-400)", borderRadius: 4, background: "var(--ink-200)" }}>
      <div className="mono" style={{ fontSize: 9, color: "var(--ink-600)", letterSpacing: "0.2em" }}>{label}</div>
      <div className="led" style={{ fontSize: 22, color: c, marginTop: 4 }}>{value}</div>
    </div>
  );
}

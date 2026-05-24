import { Ticker, Footer } from "@/components/caste/caste-chrome";
import { Countdown } from "@/components/caste/countdown-clock";
import { PHASE_STATE, POOLS_V1, LASTBUYER_FEED } from "@/lib/caste/mock";

export const dynamic = "force-static";

export default function PoolsV1Page() {
  const p = POOLS_V1;
  const bufferPct = (p.buffer.remaining / p.buffer.initial) * 100;

  const tickerItems = [
    { tag: "▸ MEGA",   text: `$${p.mega.pool.toLocaleString()} → ${p.mega.lastBuyer.addr} · deadline ${p.mega.deadline.hh}:${p.mega.deadline.mm}:${p.mega.deadline.ss}`, color: "var(--gold-hi)" },
    { tag: "▸ HOURLY", text: `$${p.hourly.pool.toLocaleString(undefined, { maximumFractionDigits: 0 })} · last buyer ${p.hourly.lastBuyer.addr} · draw ${p.hourly.drawIn.mm}:${p.hourly.drawIn.ss}`, color: "var(--jade)" },
    { tag: "▸ BUFFER", text: `${(p.buffer.remaining / 1e9).toFixed(2)}B CASTE · ${p.buffer.flipsExecuted.toLocaleString()} flips paid · ~${(p.buffer.flipsRemaining / 1000).toFixed(0)}k left`, color: "var(--orchid)" },
  ];

  return (
    <div>
      <Ticker items={tickerItems} />

      <section style={{ padding: "44px 60px 16px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 40, flexWrap: "wrap" }}>
        <div>
          <div className="mono" style={{ fontSize: 11, letterSpacing: "0.3em", color: "var(--ink-600)", marginBottom: 8 }}>/CASTE/POOLS · 4-POOL ARCHITECTURE</div>
          <h1 style={{ margin: 0 }}>
            <span className="display" style={{ fontSize: 80, color: "var(--bone)", lineHeight: 1 }}>The Four Pools.</span>
          </h1>
          <p style={{ fontSize: 15, color: "var(--ink-700)", maxWidth: 820, marginTop: 12, lineHeight: 1.65 }}>
            V1 collapses the old five-bucket fee model into <strong style={{ color: "var(--bone)" }}>four pools, two flows</strong>:
            <strong style={{ color: "var(--cobalt)" }}> LP</strong> + <strong style={{ color: "var(--orchid)" }}>Card Buffer</strong> hold the token supply;
            <strong style={{ color: "var(--jade)" }}> Hourly</strong> + <strong style={{ color: "var(--gold-hi)" }}>Mega</strong> hold the USDC from buy/sell fees.
            Both lotteries pay the <strong style={{ color: "var(--acid)" }}>lastBuyer</strong> — no tickets, no weights.
          </p>
        </div>
        <div className="chip chip--gold" style={{ fontSize: 12, padding: "8px 16px" }}>
          BLOCK {p.block.toLocaleString()} · EPOCH {p.epoch}
        </div>
      </section>

      <section style={{ padding: "20px 60px 28px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 14 }}>
          <PoolSummaryCard color="var(--cobalt)"  label="01 · LP"          value={`${(p.lp.caste / 1e9).toFixed(2)}B`}                        subValue={`+ $${(p.lp.usdc / 1000).toFixed(0)}K USDC`} meta="single-sided · permanent · JIT-locked 64 blk" emoji="🔒" />
          <PoolSummaryCard color="var(--orchid)"  label="02 · CARD BUFFER" value={`${(p.buffer.remaining / 1e9).toFixed(2)}B`}                  subValue={`${bufferPct.toFixed(1)}% remaining`}      meta="one-way drain · flip payouts only" emoji="🃏" />
          <PoolSummaryCard color="var(--jade)"    label="03 · HOURLY"      value={`$${p.hourly.pool.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} subValue={`epoch ${p.epoch}`}      meta={`→ lastBuyer · draw in ${p.hourly.drawIn.mm}:${p.hourly.drawIn.ss}`} emoji="⏰" />
          <PoolSummaryCard color="var(--gold-hi)" label="04 · MEGA"        value={`$${p.mega.pool.toLocaleString()}`}                          subValue={`round ${p.mega.round.toString().padStart(2, "0")}`} meta={`→ lastBuyer · FOMO ${p.mega.deadline.hh}:${p.mega.deadline.mm}:${p.mega.deadline.ss}`} emoji="👑" />
        </div>
      </section>

      <section style={{ padding: "12px 60px 24px" }}>
        <div style={{ position: "relative", padding: "32px 36px", borderRadius: 8, background: "linear-gradient(135deg, oklch(0.20 0.10 82) 0%, oklch(0.08 0.02 60) 100%)", border: "1px solid var(--gold)", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg, var(--gold-hi), var(--gold), var(--gold-hi))" }} />
          <div className="halftone" style={{ position: "absolute", inset: 0, opacity: 0.12 }} />

          <div style={{ position: "relative", display: "grid", gridTemplateColumns: "1.5fr auto 1fr", gap: 36, alignItems: "center" }}>
            <div>
              <div className="mono" style={{ fontSize: 11, color: "var(--gold-hi)", letterSpacing: "0.3em", marginBottom: 6 }}>
                👑 MEGA POOL · ROUND {p.mega.round.toString().padStart(2, "0")}
              </div>
              <div className="display" style={{ fontSize: 14, color: "var(--ink-700)", letterSpacing: "0.15em", marginBottom: 6 }}>
                WHOEVER BUYS LAST AT DEADLINE-ZERO TAKES IT ALL
              </div>
              <div className="led" style={{ fontSize: 128, color: "var(--gold-hi)", lineHeight: 0.85, textShadow: "var(--glow-gold)" }}>
                ${p.mega.pool.toLocaleString()}
              </div>
              <div className="mono" style={{ fontSize: 11, color: "var(--bone-dim)", marginTop: 10 }}>
                inflow: {p.mega.inflowRate} of swap fees · cap 24h from last buy
              </div>

              <div style={{ marginTop: 14, padding: 14, background: "oklch(0 0 0 / 0.3)", border: "1px dashed var(--gold-hi)", borderRadius: 4 }}>
                <div className="mono" style={{ fontSize: 10, color: "var(--gold-hi)", letterSpacing: "0.25em", marginBottom: 4 }}>
                  CURRENT LAST BUYER · KING
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span className="display" style={{ fontSize: 22, color: p.mega.lastBuyer.isYou ? "var(--acid)" : "var(--bone)" }}>
                    {p.mega.lastBuyer.addr}
                  </span>
                  <span className="mono" style={{ fontSize: 11, color: "var(--bone-dim)" }}>
                    {p.mega.lastBuyer.units} units · added +{p.mega.boostLast}s · {p.mega.lastBuyer.txAgo} ago
                  </span>
                </div>
              </div>
            </div>
            <div style={{ width: 1, alignSelf: "stretch", background: "linear-gradient(180deg, transparent, var(--gold), transparent)" }} />
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
              <Countdown hh={p.mega.deadline.hh} mm={p.mega.deadline.mm} ss={p.mega.deadline.ss} state={p.mega.deadline.state} label="FOMO DEADLINE" />
              <div className="mono" style={{ fontSize: 9, color: "var(--ink-700)", letterSpacing: "0.15em", textAlign: "center", lineHeight: 1.6 }}>
                +60s × log10(units) per buy<br />
                cap = NOW + 24h
              </div>
              <button
                disabled
                style={{
                  padding: "14px 26px",
                  background: "var(--ink-300)",
                  color: "var(--ink-600)",
                  border: "1px solid var(--ink-500)",
                  borderRadius: 4,
                  fontFamily: "var(--f-display)",
                  fontSize: 12,
                  letterSpacing: "0.15em",
                  cursor: "not-allowed",
                }}
              >
                settleMega() · LOCKED
              </button>
              <div className="mono" style={{ fontSize: 9, color: "var(--ink-600)", letterSpacing: "0.1em", textAlign: "center" }}>
                unlocks at 00:00:00
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "20px 60px 28px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>
        <div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 18 }}>
            <span className="display" style={{ fontSize: 32, color: "var(--bone)" }}>Card Buffer</span>
            <span className="mono" style={{ fontSize: 11, color: "var(--orchid)", letterSpacing: "0.2em" }}>· ONE-WAY DRAIN</span>
            <div style={{ flex: 1, height: 1, background: "var(--ink-400)" }} />
          </div>
          <div style={{ padding: 24, border: "1px solid var(--orchid)", borderRadius: 8, background: "linear-gradient(135deg, oklch(0.22 0.12 320 / 0.18), var(--ink-200))" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 14 }}>
              <div>
                <div className="mono" style={{ fontSize: 10, color: "var(--orchid)", letterSpacing: "0.25em", marginBottom: 4 }}>
                  REMAINING · OF 4.2B INITIAL
                </div>
                <div className="led" style={{ fontSize: 52, color: "var(--bone)", lineHeight: 0.9 }}>
                  {(p.buffer.remaining / 1e9).toFixed(2)}B
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div className="mono" style={{ fontSize: 10, color: "var(--ink-600)", letterSpacing: "0.2em" }}>DRAINED LIFETIME</div>
                <div className="led" style={{ fontSize: 32, color: "var(--orchid)" }}>{(p.buffer.drained / 1e6).toFixed(0)}M</div>
                <div className="mono" style={{ fontSize: 9, color: "var(--ink-700)" }}>
                  {p.buffer.flipsExecuted.toLocaleString()} flips · avg {(p.buffer.avgPayout / 1000).toFixed(1)}k / flip
                </div>
              </div>
            </div>

            <div style={{ position: "relative", height: 22, background: "var(--ink-300)", borderRadius: 2, overflow: "hidden", border: "1px solid var(--ink-400)" }}>
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  left: 0,
                  width: `${100 - bufferPct}%`,
                  background:
                    "repeating-linear-gradient(45deg, oklch(0.20 0.10 320 / 0.4), oklch(0.20 0.10 320 / 0.4) 6px, transparent 6px, transparent 12px)",
                }}
              />
              <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: `${100 - bufferPct}%`, borderRight: "2px solid var(--orchid)" }} />
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span className="mono" style={{ fontSize: 10, color: "var(--bone)", letterSpacing: "0.15em" }}>
                  {bufferPct.toFixed(2)}% LEFT
                </span>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 14, padding: 12, background: "var(--ink-100)", borderRadius: 4, border: "1px dashed var(--ink-400)" }}>
              <div>
                <div className="mono" style={{ fontSize: 9, color: "var(--ink-600)", letterSpacing: "0.2em" }}>EST. FLIPS LEFT</div>
                <div className="led" style={{ fontSize: 24, color: "var(--orchid)", marginTop: 2 }}>
                  {(p.buffer.flipsRemaining / 1000).toFixed(0)}k
                </div>
              </div>
              <div>
                <div className="mono" style={{ fontSize: 9, color: "var(--ink-600)", letterSpacing: "0.2em" }}>BUFFER POLICY</div>
                <div className="mono" style={{ fontSize: 10, color: "var(--bone-dim)", lineHeight: 1.5, marginTop: 2 }}>
                  on deplete: payout capped + <code>BufferDepleted</code> event emitted
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 18 }}>
            <span className="display" style={{ fontSize: 32, color: "var(--bone)" }}>Hourly · lastBuyer</span>
            <span className="mono" style={{ fontSize: 11, color: "var(--jade)", letterSpacing: "0.2em" }}>· EPOCH {p.hourly.epoch}</span>
            <div style={{ flex: 1, height: 1, background: "var(--ink-400)" }} />
          </div>
          <div style={{ padding: 24, border: "1px solid var(--jade)", borderRadius: 8, background: "linear-gradient(135deg, oklch(0.20 0.08 155 / 0.18), var(--ink-200))" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
              <div>
                <div className="mono" style={{ fontSize: 10, color: "var(--jade)", letterSpacing: "0.25em" }}>THIS HOUR · POOL</div>
                <div className="led" style={{ fontSize: 48, color: "var(--bone)", lineHeight: 0.9, marginTop: 6 }}>
                  ${p.hourly.pool.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
                <div className="mono" style={{ fontSize: 10, color: "var(--ink-700)", marginTop: 4 }}>inflow: {p.hourly.inflowRate}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div className="mono" style={{ fontSize: 10, color: "var(--ink-600)", letterSpacing: "0.25em" }}>DRAWS IN</div>
                <div className="led" style={{ fontSize: 40, color: "var(--gold-hi)", lineHeight: 0.9, marginTop: 6 }}>
                  {p.hourly.drawIn.mm}:{p.hourly.drawIn.ss}
                </div>
                <button
                  style={{
                    marginTop: 8,
                    padding: "6px 14px",
                    background: "transparent",
                    color: "var(--jade)",
                    border: "1px solid var(--jade)",
                    fontFamily: "var(--f-mono)",
                    fontSize: 10,
                    letterSpacing: "0.15em",
                    borderRadius: 3,
                    cursor: "pointer",
                  }}
                >
                  settleHourly(epoch) at draw
                </button>
              </div>
            </div>

            <div style={{ borderTop: "1px dashed var(--jade)", paddingTop: 14 }}>
              <div className="mono" style={{ fontSize: 10, color: "var(--ink-700)", letterSpacing: "0.2em", marginBottom: 10 }}>
                EPOCH LAST-BUYER · THIS EPOCH&apos;S WINNER (UNLESS BEATEN)
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {LASTBUYER_FEED.slice(0, 5).map((b, i) => (
                  <div
                    key={i}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "60px 1fr 80px 70px",
                      gap: 10,
                      alignItems: "center",
                      padding: "8px 10px",
                      borderRadius: 3,
                      background: i === 0 ? "oklch(0.30 0.18 115 / 0.18)" : "transparent",
                    }}
                  >
                    <span className="mono" style={{ fontSize: 10, color: i === 0 ? "var(--acid)" : "var(--ink-700)", letterSpacing: "0.1em" }}>
                      {b.ago}
                    </span>
                    <span className="mono" style={{ fontSize: 11, color: b.isYou ? "var(--acid)" : i === 0 ? "var(--bone)" : "var(--bone-dim)" }}>
                      {b.addr}
                      {b.isYou && (
                        <span className="mono" style={{ marginLeft: 6, fontSize: 7, padding: "1px 4px", background: "var(--acid)", color: "var(--ink-000)", letterSpacing: "0.1em", borderRadius: 2 }}>
                          YOU
                        </span>
                      )}
                    </span>
                    <span className="mono" style={{ fontSize: 10, color: "var(--ink-700)", textAlign: "right" }}>{b.units}u</span>
                    <span className="mono" style={{ fontSize: 10, color: i === 0 ? "var(--jade)" : "var(--ink-600)", textAlign: "right" }}>
                      {i === 0 ? "★ LEAD" : `+${b.boost}s`}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {p.hourly.rolledOver > 0 && (
              <div style={{ marginTop: 12, padding: 10, border: "1px dashed var(--gold-hi)", borderRadius: 4, background: "oklch(0.18 0.08 82 / 0.18)" }}>
                <div className="mono" style={{ fontSize: 10, color: "var(--gold-hi)", letterSpacing: "0.15em" }}>
                  ▸ ROLLOVER · ${p.hourly.rolledOver.toLocaleString()} carried in from empty epoch {p.hourly.epoch - 1}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section style={{ padding: "20px 60px 28px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 18 }}>
          <span className="display" style={{ fontSize: 32, color: "var(--bone)" }}>LP · Single-Sided · Permanently Locked</span>
          <span className="mono" style={{ fontSize: 11, color: "var(--cobalt)", letterSpacing: "0.2em" }}>· NO WITHDRAW FN · JIT 64 BLK</span>
          <div style={{ flex: 1, height: 1, background: "var(--ink-400)" }} />
        </div>
        <div
          style={{
            padding: 24,
            border: "1px solid var(--cobalt)",
            borderRadius: 8,
            background: "linear-gradient(135deg, oklch(0.20 0.10 245 / 0.15), var(--ink-200))",
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr auto",
            gap: 22,
            alignItems: "center",
          }}
        >
          <div>
            <div className="mono" style={{ fontSize: 10, color: "var(--acid)", letterSpacing: "0.25em", marginBottom: 6 }}>CASTE SIDE · ASKS-ONLY</div>
            <div className="led" style={{ fontSize: 44, color: "var(--bone)" }}>{(p.lp.caste / 1e9).toFixed(2)}B</div>
            <div className="mono" style={{ fontSize: 10, color: "var(--ink-700)", marginTop: 4 }}>
              16.8B initial · placed in [startTick − 46020, startTick − 1]
            </div>
          </div>
          <div>
            <div className="mono" style={{ fontSize: 10, color: "var(--cobalt)", letterSpacing: "0.25em", marginBottom: 6 }}>USDC ACCUMULATED</div>
            <div className="led" style={{ fontSize: 44, color: "var(--bone)" }}>${(p.lp.usdc / 1000).toFixed(0)}K</div>
            <div className="mono" style={{ fontSize: 10, color: "var(--ink-700)", marginTop: 4 }}>filled as buyers walk up the ask ladder</div>
          </div>
          <div>
            <div className="mono" style={{ fontSize: 10, color: "var(--ink-700)", letterSpacing: "0.25em", marginBottom: 6 }}>JIT LOCKOUT</div>
            <div className="led" style={{ fontSize: 44, color: "var(--blood-hi)" }}>64 BLK</div>
            <div className="mono" style={{ fontSize: 10, color: "var(--ink-700)", marginTop: 4 }}>beforeRemoveLiquidity reverts if lpAddBlock + 64 ≥ now</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <div style={{ width: 80, height: 80, borderRadius: 8, border: "1px solid var(--cobalt)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 42 }}>
              🔒
            </div>
            <div className="mono" style={{ fontSize: 9, color: "var(--cobalt)", letterSpacing: "0.2em", textAlign: "center", lineHeight: 1.4 }}>
              LP HELD BY HOOK<br />
              NO <code>withdraw()</code>
              <br />
              FUNCTION EXISTS
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "20px 60px 40px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 18 }}>
          <span className="display" style={{ fontSize: 32, color: "var(--bone)" }}>Where Each Dollar Goes</span>
          <span className="mono" style={{ fontSize: 11, color: "var(--ink-600)", letterSpacing: "0.2em" }}>· 1.5% BUY · 25% / 1.5% SELL</span>
          <div style={{ flex: 1, height: 1, background: "var(--ink-400)" }} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
          <FundCol title="BUY · $6.66666" subtitle="Phase A AND B" tone="var(--acid)"
            lanes={[
              { pct: 98.5, l: "→ LP CURVE", v: "$6.566", c: "var(--cobalt)" },
              { pct: 1.0,  l: "→ HOURLY",   v: "$0.067", c: "var(--jade)" },
              { pct: 0.5,  l: "→ MEGA",     v: "$0.033", c: "var(--gold-hi)" },
            ]}
          />
          <FundCol title="PHASE A SELL · 25%" subtitle="while cards < 10k" tone="var(--blood-hi)" hot
            lanes={[
              { pct: 75.0,  l: "→ SELLER", v: "≈ $3.75", c: "var(--bone-dim)" },
              { pct: 16.67, l: "→ HOURLY", v: "≈ $0.84", c: "var(--jade)" },
              { pct: 8.33,  l: "→ MEGA",   v: "≈ $0.42", c: "var(--gold-hi)" },
            ]}
          />
          <FundCol title="PHASE B SELL · 1.5%" subtitle="after 10k cards minted" tone="var(--jade)"
            lanes={[
              { pct: 98.5, l: "→ SELLER", v: "≈ $4.93",  c: "var(--bone-dim)" },
              { pct: 1.0,  l: "→ HOURLY", v: "≈ $0.05",  c: "var(--jade)" },
              { pct: 0.5,  l: "→ MEGA",   v: "≈ $0.025", c: "var(--gold-hi)" },
            ]}
          />
        </div>

        <div style={{ marginTop: 16, padding: 14, border: "1px dashed var(--ink-400)", borderRadius: 6, background: "var(--ink-200)" }}>
          <div className="mono" style={{ fontSize: 11, color: "var(--bone-dim)", lineHeight: 1.7, letterSpacing: "0.03em" }}>
            <strong style={{ color: "var(--orchid)" }}>Card Buffer never sees fees.</strong> Its 4.2B CASTE is allocated once at T0 and only drains via <code>flipCard()</code> payouts.
            <span style={{ color: "var(--ink-700)" }}> &nbsp;Fees are USDC; Buffer is CASTE — they don&apos;t intersect.</span>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function PoolSummaryCard({ color, label, value, subValue, meta, emoji }: { color: string; label: string; value: string; subValue: string; meta: string; emoji: string }) {
  return (
    <div style={{ padding: 18, border: `1px solid ${color}`, borderRadius: 6, background: "var(--ink-200)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: color }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span className="mono" style={{ fontSize: 9, color, letterSpacing: "0.25em" }}>{label}</span>
        <span style={{ fontSize: 18 }}>{emoji}</span>
      </div>
      <div className="led" style={{ fontSize: 38, color: "var(--bone)", lineHeight: 0.95, marginTop: 8 }}>{value}</div>
      <div className="mono" style={{ fontSize: 10, color, marginTop: 4, letterSpacing: "0.05em" }}>{subValue}</div>
      <div className="mono" style={{ fontSize: 9, color: "var(--ink-700)", marginTop: 8, lineHeight: 1.5 }}>{meta}</div>
    </div>
  );
}

type Lane = { pct: number; l: string; v: string; c: string };
function FundCol({ title, subtitle, tone, lanes, hot }: { title: string; subtitle: string; tone: string; lanes: Lane[]; hot?: boolean }) {
  return (
    <div style={{ padding: 18, border: hot ? "1px solid var(--blood-lo)" : "1px solid var(--ink-400)", borderRadius: 6, background: hot ? "oklch(0.16 0.04 25 / 0.15)" : "var(--ink-200)" }}>
      <div className="mono" style={{ fontSize: 10, color: tone, letterSpacing: "0.25em" }}>{title}</div>
      <div className="mono" style={{ fontSize: 10, color: "var(--ink-700)", marginTop: 2, marginBottom: 12 }}>{subtitle}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {lanes.map((b, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "56px 1fr 70px", gap: 10, alignItems: "center", padding: "8px 10px", background: "var(--ink-100)", borderLeft: `4px solid ${b.c}`, borderRadius: 3 }}>
            <span className="led" style={{ fontSize: 16, color: b.c }}>{b.pct}%</span>
            <span className="display" style={{ fontSize: 12, color: "var(--bone)", letterSpacing: "0.08em" }}>{b.l}</span>
            <span className="led" style={{ fontSize: 13, color: "var(--bone)", textAlign: "right" }}>{b.v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

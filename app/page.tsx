import Link from "next/link";
import { Ticker, Footer } from "@/components/caste/caste-chrome";
import { SealedCard } from "@/components/caste/sealed-card";
import { CasteCard } from "@/components/caste/caste-card";
import { StatCard } from "@/components/caste/stat-card";
import { Countdown } from "@/components/caste/countdown-clock";
import { MOCK_CARDS, PHASE_STATE, POOLS_V1 } from "@/lib/caste/mock";

export const dynamic = "force-static";

export default function LandingV1Page() {
  const phase = POOLS_V1;
  const tickerItems = [
    { tag: "▸ BUY",     text: "0x9f3a…ce21 just sealed 4 cards — flipping in 14s", color: "var(--acid)" },
    { tag: "▸ FLIP",    text: "cz.eth ripped MYTHIC CEX · paid 2.4M CASTE from buffer", color: "var(--gold-hi)" },
    { tag: "▸ PHASE A", text: `${PHASE_STATE.cardsMinted.toLocaleString()} / ${PHASE_STATE.cardsCap.toLocaleString()} cards minted · 25% sell tax active`, color: "var(--blood-hi)" },
    { tag: "▸ BUFFER",  text: `${(phase.buffer.remaining / 1e9).toFixed(2)}B / 4.2B CASTE left · ~${(phase.buffer.flipsRemaining / 1000).toFixed(0)}k flips before depletion`, color: "var(--orchid)" },
    { tag: "▸ MEGA",    text: `$${phase.mega.pool.toLocaleString()} → last buyer (you) at deadline-zero`, color: "var(--gold-hi)" },
  ];

  return (
    <div style={{ width: "100%" }}>
      <Ticker items={tickerItems} />

      <section style={{ position: "relative", padding: "60px 60px 48px", overflow: "hidden" }}>
        <div className="gridbg" style={{ position: "absolute", inset: 0, opacity: 0.4 }} />
        <div style={{ position: "absolute", top: -240, right: -120, width: 720, height: 720, borderRadius: "50%", background: "radial-gradient(circle, oklch(0.78 0.18 82 / 0.10), transparent 65%)" }} />

        <div style={{ position: "relative", display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 56, alignItems: "center" }}>
          <div>
            <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
              <span className="chip chip--blood breathe">● PHASE A · MINT WINDOW</span>
              <span className="chip chip--acid">v4 HOOK · MAINNET</span>
              <span className="chip">{PHASE_STATE.cardsCap - PHASE_STATE.cardsMinted} CARDS LEFT</span>
            </div>

            <h1 style={{ margin: 0, lineHeight: 0.86 }}>
              <span className="display" style={{ display: "block", fontSize: 132, color: "var(--bone)", letterSpacing: "-0.02em" }}>BUY QUIET.</span>
              <span className="display" style={{ display: "block", fontSize: 132, color: "var(--gold-hi)", letterSpacing: "-0.02em", marginTop: -4, textShadow: "0 0 50px oklch(0.78 0.18 82 / 0.25)" }}>FLIP LOUD.</span>
            </h1>

            <p style={{ marginTop: 28, fontSize: 21, lineHeight: 1.55, color: "var(--bone-dim)", maxWidth: 580, fontWeight: 400 }}>
              Every $6.66666 mints a <strong style={{ color: "var(--bone)" }}>sealed card</strong> with no attributes.
              You flip it on your schedule — that&apos;s where the cinema happens.
              <span style={{ color: "var(--ink-700)" }}> Until then, your wallet stays mute.</span>
            </p>

            <div style={{ display: "flex", gap: 12, marginTop: 32, flexWrap: "wrap" }}>
              <Link href="/swap" style={{ padding: "18px 32px", background: "var(--acid)", color: "var(--ink-000)", fontFamily: "var(--f-display)", fontSize: 16, letterSpacing: "0.1em", border: "none", borderRadius: 4, textDecoration: "none", boxShadow: "0 6px 0 var(--acid-lo), 0 14px 32px oklch(0.90 0.20 115 / 0.35)" }}>
                BUY $CASTE — $6.66666 / UNIT
              </Link>
              <Link href="/mycards" style={{ padding: "18px 28px", background: "transparent", color: "var(--gold-hi)", fontFamily: "var(--f-display)", fontSize: 16, letterSpacing: "0.1em", border: "1px solid var(--gold)", borderRadius: 4, textDecoration: "none" }}>
                FLIP MY SEALED ↗
              </Link>
            </div>

            <div className="mono" style={{ marginTop: 22, fontSize: 11, color: "var(--ink-700)", letterSpacing: "0.05em", lineHeight: 1.7 }}>
              ▸ Each buy auto-mints up to 4 sealed cards (max 10,000 protocol-wide)<br />
              ▸ Flip after 2-block delay · RNG fixes at flip time · payout from 4.2B buffer<br />
              ▸ Phase A sell tax 25% (mint window) → 1.5% once 10,000 cards minted
            </div>
          </div>

          <div style={{ position: "relative", height: 540, display: "flex", justifyContent: "center", alignItems: "center" }}>
            <div style={{ position: "absolute", transform: "rotate(-12deg) translate(-100px, 50px)", opacity: 0.85 }}>
              <SealedCard tokenId={8423} commitBlock={22140221} buyUnits={12} bought="14s" w={240} h={345} showFlipBtn={false} />
            </div>
            <div style={{ position: "absolute", transform: "rotate(8deg) translate(90px, -20px)", opacity: 0.9 }}>
              <SealedCard tokenId={8422} commitBlock={22140221} buyUnits={12} bought="14s" w={240} h={345} showFlipBtn={false} />
            </div>
            <div style={{ position: "relative", filter: "drop-shadow(0 24px 40px rgb(0 0 0 / 0.55))" }}>
              <SealedCard tokenId={8421} commitBlock={22140221} buyUnits={12} bought="14s" w={260} h={372} showFlipBtn={false} />
            </div>
            <div style={{ position: "absolute", bottom: 4, right: 4 }}>
              <div className="hk-banner" style={{ fontSize: 13 }}>face-down · RNG locks at flip</div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "0 60px 48px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr", gap: 14 }}>
          <div style={{ position: "relative", padding: "26px 30px", background: "linear-gradient(135deg, oklch(0.18 0.06 82), oklch(0.10 0.02 82))", border: "1px solid var(--gold)", borderRadius: 6, overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg, var(--gold-hi), var(--gold), var(--gold-hi))" }} />
            <div className="mono" style={{ fontSize: 10, letterSpacing: "0.3em", color: "var(--gold-hi)", marginBottom: 8 }}>MEGA POOL · LAST-BUYER FOMO</div>
            <div className="led" style={{ fontSize: 80, color: "var(--gold-hi)", lineHeight: 0.9, textShadow: "var(--glow-gold)" }}>${phase.mega.pool.toLocaleString()}</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 10 }}>
              <div className="mono" style={{ fontSize: 11, color: "var(--bone-dim)" }}>last buy {phase.mega.lastBuyer.addr.split(" · ")[0]}</div>
              <Countdown hh={phase.mega.deadline.hh} mm={phase.mega.deadline.mm} ss={phase.mega.deadline.ss} state="warning" label="DEADLINE" />
            </div>
          </div>
          <StatCard label="CARDS MINTED" value={`${PHASE_STATE.cardsMinted.toLocaleString()} / 10K`} meta="Phase A · 25% sell tax" tone="blood" />
          <StatCard label="BUFFER LEFT" value={`${(phase.buffer.remaining / 1e9).toFixed(2)}B`} meta={`≈ ${(phase.buffer.flipsRemaining / 1000).toFixed(0)}k flips left`} tone="gold" />
          <StatCard label="HOURLY POOL" value={`$${phase.hourly.pool.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} meta={`draw in ${phase.hourly.drawIn.mm}:${phase.hourly.drawIn.ss}`} tone="jade" />
        </div>
      </section>

      <section style={{ padding: "20px 60px 48px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 28 }}>
          <span className="display" style={{ fontSize: 48, color: "var(--bone)" }}>How V1 Plays</span>
          <span className="display" style={{ fontSize: 18, color: "var(--ink-700)", letterSpacing: "0.2em" }}>QUIET / LOUD / DONE</span>
          <div style={{ flex: 1, height: 1, background: "var(--ink-400)" }} />
          <span className="mono" style={{ fontSize: 11, color: "var(--ink-600)" }}>01 · 02 · 03</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 0, border: "1px solid var(--ink-400)", borderRadius: 6, overflow: "hidden" }}>
          <Step num="01" en="QUIET BUY"     color="var(--acid)"     body="Pay $6.66666 × N (1–100 units). Get curve-price CASTE plus up to 4 sealed cards. Wallet balance changes; no animation, no reveal, no drama." kicker="cards mint with commitBlock only · attrs all zero" />
          <Step num="02" en="FLIP CEREMONY"  color="var(--gold-hi)"  body="Wait 2 blocks. Open /mycards, pick a sealed card, hit Flip. RNG seeds from execution-time entropy — payout streams from the 4.2B buffer." kicker="this is the cinema moment · tier × variant × multiplier" />
          <Step num="03" en="PHASE B FLIPS"  color="var(--blood-hi)" body="When the 10,000th card mints, Phase B unlocks: sell tax drops 25% → 1.5%. The mint window closes; secondary market does the rest." kicker="transition is atomic · monotonic · irreversible" />
        </div>
      </section>

      <section style={{ padding: "20px 60px 48px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 22 }}>
          <span className="display" style={{ fontSize: 36, color: "var(--bone)" }}>Where the Money Goes</span>
          <span className="display" style={{ fontSize: 14, color: "var(--ink-700)", letterSpacing: "0.2em" }}>BUY 1.5% · PHASE A SELL 25%</span>
          <div style={{ flex: 1, height: 1, background: "var(--ink-400)" }} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
          <FlowBlock title="EVERY BUY · $6.66666 / UNIT" subtitle="1.5% fee split — rest goes through LP curve"
            lanes={[
              { pct: 98.5, v: "$6.566", l: "TO POOL CURVE", color: "var(--cobalt)",  note: "buyer receives CASTE at LP price" },
              { pct:  1.0, v: "$0.067", l: "→ HOURLY",       color: "var(--jade)",    note: "epochLastBuyer takes this hour" },
              { pct:  0.5, v: "$0.033", l: "→ MEGA",         color: "var(--gold-hi)", note: "global lastBuyer at FOMO zero" },
            ]} />
          <FlowBlock title="PHASE A SELL · 25% TAX" subtitle="while < 10k cards minted · forces patience" hot
            lanes={[
              { pct: 75.0,  v: "≈ $3.75", l: "TO SELLER", color: "var(--bone-dim)", note: "75% of USDC out · the cost of exit" },
              { pct: 16.67, v: "≈ $0.84", l: "→ HOURLY",   color: "var(--jade)",    note: "fattens hourly draw all day" },
              { pct:  8.33, v: "≈ $0.42", l: "→ MEGA",     color: "var(--gold-hi)", note: "fattens FOMO jackpot" },
            ]} />
        </div>

        <div style={{ marginTop: 14, padding: 14, border: "1px dashed var(--gold)", borderRadius: 6, background: "oklch(0.20 0.06 82 / 0.12)" }}>
          <div className="mono" style={{ fontSize: 11, color: "var(--gold-hi)", letterSpacing: "0.15em", lineHeight: 1.7 }}>
            ▸ <strong>4.2B CASTE buffer</strong> is one-way drain — funds flip payouts only · LP holds the other 16.8B · no Reserve/Burn/Keeper in V1
          </div>
        </div>
      </section>

      <section style={{ padding: "20px 60px 48px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 18 }}>
          <span className="display" style={{ fontSize: 28, color: "var(--bone)" }}>Recent Flips</span>
          <span className="mono" style={{ fontSize: 11, color: "var(--gold-hi)", letterSpacing: "0.2em" }}>· LIVE</span>
          <div style={{ flex: 1, height: 1, background: "var(--ink-400)" }} />
          <Link href="/activity" className="mono" style={{ fontSize: 11, color: "var(--acid)", letterSpacing: "0.15em", textDecoration: "none" }}>
            FULL ACTIVITY →
          </Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
          {[MOCK_CARDS[1]!, MOCK_CARDS[0]!, MOCK_CARDS[3]!, MOCK_CARDS[7]!].map((c, i) => {
            const payouts = ["2.40M", "287.5K", "92.1K", "54.0K"];
            const labels = ["1m ago · cz.eth", "3s · you", "8m ago · vitalik.eth", "12m ago · 0x9f3a…ce21"];
            return (
              <div key={i} style={{ padding: 14, border: "1px solid var(--ink-400)", borderRadius: 6, background: "var(--ink-200)", display: "flex", gap: 14, alignItems: "center" }}>
                <CasteCard card={c} w={88} h={126} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="mono" style={{ fontSize: 9, color: "var(--gold-hi)", letterSpacing: "0.2em" }}>FLIP PAYOUT</div>
                  <div className="led" style={{ fontSize: 26, color: "var(--gold-hi)", lineHeight: 1, textShadow: "var(--glow-gold)" }}>+{payouts[i]}</div>
                  <div className="mono" style={{ fontSize: 10, color: "var(--bone-dim)", marginTop: 4, letterSpacing: "0.05em" }}>$CASTE · {labels[i]}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <Footer />
    </div>
  );
}

function Step({ num, en, color, body, kicker }: { num: string; en: string; color: string; body: string; kicker: string }) {
  return (
    <div style={{ padding: "28px 24px 24px", borderRight: "1px solid var(--ink-400)", background: "var(--ink-200)" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 16 }}>
        <span className="display" style={{ fontSize: 56, color, lineHeight: 0.8 }}>{num}</span>
        <div className="display" style={{ fontSize: 18, color: "var(--bone)", letterSpacing: "0.1em" }}>{en}</div>
      </div>
      <p style={{ fontSize: 13, color: "var(--bone-dim)", lineHeight: 1.65, margin: 0 }}>{body}</p>
      <div style={{ marginTop: 14, padding: "8px 0", borderTop: "1px dashed var(--ink-400)" }}>
        <div className="mono" style={{ fontSize: 10, color, letterSpacing: "0.1em" }}>▸ {kicker}</div>
      </div>
    </div>
  );
}

type Lane = { pct: number; v: string; l: string; color: string; note: string };
function FlowBlock({ title, subtitle, lanes, hot }: { title: string; subtitle: string; lanes: Lane[]; hot?: boolean }) {
  return (
    <div style={{ padding: 20, border: hot ? "1px solid var(--blood-lo)" : "1px solid var(--ink-400)", borderRadius: 6, background: hot ? "oklch(0.16 0.04 25 / 0.15)" : "var(--ink-200)" }}>
      <div className="mono" style={{ fontSize: 10, color: hot ? "var(--blood-hi)" : "var(--ink-600)", letterSpacing: "0.25em", marginBottom: 4 }}>{title}</div>
      <div className="mono" style={{ fontSize: 11, color: "var(--ink-700)", marginBottom: 14 }}>{subtitle}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {lanes.map((b, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "70px 90px 130px 1fr", gap: 12, alignItems: "center", padding: "8px 10px", background: "var(--ink-100)", borderLeft: `4px solid ${b.color}`, borderRadius: 3 }}>
            <span className="led" style={{ fontSize: 18, color: b.color }}>{b.pct}%</span>
            <span className="led" style={{ fontSize: 14, color: "var(--bone)" }}>{b.v}</span>
            <span className="display" style={{ fontSize: 11, color: "var(--bone)", letterSpacing: "0.1em" }}>{b.l}</span>
            <span className="mono" style={{ fontSize: 10, color: "var(--ink-700)", letterSpacing: "0.03em" }}>{b.note}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

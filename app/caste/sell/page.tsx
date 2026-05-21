import { Fragment } from "react";
import { Ticker, Footer } from "@/components/caste/caste-chrome";
import { PHASE_STATE, ME_V1 } from "@/lib/caste/mock";

export const dynamic = "force-static";

const PRICE_CASTE = 0.0000476;
const fmt = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 2 });
const fmtNum = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 0 });

export default function SellV1Page() {
  const sellAmount = 14200;
  const tickerItems = [
    { tag: "▸ PHASE A", text: `${PHASE_STATE.cardsMinted}/10,000 minted · sell tax 25% · drops to 1.5% at 10,000`, color: "var(--blood-hi)" },
    { tag: "▸ TAX",     text: "16.67% to hourly + 8.33% to mega · both pots settle to lastBuyer", color: "var(--bone-dim)" },
    { tag: "▸ MEGA",    text: "$184K · last buyer YOU 0x6e91…aa83 · countdown 06:17:42", color: "var(--gold-hi)" },
  ];

  return (
    <div>
      <Ticker items={tickerItems} />

      <section style={{ padding: "44px 60px 16px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 40, flexWrap: "wrap" }}>
        <div>
          <div className="mono" style={{ fontSize: 11, letterSpacing: "0.3em", color: "var(--ink-600)", marginBottom: 8 }}>
            /CASTE/SELL · PHASE A · MINT-WINDOW TAX
          </div>
          <h1 style={{ margin: 0, display: "flex", alignItems: "baseline", gap: 16, flexWrap: "wrap" }}>
            <span className="display" style={{ fontSize: 80, color: "var(--bone)", lineHeight: 1 }}>Cash Out.</span>
            <span className="display" style={{ fontSize: 32, color: "var(--blood-hi)" }}>/ TAX IS 25% UNTIL ALL 10K MINT</span>
          </h1>
          <p style={{ fontSize: 15, color: "var(--ink-700)", maxWidth: 800, marginTop: 12, lineHeight: 1.55 }}>
            $CASTE has two trading phases. While sealed cards are still being minted (<strong style={{ color: "var(--blood-hi)" }}>Phase A</strong>), every sell pays{" "}
            <strong style={{ color: "var(--blood-hi)" }}>25%</strong> to the lottery pots — early holders get rewarded as impatient sellers fund the mega prize. Once all 10,000 cards mint, the tax permanently drops to{" "}
            <strong style={{ color: "var(--jade)" }}>1.5%</strong>.
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <div className="mono" style={{ fontSize: 10, color: "var(--ink-600)", letterSpacing: "0.2em", marginBottom: 4 }}>YOUR BALANCE</div>
          <div className="led" style={{ fontSize: 26, color: "var(--bone)" }}>{fmtNum(ME_V1.casteBalance)}</div>
          <div className="mono" style={{ fontSize: 10, color: "var(--ink-700)", marginTop: 4 }}>
            ≈ ${fmt(ME_V1.casteBalance * PRICE_CASTE)} · @ ${PRICE_CASTE.toFixed(7)}
          </div>
        </div>
      </section>

      <section style={{ padding: "20px 60px 24px", display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 28, alignItems: "flex-start" }}>
        <SellComposer amount={sellAmount} phase="A" />
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <FeeFlow amount={sellAmount} phase="A" />
          <PhaseCompare />
          <RecentSells phase="A" />
        </div>
      </section>

      <section style={{ padding: "32px 60px 60px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 18 }}>
          <span className="mono" style={{ fontSize: 11, letterSpacing: "0.3em", color: "var(--jade)" }}>
            ● FUTURE STATE · WHEN ALL 10K MINT
          </span>
          <div style={{ flex: 1, height: 1, background: "var(--ink-400)" }} />
          <span className="mono" style={{ fontSize: 10, color: "var(--ink-700)", letterSpacing: "0.15em" }}>
            tax 25% → 1.5% · automatic · irreversible
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 28, alignItems: "flex-start" }}>
          <SellComposer amount={sellAmount} phase="B" />
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ position: "relative", padding: 22, border: "1px solid var(--jade)", borderRadius: 6, background: "linear-gradient(135deg, oklch(0.20 0.10 155 / 0.3), var(--ink-200))", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, var(--jade), oklch(0.65 0.12 145), var(--jade))" }} />
              <div className="mono" style={{ fontSize: 10, color: "var(--jade)", letterSpacing: "0.25em", marginBottom: 10 }}>
                ★ PHASE B UNLOCK · ANIMATED CONFETTI MOMENT
              </div>
              <div className="display" style={{ fontSize: 28, color: "var(--bone)", lineHeight: 1.05 }}>📈 Free Trading Mode</div>
              <div className="mono" style={{ fontSize: 11, color: "var(--bone-dim)", marginTop: 10, lineHeight: 1.7 }}>
                When the 10,000th card is minted in some random user&apos;s buy, the contract flips. Their tx becomes a community milestone — UI plays a global celebration, banner turns green, FOMO countdown resets to a fresh 24h.
              </div>
            </div>

            <FeeFlow amount={sellAmount} phase="B" />
            <RecentSells phase="B" />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

type Phase = "A" | "B";

function SellComposer({ amount, phase }: { amount: number; phase: Phase }) {
  const usdcGross = amount * PRICE_CASTE;
  const taxPct = phase === "A" ? 25 : 1.5;
  const hourlyPct = phase === "A" ? 16.67 : 1.0;
  const megaPct = phase === "A" ? 8.33 : 0.5;
  const fee = usdcGross * (taxPct / 100);
  const toHourly = usdcGross * (hourlyPct / 100);
  const toMega = usdcGross * (megaPct / 100);
  const usdcNet = usdcGross - fee;

  const accent = phase === "A" ? "var(--blood-hi)" : "var(--jade)";
  const accentBg = phase === "A"
    ? "linear-gradient(135deg, oklch(0.20 0.14 25 / 0.35), var(--ink-200))"
    : "linear-gradient(135deg, oklch(0.20 0.10 155 / 0.20), var(--ink-200))";

  return (
    <div style={{ border: `1px solid ${phase === "A" ? "var(--blood-lo)" : "var(--ink-400)"}`, borderRadius: 8, background: accentBg, padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", borderBottom: "1px solid var(--ink-400)" }}>
        <span style={{ padding: "10px 18px", fontFamily: "var(--f-display)", fontSize: 14, color: "var(--ink-700)", letterSpacing: "0.1em" }}>BUY</span>
        <div style={{ padding: "10px 18px", fontFamily: "var(--f-display)", fontSize: 14, color: accent, borderBottom: `2px solid ${accent}`, marginBottom: -1, letterSpacing: "0.1em" }}>
          SELL · {taxPct}%
        </div>
      </div>

      <div style={{ position: "relative", padding: "18px 20px", border: `2px solid ${accent}`, borderRadius: 6, background: phase === "A" ? "oklch(0.18 0.14 25 / 0.35)" : "oklch(0.18 0.10 155 / 0.25)", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "var(--tex-scanline)", opacity: 0.5 }} />
        <div style={{ position: "relative", display: "grid", gridTemplateColumns: "auto 1fr", gap: 22, alignItems: "center" }}>
          <div>
            <div className="mono" style={{ fontSize: 9, color: accent, letterSpacing: "0.25em" }}>
              {phase === "A" ? "PHASE A · MINT WINDOW" : "PHASE B · FREE TRADING"} · SELL TAX
            </div>
            <div className="led" style={{ fontSize: 96, color: accent, lineHeight: 0.9, textShadow: `0 0 24px ${accent}, 0 0 6px ${accent}` }}>
              {taxPct}%
            </div>
          </div>
          <div>
            <div className="mono" style={{ fontSize: 11, color: "var(--bone)", letterSpacing: "0.1em", lineHeight: 1.7 }}>
              {phase === "A" ? (
                <>
                  ▸ While cards are still minting (currently <strong style={{ color: accent }}>{PHASE_STATE.cardsMinted.toLocaleString()} / 10,000</strong>), every sell pays{" "}
                  <strong style={{ color: accent }}>25% to the lottery pots</strong>.<br />
                  ▸ Drops to <span style={{ color: "var(--jade)" }}>1.5%</span> when the last sealed card mints — the Phase A → B switch is automatic, atomic, irreversible.<br />
                  ▸ <strong style={{ color: "var(--bone)" }}>Patient holders earn</strong> while impatient sellers subsidize the pools.
                </>
              ) : (
                <>
                  ▸ All 10,000 sealed cards minted. The sell tax dropped from 25% to <strong style={{ color: "var(--jade)" }}>1.5%</strong>.<br />
                  ▸ Symmetric with buy fee · 1% hourly pool + 0.5% mega pool.<br />
                  ▸ Phase A → B was triggered at block <strong style={{ color: "var(--bone)" }}>22,243,008</strong>.
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span className="display" style={{ fontSize: 22, color: "var(--bone)" }}>Sell $CASTE</span>
        <span className="chip">CASTE PRICE · ${PRICE_CASTE.toFixed(7)}</span>
      </div>

      <div style={{ border: "1px solid var(--ink-400)", borderRadius: 6, padding: "16px 18px", background: "var(--ink-100)" }}>
        <div className="mono" style={{ fontSize: 10, letterSpacing: "0.2em", color: "var(--ink-600)" }}>YOU SELL · $CASTE</div>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginTop: 6 }}>
          <div className="led" style={{ fontSize: 56, color: "var(--bone)" }}>{fmtNum(amount)}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 10px", border: "1px solid var(--acid-lo)", borderRadius: 999 }}>
            <div style={{ width: 18, height: 18, borderRadius: 4, background: "var(--acid)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ink-000)", fontSize: 10, fontWeight: 900 }}>
              ◇
            </div>
            <span className="mono" style={{ fontSize: 12, color: "var(--bone)" }}>$CASTE</span>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
          <span className="mono" style={{ fontSize: 11, color: "var(--ink-600)" }}>≈ ${fmt(usdcGross)} gross</span>
          <span className="mono" style={{ fontSize: 11, color: "var(--ink-600)" }}>balance {fmtNum(ME_V1.casteBalance)}</span>
        </div>
        <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
          {["25%", "50%", "75%", "MAX"].map((p, i) => (
            <button
              key={i}
              style={{
                flex: 1,
                padding: "8px 0",
                background: i === 2 ? "var(--ink-100)" : "var(--ink-300)",
                color: i === 2 ? accent : "var(--ink-700)",
                border: `1px solid ${i === 2 ? accent : "var(--ink-400)"}`,
                fontFamily: "var(--f-mono)",
                fontSize: 11,
                letterSpacing: "0.1em",
                borderRadius: 3,
                cursor: "pointer",
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ width: 40, height: 40, borderRadius: 8, border: "1px solid var(--ink-400)", background: "var(--ink-100)", display: "flex", alignItems: "center", justifyContent: "center", color: accent, fontSize: 18 }}>↓</div>
      </div>

      <div style={{ border: `1px solid ${accent}`, borderRadius: 6, padding: "16px 18px", background: "linear-gradient(135deg, oklch(0.20 0.06 25 / 0.18), var(--ink-100))" }}>
        <div className="mono" style={{ fontSize: 10, letterSpacing: "0.2em", color: "var(--ink-600)" }}>
          YOU RECEIVE · USDC after {taxPct}% tax
        </div>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginTop: 6 }}>
          <div className="led" style={{ fontSize: 48, color: accent }}>${fmt(usdcNet)}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 10px", border: "1px solid var(--ink-400)", borderRadius: 999 }}>
            <div style={{ width: 18, height: 18, borderRadius: "50%", background: "var(--cobalt)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--bone)", fontSize: 10, fontWeight: 700 }}>$</div>
            <span className="mono" style={{ fontSize: 12, color: "var(--bone)" }}>USDC</span>
          </div>
        </div>
        <div style={{ marginTop: 12, padding: "10px 0", borderTop: "1px dotted var(--ink-400)", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 4 }}>
          <div>
            <div className="mono" style={{ fontSize: 9, color: "var(--ink-600)", letterSpacing: "0.15em" }}>GROSS</div>
            <div className="mono" style={{ fontSize: 12, color: "var(--bone-dim)" }}>${fmt(usdcGross)}</div>
          </div>
          <div>
            <div className="mono" style={{ fontSize: 9, color: "var(--jade)", letterSpacing: "0.15em" }}>−{hourlyPct}% HOURLY</div>
            <div className="mono" style={{ fontSize: 12, color: "var(--jade)" }}>−${fmt(toHourly)}</div>
          </div>
          <div>
            <div className="mono" style={{ fontSize: 9, color: "var(--gold-hi)", letterSpacing: "0.15em" }}>−{megaPct}% MEGA</div>
            <div className="mono" style={{ fontSize: 12, color: "var(--gold-hi)" }}>−${fmt(toMega)}</div>
          </div>
        </div>
      </div>

      {phase === "A" && (
        <div style={{ padding: "12px 14px", background: "oklch(0.18 0.10 60 / 0.35)", border: "1px dashed var(--gold-hi)", borderRadius: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span className="display" style={{ fontSize: 13, color: "var(--gold-hi)", letterSpacing: "0.18em" }}>⏳ WAIT FOR PHASE B?</span>
            <span className="mono" style={{ fontSize: 10, color: "var(--bone)" }}>
              You&apos;d save <span className="led" style={{ color: "var(--gold-hi)" }}>${fmt(usdcGross * 0.235)}</span> ({(taxPct - 1.5).toFixed(1)}pp) on this sell when all 10k mint.
            </span>
          </div>
          <div className="mono" style={{ fontSize: 9, color: "var(--ink-700)", marginTop: 6, letterSpacing: "0.05em" }}>
            ▸ At current mint pace (~410 cards/day), Phase B unlocks in <strong style={{ color: "var(--gold-hi)" }}>~14.6 days</strong>.
          </div>
        </div>
      )}

      <button
        style={{
          padding: "20px 0",
          background: accent,
          color: "var(--bone)",
          fontFamily: "var(--f-display)",
          fontSize: 18,
          letterSpacing: "0.12em",
          border: "none",
          borderRadius: 4,
          boxShadow: `0 6px 0 ${phase === "A" ? "var(--blood-lo)" : "oklch(0.45 0.10 155)"}, 0 16px 32px oklch(0.62 0.24 25 / 0.4)`,
          cursor: "pointer",
        }}
      >
        {phase === "A"
          ? `SELL ${fmtNum(amount)} · PAY ${taxPct}% TAX · GET $${fmt(usdcNet)}`
          : `SELL ${fmtNum(amount)} · GET $${fmt(usdcNet)}`}
      </button>
      <div className="mono" style={{ fontSize: 10, color: "var(--ink-600)", letterSpacing: "0.15em", textAlign: "center" }}>
        ▸ Phase {phase} · tax is locked by protocol · trigger is <code>card.totalSupply() == 10000</code>
      </div>
    </div>
  );
}

function FeeFlow({ amount, phase }: { amount: number; phase: Phase }) {
  const usdcGross = amount * PRICE_CASTE;
  const taxPct = phase === "A" ? 25 : 1.5;
  const hourlyPct = phase === "A" ? 16.67 : 1.0;
  const megaPct = phase === "A" ? 8.33 : 0.5;
  const fee = usdcGross * (taxPct / 100);
  const toHourly = usdcGross * (hourlyPct / 100);
  const toMega = usdcGross * (megaPct / 100);
  const accent = phase === "A" ? "var(--blood-hi)" : "var(--jade)";

  return (
    <div style={{ border: "1px solid var(--ink-400)", borderRadius: 6, background: "var(--ink-200)", padding: 18 }}>
      <div className="mono" style={{ fontSize: 10, letterSpacing: "0.25em", color: "var(--ink-600)", marginBottom: 12 }}>
        WHERE THE TAX GOES · BOTH POOLS → LASTBUYER
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <span className="display" style={{ fontSize: 26, color: accent, letterSpacing: "0.04em" }}>{taxPct}%</span>
        <span className="mono" style={{ fontSize: 10, color: "var(--ink-700)" }}>total tax · ${fmt(fee)}</span>
        <div style={{ flex: 1, height: 10, display: "flex", border: "1px solid var(--ink-400)", borderRadius: 2, overflow: "hidden" }}>
          <div style={{ flex: hourlyPct, background: "var(--jade)" }} />
          <div style={{ flex: megaPct, background: "var(--gold-hi)" }} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ borderLeft: "2px solid var(--jade)", paddingLeft: 10 }}>
          <div className="mono" style={{ fontSize: 9, color: "var(--ink-600)", letterSpacing: "0.15em" }}>{hourlyPct}% → HOURLY POOL</div>
          <div className="led" style={{ fontSize: 18, color: "var(--jade)" }}>+${fmt(toHourly)}</div>
          <div className="mono" style={{ fontSize: 9, color: "var(--ink-700)", marginTop: 2 }}>winner = epoch lastBuyer</div>
        </div>
        <div style={{ borderLeft: "2px solid var(--gold-hi)", paddingLeft: 10 }}>
          <div className="mono" style={{ fontSize: 9, color: "var(--ink-600)", letterSpacing: "0.15em" }}>{megaPct}% → MEGA POOL</div>
          <div className="led" style={{ fontSize: 18, color: "var(--gold-hi)" }}>+${fmt(toMega)}</div>
          <div className="mono" style={{ fontSize: 9, color: "var(--ink-700)", marginTop: 2 }}>winner = global lastBuyer</div>
        </div>
      </div>

      <div style={{ marginTop: 14, padding: "8px 12px", border: "1px dashed var(--ink-400)", borderRadius: 3 }}>
        <div className="mono" style={{ fontSize: 9, color: "var(--ink-600)", letterSpacing: "0.2em", marginBottom: 4 }}>
          NOT TO TEAM · NOT TO LP · NOT BURNED
        </div>
        <div className="mono" style={{ fontSize: 10, color: "var(--bone-dim)", lineHeight: 1.55 }}>
          Tax routes straight into the two lottery pools. Phase A tax volume bootstraps the mega pool to outrageous numbers — early sellers are{" "}
          <strong style={{ color: "var(--bone)" }}>paying you</strong>, the last buyer.
        </div>
      </div>
    </div>
  );
}

function PhaseCompare() {
  const rows: Array<[string, string, string]> = [
    ["Sell tax",   "25%",            "1.5%"],
    ["→ Hourly",   "16.67%",         "1.0%"],
    ["→ Mega",     "8.33%",          "0.5%"],
    ["Buy fee",    "1.5%",           "1.5%"],
    ["Mint cards", "yes · max 4/buy", "no — supply capped"],
    ["Flip",       "anytime",        "anytime"],
  ];
  return (
    <div style={{ border: "1px solid var(--ink-400)", borderRadius: 6, background: "var(--ink-200)", padding: 18 }}>
      <div className="mono" style={{ fontSize: 10, letterSpacing: "0.25em", color: "var(--ink-600)", marginBottom: 12 }}>
        PHASE A vs PHASE B
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "120px 1fr 1fr", gap: 10, alignItems: "stretch" }}>
        <div />
        <div style={{ padding: "8px 12px", background: "oklch(0.18 0.14 25 / 0.3)", border: "1px solid var(--blood-lo)", borderRadius: 3, textAlign: "center" }}>
          <div className="display" style={{ fontSize: 13, color: "var(--blood-hi)", letterSpacing: "0.2em" }}>PHASE A</div>
          <div className="mono" style={{ fontSize: 9, color: "var(--ink-700)", letterSpacing: "0.05em", marginTop: 2 }}>0 &lt; cards &lt; 10,000</div>
        </div>
        <div style={{ padding: "8px 12px", background: "oklch(0.18 0.10 155 / 0.25)", border: "1px solid oklch(0.50 0.10 155 / 0.5)", borderRadius: 3, textAlign: "center" }}>
          <div className="display" style={{ fontSize: 13, color: "var(--jade)", letterSpacing: "0.2em" }}>PHASE B</div>
          <div className="mono" style={{ fontSize: 9, color: "var(--ink-700)", letterSpacing: "0.05em", marginTop: 2 }}>cards == 10,000</div>
        </div>

        {rows.map(([k, a, b], i) => (
          <Fragment key={i}>
            <div className="mono" style={{ fontSize: 11, color: "var(--ink-700)", letterSpacing: "0.05em", padding: "8px 0" }}>{k}</div>
            <div className="mono" style={{ fontSize: 11, color: "var(--blood-hi)", padding: "8px 12px", borderBottom: i < rows.length - 1 ? "1px dotted var(--ink-400)" : "none", textAlign: "center" }}>{a}</div>
            <div className="mono" style={{ fontSize: 11, color: "var(--jade)", padding: "8px 12px", borderBottom: i < rows.length - 1 ? "1px dotted var(--ink-400)" : "none", textAlign: "center" }}>{b}</div>
          </Fragment>
        ))}
      </div>
    </div>
  );
}

function RecentSells({ phase }: { phase: Phase }) {
  const taxPct = phase === "A" ? 25 : 1.5;
  const rows = [
    { user: "0x9f3a…ce21",     amt: 14200,  gross: 671.72,    ago: "0:03" },
    { user: "anon-degen.eth",  amt: 1500,   gross: 70.99,     ago: "0:09" },
    { user: "0x4d11…ab07",     amt: 88000,  gross: 4163.76,   ago: "0:22" },
    { user: "0xdead…b0b",      amt: 240000, gross: 11357.04,  ago: "0:31" },
    { user: "vitalik.eth",     amt: 7500,   gross: 354.95,    ago: "0:48" },
  ];
  return (
    <div style={{ border: "1px solid var(--ink-400)", borderRadius: 6, background: "var(--ink-200)", padding: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
        <span className="mono" style={{ fontSize: 10, letterSpacing: "0.25em", color: "var(--ink-600)" }}>RECENT SELLS · PHASE {phase}</span>
        <span className="mono" style={{ fontSize: 9, color: "var(--ink-600)" }}>SellExecuted events · last 5</span>
      </div>
      {rows.map((r, i) => {
        const net = r.gross * (1 - taxPct / 100);
        const tax = r.gross - net;
        return (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "60px 1fr auto auto", gap: 10, alignItems: "center", padding: "8px 0", borderBottom: i < rows.length - 1 ? "1px dashed var(--ink-400)" : "none" }}>
            <span className="mono" style={{ fontSize: 10, color: "var(--ink-700)" }}>−{r.ago}</span>
            <span className="mono" style={{ fontSize: 11, color: "var(--bone-dim)" }}>{r.user}</span>
            <span className="mono" style={{ fontSize: 11, color: phase === "A" ? "var(--blood-hi)" : "var(--ink-700)" }}>−${fmt(tax)} tax</span>
            <span className="led" style={{ fontSize: 14, color: phase === "A" ? "var(--blood-hi)" : "var(--jade)" }}>${fmt(net)}</span>
          </div>
        );
      })}
    </div>
  );
}

"use client";

import { Ticker, Footer } from "@/components/caste/caste-chrome";
import { useStats } from "@/lib/caste/hooks";

const AVG_PAYOUT_E18 = 13_900n * 10n ** 18n; // ≈ avg flip payout in CASTE wei

function bigStrToCasteUnits(s: string | null | undefined): number {
  if (!s) return 0;
  return Number(BigInt(s) / 10n ** 18n);
}

export default function StatsV1Page() {
  const { data: stats } = useStats();

  const cardsMinted = stats?.cardsMinted ?? 0;
  const cardsCap = 10_000;
  const phasePct = (cardsMinted / cardsCap) * 100;

  const bufferInitial = bigStrToCasteUnits(stats?.bufferStart);
  const bufferRemaining = bigStrToCasteUnits(stats?.bufferRemaining);
  const bufferDrained = bigStrToCasteUnits(stats?.bufferPaid);
  const bufferPct = bufferInitial > 0 ? (bufferRemaining / bufferInitial) * 100 : 0;
  const flipsRemaining = stats
    ? Number(BigInt(stats.bufferRemaining) / AVG_PAYOUT_E18)
    : 0;

  const hookAddr = process.env.NEXT_PUBLIC_CASTE_HOOK_ADDRESS ?? "";
  const tokenAddr = process.env.NEXT_PUBLIC_CASTE_TOKEN_ADDRESS ?? "";
  const cardAddr = process.env.NEXT_PUBLIC_CASTE_CARD_ADDRESS ?? "";
  const shortAddr = (a: string) =>
    a.length >= 12 ? `${a.slice(0, 6)}…${a.slice(-5)}` : a || "—";

  const tickerItems = [
    { tag: "▸ CARDS",  text: `${cardsMinted.toLocaleString()} / 10,000 minted · ${(cardsCap - cardsMinted).toLocaleString()} until Phase B`, color: "var(--blood-hi)" },
    { tag: "▸ BUFFER", text: `${(bufferRemaining / 1e9).toFixed(3)}B left · ${(bufferDrained / 1e6).toFixed(0)}M drained · ~${(flipsRemaining / 1000).toFixed(0)}k flips remaining`, color: "var(--orchid)" },
    { tag: "▸ RNG",    text: "flip seed = keccak(blockhash, prevrandao, coinbase, gasleft, tokenId, msg.sender)", color: "var(--cobalt)" },
  ];

  return (
    <div>
      <Ticker items={tickerItems} />

      <section style={{ padding: "28px 40px 20px" }}>
        <div className="mono" style={{ fontSize: 11, letterSpacing: "0.3em", color: "var(--ink-600)", marginBottom: 8 }}>
          /CASTE/STATS · CONTRACTS · CONSTANTS · ENTROPY
        </div>
        <h1 style={{ margin: 0 }}>
          <span className="display" style={{ fontSize: 56, color: "var(--bone)", lineHeight: 1 }}>The Numbers.</span>
        </h1>
        <p style={{ fontSize: 15, color: "var(--ink-700)", maxWidth: 820, marginTop: 12, lineHeight: 1.65 }}>
          V1 is single-phase, sealed-mint, deferred-reveal. Three things you can verify before touching the contract: how the{" "}
          <strong style={{ color: "var(--bone)" }}>fees split</strong>, how the <strong style={{ color: "var(--orchid)" }}>buffer drains</strong>, how the{" "}
          <strong style={{ color: "var(--cobalt)" }}>RNG seed</strong> is composed.
        </p>
      </section>

      <section style={{ padding: "10px 40px 20px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 18 }}>
          <span className="display" style={{ fontSize: 32, color: "var(--bone)" }}>Phase Transition</span>
          <span className="mono" style={{ fontSize: 11, color: "var(--blood-hi)", letterSpacing: "0.2em" }}>· A → B · IRREVERSIBLE · ATOMIC</span>
          <div style={{ flex: 1, height: 1, background: "var(--ink-400)" }} />
        </div>

        <div style={{ padding: 24, border: "1px solid var(--blood-lo)", borderRadius: 8, background: "linear-gradient(135deg, oklch(0.18 0.06 25 / 0.15), var(--ink-200))" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, marginBottom: 18 }}>
            <div>
              <div className="mono" style={{ fontSize: 10, color: "var(--blood-hi)", letterSpacing: "0.25em" }}>PHASE A · NOW</div>
              <div className="led" style={{ fontSize: 40, color: "var(--blood-hi)", lineHeight: 0.9 }}>25%</div>
              <div className="mono" style={{ fontSize: 11, color: "var(--ink-700)", marginTop: 4 }}>sell tax · split 16.67 hourly / 8.33 mega</div>
            </div>
            <div>
              <div className="mono" style={{ fontSize: 10, color: "var(--ink-600)", letterSpacing: "0.25em" }}>{cardsMinted.toLocaleString()} / 10,000</div>
              <div className="led" style={{ fontSize: 40, color: "var(--bone)", lineHeight: 0.9 }}>{phasePct.toFixed(1)}%</div>
              <div className="mono" style={{ fontSize: 11, color: "var(--ink-700)", marginTop: 4 }}>
                cards minted · {(cardsCap - cardsMinted).toLocaleString()} more to flip phase
              </div>
            </div>
            <div>
              <div className="mono" style={{ fontSize: 10, color: "var(--jade)", letterSpacing: "0.25em" }}>PHASE B · AFTER 10K</div>
              <div className="led" style={{ fontSize: 40, color: "var(--jade)", lineHeight: 0.9 }}>1.5%</div>
              <div className="mono" style={{ fontSize: 11, color: "var(--ink-700)", marginTop: 4 }}>sell tax · split 1.0 hourly / 0.5 mega</div>
            </div>
          </div>

          <div style={{ position: "relative", height: 28, background: "var(--ink-300)", borderRadius: 2, overflow: "hidden", border: "1px solid var(--ink-400)" }}>
            <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: `${phasePct}%`, background: "linear-gradient(90deg, var(--blood-lo), var(--blood-hi))" }} />
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                right: 0,
                width: `${100 - phasePct}%`,
                background:
                  "repeating-linear-gradient(45deg, oklch(0.18 0.04 60 / 0.4), oklch(0.18 0.04 60 / 0.4) 4px, transparent 4px, transparent 10px)",
              }}
            />
            <div style={{ position: "absolute", left: `${phasePct}%`, top: 0, bottom: 0, width: 2, background: "var(--bone)" }} />
            <div style={{ position: "absolute", inset: 0, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 14px" }}>
              <span className="display" style={{ fontSize: 13, color: "var(--bone)", letterSpacing: "0.15em" }}>PHASE A · MINT WINDOW · 25%</span>
              <span className="display" style={{ fontSize: 13, color: "var(--bone-dim)", letterSpacing: "0.15em" }}>PHASE B · FREE TRADE · 1.5%</span>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "14px 40px 20px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 18 }}>
          <span className="display" style={{ fontSize: 32, color: "var(--bone)" }}>Buffer Drain Math</span>
          <span className="mono" style={{ fontSize: 11, color: "var(--orchid)", letterSpacing: "0.2em" }}>· ONE-WAY · GRACEFUL CAP ON DEPLETION</span>
          <div style={{ flex: 1, height: 1, background: "var(--ink-400)" }} />
        </div>

        <div style={{ padding: 24, border: "1px solid var(--orchid)", borderRadius: 8, background: "var(--ink-200)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 24 }}>
            <div>
              <div className="mono" style={{ fontSize: 10, color: "var(--orchid)", letterSpacing: "0.25em", marginBottom: 8 }}>
                BUFFER · 4,200,000,000 CASTE INITIAL
              </div>
              <div style={{ position: "relative", height: 60, background: "var(--ink-300)", borderRadius: 4, overflow: "hidden", border: "1px solid var(--ink-400)" }}>
                <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: `${bufferPct}%`, background: "linear-gradient(90deg, var(--orchid), oklch(0.45 0.18 320))" }} />
                <div style={{ position: "absolute", inset: 0, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 16px" }}>
                  <span className="led" style={{ fontSize: 26, color: "var(--bone)" }}>{(bufferRemaining / 1e9).toFixed(3)}B LEFT</span>
                  <span className="led" style={{ fontSize: 22, color: "var(--orchid)" }}>{(bufferDrained / 1e6).toFixed(0)}M drained</span>
                </div>
              </div>
              <div className="mono" style={{ fontSize: 10, color: "var(--ink-700)", marginTop: 8, letterSpacing: "0.05em", lineHeight: 1.7 }}>
                ▸ payout = tier_base × variant_mult × multiplier_e18 / 1e18 (deducted same tx as flipCard)<br />
                ▸ when payout {">"} buffer → capped at buffer remaining + <code>BufferDepleted(addr, shortfall)</code> event<br />
                ▸ buffer never refills · drained CASTE is now circulating supply
              </div>
            </div>

            <div>
              <div style={{ padding: 16, background: "var(--ink-100)", borderRadius: 4, border: "1px dashed var(--ink-400)" }}>
                <div className="mono" style={{ fontSize: 10, color: "var(--orchid)", letterSpacing: "0.25em", marginBottom: 10 }}>AVERAGE FLIP — WEIGHTED</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 4, rowGap: 6, fontFamily: "var(--f-mono)", fontSize: 11 }}>
                  <span style={{ color: "var(--bone-dim)" }}>avg tier_base</span>
                  <span style={{ color: "var(--bone)" }}>≈ 10,800</span>
                  <span style={{ color: "var(--bone-dim)" }}>avg variant_mult</span>
                  <span style={{ color: "var(--bone)" }}>× 1.225</span>
                  <span style={{ color: "var(--bone-dim)" }}>avg multiplier</span>
                  <span style={{ color: "var(--bone)" }}>× 1.050</span>
                  <span style={{ color: "var(--orchid)", borderTop: "1px solid var(--ink-400)", paddingTop: 4 }}>avg payout / flip</span>
                  <span style={{ color: "var(--orchid)", borderTop: "1px solid var(--ink-400)", paddingTop: 4 }}>≈ 13,900</span>
                </div>
              </div>
              <div style={{ marginTop: 12, padding: 16, background: "var(--ink-100)", borderRadius: 4, border: "1px dashed var(--orchid)" }}>
                <div className="mono" style={{ fontSize: 10, color: "var(--orchid)", letterSpacing: "0.25em", marginBottom: 8 }}>RUNWAY</div>
                <div className="led" style={{ fontSize: 28, color: "var(--orchid)" }}>~{(flipsRemaining / 1000).toFixed(0)}k flips</div>
                <div className="mono" style={{ fontSize: 10, color: "var(--ink-700)", marginTop: 4 }}>= 4.2B / 13.9k · ≥ 30× protocol life @ healthy flip rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "14px 40px 20px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 18 }}>
          <span className="display" style={{ fontSize: 32, color: "var(--bone)" }}>Flip RNG · 7 Sources</span>
          <span className="mono" style={{ fontSize: 11, color: "var(--cobalt)", letterSpacing: "0.2em" }}>· EXECUTION-TIME ENTROPY · NO ORACLE</span>
          <div style={{ flex: 1, height: 1, background: "var(--ink-400)" }} />
        </div>

        <div style={{ padding: 24, border: "1px solid var(--cobalt)", borderRadius: 8, background: "linear-gradient(135deg, oklch(0.20 0.10 245 / 0.12), var(--ink-200))" }}>
          <div style={{ padding: 14, background: "var(--ink-100)", borderRadius: 4, border: "1px dashed var(--cobalt)", marginBottom: 16 }}>
            <div className="mono" style={{ fontSize: 11, color: "var(--bone)", lineHeight: 1.7 }}>
              <span style={{ color: "var(--cobalt)" }}>seed</span> = keccak256(
              <br />
              &nbsp;&nbsp;<span style={{ color: "var(--acid)" }}>blockhash(commitBlock + 2)</span>,&nbsp;&nbsp;
              <span style={{ color: "var(--ink-700)" }}>// fallback: blockhash(now − 1)</span>
              <br />
              &nbsp;&nbsp;<span style={{ color: "var(--acid)" }}>blockhash(block.number − 1)</span>,
              <br />
              &nbsp;&nbsp;<span style={{ color: "var(--acid)" }}>block.prevrandao</span>,&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: "var(--ink-700)" }}>// PoS RANDAO</span>
              <br />
              &nbsp;&nbsp;<span style={{ color: "var(--acid)" }}>block.coinbase</span>,
              <br />
              &nbsp;&nbsp;<span style={{ color: "var(--acid)" }}>block.timestamp</span>,
              <br />
              &nbsp;&nbsp;<span style={{ color: "var(--acid)" }}>tokenId</span>,
              <br />
              &nbsp;&nbsp;<span style={{ color: "var(--acid)" }}>msg.sender</span>,
              <br />
              &nbsp;&nbsp;<span style={{ color: "var(--acid)" }}>gasleft()</span>&nbsp;&nbsp;<span style={{ color: "var(--ink-700)" }}>// tx execution path</span>
              <br />)
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div>
              <div className="mono" style={{ fontSize: 10, color: "var(--jade)", letterSpacing: "0.25em", marginBottom: 8 }}>✓ PROPERTIES</div>
              <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
                {[
                  "no oracle, no fee, no async delay (vs Chainlink VRF)",
                  "seller can't simulate before flipping — gasleft() depends on tx execution",
                  "validator can't predict — they don't know msg.sender at block proposal",
                  "offline sim infeasible — block-time entropy + execution path",
                ].map((s, i) => (
                  <li
                    key={i}
                    className="mono"
                    style={{
                      fontSize: 11,
                      color: "var(--bone-dim)",
                      letterSpacing: "0.03em",
                      lineHeight: 1.5,
                      paddingLeft: 14,
                      position: "relative",
                    }}
                  >
                    <span style={{ position: "absolute", left: 0, color: "var(--jade)" }}>▸</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="mono" style={{ fontSize: 10, color: "var(--blood-hi)", letterSpacing: "0.25em", marginBottom: 8 }}>△ ACCEPTED RISKS</div>
              <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
                {[
                  "validator MEV: theoretical — validator mines flip-favorable blocks selectively",
                  "blockhash window expires past 256 blocks — falls back to blockhash(now − 1)",
                  "commit-reveal lock = 2 blocks (minimum to prevent same-block prediction)",
                  "categorized as meme-grade · same risk profile as Pump.fun's bonding curve",
                ].map((s, i) => (
                  <li
                    key={i}
                    className="mono"
                    style={{
                      fontSize: 11,
                      color: "var(--bone-dim)",
                      letterSpacing: "0.03em",
                      lineHeight: 1.5,
                      paddingLeft: 14,
                      position: "relative",
                    }}
                  >
                    <span style={{ position: "absolute", left: 0, color: "var(--blood-hi)" }}>△</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "14px 40px 28px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 18 }}>
          <span className="display" style={{ fontSize: 32, color: "var(--bone)" }}>Constants</span>
          <span className="mono" style={{ fontSize: 11, color: "var(--ink-600)", letterSpacing: "0.2em" }}>· FROM Constants.sol</span>
          <div style={{ flex: 1, height: 1, background: "var(--ink-400)" }} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
          <ConstBlock
            title="PRICING & BATCH"
            rows={[
              ["UNIT", "$6.66666 USDC", "= 6_666_660 raw"],
              ["MIN_BATCH_UNITS", "1", "1 × UNIT min"],
              ["MAX_BATCH_UNITS", "100", "$666.666 max"],
              ["CARDS_PER_UNIT", "1", "1 unit = 1 sealed card"],
              ["MAX_CARDS", "10,000", "protocol-life cap"],
            ]}
          />
          <ConstBlock
            title="TOKEN ECONOMICS"
            rows={[
              ["TOTAL_SUPPLY", "21,000,000,000", "$CASTE · ERC20"],
              ["LP_TOKEN_AMOUNT", "16,800,000,000", "80% → LP single-side"],
              ["BUFFER_INITIAL", "4,200,000,000", "20% → flip buffer"],
              ["LP_TICK_OFFSET", "46,020", "≈ 100× price range"],
            ]}
          />
          <ConstBlock
            title="FEES & TIMING"
            rows={[
              ["SWAP_FEE_BPS", "150", "1.5% buy + Phase B sell"],
              ["PHASE_A_SELL_TAX", "2500", "25% sell tax in mint"],
              ["HOURLY_EPOCH", "1 hour", "lottery resolution"],
              ["FOMO_INITIAL", "24h", "starting Mega deadline"],
              ["FOMO_BOOST", "60s × log10(units)", "deadline extender · cap 24h"],
              ["FLIP_DELAY_BLOCKS", "2", "commit-reveal lock"],
              ["JIT_LOCKOUT", "64 blocks", "LP add → remove min wait"],
            ]}
          />
        </div>
      </section>

      <section style={{ padding: "8px 40px 40px" }}>
        <div style={{ padding: 24, border: "1px dashed var(--ink-400)", borderRadius: 6, background: "var(--ink-200)" }}>
          <div className="mono" style={{ fontSize: 10, color: "var(--ink-600)", letterSpacing: "0.25em", marginBottom: 14 }}>
            CONTRACT ADDRESSES · ETHEREUM MAINNET
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            {[
              { name: "CasteHook",  addr: shortAddr(hookAddr),  desc: "v4 hook · 0xACC flag · mined CREATE2" },
              { name: "CasteToken", addr: shortAddr(tokenAddr), desc: "ERC20 · one-shot mint by hook" },
              { name: "CasteCard",  addr: shortAddr(cardAddr),  desc: "ERC721Enumerable · sealed + flip" },
            ].map((c) => (
              <div key={c.name} style={{ padding: 14, background: "var(--ink-100)", border: "1px solid var(--ink-400)", borderRadius: 4 }}>
                <div className="display" style={{ fontSize: 14, color: "var(--bone)", letterSpacing: "0.05em" }}>{c.name}</div>
                <div className="mono" style={{ fontSize: 11, color: "var(--cobalt)", marginTop: 6, letterSpacing: "0.05em" }}>{c.addr}</div>
                <div className="mono" style={{ fontSize: 9, color: "var(--ink-700)", marginTop: 4, lineHeight: 1.5 }}>{c.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function ConstBlock({ title, rows }: { title: string; rows: Array<[string, string, string]> }) {
  return (
    <div style={{ padding: 18, border: "1px solid var(--ink-400)", borderRadius: 6, background: "var(--ink-200)" }}>
      <div className="mono" style={{ fontSize: 10, color: "var(--ink-600)", letterSpacing: "0.25em", marginBottom: 14 }}>{title}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {rows.map(([k, v, note], i) => (
          <div
            key={k}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: 8,
              paddingBottom: 6,
              borderBottom: i < rows.length - 1 ? "1px dashed var(--ink-400)" : "none",
            }}
          >
            <span className="mono" style={{ fontSize: 11, color: "var(--bone)", letterSpacing: "0.03em" }}>{k}</span>
            <span className="led" style={{ fontSize: 13, color: "var(--acid)", textAlign: "right" }}>{v}</span>
            <span className="mono" style={{ fontSize: 9, color: "var(--ink-700)", gridColumn: "1 / 3", marginTop: -2 }}>{note}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

import { Ticker, Footer } from "@/components/caste/caste-chrome";
import { SealedCard } from "@/components/caste/sealed-card";
import { CasteCard } from "@/components/caste/caste-card";
import { SEALED_CARDS, FLIPPED_CARDS, PHASE_STATE } from "@/lib/caste/mock";

export const dynamic = "force-static";

function fmtCaste(n: number) {
  return n >= 1e6 ? `${(n / 1e6).toFixed(2)}M` : n >= 1e3 ? `${(n / 1e3).toFixed(0)}K` : Math.round(n).toLocaleString();
}

export default function MyCardsPage() {
  const flippable = SEALED_CARDS.filter((c) => c.canFlip).length;
  const tickerItems = [
    { tag: "▸ YOU",    text: `${SEALED_CARDS.length} sealed · ${FLIPPED_CARDS.length} flipped · highest tier VC MYTHIC`, color: "var(--acid)" },
    { tag: "▸ BUFFER", text: `${(PHASE_STATE.bufferLeft / 1e9).toFixed(2)}B / ${(PHASE_STATE.bufferTotal / 1e9).toFixed(1)}B CASTE in reserve · ~${(PHASE_STATE.estFlipsLeft / 1000).toFixed(0)}k flips left`, color: "var(--gold-hi)" },
    { tag: "▸ FLIP",   text: "Flip is instant, gas ~120k · payout from buffer transfers same tx", color: "var(--bone-dim)" },
  ];

  return (
    <div>
      <Ticker items={tickerItems} />

      <section style={{ padding: "44px 60px 12px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 40, flexWrap: "wrap" }}>
        <div>
          <div className="mono" style={{ fontSize: 11, letterSpacing: "0.3em", color: "var(--ink-600)", marginBottom: 8 }}>
            /CASTE/MYCARDS · YOUR SEALED + FLIPPED
          </div>
          <h1 style={{ margin: 0, display: "flex", alignItems: "baseline", gap: 16, flexWrap: "wrap" }}>
            <span className="display" style={{ fontSize: 80, color: "var(--bone)", lineHeight: 1 }}>My Cards.</span>
            <span className="display" style={{ fontSize: 28, color: "var(--blood-hi)" }}>
              / {SEALED_CARDS.length} UNREVEALED
            </span>
          </h1>
          <p style={{ fontSize: 14, color: "var(--ink-700)", maxWidth: 720, marginTop: 12, lineHeight: 1.65 }}>
            Every buy mints sealed cards — face-down lottery tickets with no attributes until you flip them.
            <span style={{ color: "var(--bone-dim)" }}> Flip individually for the cinema moment, or batch them all with </span>
            <strong style={{ color: "var(--acid)" }}>Flip All</strong>
            <span style={{ color: "var(--bone-dim)" }}> to save gas.</span>
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
          <div className="mono" style={{ fontSize: 10, color: "var(--ink-600)", letterSpacing: "0.2em" }}>BATCH ACTION</div>
          <button
            style={{
              padding: "18px 28px",
              background: "var(--acid)",
              color: "var(--ink-000)",
              fontFamily: "var(--f-display)",
              fontSize: 16,
              letterSpacing: "0.18em",
              border: "none",
              borderRadius: 4,
              boxShadow: "0 6px 0 var(--acid-lo), 0 16px 32px oklch(0.90 0.20 115 / 0.35)",
              display: "flex",
              alignItems: "center",
              gap: 10,
              cursor: "pointer",
            }}
          >
            ▸ FLIP ALL {flippable} CARDS
          </button>
          <span className="mono" style={{ fontSize: 9, color: "var(--ink-700)", letterSpacing: "0.15em" }}>
            est. gas ~480k · single tx
          </span>
        </div>
      </section>

      <section style={{ padding: "12px 60px 0" }}>
        <div style={{ display: "flex", borderBottom: "1px solid var(--ink-400)", gap: 4 }}>
          <Tab label={`SEALED · ${SEALED_CARDS.length}`} active color="var(--blood-hi)" />
          <Tab label={`FLIPPED · ${FLIPPED_CARDS.length}`} color="var(--bone-dim)" />
          <Tab label={`ALL · ${SEALED_CARDS.length + FLIPPED_CARDS.length}`} color="var(--ink-700)" />
          <div style={{ flex: 1 }} />
          <span className="mono" style={{ fontSize: 10, color: "var(--ink-600)", letterSpacing: "0.15em", padding: "10px 4px" }}>
            sort: newest first ▼ · view: grid ▦
          </span>
        </div>
      </section>

      <section style={{ padding: "28px 60px 36px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 18 }}>
          <span className="display" style={{ fontSize: 22, color: "var(--blood-hi)", letterSpacing: "0.05em" }}>
            Awaiting flip
          </span>
          <span className="mono" style={{ fontSize: 10, color: "var(--ink-700)", letterSpacing: "0.15em" }}>
            · FACE-DOWN, ATTRIBUTES UNKNOWN UNTIL YOU REVEAL
          </span>
          <div style={{ flex: 1, height: 1, background: "var(--ink-400)" }} />
          <span className="mono" style={{ fontSize: 10, color: "var(--ink-700)", letterSpacing: "0.15em" }}>
            {SEALED_CARDS.length} cards · 2 blk delay
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 28, justifyItems: "stretch" }}>
          {SEALED_CARDS.map((c) => (
            <SealedCard
              key={c.tokenId}
              tokenId={c.tokenId}
              commitBlock={c.commitBlock}
              buyUnits={c.buyUnits}
              bought={c.bought}
              canFlip={c.canFlip}
              w={280}
              h={400}
            />
          ))}
        </div>
      </section>

      <section style={{ padding: "16px 60px 36px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 18 }}>
          <span className="display" style={{ fontSize: 22, color: "var(--gold-hi)", letterSpacing: "0.05em" }}>Already flipped</span>
          <span className="mono" style={{ fontSize: 10, color: "var(--ink-700)", letterSpacing: "0.15em" }}>
            · REVEALED · TIER BENEFIT ACTIVE
          </span>
          <div style={{ flex: 1, height: 1, background: "var(--ink-400)" }} />
          <span className="mono" style={{ fontSize: 10, color: "var(--ink-700)", letterSpacing: "0.15em" }}>
            {FLIPPED_CARDS.length} cards · highest tier locked in
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 28, justifyItems: "center" }}>
          {FLIPPED_CARDS.map((c) => (
            <div key={c.id} style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
              <CasteCard card={c} w={280} h={400} />
              <div className="mono" style={{ fontSize: 9, color: "var(--gold-hi)", letterSpacing: "0.15em" }}>
                FLIP PAYOUT · +{fmtCaste(c.payout)} CASTE
              </div>
              <div className="mono" style={{ fontSize: 8, color: "var(--ink-700)", letterSpacing: "0.1em" }}>
                flipped {c.flippedAgo} ago · mult {(c.multBp / 1e4).toFixed(1)}×
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: "12px 60px 60px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
          <div style={{ padding: 20, border: "1px dashed var(--ink-400)", borderRadius: 6, background: "var(--ink-200)" }}>
            <div className="mono" style={{ fontSize: 10, color: "var(--ink-600)", letterSpacing: "0.25em", marginBottom: 8 }}>
              SECONDARY MARKET
            </div>
            <div className="display" style={{ fontSize: 16, color: "var(--bone)" }}>
              Sealed cards trade on OpenSea/Blur as{" "}
              <span style={{ color: "var(--blood-hi)" }}>&quot;Sealed Caste Card #N&quot;</span>
            </div>
            <div className="mono" style={{ fontSize: 10, color: "var(--ink-700)", marginTop: 8, lineHeight: 1.7 }}>
              ▸ Neither seller nor buyer can simulate what&apos;s inside — execution-time RNG.<br />
              ▸ Whoever owns the card at flip time gets the payout. Sell before flipping = forfeit the bonus.<br />
              ▸ Flipped cards show full metadata; sealed cards show a uniform cover image.
            </div>
          </div>
          <div style={{ padding: 20, border: "1px dashed var(--ink-400)", borderRadius: 6, background: "var(--ink-200)" }}>
            <div className="mono" style={{ fontSize: 10, color: "var(--ink-600)", letterSpacing: "0.25em", marginBottom: 8 }}>
              WHY DEFER REVEAL?
            </div>
            <div className="display" style={{ fontSize: 16, color: "var(--bone)" }}>
              So the cinema moment is yours — and the secondary market is pure speculation.
            </div>
            <div className="mono" style={{ fontSize: 10, color: "var(--ink-700)", marginTop: 8, lineHeight: 1.7 }}>
              ▸ Buy = quiet ticket purchase + balance increase. No drama.<br />
              ▸ Flip = the open-the-pack ceremony. Big animation, big number.<br />
              ▸ Replicates Pokemon TCG / Hearthstone pack rip in DeFi UX.
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function Tab({ label, active = false, color = "var(--bone-dim)" }: { label: string; active?: boolean; color?: string }) {
  return (
    <div
      style={{
        padding: "10px 18px",
        fontFamily: "var(--f-display)",
        fontSize: 13,
        letterSpacing: "0.12em",
        color: active ? color : "var(--ink-700)",
        borderBottom: active ? `2px solid ${color}` : "2px solid transparent",
        marginBottom: -1,
        cursor: "pointer",
      }}
    >
      {label}
    </div>
  );
}

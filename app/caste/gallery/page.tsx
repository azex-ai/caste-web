import { Ticker, Footer } from "@/components/caste/caste-chrome";
import { SealedCard } from "@/components/caste/sealed-card";
import { CasteCard } from "@/components/caste/caste-card";
import { SIGNATURES, MOCK_CARDS, SEALED_CARDS, FLIPPED_CARDS, SECONDARY_LISTINGS, PHASE_STATE } from "@/lib/caste/mock";

export const dynamic = "force-static";

export default function GalleryV1Page() {
  const mythicLeaders = MOCK_CARDS.filter((c) => c.variant === 2).slice(0, 4);
  const tickerItems = [
    { tag: "▸ MARKET", text: `${SECONDARY_LISTINGS.length} sealed cards listed on OpenSea / Blur · pure speculation`, color: "var(--orchid)" },
    { tag: "▸ YOU",    text: `${SEALED_CARDS.length} sealed · ${FLIPPED_CARDS.length} flipped · highest tier VC MYTHIC`, color: "var(--acid)" },
    { tag: "▸ MINTED", text: `${PHASE_STATE.cardsMinted.toLocaleString()} / 10,000 protocol cards · ${(10000 - PHASE_STATE.cardsMinted).toLocaleString()} until cap`, color: "var(--blood-hi)" },
  ];

  return (
    <div>
      <Ticker items={tickerItems} />

      <section style={{ padding: "44px 60px 28px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 40, flexWrap: "wrap" }}>
        <div>
          <div className="mono" style={{ fontSize: 11, letterSpacing: "0.3em", color: "var(--ink-600)", marginBottom: 8 }}>
            /CASTE/GALLERY · SEALED · FLIPPED · MARKET
          </div>
          <h1 style={{ margin: 0 }}>
            <span className="display" style={{ fontSize: 80, color: "var(--bone)", lineHeight: 1 }}>The Gallery.</span>
          </h1>
          <p style={{ fontSize: 15, color: "var(--ink-700)", maxWidth: 820, marginTop: 12, lineHeight: 1.65 }}>
            Two states, three lenses. <strong style={{ color: "var(--blood-hi)" }}>Sealed</strong> cards all look identical — uniform cover, serial only.
            <strong style={{ color: "var(--gold-hi)" }}> Flipped</strong> cards show full metadata. The
            <strong style={{ color: "var(--orchid)" }}> secondary market</strong> mostly traffics sealed — that&apos;s where the gambling really happens.
          </p>
        </div>
      </section>

      <section style={{ padding: "12px 60px 0" }}>
        <div style={{ display: "flex", borderBottom: "1px solid var(--ink-400)", gap: 4 }}>
          <Tab label={`MY SEALED · ${SEALED_CARDS.length}`} active color="var(--blood-hi)" />
          <Tab label={`MY FLIPPED · ${FLIPPED_CARDS.length}`} color="var(--gold-hi)" />
          <Tab label={`MARKET · ${SECONDARY_LISTINGS.length}`} color="var(--orchid)" />
          <Tab label="MYTHIC LEADERBOARD" color="var(--ink-700)" />
          <div style={{ flex: 1 }} />
          <span className="mono" style={{ fontSize: 10, color: "var(--ink-600)", letterSpacing: "0.15em", padding: "10px 4px" }}>
            sort: newest ▼ · view: grid ▦
          </span>
        </div>
      </section>

      <section style={{ padding: "28px 60px 28px" }}>
        <SectionHead title="My Sealed" color="var(--blood-hi)" note="FACE-DOWN · ATTRIBUTES UNKNOWN UNTIL FLIP" right={`${SEALED_CARDS.length} cards · 2 blk delay`} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
          {SEALED_CARDS.slice(0, 4).map((c) => (
            <SealedCard key={c.tokenId} tokenId={c.tokenId} commitBlock={c.commitBlock} buyUnits={c.buyUnits} bought={c.bought} canFlip={c.canFlip} w={260} h={372} />
          ))}
        </div>
      </section>

      <section style={{ padding: "12px 60px 28px" }}>
        <SectionHead
          title="My Flipped"
          color="var(--gold-hi)"
          note="REVEALED · TIER + VARIANT + PAYOUT LOCKED"
          right={`${FLIPPED_CARDS.length} cards · total +${(FLIPPED_CARDS.reduce((a, c) => a + c.payout, 0) / 1e6).toFixed(2)}M CASTE`}
        />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
          {FLIPPED_CARDS.map((c) => (
            <div key={c.id} style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
              <CasteCard card={c} w={260} h={372} />
              <div style={{ display: "flex", justifyContent: "space-between", width: 260, marginTop: 6 }}>
                <span className="mono" style={{ fontSize: 9, color: "var(--gold-hi)", letterSpacing: "0.15em" }}>
                  +{c.payout >= 1e6 ? `${(c.payout / 1e6).toFixed(2)}M` : `${(c.payout / 1e3).toFixed(0)}K`}
                </span>
                <span className="mono" style={{ fontSize: 9, color: "var(--ink-700)", letterSpacing: "0.1em" }}>
                  ×{(c.multBp / 1e4).toFixed(1)} · {c.flippedAgo} ago
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: "12px 60px 28px" }}>
        <SectionHead
          title="Secondary Market · Sealed"
          color="var(--orchid)"
          note="EXECUTION-TIME RNG · NEITHER SELLER NOR BUYER KNOWS THE INSIDE"
          right={`${SECONDARY_LISTINGS.length} active listings`}
        />

        <div style={{ padding: 18, border: "1px dashed var(--orchid)", borderRadius: 6, background: "oklch(0.22 0.10 320 / 0.10)", marginBottom: 18 }}>
          <div className="mono" style={{ fontSize: 11, color: "var(--orchid)", letterSpacing: "0.12em", lineHeight: 1.7 }}>
            ▸ Listings carry only <code>tokenId</code> and <code>commitBlock</code>. No tier, no variant, no payout estimate.<br />
            ▸ Whoever owns the card <em>at flip time</em> claims the payout. Sell before flipping = forfeit.<br />
            ▸ Price is set by speculation: did the seller already know something? They didn&apos;t. RNG locks at flip.
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
          {SECONDARY_LISTINGS.map((l) => (
            <MarketCard key={l.tokenId} listing={l} />
          ))}
        </div>
      </section>

      <section style={{ padding: "12px 60px 60px" }}>
        <SectionHead
          title="Protocol Mythic Wall"
          color="var(--gold-hi)"
          note="ONLY FLIPPED CARDS COUNT · 142 MYTHIC OUT OF 4,019 FLIPPED"
          right="all-time · sortable"
        />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
          {mythicLeaders.map((c, i) => (
            <div key={c.id} style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
              <CasteCard card={c} w={240} h={345} />
              <div style={{ width: 240, padding: 10, background: "var(--ink-200)", border: "1px solid var(--ink-400)", borderRadius: 4 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span className="mono" style={{ fontSize: 10, color: "var(--ink-700)", letterSpacing: "0.15em" }}>OWNER</span>
                  <span className="mono" style={{ fontSize: 9, color: "var(--orchid)" }}>#{i + 1} all-time</span>
                </div>
                <div className="mono" style={{ fontSize: 12, color: "var(--bone)", marginTop: 4 }}>
                  {["cz.eth", "vitalik.eth", "0x7b2c…d104", "anon-degen.eth"][i]}
                </div>
                <div className="mono" style={{ fontSize: 9, color: "var(--ink-600)", marginTop: 4 }}>
                  signed by {SIGNATURES[c.sig]} · flip payout +{[2400, 800, 287, 96][i]}K CASTE
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

function SectionHead({ title, color, note, right }: { title: string; color: string; note: string; right: string }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 18 }}>
      <span className="display" style={{ fontSize: 28, color, letterSpacing: "0.05em" }}>{title}</span>
      <span className="mono" style={{ fontSize: 10, color: "var(--ink-700)", letterSpacing: "0.15em" }}>· {note}</span>
      <div style={{ flex: 1, height: 1, background: "var(--ink-400)" }} />
      <span className="mono" style={{ fontSize: 10, color: "var(--ink-700)", letterSpacing: "0.15em" }}>{right}</span>
    </div>
  );
}

function MarketCard({ listing: l }: { listing: (typeof SECONDARY_LISTINGS)[number] }) {
  return (
    <div style={{ padding: 14, border: "1px solid var(--orchid)", borderRadius: 6, background: "var(--ink-200)" }}>
      <SealedCard tokenId={l.tokenId} commitBlock={l.commitBlock} buyUnits={1} bought={l.ago} canFlip={false} w={232} h={332} showFlipBtn={false} />

      <div style={{ marginTop: 12, padding: 10, background: "var(--ink-100)", border: "1px solid var(--ink-400)", borderRadius: 4 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span className="mono" style={{ fontSize: 9, color: "var(--ink-600)", letterSpacing: "0.2em" }}>ASK</span>
          <span className="mono" style={{ fontSize: 9, color: l.marketplace === "Blur" ? "var(--cobalt)" : "var(--acid)", letterSpacing: "0.15em" }}>
            {l.marketplace.toUpperCase()}
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 4 }}>
          <span className="led" style={{ fontSize: 22, color: "var(--bone)", lineHeight: 1 }}>{l.askEth} Ξ</span>
          <span className="mono" style={{ fontSize: 11, color: "var(--ink-700)" }}>≈ ${l.askUsd}</span>
        </div>
        <div className="mono" style={{ fontSize: 9, color: "var(--ink-700)", marginTop: 6, letterSpacing: "0.05em" }}>
          seller {l.seller} · listed {l.ago} ago
        </div>
        <button
          style={{
            width: "100%",
            marginTop: 8,
            padding: "8px 0",
            background: "transparent",
            color: "var(--orchid)",
            border: "1px solid var(--orchid)",
            fontFamily: "var(--f-mono)",
            fontSize: 10,
            letterSpacing: "0.2em",
            borderRadius: 3,
            cursor: "pointer",
          }}
        >
          BUY SEALED · {l.askEth} Ξ
        </button>
      </div>
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

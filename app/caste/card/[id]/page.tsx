import { Fragment } from "react";
import Link from "next/link";
import { Ticker, Footer } from "@/components/caste/caste-chrome";
import { SealedCard } from "@/components/caste/sealed-card";
import { CasteCard } from "@/components/caste/caste-card";
import { TierBadge } from "@/components/caste/tier-badge";
import { TIERS, VARIANTS, SIGNATURES, TRAITS } from "@/lib/caste/mock";

export const dynamic = "force-static";

export default async function CardDetailV1Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tokenId = Number(id) || 8421;

  const sealedDemo = { tokenId, commitBlock: 22140221, buyUnits: 12, bought: "14s ago" };
  const flippedDemo = { id: tokenId, tier: 6, variant: 2, sig: 1, traits: [0, 1, 3], swaps: 0, jackpots: 0 };

  const t = TIERS[flippedDemo.tier]!;
  const v = VARIANTS[flippedDemo.variant]!;
  const sig = SIGNATURES[flippedDemo.sig] ?? "—";
  const traitNames = TRAITS[t.key] ?? [];

  const tickerItems = [
    { tag: `▸ /CARD/${tokenId}`, text: `Token #${tokenId} — both UI states shown side-by-side`, color: "var(--acid)" },
    { tag: "▸ SEALED",  text: "Pre-flip: cover image + Flip button · no attributes leaked", color: "var(--blood-hi)" },
    { tag: "▸ FLIPPED", text: "Post-flip: full metadata + tier emoji + payout receipt", color: "var(--gold-hi)" },
  ];

  return (
    <div>
      <Ticker items={tickerItems} />

      <section style={{ padding: "44px 60px 16px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 8 }}>
          <Link href="/caste/mycards" className="mono" style={{ fontSize: 11, color: "var(--ink-700)", letterSpacing: "0.2em", textDecoration: "none" }}>
            ← /caste/mycards
          </Link>
          <span className="mono" style={{ fontSize: 11, color: "var(--ink-600)", letterSpacing: "0.3em" }}>· /CASTE/CARD/{tokenId}</span>
        </div>
        <h1 style={{ margin: 0, display: "flex", alignItems: "baseline", gap: 18, flexWrap: "wrap" }}>
          <span className="display" style={{ fontSize: 80, color: "var(--bone)", lineHeight: 1 }}>#{tokenId}</span>
          <span className="display" style={{ fontSize: 22, color: "var(--ink-700)" }}>· two states, same token</span>
        </h1>
        <p style={{ fontSize: 14, color: "var(--ink-700)", maxWidth: 880, marginTop: 12, lineHeight: 1.7 }}>
          The CardDetail page reads <code>card.flipped(tokenId)</code> and branches between two completely different layouts. Before flip: cover image + commit info + Flip CTA. After flip: full attributes, payout receipt, tier benefits.
        </p>
      </section>

      <section style={{ padding: "20px 60px 40px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
        <StateColumn title="SEALED · pre-flip" accent="var(--blood-hi)" sub="card.flipped(tokenId) → false">
          <div style={{ position: "relative", padding: 30, border: "1px solid var(--blood-lo)", borderRadius: 8, background: "linear-gradient(135deg, oklch(0.20 0.10 25 / 0.18), var(--ink-200))", display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, var(--blood-lo), var(--blood-hi), var(--blood-lo))" }} />
            <SealedCard tokenId={sealedDemo.tokenId} commitBlock={sealedDemo.commitBlock} buyUnits={sealedDemo.buyUnits} bought={sealedDemo.bought} w={300} h={430} canFlip />
            <div className="mono" style={{ fontSize: 9, color: "var(--ink-700)", letterSpacing: "0.18em", textAlign: "center", lineHeight: 1.6 }}>
              ▸ tokenURI returns a uniform &quot;Sealed Caste Card&quot; image<br />
              ▸ visible on OpenSea/Blur with &quot;flip to reveal&quot; copy
            </div>
          </div>

          <MetadataPanel
            rows={[
              ["TOKEN ID",     `#${tokenId}`,            "var(--bone)"],
              ["FLIPPED",      "false",                  "var(--blood-hi)"],
              ["COMMIT BLOCK", "22,140,221",             "var(--ink-700)"],
              ["TIER",         "Tier.None",              "var(--ink-700)"],
              ["VARIANT",      "Common (default)",       "var(--ink-700)"],
              ["TRAITS",       "[0, 0, 0]",              "var(--ink-700)"],
              ["MULT BP",      "0",                      "var(--ink-700)"],
              ["FLIPPED AT",   "—",                      "var(--ink-700)"],
              ["OWNER",        "0x6e91…aa83 · you",      "var(--bone)"],
              ["TRANSFERS",    "0 since mint",           "var(--ink-700)"],
            ]}
          />

          <div style={{ padding: 18, border: "1px dashed var(--ink-500)", borderRadius: 6, background: "var(--ink-100)" }}>
            <div className="mono" style={{ fontSize: 10, color: "var(--ink-600)", letterSpacing: "0.25em", marginBottom: 10 }}>SECONDARY MARKET · OPENSEA / BLUR</div>
            <div className="display" style={{ fontSize: 15, color: "var(--bone)" }}>&quot;Sealed Caste Card #{tokenId}&quot;</div>
            <div className="mono" style={{ fontSize: 10, color: "var(--ink-700)", marginTop: 6, lineHeight: 1.7 }}>
              ▸ Listed at floor <span className="led" style={{ fontSize: 14, color: "var(--bone)" }}>0.8 ETH</span> · floor for ALL sealed cards.<br />
              ▸ Sellers can&apos;t simulate what&apos;s inside · neither can buyers · pure speculation.<br />
              ▸ Whoever owns at flip time keeps the payout.
            </div>
          </div>
        </StateColumn>

        <StateColumn title="FLIPPED · post-flip" accent="var(--gold-hi)" sub="card.flipped(tokenId) → true">
          <div style={{ position: "relative", padding: 30, border: "1px solid var(--gold-hi)", borderRadius: 8, background: "linear-gradient(135deg, oklch(0.20 0.08 82 / 0.25), var(--ink-200))", display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, var(--gold), var(--gold-hi), var(--gold))" }} />
            <CasteCard card={flippedDemo} w={300} h={430} />

            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
              <TierBadge tier={flippedDemo.tier} variant={flippedDemo.variant} size="md" />
              <span className="chip chip--gold">5.0× JACKPOT MULTIPLIER</span>
              <span className="chip chip--blood">Black Humor Suit</span>
            </div>

            <div style={{ width: "100%", padding: 14, background: "oklch(0 0 0 / 0.35)", border: "1px solid var(--gold-hi)", borderRadius: 4 }}>
              <div className="mono" style={{ fontSize: 9, color: "var(--gold-hi)", letterSpacing: "0.25em" }}>FLIP PAYOUT · LOGGED ON-CHAIN</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 4 }}>
                <span className="led" style={{ fontSize: 42, color: "var(--gold-hi)", textShadow: "0 0 16px var(--gold)" }}>+375K</span>
                <span className="mono" style={{ fontSize: 11, color: "var(--bone-dim)" }}>$CASTE · paid from buffer</span>
              </div>
              <div className="mono" style={{ fontSize: 9, color: "var(--ink-700)", marginTop: 6, letterSpacing: "0.05em" }}>
                25,000 × 3.0× × 5.0× = 375,000 · flipped 2 d ago by you
              </div>
            </div>
          </div>

          <MetadataPanel
            rows={[
              ["TOKEN ID",     `#${tokenId}`,                           "var(--bone)"],
              ["FLIPPED",      "true",                                  "var(--jade)"],
              ["COMMIT BLOCK", "22,140,221 (sealed)",                   "var(--ink-700)"],
              ["TIER",         `Tier.VC (${t.cn})`,                     "var(--gold-hi)"],
              ["VARIANT",      `MYTHIC (×${v.mult})`,                   "var(--orchid)"],
              ["SIGNATURE",    `by ${sig}`,                             "var(--bone)"],
              ["TRAITS",       `[${flippedDemo.traits.map((i) => traitNames[i]).join(", ")}]`, "var(--bone-dim)"],
              ["MULT BP",      "50,000 (5.0×)",                         "var(--gold-hi)"],
              ["FLIPPED AT",   "2026-05-14 18:42 UTC",                  "var(--ink-700)"],
              ["FLIP PAYOUT",  "375,000 CASTE",                         "var(--gold-hi)"],
              ["OWNER",        "0x6e91…aa83 · you",                     "var(--bone)"],
            ]}
          />

          <div style={{ padding: 18, border: "1px solid var(--gold-hi)", borderRadius: 6, background: "linear-gradient(135deg, oklch(0.20 0.08 82 / 0.15), var(--ink-100))" }}>
            <div className="mono" style={{ fontSize: 10, color: "var(--gold-hi)", letterSpacing: "0.25em", marginBottom: 10 }}>SECONDARY MARKET · BLACK HUMOR PREMIUM</div>
            <div className="display" style={{ fontSize: 15, color: "var(--bone)" }}>&quot;Mythic VC by SBF #{tokenId}&quot;</div>
            <div className="mono" style={{ fontSize: 10, color: "var(--ink-700)", marginTop: 6, lineHeight: 1.7 }}>
              ▸ Now listed individually · floor <span className="led" style={{ fontSize: 14, color: "var(--gold-hi)" }}>12.4 ETH</span> (Blur) /{" "}
              <span className="led" style={{ fontSize: 14, color: "var(--gold-hi)" }}>13.1 ETH</span> (OpenSea).<br />
              ▸ Rarity: 1 in ~16,000 (VC 5% × Mythic 5% × SBF sig 5% × FTX trait).<br />
              ▸ Payout already collected — secondary buyer gets the NFT only.
            </div>
          </div>
        </StateColumn>
      </section>

      <section style={{ padding: "20px 60px 60px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 18 }}>
          <span className="display" style={{ fontSize: 24, color: "var(--bone)" }}>Token #{tokenId} lifecycle</span>
          <span className="mono" style={{ fontSize: 10, color: "var(--ink-700)", letterSpacing: "0.2em" }}>
            · EVENT HISTORY FROM SEAL → FLIP
          </span>
          <div style={{ flex: 1, height: 1, background: "var(--ink-400)" }} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "180px 1fr 180px", gap: 0, background: "var(--ink-200)", border: "1px solid var(--ink-400)", borderRadius: 6, overflow: "hidden" }}>
          {([
            { ts: "block 22,140,221", ev: "CardMinted",            desc: "minted sealed in 12-unit buy by 0x6e91…aa83 · commitBlock = same",   tone: "var(--blood-hi)" },
            { ts: "+ 2 blocks",       ev: "(flip unlock)",         desc: "RNG anchor now safe — user can call flipCard from this block onward", tone: "var(--ink-700)" },
            { ts: "block 22,140,236", ev: "CardFlipped",           desc: "VC + Mythic + sig SBF + traits [FTX Victim,…] · multBp 50000 · payout 375,000 CASTE", tone: "var(--gold-hi)" },
            { ts: "+ 0 (same tx)",    ev: "Transfer",              desc: "375,000 CASTE moved from hook buffer → 0x6e91…aa83",                tone: "var(--jade)" },
            { ts: "+ 0 (same tx)",    ev: "BufferDepleted (n/a)",  desc: "payout < remaining buffer → no shortfall · buffer 3,894,120,000 → 3,893,745,000", tone: "var(--ink-700)" },
          ] as const).map((r, i, arr) => (
            <Fragment key={i}>
              <div className="mono" style={{ fontSize: 10, color: "var(--ink-600)", padding: "12px 16px", letterSpacing: "0.1em", borderBottom: i < arr.length - 1 ? "1px dotted var(--ink-400)" : "none", background: "var(--ink-100)" }}>
                {r.ts}
              </div>
              <div className="mono" style={{ fontSize: 11, color: r.tone, padding: "12px 16px", letterSpacing: "0.05em", borderBottom: i < arr.length - 1 ? "1px dotted var(--ink-400)" : "none" }}>
                {r.desc}
              </div>
              <div className="mono" style={{ fontSize: 10, color: r.tone, padding: "12px 16px", letterSpacing: "0.15em", textAlign: "right", borderBottom: i < arr.length - 1 ? "1px dotted var(--ink-400)" : "none" }}>
                {r.ev}
              </div>
            </Fragment>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}

function StateColumn({ title, accent, sub, children }: { title: string; accent: string; sub: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span className="display" style={{ fontSize: 22, color: accent, letterSpacing: "0.05em" }}>{title}</span>
        <div style={{ flex: 1, height: 1, background: "var(--ink-400)" }} />
        <span className="mono" style={{ fontSize: 10, color: "var(--ink-700)", letterSpacing: "0.15em" }}>{sub}</span>
      </div>
      {children}
    </div>
  );
}

function MetadataPanel({ rows }: { rows: Array<[string, string, string]> }) {
  return (
    <div style={{ padding: 20, border: "1px solid var(--ink-400)", borderRadius: 8, background: "var(--ink-200)" }}>
      <div className="mono" style={{ fontSize: 10, color: "var(--ink-600)", letterSpacing: "0.25em", marginBottom: 14 }}>
        ON-CHAIN STATE · CardData
      </div>
      {rows.map(([k, v, c], i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "150px 1fr", gap: 10, padding: "8px 0", borderBottom: i < rows.length - 1 ? "1px dotted var(--ink-400)" : "none" }}>
          <span className="mono" style={{ fontSize: 10, color: "var(--ink-600)", letterSpacing: "0.15em" }}>{k}</span>
          <span className="mono" style={{ fontSize: 12, color: c, textAlign: "right" }}>{v}</span>
        </div>
      ))}
    </div>
  );
}

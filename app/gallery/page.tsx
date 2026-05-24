"use client";

import { useAccount } from "wagmi";

import { Ticker, Footer } from "@/components/caste/caste-chrome";
import { SealedCard } from "@/components/caste/sealed-card";
import { CasteCard } from "@/components/caste/caste-card";
import { SIGNATURES } from "@/lib/caste/mock";
import { useRareCards, useStats, useUserCards } from "@/lib/caste/hooks";
import type { CardData } from "@/lib/caste/types";
import type { CardRow } from "@/lib/caste/response-types";

const ONE_E18 = 10n ** 18n;

function shortAddr(a?: string | null): string {
  if (!a || a.length < 12) return a ?? "—";
  return `${a.slice(0, 6)}…${a.slice(-4)}`;
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

export default function GalleryV1Page() {
  const { address } = useAccount();
  const { data: stats } = useStats();
  const { data: ownedCards = [] } = useUserCards(address);
  const { data: rareCards = [] } = useRareCards(100);

  const nowSec = Math.floor(Date.now() / 1000);
  const sealed = ownedCards.filter((c) => !c.flipped);
  const flipped = ownedCards.filter((c) => c.flipped);
  const mythicLeaders = rareCards.filter((c) => c.variant === 2).slice(0, 4);

  const totalFlippedPayout = flipped.reduce(
    (acc, c) => acc + (c.payout ? Number(BigInt(c.payout) / ONE_E18) : 0),
    0,
  );

  const tickerItems = [
    { tag: "▸ YOU",    text: address ? `${sealed.length} sealed · ${flipped.length} flipped` : "connect wallet to see your cards", color: "var(--acid)" },
    { tag: "▸ MINTED", text: `${stats?.cardsMinted ?? 0} / 10,000 protocol cards`, color: "var(--blood-hi)" },
    { tag: "▸ MYTHIC", text: `${stats?.mythicCount ?? 0} mythic flips lifetime`, color: "var(--gold-hi)" },
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
            <strong style={{ color: "var(--gold-hi)" }}> Flipped</strong> cards show full metadata. Sealed cards on the secondary market are pure speculation —
            RNG locks at flip time, not list time.
          </p>
        </div>
      </section>

      <section style={{ padding: "12px 60px 0" }}>
        <div style={{ display: "flex", borderBottom: "1px solid var(--ink-400)", gap: 4 }}>
          <Tab label={`MY SEALED · ${sealed.length}`} active color="var(--blood-hi)" />
          <Tab label={`MY FLIPPED · ${flipped.length}`} color="var(--gold-hi)" />
          <Tab label={`MYTHIC WALL · ${mythicLeaders.length}`} color="var(--orchid)" />
          <div style={{ flex: 1 }} />
          <span className="mono" style={{ fontSize: 10, color: "var(--ink-600)", letterSpacing: "0.15em", padding: "10px 4px" }}>
            sort: newest ▼ · view: grid ▦
          </span>
        </div>
      </section>

      <section style={{ padding: "28px 60px 28px" }}>
        <SectionHead title="My Sealed" color="var(--blood-hi)" note="FACE-DOWN · ATTRIBUTES UNKNOWN UNTIL FLIP" right={`${sealed.length} cards · 2 blk delay`} />
        {!address && (
          <EmptyState text="CONNECT WALLET TO VIEW YOUR CARDS" />
        )}
        {address && sealed.length === 0 && (
          <EmptyState text="NO SEALED CARDS — BUY ON THE SWAP PAGE TO MINT" />
        )}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
          {sealed.slice(0, 8).map((c) => {
            const buyAgo = fmtAgo(nowSec - Number(c.mintTime));
            return (
              <SealedCard
                key={c.tokenId}
                tokenId={Number(c.tokenId)}
                commitBlock={Number(c.commitBlock)}
                buyUnits={1}
                bought={`${buyAgo} ago`}
                canFlip={true}
                w={260}
                h={372}
              />
            );
          })}
        </div>
      </section>

      <section style={{ padding: "12px 60px 28px" }}>
        <SectionHead
          title="My Flipped"
          color="var(--gold-hi)"
          note="REVEALED · TIER + VARIANT + PAYOUT LOCKED"
          right={`${flipped.length} cards · total +${(totalFlippedPayout / 1e3).toFixed(0)}K CASTE`}
        />
        {address && flipped.length === 0 && (
          <EmptyState text="NO FLIPPED CARDS YET" />
        )}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
          {flipped.slice(0, 8).map((c) => {
            const card = cardRowToCard(c);
            const payoutCaste = c.payout ? Number(BigInt(c.payout) / ONE_E18) : 0;
            const multX = (c.multiplierBp ?? 10000) / 10000;
            const ago = c.flipTime ? fmtAgo(nowSec - Number(c.flipTime)) : "—";
            return (
              <div key={c.tokenId} style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
                <CasteCard card={card} w={260} h={372} />
                <div style={{ display: "flex", justifyContent: "space-between", width: 260, marginTop: 6 }}>
                  <span className="mono" style={{ fontSize: 9, color: "var(--gold-hi)", letterSpacing: "0.15em" }}>
                    +{payoutCaste >= 1e6 ? `${(payoutCaste / 1e6).toFixed(2)}M` : `${(payoutCaste / 1e3).toFixed(0)}K`}
                  </span>
                  <span className="mono" style={{ fontSize: 9, color: "var(--ink-700)", letterSpacing: "0.1em" }}>
                    ×{multX.toFixed(1)} · {ago} ago
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section style={{ padding: "12px 60px 60px" }}>
        <SectionHead
          title="Protocol Mythic Wall"
          color="var(--gold-hi)"
          note={`${stats?.mythicCount ?? 0} MYTHIC FLIPS OUT OF ${stats?.cardsFlipped ?? 0} TOTAL`}
          right="all-time · live"
        />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
          {mythicLeaders.length === 0 && (
            <div style={{ gridColumn: "1 / -1", padding: 24, textAlign: "center", color: "var(--ink-600)", fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: "0.15em", border: "1px dashed var(--ink-400)", borderRadius: 6 }}>
              NO MYTHIC CARDS REVEALED YET
            </div>
          )}
          {mythicLeaders.map((c, i) => {
            const card = cardRowToCard(c);
            const payoutCaste = c.payout ? Number(BigInt(c.payout) / ONE_E18) : 0;
            return (
              <div key={c.tokenId} style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
                <CasteCard card={card} w={240} h={345} />
                <div style={{ width: 240, padding: 10, background: "var(--ink-200)", border: "1px solid var(--ink-400)", borderRadius: 4 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span className="mono" style={{ fontSize: 10, color: "var(--ink-700)", letterSpacing: "0.15em" }}>OWNER</span>
                    <span className="mono" style={{ fontSize: 9, color: "var(--orchid)" }}>#{i + 1}</span>
                  </div>
                  <div className="mono" style={{ fontSize: 12, color: "var(--bone)", marginTop: 4 }}>
                    {shortAddr(c.owner)}
                  </div>
                  <div className="mono" style={{ fontSize: 9, color: "var(--ink-600)", marginTop: 4 }}>
                    signed by {SIGNATURES[card.sig] ?? "—"} · +{(payoutCaste / 1e3).toFixed(0)}K CASTE
                  </div>
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

function EmptyState({ text }: { text: string }) {
  return (
    <div style={{ padding: 24, textAlign: "center", color: "var(--ink-600)", fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: "0.15em", border: "1px dashed var(--ink-400)", borderRadius: 6, marginBottom: 18 }}>
      {text}
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

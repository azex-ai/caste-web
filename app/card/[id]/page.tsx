"use client";

import { use } from "react";
import Link from "next/link";

import { Ticker, Footer } from "@/components/caste/caste-chrome";
import { SealedCard } from "@/components/caste/sealed-card";
import { CasteCard } from "@/components/caste/caste-card";
import { TierBadge } from "@/components/caste/tier-badge";
import { TIERS, VARIANTS, SIGNATURES, TRAITS } from "@/lib/caste/mock";
import { useCard } from "@/lib/caste/hooks";
import { useFlipCard } from "@/lib/caste/writes";
import type { CardData } from "@/lib/caste/types";

const ONE_E18 = 10n ** 18n;

function shortAddr(a?: string): string {
  if (!a || a.length < 12) return a ?? "—";
  return `${a.slice(0, 6)}…${a.slice(-4)}`;
}

function fmtAgo(ts: bigint, nowSec: number): string {
  const diff = nowSec - Number(ts);
  if (diff < 60) return `${Math.max(diff, 0)}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}

export default function CardDetailV1Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const tokenId = id;
  const { data: card, isLoading, error } = useCard(tokenId);
  const nowSec = Math.floor(Date.now() / 1000);

  const tickerItems = [
    { tag: `▸ /CARD/${tokenId}`, text: `Token #${tokenId} — live state from indexer`, color: "var(--acid)" },
    { tag: "▸ STATE", text: card?.flipped ? "Flipped · full metadata revealed" : "Sealed · cover image only", color: card?.flipped ? "var(--gold-hi)" : "var(--blood-hi)" },
    { tag: "▸ OWNER", text: shortAddr(card?.owner), color: "var(--bone-dim)" },
  ];

  return (
    <div>
      <Ticker items={tickerItems} />

      <section style={{ padding: "28px 40px 12px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 8 }}>
          <Link href="/mycards" className="mono" style={{ fontSize: 11, color: "var(--ink-700)", letterSpacing: "0.2em", textDecoration: "none" }}>
            ← /mycards
          </Link>
          <span className="mono" style={{ fontSize: 11, color: "var(--ink-600)", letterSpacing: "0.3em" }}>· /CASTE/CARD/{tokenId}</span>
        </div>
        <h1 style={{ margin: 0, display: "flex", alignItems: "baseline", gap: 18, flexWrap: "wrap" }}>
          <span className="display" style={{ fontSize: 56, color: "var(--bone)", lineHeight: 1 }}>#{tokenId}</span>
          {card && (
            <span className="display" style={{ fontSize: 22, color: card.flipped ? "var(--gold-hi)" : "var(--blood-hi)" }}>
              · {card.flipped ? "REVEALED" : "SEALED"}
            </span>
          )}
        </h1>
      </section>

      {isLoading && (
        <section style={{ padding: "0 40px 40px" }}>
          <div style={{ padding: 24, textAlign: "center", color: "var(--ink-600)", fontFamily: "var(--f-mono)", fontSize: 12, letterSpacing: "0.15em" }}>
            LOADING CARD #{tokenId}…
          </div>
        </section>
      )}

      {error && (
        <section style={{ padding: "0 40px 40px" }}>
          <div style={{ padding: 24, textAlign: "center", color: "var(--blood-hi)", fontFamily: "var(--f-mono)", fontSize: 12, letterSpacing: "0.15em", border: "1px dashed var(--blood-lo)", borderRadius: 6 }}>
            CARD NOT FOUND
          </div>
        </section>
      )}

      {card && !card.flipped && (
        <SealedView
          tokenId={tokenId}
          commitBlock={card.commitBlock}
          mintTime={BigInt(card.mintTime)}
          owner={card.owner}
          nowSec={nowSec}
        />
      )}
      {card && !card.flipped && <FlipActionBar tokenId={tokenId} />}

      {card && card.flipped && (
        <FlippedView
          tokenId={tokenId}
          tier={card.tier ?? 0}
          variant={card.variant ?? 0}
          signature={card.signature ?? 0}
          traits={[card.trait0 ?? 0, card.trait1 ?? 1, card.trait2 ?? 2]}
          multiplierBp={card.multiplierBp ?? 10000}
          payout={card.payout ?? "0"}
          flipTime={card.flipTime ? BigInt(card.flipTime) : 0n}
          owner={card.owner}
          nowSec={nowSec}
        />
      )}

      <Footer />
    </div>
  );
}

function SealedView({ tokenId, commitBlock, mintTime, owner, nowSec }: {
  tokenId: string;
  commitBlock: string;
  mintTime: bigint;
  owner: string;
  nowSec: number;
}) {
  return (
    <section style={{ padding: "14px 40px 28px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
      <div>
        <div style={{ position: "relative", padding: 30, border: "1px solid var(--blood-lo)", borderRadius: 8, background: "linear-gradient(135deg, oklch(0.20 0.10 25 / 0.18), var(--ink-200))", display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, var(--blood-lo), var(--blood-hi), var(--blood-lo))" }} />
          <SealedCard
            tokenId={Number(tokenId)}
            commitBlock={Number(commitBlock)}
            buyUnits={1}
            bought={`${fmtAgo(mintTime, nowSec)} ago`}
            w={300}
            h={430}
            canFlip
          />
        </div>
      </div>

      <div>
        <MetadataPanel
          rows={[
            ["TOKEN ID",     `#${tokenId}`,                                "var(--bone)"],
            ["FLIPPED",      "false",                                      "var(--blood-hi)"],
            ["COMMIT BLOCK", Number(commitBlock).toLocaleString(),         "var(--ink-700)"],
            ["TIER",         "Tier.None (pre-flip)",                       "var(--ink-700)"],
            ["VARIANT",      "—",                                          "var(--ink-700)"],
            ["TRAITS",       "[?, ?, ?]",                                  "var(--ink-700)"],
            ["MULT BP",      "0",                                          "var(--ink-700)"],
            ["FLIPPED AT",   "—",                                          "var(--ink-700)"],
            ["OWNER",        shortAddr(owner),                             "var(--bone)"],
            ["MINTED",       `${fmtAgo(mintTime, nowSec)} ago`,            "var(--bone-dim)"],
          ]}
        />
      </div>
    </section>
  );
}

function FlippedView({ tokenId, tier, variant, signature, traits, multiplierBp, payout, flipTime, owner, nowSec }: {
  tokenId: string;
  tier: number;
  variant: number;
  signature: number;
  traits: number[];
  multiplierBp: number;
  payout: string;
  flipTime: bigint;
  owner: string;
  nowSec: number;
}) {
  const t = TIERS[tier];
  const v = VARIANTS[variant];
  const sig = SIGNATURES[signature] ?? "—";
  const traitNames = t ? (TRAITS[t.key] ?? []) : [];
  const card: CardData = {
    id: Number(tokenId),
    tier,
    variant,
    sig: signature,
    traits,
    swaps: 0,
    jackpots: 0,
  };
  const payoutCaste = Number(BigInt(payout) / ONE_E18);
  const multX = multiplierBp / 10000;

  return (
    <section style={{ padding: "14px 40px 28px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
      <div>
        <div style={{ position: "relative", padding: 30, border: "1px solid var(--gold-hi)", borderRadius: 8, background: "linear-gradient(135deg, oklch(0.20 0.08 82 / 0.25), var(--ink-200))", display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, var(--gold), var(--gold-hi), var(--gold))" }} />
          <CasteCard card={card} w={300} h={430} />

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
            <TierBadge tier={tier} variant={variant} size="md" />
            <span className="chip chip--gold">{multX.toFixed(2)}× MULTIPLIER</span>
          </div>

          <div style={{ width: "100%", padding: 14, background: "oklch(0 0 0 / 0.35)", border: "1px solid var(--gold-hi)", borderRadius: 4 }}>
            <div className="mono" style={{ fontSize: 9, color: "var(--gold-hi)", letterSpacing: "0.25em" }}>FLIP PAYOUT · ON-CHAIN</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 4 }}>
              <span className="led" style={{ fontSize: 42, color: "var(--gold-hi)", textShadow: "0 0 16px var(--gold)" }}>
                +{payoutCaste >= 1e6 ? `${(payoutCaste / 1e6).toFixed(2)}M` : `${(payoutCaste / 1e3).toFixed(0)}K`}
              </span>
              <span className="mono" style={{ fontSize: 11, color: "var(--bone-dim)" }}>$CASTE · from buffer</span>
            </div>
            <div className="mono" style={{ fontSize: 9, color: "var(--ink-700)", marginTop: 6, letterSpacing: "0.05em" }}>
              flipped {fmtAgo(flipTime, nowSec)} ago
            </div>
          </div>
        </div>
      </div>

      <div>
        <MetadataPanel
          rows={[
            ["TOKEN ID",     `#${tokenId}`,                                "var(--bone)"],
            ["FLIPPED",      "true",                                       "var(--jade)"],
            ["TIER",         t ? `Tier.${t.cn}` : `Tier.${tier}`,          "var(--gold-hi)"],
            ["VARIANT",      v ? `${v.cn} (×${v.mult})` : `${variant}`,    "var(--orchid)"],
            ["SIGNATURE",    `by ${sig}`,                                  "var(--bone)"],
            ["TRAITS",       `[${traits.map((i) => traitNames[i] ?? "?").join(", ")}]`, "var(--bone-dim)"],
            ["MULT BP",      `${multiplierBp.toLocaleString()} (${multX.toFixed(2)}×)`, "var(--gold-hi)"],
            ["FLIPPED AT",   fmtAgo(flipTime, nowSec) + " ago",            "var(--ink-700)"],
            ["FLIP PAYOUT",  `${payoutCaste.toLocaleString()} CASTE`,      "var(--gold-hi)"],
            ["OWNER",        shortAddr(owner),                             "var(--bone)"],
          ]}
        />
      </div>
    </section>
  );
}

function FlipActionBar({ tokenId }: { tokenId: string }) {
  const flip = useFlipCard();
  return (
    <section style={{ padding: "0 40px 28px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
        <button
          disabled={flip.isPending}
          onClick={() => flip.mutate({ tokenId })}
          style={{
            padding: "16px 40px",
            background: flip.isPending ? "var(--ink-300)" : "var(--blood-hi)",
            color: flip.isPending ? "var(--ink-600)" : "var(--ink-000)",
            fontFamily: "var(--f-display)",
            fontSize: 18,
            letterSpacing: "0.12em",
            border: "none",
            borderRadius: 4,
            boxShadow: flip.isPending ? "none" : "0 6px 0 var(--blood-lo), 0 14px 28px oklch(0.55 0.24 25 / 0.40)",
            cursor: flip.isPending ? "not-allowed" : "pointer",
          }}
        >
          {flip.isPending ? "FLIPPING…" : `▸ FLIP CARD #${tokenId}`}
        </button>
        {flip.isError && (
          <span className="mono" style={{ fontSize: 11, color: "var(--blood-hi)", letterSpacing: "0.05em" }}>
            ✗ {flip.error?.message ?? "tx failed"}
          </span>
        )}
        {flip.isSuccess && (
          <span className="mono" style={{ fontSize: 11, color: "var(--jade)", letterSpacing: "0.05em" }}>
            ✓ flipped @ block {flip.data.blockNumber.toString()}
          </span>
        )}
      </div>
    </section>
  );
}

function MetadataPanel({ rows }: { rows: Array<[string, string, string]> }) {
  return (
    <div style={{ padding: 20, border: "1px solid var(--ink-400)", borderRadius: 8, background: "var(--ink-200)" }}>
      <div className="mono" style={{ fontSize: 10, color: "var(--ink-600)", letterSpacing: "0.25em", marginBottom: 14 }}>
        ON-CHAIN STATE · CasteCard
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

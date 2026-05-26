"use client";

import { useAccount, useBlockNumber } from "wagmi";

import { Ticker, Footer } from "@/components/caste/caste-chrome";
import { SealedCard } from "@/components/caste/sealed-card";
import { CasteCard } from "@/components/caste/caste-card";
import { useStats, useUserCards } from "@/lib/caste/hooks";
import { useFlipBatch, useFlipCard } from "@/lib/caste/writes";
import type { CardData } from "@/lib/caste/types";
import type { CardRow } from "@/lib/caste/response-types";

const ONE_E18 = 10n ** 18n;
const FLIP_DELAY_BLOCKS = 2;
// Mirrors `Constants.MAX_FLIP_BATCH` in contracts — the hook rejects batches
// larger than this. Slicing at the UI layer keeps the revert path off the
// happy flow.
const MAX_FLIP_BATCH = 50;

function fmtCaste(n: number) {
  return n >= 1e6 ? `${(n / 1e6).toFixed(2)}M` : n >= 1e3 ? `${(n / 1e3).toFixed(0)}K` : Math.round(n).toLocaleString();
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

export default function MyCardsPage() {
  const { address } = useAccount();
  const { data: stats } = useStats();
  const { data: cards = [] } = useUserCards(address);
  const { data: currentBlock } = useBlockNumber({ watch: true });
  const flipMutation = useFlipCard();
  const flipBatchMutation = useFlipBatch();

  const sealed = cards.filter((c) => !c.flipped);
  const flipped = cards.filter((c) => c.flipped);
  const flippableCards = currentBlock
    ? sealed.filter((c) => currentBlock > BigInt(c.commitBlock) + BigInt(FLIP_DELAY_BLOCKS))
    : [];
  // Cap the batch at the contract-enforced max so we never submit a tx that
  // would revert on length check. If the user has more flippable cards than
  // this, the rest stay queued for the next click.
  const batchCards = flippableCards.slice(0, MAX_FLIP_BATCH);
  const flippable = flippableCards.length;
  const batchSize = batchCards.length;
  const batchTruncated = flippable > MAX_FLIP_BATCH;

  const handleBatchFlip = () => {
    if (batchCards.length === 0) return;
    flipBatchMutation.mutate({
      tokenIds: batchCards.map((c) => BigInt(c.tokenId)),
    });
  };
  const batchPending = flipBatchMutation.isPending;
  const nowSec = Math.floor(Date.now() / 1000);

  const bufferRemaining = stats ? Number(BigInt(stats.bufferRemaining) / ONE_E18) : 0;
  const bufferStart = stats ? Number(BigInt(stats.bufferStart) / ONE_E18) : 0;
  const estFlipsLeft = stats ? Number(BigInt(stats.bufferRemaining) / (13_900n * ONE_E18)) : 0;

  const tickerItems = [
    { tag: "▸ YOU",    text: address ? `${sealed.length} sealed · ${flipped.length} flipped · ${flippable} ready to flip` : "connect wallet", color: "var(--acid)" },
    { tag: "▸ BUFFER", text: `${(bufferRemaining / 1e9).toFixed(2)}B / ${(bufferStart / 1e9).toFixed(1)}B CASTE · ~${(estFlipsLeft / 1000).toFixed(0)}k flips left`, color: "var(--gold-hi)" },
    { tag: "▸ FLIP",   text: "Flip is instant, gas ~120k · payout transfers same tx", color: "var(--bone-dim)" },
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
              / {sealed.length} UNREVEALED
            </span>
          </h1>
          <p style={{ fontSize: 14, color: "var(--ink-700)", maxWidth: 720, marginTop: 12, lineHeight: 1.65 }}>
            Every buy mints sealed cards — face-down lottery tickets with no attributes until you flip them.
            <span style={{ color: "var(--bone-dim)" }}> Flip individually for the cinema moment, or batch.</span>
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
          <div className="mono" style={{ fontSize: 10, color: "var(--ink-600)", letterSpacing: "0.2em" }}>BATCH ACTION</div>
          <button
            disabled={!address || batchSize === 0 || batchPending}
            onClick={handleBatchFlip}
            title={batchTruncated ? `Capped at ${MAX_FLIP_BATCH}/batch — click again to flip the rest` : undefined}
            style={{
              padding: "18px 28px",
              background: batchSize > 0 && !batchPending ? "var(--acid)" : "var(--ink-300)",
              color: batchSize > 0 && !batchPending ? "var(--ink-000)" : "var(--ink-600)",
              fontFamily: "var(--f-display)",
              fontSize: 16,
              letterSpacing: "0.18em",
              border: "none",
              borderRadius: 4,
              boxShadow:
                batchSize > 0 && !batchPending
                  ? "0 6px 0 var(--acid-lo), 0 16px 32px oklch(0.90 0.20 115 / 0.35)"
                  : "none",
              display: "flex",
              alignItems: "center",
              gap: 10,
              cursor: batchSize > 0 && !batchPending ? "pointer" : "not-allowed",
            }}
          >
            {batchPending ? "FLIPPING…" : `▸ FLIP ${batchSize} CARDS`}
          </button>
          <span className="mono" style={{ fontSize: 9, color: "var(--ink-700)", letterSpacing: "0.15em" }}>
            {batchSize > 0
              ? batchTruncated
                ? `est. gas ~${batchSize * 120}k · ${flippable - batchSize} more after this`
                : `est. gas ~${batchSize * 120}k · single tx`
              : "no flippable cards yet"}
          </span>
        </div>
      </section>

      <section style={{ padding: "28px 60px 36px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 18 }}>
          <span className="display" style={{ fontSize: 22, color: "var(--blood-hi)", letterSpacing: "0.05em" }}>
            Awaiting flip
          </span>
          <span className="mono" style={{ fontSize: 10, color: "var(--ink-700)", letterSpacing: "0.15em" }}>
            · FACE-DOWN · 2 BLOCK COMMIT-REVEAL LOCK
          </span>
          <div style={{ flex: 1, height: 1, background: "var(--ink-400)" }} />
          <span className="mono" style={{ fontSize: 10, color: "var(--ink-700)", letterSpacing: "0.15em" }}>
            {sealed.length} sealed · {flippable} can flip now
          </span>
        </div>

        {!address && <EmptyState text="CONNECT WALLET TO VIEW YOUR CARDS" />}
        {address && sealed.length === 0 && <EmptyState text="NO SEALED CARDS — BUY ON SWAP TO MINT" />}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 28, justifyItems: "stretch" }}>
          {sealed.map((c) => {
            const buyAgo = fmtAgo(nowSec - Number(c.mintTime));
            const blocksLeft = currentBlock
              ? Math.max(0, Number(BigInt(c.commitBlock) + BigInt(FLIP_DELAY_BLOCKS) - currentBlock))
              : 0;
            const canFlip = blocksLeft === 0;
            return (
              <SealedCard
                key={c.tokenId}
                tokenId={Number(c.tokenId)}
                commitBlock={Number(c.commitBlock)}
                buyUnits={1}
                bought={`${buyAgo} ago`}
                canFlip={canFlip && !flipMutation.isPending}
                onFlip={() => flipMutation.mutate({ tokenId: BigInt(c.tokenId) })}
                w={280}
                h={400}
              />
            );
          })}
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
            {flipped.length} cards
          </span>
        </div>

        {address && flipped.length === 0 && <EmptyState text="NO FLIPPED CARDS YET" />}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 28, justifyItems: "center" }}>
          {flipped.map((c) => {
            const card = cardRowToCard(c);
            const payoutCaste = c.payout ? Number(BigInt(c.payout) / ONE_E18) : 0;
            const multX = (c.multiplierBp ?? 10000) / 10000;
            const ago = c.flipTime ? fmtAgo(nowSec - Number(c.flipTime)) : "—";
            return (
              <div key={c.tokenId} style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
                <CasteCard card={card} w={280} h={400} />
                <div className="mono" style={{ fontSize: 9, color: "var(--gold-hi)", letterSpacing: "0.15em" }}>
                  FLIP PAYOUT · +{fmtCaste(payoutCaste)} CASTE
                </div>
                <div className="mono" style={{ fontSize: 8, color: "var(--ink-700)", letterSpacing: "0.1em" }}>
                  flipped {ago} ago · mult {multX.toFixed(1)}×
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

function EmptyState({ text }: { text: string }) {
  return (
    <div style={{ padding: 24, textAlign: "center", color: "var(--ink-600)", fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: "0.15em", border: "1px dashed var(--ink-400)", borderRadius: 6, marginBottom: 18 }}>
      {text}
    </div>
  );
}

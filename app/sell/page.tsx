"use client";

import { Fragment, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAccount, useReadContract } from "wagmi";
import { formatUnits, parseUnits } from "viem";

import { Ticker, Footer } from "@/components/caste/caste-chrome";
import { useStats, useSellTaxEvents, castePriceUsdc } from "@/lib/caste/hooks";
import { useSellCaste } from "@/lib/caste/writes";
import { erc20Abi } from "@/lib/caste/abis";
import { addresses } from "@/lib/caste/contracts";
import { useIsMounted } from "@/lib/use-is-mounted";

function useCasteBalance() {
  const { address } = useAccount();
  return useReadContract({
    address: addresses.token,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address, refetchInterval: 10_000 },
  });
}

const fmt = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 2 });
const fmtNum = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 0 });

// Convert a fractional CASTE balance to a display-safe Number.
// Bigint → Number conversion loses precision above 2^53; for sub-21B supply
// we're comfortably below that, but we still do the cast via formatUnits so
// the fractional part survives instead of getting integer-divided away.
function weiToNumber(wei: bigint): number {
  return Number(formatUnits(wei, 18));
}

export default function SellV1Page() {
  const mounted = useIsMounted();
  const { data: stats } = useStats();
  const { address: rawAddress } = useAccount();
  // Gate wallet state behind mount — SSR has no wallet; first client paint
  // must match before useEffect runs.
  const address = mounted ? rawAddress : undefined;
  const { data: casteBalWei } = useCasteBalance();
  const casteBalWeiVal: bigint = casteBalWei ?? 0n;
  const casteBalance = weiToNumber(casteBalWeiVal);
  const hasBalance = casteBalWeiVal > 0n;

  // Price = USDC per CASTE, derived from last observed sqrtPriceX96 on the pool.
  // Falls back to 0 while loading / before the first swap is indexed — display
  // code suppresses dollar amounts when PRICE_CASTE === 0.
  // NB: cast through `unknown` because response-types.ts (owned by another
  // agent) may not yet declare `sqrtPriceX96Last` on StatsResponse.
  const sqrtRaw = (stats as unknown as { sqrtPriceX96Last?: string | null } | undefined)
    ?.sqrtPriceX96Last;
  const PRICE_CASTE = sqrtRaw ? castePriceUsdc(BigInt(sqrtRaw)) : 0;
  const priceKnown = PRICE_CASTE > 0;

  // Track user-chosen sell amount as BOTH a display number (UI math, slider,
  // input) and the exact wei bigint (what we submit to the contract). On user
  // input the wei is recomputed via parseUnits; on a MAX click we copy the
  // raw balance wei directly so no fractional CASTE is lost in the roundtrip.
  const [sellAmount, setSellAmount] = useState<number>(0);
  const [sellAmountWei, setSellAmountWei] = useState<bigint>(0n);
  useEffect(() => {
    // Default to full balance on mount/balance change.
    setSellAmount(Math.floor(casteBalance));
    setSellAmountWei(casteBalWeiVal);
  }, [casteBalWeiVal, casteBalance]);

  // Setter used by SellComposer presets — for MAX we want the exact wei,
  // for other presets we recompute wei from the integer target.
  const setAmount = useCallback(
    (target: number, exactWei?: bigint) => {
      setSellAmount(target);
      if (exactWei !== undefined) {
        setSellAmountWei(exactWei);
      } else {
        // parseUnits rejects negatives / NaN; clamp first.
        const safe = Number.isFinite(target) && target >= 0 ? target : 0;
        setSellAmountWei(parseUnits(safe.toString(), 18));
      }
    },
    [],
  );

  const cardsMinted = stats?.cardsMinted ?? 0;
  const fomoLeft = stats?.fomoSecondsLeft ?? 0;
  const fomoHh = Math.floor(fomoLeft / 3600).toString().padStart(2, "0");
  const fomoMm = Math.floor((fomoLeft % 3600) / 60).toString().padStart(2, "0");
  const fomoSs = (fomoLeft % 60).toString().padStart(2, "0");
  const phaseA = cardsMinted < 10_000;

  const tickerItems = [
    { tag: "▸ PHASE A", text: `${cardsMinted.toLocaleString()}/10,000 minted · sell tax ${phaseA ? "25%" : "1.5%"} · ${phaseA ? "drops to 1.5% at 10,000" : "Phase B unlocked"}`, color: "var(--blood-hi)" },
    { tag: "▸ TAX",     text: "16.67% → hourly · 8.33% → mega · both pots settle to lastBuyer", color: "var(--bone-dim)" },
    { tag: "▸ MEGA",    text: `FOMO ${fomoHh}:${fomoMm}:${fomoSs} → last buyer wins`, color: "var(--gold-hi)" },
  ];

  return (
    <div>
      <Ticker items={tickerItems} />

      <section style={{ padding: "28px 40px 12px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 40, flexWrap: "wrap" }}>
        <div>
          <div className="mono" style={{ fontSize: 11, letterSpacing: "0.3em", color: "var(--ink-600)", marginBottom: 8 }}>
            /CASTE/SELL · PHASE A · MINT-WINDOW TAX
          </div>
          <h1 style={{ margin: 0, display: "flex", alignItems: "baseline", gap: 16, flexWrap: "wrap" }}>
            <span className="display" style={{ fontSize: 56, color: "var(--bone)", lineHeight: 1 }}>Cash Out.</span>
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
          <div className="led" style={{ fontSize: 26, color: "var(--bone)" }}>{fmtNum(casteBalance)}</div>
          <div className="mono" style={{ fontSize: 10, color: "var(--ink-700)", marginTop: 4 }}>
            {priceKnown
              ? `≈ $${fmt(casteBalance * PRICE_CASTE)} · @ $${PRICE_CASTE.toFixed(7)}`
              : "≈ — · price loading"}
          </div>
        </div>
      </section>

      {!address ? (
        <EmptyState
          headline="Connect wallet to view your $CASTE position"
          hint="Sell mechanics depend on your on-chain balance."
        />
      ) : !hasBalance ? (
        <EmptyState
          headline="You have no $CASTE to sell yet"
          hint="Buy at least 1 unit first — every $6.66666 unit also mints a sealed card."
          ctaHref="/swap"
          ctaLabel="→ BUY $CASTE"
        />
      ) : (
        <section style={{ padding: "14px 40px 18px", display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 28, alignItems: "flex-start" }}>
          <SellComposer
            amount={sellAmount}
            amountWei={sellAmountWei}
            onAmountChange={setAmount}
            casteBalWei={casteBalWeiVal}
            phase="A"
            cardsMinted={cardsMinted}
            casteBalance={casteBalance}
            priceCaste={PRICE_CASTE}
            priceKnown={priceKnown}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <FeeFlow amount={sellAmount} phase="A" priceCaste={PRICE_CASTE} priceKnown={priceKnown} />
            <PhaseCompare />
            <RecentSells phase="A" />
          </div>
        </section>
      )}

      {hasBalance && (
        <section style={{ padding: "22px 40px 40px" }}>
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
            <SellComposer
              amount={sellAmount}
              amountWei={sellAmountWei}
              onAmountChange={setAmount}
              casteBalWei={casteBalWeiVal}
              phase="B"
              cardsMinted={cardsMinted}
              casteBalance={casteBalance}
              priceCaste={PRICE_CASTE}
              priceKnown={priceKnown}
              readOnly
            />
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ position: "relative", padding: 22, border: "1px solid var(--jade)", borderRadius: 6, background: "linear-gradient(135deg, oklch(0.20 0.10 155 / 0.3), var(--ink-200))", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, var(--jade), oklch(0.65 0.12 145), var(--jade))" }} />
                <div className="mono" style={{ fontSize: 10, color: "var(--jade)", letterSpacing: "0.25em", marginBottom: 10 }}>
                  ★ PHASE B UNLOCK · ANIMATED CONFETTI MOMENT
                </div>
                <div className="display" style={{ fontSize: 28, color: "var(--bone)", lineHeight: 1.05 }}>Free Trading Mode</div>
                <div className="mono" style={{ fontSize: 11, color: "var(--bone-dim)", marginTop: 10, lineHeight: 1.7 }}>
                  When the 10,000th card is minted in some random user&apos;s buy, the contract flips. Their tx becomes a community milestone — UI plays a global celebration, banner turns green, FOMO countdown resets to a fresh 24h.
                </div>
              </div>

              <FeeFlow amount={sellAmount} phase="B" priceCaste={PRICE_CASTE} priceKnown={priceKnown} />
              <RecentSells phase="B" />
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}

type Phase = "A" | "B";

function EmptyState({ headline, hint, ctaHref, ctaLabel }: { headline: string; hint: string; ctaHref?: string; ctaLabel?: string }) {
  return (
    <section style={{ padding: "40px 40px 28px" }}>
      <div style={{ padding: 24, border: "1px dashed var(--ink-400)", borderRadius: 8, background: "var(--ink-200)", textAlign: "center" }}>
        <div className="display" style={{ fontSize: 28, color: "var(--bone)", marginBottom: 8 }}>{headline}</div>
        <div className="mono" style={{ fontSize: 12, color: "var(--ink-700)", letterSpacing: "0.05em", marginBottom: ctaHref ? 22 : 0 }}>{hint}</div>
        {ctaHref && ctaLabel && (
          <Link
            href={ctaHref}
            style={{
              display: "inline-block",
              padding: "14px 28px",
              background: "var(--acid)",
              color: "var(--ink-000)",
              fontFamily: "var(--f-display)",
              fontSize: 15,
              letterSpacing: "0.12em",
              textDecoration: "none",
              borderRadius: 4,
              boxShadow: "0 5px 0 var(--acid-lo)",
            }}
          >
            {ctaLabel}
          </Link>
        )}
      </div>
    </section>
  );
}

function SellComposer({
  amount,
  amountWei,
  onAmountChange,
  casteBalWei,
  phase,
  cardsMinted,
  casteBalance,
  priceCaste,
  priceKnown,
  readOnly = false,
}: {
  amount: number;
  amountWei: bigint;
  onAmountChange: (n: number, exactWei?: bigint) => void;
  casteBalWei: bigint;
  phase: Phase;
  cardsMinted: number;
  casteBalance: number;
  priceCaste: number;
  priceKnown: boolean;
  readOnly?: boolean;
}) {
  const { address } = useAccount();
  const usdcGross = amount * priceCaste;
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
            <div className="led" style={{ fontSize: 64, color: accent, lineHeight: 0.9, textShadow: `0 0 24px ${accent}, 0 0 6px ${accent}` }}>
              {taxPct}%
            </div>
          </div>
          <div>
            <div className="mono" style={{ fontSize: 11, color: "var(--bone)", letterSpacing: "0.1em", lineHeight: 1.7 }}>
              {phase === "A" ? (
                <>
                  ▸ While cards are still minting (currently <strong style={{ color: accent }}>{cardsMinted.toLocaleString()} / 10,000</strong>), every sell pays{" "}
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
        <span className="chip">CASTE PRICE · {priceKnown ? `$${priceCaste.toFixed(7)}` : "—"}</span>
      </div>

      <div style={{ border: "1px solid var(--ink-400)", borderRadius: 6, padding: "16px 18px", background: "var(--ink-100)" }}>
        <div className="mono" style={{ fontSize: 10, letterSpacing: "0.2em", color: "var(--ink-600)" }}>YOU SELL · $CASTE</div>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginTop: 6 }}>
          <div className="led" style={{ fontSize: 40, color: "var(--bone)" }}>{fmtNum(amount)}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 10px", border: "1px solid var(--acid-lo)", borderRadius: 999 }}>
            <div style={{ width: 18, height: 18, borderRadius: 4, background: "var(--acid)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ink-000)", fontSize: 10, fontWeight: 900 }}>
              ◇
            </div>
            <span className="mono" style={{ fontSize: 12, color: "var(--bone)" }}>$CASTE</span>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
          <span className="mono" style={{ fontSize: 11, color: "var(--ink-600)" }}>{priceKnown ? `≈ $${fmt(usdcGross)} gross` : "≈ — gross"}</span>
          <span className="mono" style={{ fontSize: 11, color: "var(--ink-600)" }}>balance {fmtNum(casteBalance)}</span>
        </div>
        <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
          {[
            { label: "25%", pct: 25 },
            { label: "50%", pct: 50 },
            { label: "75%", pct: 75 },
            { label: "MAX", pct: 100 },
          ].map((p) => {
            // For MAX, copy the exact wei balance so no fractional CASTE is
            // lost in the number roundtrip. Other presets compute as integer
            // CASTE since the slider lives in number-space.
            const isMax = p.pct === 100;
            const targetWei = isMax
              ? casteBalWei
              : (casteBalWei * BigInt(p.pct)) / 100n;
            const target = isMax
              ? Math.floor(casteBalance)
              : Math.floor((casteBalance * p.pct) / 100);
            const active = amount === target && target > 0;
            return (
              <button type="button"
                key={p.label}
                onClick={() => onAmountChange(target, targetWei)}
                disabled={casteBalWei === 0n}
                style={{
                  flex: 1,
                  padding: "8px 0",
                  background: active ? "var(--ink-100)" : "var(--ink-300)",
                  color: active ? accent : "var(--ink-700)",
                  border: `1px solid ${active ? accent : "var(--ink-400)"}`,
                  fontFamily: "var(--f-mono)",
                  fontSize: 11,
                  letterSpacing: "0.1em",
                  borderRadius: 3,
                  cursor: casteBalWei === 0n ? "not-allowed" : "pointer",
                  opacity: casteBalWei === 0n ? 0.4 : 1,
                }}
              >
                {p.label}
              </button>
            );
          })}
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
          <div className="led" style={{ fontSize: 36, color: accent }}>{priceKnown ? `$${fmt(usdcNet)}` : "—"}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 10px", border: "1px solid var(--ink-400)", borderRadius: 999 }}>
            <div style={{ width: 18, height: 18, borderRadius: "50%", background: "var(--cobalt)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--bone)", fontSize: 10, fontWeight: 700 }}>$</div>
            <span className="mono" style={{ fontSize: 12, color: "var(--bone)" }}>USDC</span>
          </div>
        </div>
        <div style={{ marginTop: 12, padding: "10px 0", borderTop: "1px dotted var(--ink-400)", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 4 }}>
          <div>
            <div className="mono" style={{ fontSize: 9, color: "var(--ink-600)", letterSpacing: "0.15em" }}>GROSS</div>
            <div className="mono" style={{ fontSize: 12, color: "var(--bone-dim)" }}>{priceKnown ? `$${fmt(usdcGross)}` : "—"}</div>
          </div>
          <div>
            <div className="mono" style={{ fontSize: 9, color: "var(--jade)", letterSpacing: "0.15em" }}>−{hourlyPct}% HOURLY</div>
            <div className="mono" style={{ fontSize: 12, color: "var(--jade)" }}>{priceKnown ? `−$${fmt(toHourly)}` : "—"}</div>
          </div>
          <div>
            <div className="mono" style={{ fontSize: 9, color: "var(--gold-hi)", letterSpacing: "0.15em" }}>−{megaPct}% MEGA</div>
            <div className="mono" style={{ fontSize: 12, color: "var(--gold-hi)" }}>{priceKnown ? `−$${fmt(toMega)}` : "—"}</div>
          </div>
        </div>
      </div>

      {phase === "A" && (
        <div style={{ padding: "12px 14px", background: "oklch(0.18 0.10 60 / 0.35)", border: "1px dashed var(--gold-hi)", borderRadius: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span className="display" style={{ fontSize: 13, color: "var(--gold-hi)", letterSpacing: "0.18em" }}>▸ WAIT FOR PHASE B?</span>
            <span className="mono" style={{ fontSize: 10, color: "var(--bone)" }}>
              You&apos;d save <span className="led" style={{ color: "var(--gold-hi)" }}>{priceKnown ? `$${fmt(usdcGross * 0.235)}` : "—"}</span> ({(taxPct - 1.5).toFixed(1)}pp) on this sell when all 10k mint.
            </span>
          </div>
          <div className="mono" style={{ fontSize: 9, color: "var(--ink-700)", marginTop: 6, letterSpacing: "0.05em" }}>
            ▸ At current mint pace (~410 cards/day), Phase B unlocks in <strong style={{ color: "var(--gold-hi)" }}>~14.6 days</strong>.
          </div>
        </div>
      )}

      {readOnly ? (
        <button type="button"
          disabled
          title="Phase B unlocks after 10,000 cards minted"
          style={{
            padding: "20px 0",
            background: "var(--ink-300)",
            color: "var(--ink-600)",
            fontFamily: "var(--f-display)",
            fontSize: 18,
            letterSpacing: "0.12em",
            border: "none",
            borderRadius: 4,
            cursor: "not-allowed",
          }}
        >
          PHASE B PREVIEW · UNLOCKS AT 10,000 CARDS
        </button>
      ) : (
        <SellCtaButton
          address={address}
          amount={amount}
          amountWei={amountWei}
          casteBalWei={casteBalWei}
          casteBalance={casteBalance}
          phase={phase}
          taxPct={taxPct}
          usdcNet={usdcNet}
          accent={accent}
          priceKnown={priceKnown}
        />
      )}
      <div className="mono" style={{ fontSize: 10, color: "var(--ink-600)", letterSpacing: "0.15em", textAlign: "center" }}>
        ▸ Phase {phase} · tax is locked by protocol · trigger is <code>card.totalSupply() == 10000</code>
      </div>
    </div>
  );
}

function SellCtaButton({
  address,
  amount,
  amountWei,
  casteBalWei,
  casteBalance,
  phase,
  taxPct,
  usdcNet,
  accent,
  priceKnown,
}: {
  address: `0x${string}` | undefined;
  amount: number;
  amountWei: bigint;
  casteBalWei: bigint;
  casteBalance: number;
  phase: Phase;
  taxPct: number;
  usdcNet: number;
  accent: string;
  priceKnown: boolean;
}) {
  const sell = useSellCaste();
  // Disable on wei comparison — that's the source of truth. The number side
  // is for display only and can lag/round.
  const disabled = !address || sell.isPending || amountWei <= 0n || amountWei > casteBalWei;
  return (
    <>
      <button type="button"
        disabled={disabled}
        onClick={() => sell.mutate({ amount: amountWei })}
        style={{
          padding: "20px 0",
          background: disabled ? "var(--ink-300)" : accent,
          color: disabled ? "var(--ink-600)" : "var(--bone)",
          fontFamily: "var(--f-display)",
          fontSize: 18,
          letterSpacing: "0.12em",
          border: "none",
          borderRadius: 4,
          boxShadow: disabled
            ? "none"
            : `0 6px 0 ${phase === "A" ? "var(--blood-lo)" : "oklch(0.45 0.10 155)"}, 0 16px 32px oklch(0.62 0.24 25 / 0.4)`,
          cursor: disabled ? "not-allowed" : "pointer",
        }}
      >
        {!address
          ? "CONNECT WALLET TO SELL"
          : sell.isPending
          ? "SELLING…"
          : amountWei <= 0n
          ? "ENTER AN AMOUNT"
          : amountWei > casteBalWei
          ? `INSUFFICIENT BALANCE · YOU HAVE ${fmtNum(casteBalance)}`
          : phase === "A"
          ? `SELL ${fmtNum(amount)} · PAY ${taxPct}% TAX · ${priceKnown ? `GET $${fmt(usdcNet)}` : "GET — USDC"}`
          : `SELL ${fmtNum(amount)} · ${priceKnown ? `GET $${fmt(usdcNet)}` : "GET — USDC"}`}
      </button>
      {sell.isError && (
        <div className="mono" style={{ fontSize: 11, color: "var(--blood-hi)", letterSpacing: "0.05em", textAlign: "center", padding: 8, border: "1px dashed var(--blood-lo)", borderRadius: 4 }}>
          ✗ {sell.error?.message ?? "tx failed"}
        </div>
      )}
      {sell.isSuccess && (
        <div className="mono" style={{ fontSize: 11, color: "var(--jade)", letterSpacing: "0.05em", textAlign: "center", padding: 8, border: "1px dashed var(--jade)", borderRadius: 4 }}>
          ✓ sold @ block {sell.data.blockNumber.toString()}
        </div>
      )}
    </>
  );
}

function FeeFlow({
  amount,
  phase,
  priceCaste,
  priceKnown,
}: {
  amount: number;
  phase: Phase;
  priceCaste: number;
  priceKnown: boolean;
}) {
  const usdcGross = amount * priceCaste;
  const taxPct = phase === "A" ? 25 : 1.5;
  const hourlyPct = phase === "A" ? 16.67 : 1.0;
  const megaPct = phase === "A" ? 8.33 : 0.5;
  const fee = usdcGross * (taxPct / 100);
  const toHourly = usdcGross * (hourlyPct / 100);
  const toMega = usdcGross * (megaPct / 100);
  const accent = phase === "A" ? "var(--blood-hi)" : "var(--jade)";
  const fmtDollar = (n: number) => (priceKnown ? `$${fmt(n)}` : "—");

  return (
    <div style={{ border: "1px solid var(--ink-400)", borderRadius: 6, background: "var(--ink-200)", padding: 18 }}>
      <div className="mono" style={{ fontSize: 10, letterSpacing: "0.25em", color: "var(--ink-600)", marginBottom: 12 }}>
        WHERE THE TAX GOES · BOTH POOLS → LASTBUYER
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <span className="display" style={{ fontSize: 26, color: accent, letterSpacing: "0.04em" }}>{taxPct}%</span>
        <span className="mono" style={{ fontSize: 10, color: "var(--ink-700)" }}>total tax · {fmtDollar(fee)}</span>
        <div style={{ flex: 1, height: 10, display: "flex", border: "1px solid var(--ink-400)", borderRadius: 2, overflow: "hidden" }}>
          <div style={{ flex: hourlyPct, background: "var(--jade)" }} />
          <div style={{ flex: megaPct, background: "var(--gold-hi)" }} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ borderLeft: "2px solid var(--jade)", paddingLeft: 10 }}>
          <div className="mono" style={{ fontSize: 9, color: "var(--ink-600)", letterSpacing: "0.15em" }}>{hourlyPct}% → HOURLY POOL</div>
          <div className="led" style={{ fontSize: 18, color: "var(--jade)" }}>+{fmtDollar(toHourly)}</div>
          <div className="mono" style={{ fontSize: 9, color: "var(--ink-700)", marginTop: 2 }}>winner = epoch lastBuyer</div>
        </div>
        <div style={{ borderLeft: "2px solid var(--gold-hi)", paddingLeft: 10 }}>
          <div className="mono" style={{ fontSize: 9, color: "var(--ink-600)", letterSpacing: "0.15em" }}>{megaPct}% → MEGA POOL</div>
          <div className="led" style={{ fontSize: 18, color: "var(--gold-hi)" }}>+{fmtDollar(toMega)}</div>
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
          <Fragment key={k}>
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
  const { data: events = [] } = useSellTaxEvents(20);
  // Phase A events have phaseA=true; filter to the requested phase.
  const filtered = events
    .filter((e) => (phase === "A" ? e.phaseA : !e.phaseA))
    .slice(0, 5);
  const nowSec = Math.floor(Date.now() / 1000);
  // USDC has 6 decimals — gross is the raw amount before tax.
  const fromUsdc6 = (v: string | number | bigint) => Number(BigInt(v)) / 1e6;
  const shortAddr = (a?: string | null) => (a && a.length >= 12 ? `${a.slice(0, 6)}…${a.slice(-4)}` : (a ?? "—"));
  const fmtAgo = (ts: number) => {
    const d = nowSec - ts;
    if (d < 60) return `${Math.max(d, 0)}s`;
    if (d < 3600) return `${Math.floor(d / 60)}m`;
    return `${Math.floor(d / 3600)}h`;
  };

  return (
    <div style={{ border: "1px solid var(--ink-400)", borderRadius: 6, background: "var(--ink-200)", padding: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
        <span className="mono" style={{ fontSize: 10, letterSpacing: "0.25em", color: "var(--ink-600)" }}>RECENT SELLS · PHASE {phase}</span>
        <span className="mono" style={{ fontSize: 9, color: "var(--ink-600)" }}>SellTaxCollected events · last 5</span>
      </div>
      {filtered.length === 0 && (
        <div className="mono" style={{ fontSize: 11, color: "var(--ink-700)", padding: "12px 0", textAlign: "center" }}>
          — no Phase {phase} sells yet —
        </div>
      )}
      {filtered.map((r, i) => {
        const gross = fromUsdc6(r.grossUsdcOut);
        const tax = fromUsdc6(r.fee);
        const net = gross - tax;
        const ts = Number(r.blockTime ?? 0);
        return (
          <div key={`${r.txHash}-${i}`} style={{ display: "grid", gridTemplateColumns: "60px 1fr auto auto", gap: 10, alignItems: "center", padding: "8px 0", borderBottom: i < filtered.length - 1 ? "1px dashed var(--ink-400)" : "none" }}>
            <span className="mono" style={{ fontSize: 10, color: "var(--ink-700)" }}>−{fmtAgo(ts)}</span>
            <span className="mono" style={{ fontSize: 11, color: "var(--bone-dim)" }}>{shortAddr(r.seller)}</span>
            <span className="mono" style={{ fontSize: 11, color: phase === "A" ? "var(--blood-hi)" : "var(--ink-700)" }}>−${fmt(tax)} tax</span>
            <span className="led" style={{ fontSize: 14, color: phase === "A" ? "var(--blood-hi)" : "var(--jade)" }}>${fmt(net)}</span>
          </div>
        );
      })}
    </div>
  );
}

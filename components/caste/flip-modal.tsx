"use client";

import { TIERS, VARIANTS, SIGNATURES, TRAITS, FLIP_DEMO } from "@/lib/caste/mock";
import { TierBadge } from "./tier-badge";
import { SealedCard } from "./sealed-card";
import { CasteCard } from "./caste-card";

export type FlipStage = "confirm" | "signing" | "flipping" | "revealed";
type FlipDemo = typeof FLIP_DEMO;

export function FlipModal({
  stage = "revealed",
  demo = FLIP_DEMO,
  w = 1100,
  h = 720,
  onClose,
}: {
  stage?: FlipStage;
  demo?: FlipDemo;
  w?: number | string;
  h?: number | string;
  onClose?: () => void;
}) {
  return (
    <div
      style={{
        width: w,
        height: h,
        position: "relative",
        overflow: "hidden",
        background: "oklch(0.06 0.005 60 / 0.95)",
        backdropFilter: "blur(6px)",
      }}
    >
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 40%, oklch(0.20 0.06 115 / 0.25), transparent 60%)" }} />
      <div className="gridbg" style={{ position: "absolute", inset: 0, opacity: 0.2 }} />

      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: 22,
          right: 22,
          width: 36,
          height: 36,
          borderRadius: 4,
          background: "transparent",
          border: "1px solid var(--ink-400)",
          color: "var(--bone-dim)",
          fontSize: 18,
          cursor: "pointer",
          zIndex: 10,
        }}
        aria-label="Close"
      >
        ×
      </button>

      <div style={{ position: "absolute", top: 22, left: 28, display: "flex", alignItems: "center", gap: 14, zIndex: 10 }}>
        <span
          className={stage === "flipping" ? "breathe" : ""}
          style={{
            width: 8,
            height: 8,
            background: stage === "revealed" ? "var(--gold-hi)" : "var(--acid)",
            borderRadius: "50%",
            boxShadow: `0 0 10px ${stage === "revealed" ? "var(--gold-hi)" : "var(--acid)"}`,
          }}
        />
        <span
          className="display"
          style={{
            fontSize: 13,
            color: stage === "revealed" ? "var(--gold-hi)" : "var(--acid)",
            letterSpacing: "0.2em",
          }}
        >
          {stage === "confirm" && "FLIP · CONFIRM"}
          {stage === "signing" && "FLIP · AWAITING SIGNATURE"}
          {stage === "flipping" && "FLIP · ROLLING ATTRIBUTES"}
          {stage === "revealed" && "★ FLIPPED · REVEALED"}
        </span>
        <span className="mono" style={{ fontSize: 10, color: "var(--ink-700)", letterSpacing: "0.15em" }}>
          · token #{demo.sealed.tokenId}
        </span>
      </div>

      {stage === "confirm" && <ConfirmStage demo={demo} />}
      {stage === "signing" && <SigningStage demo={demo} />}
      {stage === "flipping" && <FlippingStage />}
      {stage === "revealed" && <RevealedStage demo={demo} />}
    </div>
  );
}

function Hint({ label, value, sub, tone = "neutral" }: { label: string; value: string; sub?: string; tone?: "neutral" | "jade" | "acid" }) {
  const colors = { neutral: "var(--bone)", jade: "var(--jade)", acid: "var(--acid)" } as const;
  return (
    <div style={{ padding: "10px 14px", border: "1px dashed var(--ink-500)", borderRadius: 4 }}>
      <div className="mono" style={{ fontSize: 9, letterSpacing: "0.2em", color: "var(--ink-600)" }}>
        {label}
      </div>
      <div className="led" style={{ fontSize: 20, color: colors[tone] }}>
        {value}
      </div>
      {sub && (
        <div className="mono" style={{ fontSize: 9, color: "var(--ink-700)", marginTop: 2 }}>
          {sub}
        </div>
      )}
    </div>
  );
}

function ConfirmStage({ demo }: { demo: FlipDemo }) {
  return (
    <div
      style={{
        position: "relative",
        display: "grid",
        gridTemplateColumns: "auto 1fr",
        gap: 56,
        padding: "92px 64px 64px",
        height: "100%",
        alignItems: "center",
      }}
    >
      <SealedCard
        tokenId={demo.sealed.tokenId}
        commitBlock={demo.sealed.commitBlock}
        buyUnits={demo.sealed.buyUnits}
        bought={demo.sealed.bought}
        w={300}
        h={430}
        showFlipBtn={false}
        compact
      />
      <div>
        <div className="mono" style={{ fontSize: 11, letterSpacing: "0.3em", color: "var(--ink-600)", marginBottom: 8 }}>
          FLIPPING REVEALS
        </div>
        <h2 style={{ margin: 0, fontFamily: "var(--f-display)", fontSize: 42, color: "var(--bone)", lineHeight: 1.05, letterSpacing: "-0.02em" }}>
          Tier. Variant. Traits.<br />
          Multiplier. <span style={{ color: "var(--gold-hi)" }}>Payout.</span>
        </h2>
        <p style={{ fontSize: 14, color: "var(--ink-700)", maxWidth: 480, marginTop: 16, lineHeight: 1.7 }}>
          Once flipped, the bonus <strong style={{ color: "var(--bone)" }}>CASTE</strong> payout is drawn from the protocol reserve buffer and sent to your wallet. <strong style={{ color: "var(--blood-hi)" }}>No more secrets</strong> — anyone reading <code>tokenURI</code> sees the full attributes.
        </p>

        <div style={{ marginTop: 28, display: "grid", gridTemplateColumns: "repeat(3, auto)", gap: 18, alignItems: "center" }}>
          <Hint label="GAS" value="~120k" />
          <Hint label="DELAY" value="2 blk lock" sub="cleared" tone="jade" />
          <Hint label="BUFFER" value="3.89B left" tone="acid" />
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
          <button
            style={{
              padding: "16px 28px",
              background: "var(--acid)",
              color: "var(--ink-000)",
              fontFamily: "var(--f-display)",
              fontSize: 15,
              letterSpacing: "0.18em",
              border: "none",
              borderRadius: 4,
              boxShadow: "0 6px 0 var(--acid-lo), 0 16px 32px oklch(0.90 0.20 115 / 0.4)",
              cursor: "pointer",
            }}
          >
            ▸ FLIP IT
          </button>
          <button
            style={{
              padding: "16px 28px",
              background: "transparent",
              color: "var(--ink-700)",
              fontFamily: "var(--f-mono)",
              fontSize: 12,
              letterSpacing: "0.2em",
              border: "1px solid var(--ink-500)",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            CANCEL
          </button>
        </div>

        <div className="mono" style={{ fontSize: 9, color: "var(--ink-600)", letterSpacing: "0.15em", marginTop: 22, maxWidth: 480, lineHeight: 1.7 }}>
          ▸ RNG uses <code>keccak256(blockhash(commitBlock+2), block.prevrandao, gasleft(), tokenId, you)</code> — execution-time entropy. No simulator can predict the outcome.<br />
          ▸ You can also use <strong style={{ color: "var(--bone)" }}>Flip All</strong> from /mycards to batch the gas.
        </div>
      </div>
    </div>
  );
}

function SigningStage({ demo }: { demo: FlipDemo }) {
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "92px 64px 64px",
        height: "100%",
        gap: 30,
      }}
    >
      <div style={{ position: "relative" }}>
        <SealedCard
          tokenId={demo.sealed.tokenId}
          commitBlock={demo.sealed.commitBlock}
          buyUnits={demo.sealed.buyUnits}
          bought={demo.sealed.bought}
          w={260}
          h={370}
          showFlipBtn={false}
          compact
        />
        <div
          className="breathe"
          style={{
            position: "absolute",
            inset: -10,
            border: "2px solid var(--acid)",
            borderRadius: "calc(var(--r-card) + 10px)",
            pointerEvents: "none",
            boxShadow: "0 0 60px var(--acid)",
          }}
        />
      </div>

      <div style={{ textAlign: "center" }}>
        <div className="display breathe" style={{ fontSize: 18, color: "var(--acid)", letterSpacing: "0.3em" }}>
          ● AWAITING SIGNATURE
        </div>
        <div className="mono" style={{ fontSize: 11, color: "var(--ink-700)", marginTop: 8, letterSpacing: "0.1em" }}>
          open your wallet and approve <code>hook.flipCard({demo.sealed.tokenId})</code>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: 16,
          alignItems: "center",
          padding: "10px 18px",
          background: "var(--ink-200)",
          border: "1px solid var(--ink-400)",
          borderRadius: 4,
        }}
      >
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--ink-700)" }} />
        <span className="mono" style={{ fontSize: 11, color: "var(--bone-dim)" }}>
          0x6e91…aa83 · gas ~$0.42 · max fee 0.18 gwei
        </span>
      </div>
    </div>
  );
}

function RollReel({ label, items, highlight, color }: { label: string; items: string[]; highlight: string; color: string }) {
  const hi = items.indexOf(highlight);
  return (
    <div style={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: 14, alignItems: "center" }}>
      <span className="mono" style={{ fontSize: 10, letterSpacing: "0.25em", color: "var(--ink-600)" }}>
        {label}
      </span>
      <div
        style={{
          position: "relative",
          height: 56,
          background: "var(--ink-100)",
          border: "1px solid var(--ink-400)",
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", gap: 22, padding: "0 16px", alignItems: "center", height: "100%" }}>
          {items.map((it, i) => (
            <span
              key={i}
              className="led"
              style={{
                fontSize: 30,
                color: i === hi ? color : "var(--ink-600)",
                opacity: i === hi ? 1 : 0.4,
                textShadow: i === hi ? `0 0 18px ${color}` : "none",
                whiteSpace: "nowrap",
              }}
            >
              {it}
            </span>
          ))}
        </div>
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: `calc(16px + ${hi * 100}px - 6px)`,
            width: 60,
            borderLeft: `1px solid ${color}`,
            borderRight: `1px solid ${color}`,
            opacity: 0.5,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, var(--ink-100), transparent 15%, transparent 85%, var(--ink-100))",
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
}

function FlippingStage() {
  const scrollRoll = ["LEEK", "KOL", "WHALE", "MEV BOT", "MINER", "FOUNDER", "VC", "MM", "REG", "CEX"];
  const variantRoll = ["COMMON", "RARE", "MYTHIC"];
  const multRoll = ["0.3×", "0.7×", "1.0×", "1.3×", "2.0×", "5.0×", "10×"];
  return (
    <div
      style={{
        position: "relative",
        display: "grid",
        gridTemplateColumns: "auto 1fr",
        gap: 40,
        padding: "92px 56px 56px",
        height: "100%",
        alignItems: "center",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
        <div style={{ perspective: "1200px", width: 280, height: 400, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div
            style={{
              width: 12,
              height: 400,
              background: "linear-gradient(180deg, var(--gold-hi), var(--gold), var(--gold-hi))",
              borderRadius: 4,
              transform: "rotateY(78deg)",
              boxShadow: "0 0 60px var(--gold), 0 0 12px var(--gold-hi)",
            }}
          />
        </div>
        <div className="display" style={{ fontSize: 14, color: "var(--gold-hi)", letterSpacing: "0.3em" }}>
          ▸ ROLLING ▸
        </div>
        <div className="mono" style={{ fontSize: 9, color: "var(--ink-700)", letterSpacing: "0.18em", textAlign: "center", maxWidth: 220, lineHeight: 1.6 }}>
          tx mined in block 22,140,236<br />
          seed = keccak256(…)
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        <RollReel label="TIER" items={scrollRoll} highlight="VC" color="var(--gold-hi)" />
        <RollReel label="VARIANT" items={variantRoll} highlight="MYTHIC" color="var(--orchid)" />
        <RollReel label="SIG" items={["CZ", "SBF", "VITALIK", "SUN", "COBIE", "TRUMP", "MUSK", "a16z"]} highlight="SBF" color="var(--bone)" />
        <RollReel label="MULT" items={multRoll} highlight="5.0×" color="var(--gold-hi)" />
        <div
          style={{
            padding: "14px 18px",
            background: "linear-gradient(135deg, oklch(0.20 0.10 82 / 0.4), var(--ink-200))",
            border: "1px solid var(--gold)",
            borderRadius: 4,
          }}
        >
          <div className="mono" style={{ fontSize: 10, color: "var(--gold-hi)", letterSpacing: "0.25em" }}>
            PAYOUT (BUFFER)
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginTop: 6 }}>
            <div className="led" style={{ fontSize: 44, color: "var(--gold-hi)", textShadow: "0 0 18px var(--gold)" }}>
              ···
            </div>
            <span className="mono" style={{ fontSize: 11, color: "var(--ink-700)" }}>
              computing…
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Op({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div className="mono" style={{ fontSize: 8, color: "var(--ink-600)", letterSpacing: "0.15em" }}>
        {label}
      </div>
      <div className="led" style={{ fontSize: 22, color }}>
        {value}
      </div>
    </div>
  );
}
function Sign({ children }: { children: React.ReactNode }) {
  return (
    <span className="display" style={{ fontSize: 22, color: "var(--ink-600)" }}>
      {children}
    </span>
  );
}

function RevealedStage({ demo }: { demo: FlipDemo }) {
  const r = demo.revealed;
  const t = TIERS[r.tier]!;
  const v = VARIANTS[r.variant]!;
  const sig = SIGNATURES[r.sig] ?? "—";
  const traitNames = TRAITS[t.key] ?? [];
  return (
    <div
      style={{
        position: "relative",
        display: "grid",
        gridTemplateColumns: "auto 1fr",
        gap: 56,
        padding: "82px 60px 56px",
        height: "100%",
        alignItems: "center",
      }}
    >
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 24% 50%, oklch(0.30 0.16 82 / 0.35), transparent 50%)", pointerEvents: "none" }} />

      <div style={{ position: "relative" }}>
        <div
          className="breathe"
          style={{
            position: "absolute",
            inset: -16,
            background: "radial-gradient(circle, oklch(0.82 0.16 82 / 0.4), transparent 70%)",
            pointerEvents: "none",
            borderRadius: 28,
            filter: "blur(12px)",
          }}
        />
        <CasteCard card={r} w={300} h={430} />
      </div>

      <div>
        <div className="mono" style={{ fontSize: 11, letterSpacing: "0.3em", color: "var(--gold-hi)", marginBottom: 8 }}>
          ★ JACKPOT FLIP ★ · NO MORE SECRETS
        </div>
        <h2 style={{ margin: 0, fontFamily: "var(--f-display)", fontSize: 42, color: "var(--bone)", lineHeight: 1.05, letterSpacing: "-0.02em" }}>
          {v.cn === "RARE" ? "Rare " : v.cn === "MYTHIC" ? "Mythic " : ""}
          {t.cn} <span style={{ color: "var(--gold-hi)" }}>by {sig}</span>
        </h2>

        <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
          <TierBadge tier={r.tier} variant={r.variant} size="md" />
          <span className="chip chip--gold breathe">{t.emoji} {t.cn} TIER</span>
          {r.traits.map((ti, i) => (
            <span key={i} className="chip">▸ {traitNames[ti]}</span>
          ))}
        </div>

        <div
          style={{
            marginTop: 28,
            padding: 22,
            background: "linear-gradient(135deg, oklch(0.20 0.10 82 / 0.35), var(--ink-200))",
            border: "1px solid var(--gold-hi)",
            borderRadius: 6,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, var(--gold-hi), var(--gold), var(--gold-hi))" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
            <span className="mono" style={{ fontSize: 10, letterSpacing: "0.25em", color: "var(--gold-hi)" }}>
              PAYOUT FROM BUFFER
            </span>
            <span className="mono" style={{ fontSize: 9, color: "var(--ink-700)" }}>
              → sent to your wallet
            </span>
          </div>
          <div className="led" style={{ fontSize: 74, color: "var(--gold-hi)", lineHeight: 0.9, textShadow: "0 0 24px var(--gold), 0 0 4px var(--gold-hi)" }}>
            +{(demo.payout / 1000).toFixed(0)}K
          </div>
          <div className="mono" style={{ fontSize: 12, color: "var(--bone-dim)", marginTop: 6 }}>
            $CASTE · ≈ ${(demo.payout / 1000 * 4.2).toFixed(0)} @ pool curve
          </div>

          <div
            style={{
              marginTop: 18,
              padding: "10px 12px",
              background: "oklch(0 0 0 / 0.3)",
              borderRadius: 3,
              display: "grid",
              gridTemplateColumns: "repeat(7, auto)",
              gap: 8,
              alignItems: "center",
            }}
          >
            <Op label="TIER BASE" value={`${(demo.tierBase / 1000).toFixed(0)}K`} color="var(--bone-dim)" />
            <Sign>×</Sign>
            <Op label="VARIANT" value={`${demo.variantMult.toFixed(1)}×`} color="var(--orchid)" />
            <Sign>×</Sign>
            <Op label="MULT" value={`${demo.multiplier.toFixed(1)}×`} color="var(--gold-hi)" />
            <Sign>=</Sign>
            <Op label="PAYOUT" value={`${(demo.payout / 1000).toFixed(0)}K`} color="var(--gold-hi)" />
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
          <button style={btnSecondary}>VIEW IN GALLERY →</button>
          <button style={btnSecondary}>SHARE ON X →</button>
          <button style={btnPrimary}>FLIP ANOTHER ▸</button>
        </div>
      </div>
    </div>
  );
}

const btnSecondary: React.CSSProperties = {
  padding: "14px 22px",
  background: "var(--ink-200)",
  color: "var(--bone)",
  border: "1px solid var(--ink-400)",
  fontFamily: "var(--f-mono)",
  fontSize: 11,
  letterSpacing: "0.18em",
  borderRadius: 4,
  cursor: "pointer",
};

const btnPrimary: React.CSSProperties = {
  padding: "14px 22px",
  background: "var(--acid)",
  color: "var(--ink-000)",
  fontFamily: "var(--f-display)",
  fontSize: 13,
  letterSpacing: "0.18em",
  border: "none",
  borderRadius: 4,
  boxShadow: "0 4px 0 var(--acid-lo)",
  cursor: "pointer",
};

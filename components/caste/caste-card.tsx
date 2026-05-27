import { TIERS, VARIANTS, SIGNATURES, TRAITS } from "@/lib/caste/mock";
import type { CardData } from "@/lib/caste/types";

const ABS: React.CSSProperties = { position: "absolute" };

function MaterialBg({ tier }: { tier: number }) {
  const t = TIERS[tier];
  if (!t) return null;
  const base: React.CSSProperties = { ...ABS, inset: 0, borderRadius: "inherit", overflow: "hidden" };
  switch (t.key) {
    case "leek":
      return (
        <div style={{ ...base, background: "linear-gradient(180deg, oklch(0.30 0.06 130), oklch(0.22 0.05 130))" }}>
          <div style={{ ...ABS, inset: 0, backgroundImage: "var(--tex-noise)", opacity: 0.6, mixBlendMode: "overlay" }} />
          <div style={{ ...ABS, inset: 0, background: "repeating-linear-gradient(135deg, transparent 0 12px, oklch(1 0 0 / 0.02) 12px 13px)" }} />
        </div>
      );
    case "kol":
      return (
        <div style={{ ...base, background: "repeating-linear-gradient(135deg, oklch(0.38 0.18 35) 0 18px, oklch(0.30 0.16 50) 18px 36px)" }}>
          <div style={{ ...ABS, inset: 0, background: "radial-gradient(circle at 70% 30%, oklch(0.78 0.20 35 / 0.4), transparent 60%)" }} />
        </div>
      );
    case "whale":
      return (
        <div style={{ ...base, background: "radial-gradient(circle at 30% 70%, oklch(0.32 0.10 235), oklch(0.16 0.06 235) 70%)" }}>
          <div style={{ ...ABS, inset: 0, backgroundImage: "var(--tex-noise)", opacity: 0.4, mixBlendMode: "overlay" }} />
        </div>
      );
    case "mev":
      return (
        <div style={{ ...base, background: "linear-gradient(180deg, oklch(0.22 0.10 320), oklch(0.18 0.12 280))" }}>
          <div style={{ ...ABS, inset: 0, background: "repeating-linear-gradient(0deg, transparent 0 4px, oklch(0.72 0.22 320 / 0.08) 4px 5px)" }} />
          <div style={{ ...ABS, top: "20%", left: 0, right: 0, height: 2, background: "var(--orchid)", opacity: 0.5 }} />
        </div>
      );
    case "miner":
      return (
        <div style={{ ...base, background: "linear-gradient(180deg, oklch(0.32 0.02 60), oklch(0.20 0.02 60))" }}>
          <div style={{ ...ABS, inset: 0, background: "repeating-linear-gradient(0deg, oklch(1 0 0 / 0.03) 0 1px, transparent 1px 3px)" }} />
        </div>
      );
    case "team":
      return (
        <div style={{ ...base, background: "linear-gradient(180deg, oklch(0.24 0.01 80), oklch(0.18 0.01 80))" }}>
          <div style={{ ...ABS, top: 8, left: 8, right: 8, height: 1, background: "oklch(1 0 0 / 0.15)" }} />
          <div style={{ ...ABS, top: 12, left: 8, right: 8, height: 1, background: "oklch(1 0 0 / 0.08)" }} />
        </div>
      );
    case "vc":
      return (
        <div style={{ ...base, background: "linear-gradient(135deg, oklch(0.45 0.10 82), oklch(0.62 0.14 82) 50%, oklch(0.38 0.08 82))" }}>
          <div style={{ ...ABS, inset: 0, background: "repeating-linear-gradient(45deg, transparent 0 8px, oklch(1 0 0 / 0.05) 8px 9px)" }} />
        </div>
      );
    case "mm":
      return <div style={{ ...base, background: "linear-gradient(180deg, oklch(0.78 0.01 250), oklch(0.62 0.01 250))" }} />;
    case "reg":
      return (
        <div style={{ ...base, background: "linear-gradient(180deg, oklch(0.30 0.14 18), oklch(0.22 0.12 18))" }}>
          <div style={{ ...ABS, inset: 0, backgroundImage: "var(--tex-noise)", opacity: 0.3 }} />
        </div>
      );
    case "cex":
      return (
        <div style={{ ...base, background: "linear-gradient(180deg, oklch(0.10 0.01 80) 0%, oklch(0.14 0.02 80) 100%)" }}>
          <div style={{ ...ABS, top: 0, left: 0, right: 0, height: 6, background: "linear-gradient(90deg, var(--gold-hi), var(--gold), var(--gold-hi))" }} />
          <div style={{ ...ABS, bottom: 0, left: 0, right: 0, height: 6, background: "linear-gradient(90deg, var(--gold-hi), var(--gold), var(--gold-hi))" }} />
        </div>
      );
    default:
      return null;
  }
}

function E({ children, sx = 1, x, y, r = 0, op = 1, sz }: { children: React.ReactNode; sx?: number; x: string; y: string; r?: number; op?: number; sz: number }) {
  return (
    <span
      style={{
        position: "absolute",
        left: x,
        top: y,
        fontSize: sz * 0.5 * sx,
        lineHeight: 1,
        transform: `rotate(${r}deg)`,
        opacity: op,
        userSelect: "none",
      }}
    >
      {children}
    </span>
  );
}

const Ground = ({ color = "oklch(0.45 0.08 60)" }: { color?: string }) => (
  <div style={{ position: "absolute", bottom: "12%", left: "8%", right: "8%", height: 1, background: color, opacity: 0.7 }} />
);

export function TierScene({ tier, size = 120 }: { tier: number; size?: number }) {
  const sz = size;
  const wrap: React.CSSProperties = {
    position: "absolute",
    left: "50%",
    top: "30%",
    transform: "translateX(-50%)",
    width: sz * 1.5,
    height: sz * 1.1,
    pointerEvents: "none",
    filter: "drop-shadow(0 6px 18px rgb(0 0 0 / 0.6))",
  };

  switch (tier) {
    case 0:
      return (
        <div style={wrap}>
          <E sz={sz} x="6%"  y="32%" r={-8} sx={1.0}>🌱</E>
          <E sz={sz} x="34%" y="22%" r={2}  sx={1.15}>🌱</E>
          <E sz={sz} x="64%" y="32%" r={10} sx={0.95}>🌱</E>
          <Ground />
        </div>
      );
    case 1:
      return (
        <div style={wrap}>
          <E sz={sz} x="8%" y="26%" r={-12} sx={1.4}>📢</E>
          <span style={{ position: "absolute", left: "55%", top: "20%", fontFamily: "var(--f-led)", fontSize: sz * 0.45, color: "var(--bone)", textShadow: "0 0 12px oklch(0.78 0.20 35)", lineHeight: 1, transform: "rotate(8deg)" }}>100×</span>
          <span style={{ position: "absolute", left: "60%", top: "55%", fontFamily: "var(--f-led)", fontSize: sz * 0.22, color: "oklch(0.78 0.20 35)", lineHeight: 1, transform: "rotate(-4deg)", opacity: 0.7 }}>RUG WARN</span>
        </div>
      );
    case 2:
      return (
        <div style={wrap}>
          <E sz={sz} x="20%" y="20%" sx={1.6}>🐳</E>
          <span style={{ position: "absolute", bottom: "18%", left: "10%", right: "10%", height: 2, background: "oklch(0.55 0.10 235)", opacity: 0.6, borderRadius: 999 }} />
          <span style={{ position: "absolute", bottom: "10%", left: "20%", right: "20%", height: 1, background: "oklch(0.55 0.10 235)", opacity: 0.4 }} />
        </div>
      );
    case 3:
      return (
        <div style={wrap}>
          <E sz={sz} x="6%"  y="30%" sx={0.85} op={0.55}>🟢</E>
          <E sz={sz} x="30%" y="22%" sx={1.5}>🤖</E>
          <E sz={sz} x="64%" y="30%" sx={0.85} op={0.55}>🔴</E>
          <span style={{ position: "absolute", bottom: "8%", left: "50%", transform: "translateX(-50%)", fontFamily: "var(--f-mono)", fontSize: sz * 0.13, color: "var(--orchid)", letterSpacing: "0.2em" }}>SANDWICH</span>
        </div>
      );
    case 4:
      return (
        <div style={wrap}>
          <E sz={sz} x="10%" y="18%" r={-22} sx={1.4}>⛏️</E>
          <span style={{ position: "absolute", bottom: "20%", right: "12%", width: sz * 0.55, height: sz * 0.35, background: "linear-gradient(135deg, oklch(0.45 0.04 60), oklch(0.28 0.03 60))", clipPath: "polygon(15% 100%, 0 60%, 25% 25%, 60% 10%, 90% 35%, 100% 80%, 70% 100%)", border: "1px solid oklch(0.65 0.05 60)" }} />
          <span style={{ position: "absolute", bottom: "32%", right: "30%", width: 4, height: 4, background: "var(--acid)", borderRadius: "50%", boxShadow: "0 0 8px var(--acid)" }} />
        </div>
      );
    case 5:
      return (
        <div style={wrap}>
          <E sz={sz} x="4%"  y="42%" r={-30} sx={0.9} op={0.7}>🌱</E>
          <E sz={sz} x="22%" y="36%" r={-8}  sx={1.05}>🌱</E>
          <E sz={sz} x="44%" y="36%" r={6}   sx={1.05}>🌱</E>
          <span style={{ position: "absolute", right: "8%", top: "8%", fontSize: sz * 0.85, transform: "rotate(115deg)", filter: "drop-shadow(0 0 6px oklch(0.62 0.24 25 / 0.6))" }}>🪓</span>
          <div style={{ position: "absolute", top: "44%", left: "8%", right: "20%", height: 1, background: "var(--blood-hi)", opacity: 0.6, transform: "rotate(-3deg)" }} />
          <Ground />
          <span style={{ position: "absolute", bottom: "2%", left: "50%", transform: "translateX(-50%)", fontFamily: "var(--f-display)", fontSize: sz * 0.13, color: "var(--blood-hi)", letterSpacing: "0.15em", whiteSpace: "nowrap" }}>HARVESTING</span>
        </div>
      );
    case 6:
      return (
        <div style={wrap}>
          <E sz={sz} x="22%" y="14%" sx={0.7} r={-6}>🎩</E>
          <E sz={sz} x="20%" y="32%" sx={1.6}>💰</E>
          <E sz={sz} x="56%" y="42%" sx={1.0} op={0.7}>💵</E>
        </div>
      );
    case 7:
      return (
        <div style={wrap}>
          <E sz={sz} x="10%" y="22%" sx={1.2}>📈</E>
          <E sz={sz} x="48%" y="22%" sx={1.2}>📉</E>
          <span style={{ position: "absolute", bottom: "12%", left: "10%", right: "10%", height: 1, background: "oklch(0.86 0.01 250)", opacity: 0.4 }} />
        </div>
      );
    case 8:
      return (
        <div style={wrap}>
          <E sz={sz} x="14%" y="18%" sx={1.5} r={-18}>⚖️</E>
          <E sz={sz} x="58%" y="40%" sx={1.0} r={20} op={0.85}>🔗</E>
          <span style={{ position: "absolute", bottom: "10%", left: "50%", transform: "translateX(-50%)", fontFamily: "var(--f-display)", fontSize: sz * 0.13, color: "var(--blood-hi)", letterSpacing: "0.15em", whiteSpace: "nowrap" }}>SEC RAID</span>
        </div>
      );
    case 9:
      return (
        <div style={wrap}>
          <E sz={sz} x="20%" y="16%" sx={1.6}>🏦</E>
          <E sz={sz} x="60%" y="36%" sx={0.8} r={-4}>🔒</E>
          <span style={{ position: "absolute", bottom: "10%", left: 0, right: 0, textAlign: "center", fontFamily: "var(--f-led)", fontSize: sz * 0.2, color: "var(--gold-hi)", letterSpacing: "0.1em", textShadow: "0 0 8px var(--gold)" }}>$$$$</span>
        </div>
      );
    default:
      return null;
  }
}

function CardFrame({ variant, children, style }: { variant: number; children: React.ReactNode; style?: React.CSSProperties }) {
  let frameStyle: React.CSSProperties = {};
  if (variant === 0) frameStyle = { border: "1px solid oklch(1 0 0 / 0.08)" };
  if (variant === 1)
    frameStyle = {
      border: "1.5px solid var(--gold)",
      boxShadow: "0 0 0 1px oklch(0.82 0.16 82 / 0.3), 0 8px 24px rgb(0 0 0 / 0.5)",
    };
  if (variant === 2)
    frameStyle = {
      border: "1.5px solid transparent",
      boxShadow:
        "0 0 0 1px oklch(0.78 0.18 320 / 0.5), 0 12px 36px oklch(0.62 0.24 320 / 0.35)",
      background:
        "linear-gradient(var(--ink-200), var(--ink-200)) padding-box, linear-gradient(135deg, var(--orchid), var(--cobalt), var(--acid), var(--gold), var(--orchid)) border-box",
    };
  return <div style={{ position: "relative", borderRadius: "var(--r-card)", ...frameStyle, ...style }}>{children}</div>;
}

export function CasteCard({ card, w = 260, h = 380 }: { card: CardData; w?: number; h?: number }) {
  const tier = TIERS[card.tier];
  const variantObj = VARIANTS[card.variant];
  if (!tier || !variantObj) return null;
  const sig = SIGNATURES[card.sig] ?? "—";
  const traitPool = TRAITS[tier.key] ?? [];
  const traits = card.traits.map((i) => traitPool[i]).filter(Boolean) as string[];
  const special = [69, 420, 1337, 6969, 21000].includes(card.id);
  const isBlackHumorSuit =
    (tier.key === "vc" && sig === "SBF") ||
    (tier.key === "team" && sig === "Do Kwon") ||
    (tier.key === "cex" && sig === "SBF") ||
    (tier.key === "reg" && sig === "Trump");

  return (
    <CardFrame variant={card.variant} style={{ width: w, height: h, flexShrink: 0 }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: "inherit", overflow: "hidden", background: "var(--ink-200)" }}>
        <MaterialBg tier={card.tier} />
        {card.variant === 2 && (
          <div className="holo" style={{ position: "absolute", inset: 0, opacity: 0.18, mixBlendMode: "screen", pointerEvents: "none" }} />
        )}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "var(--tex-scanline)", opacity: 0.6, pointerEvents: "none" }} />

        <div style={{ position: "absolute", top: 14, left: 16, right: 16, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div className="mono" style={{ fontSize: 9, letterSpacing: "0.2em", color: "oklch(1 0 0 / 0.55)", textTransform: "uppercase" }}>
              CASTE · GENESIS · Q2/2026
            </div>
            <div className="display" style={{ fontSize: 22, color: "var(--bone)", lineHeight: 1, marginTop: 4, textShadow: "0 1px 0 rgb(0 0 0 / 0.4)" }}>
              {tier.cn}
            </div>
            <div className="display" style={{ fontSize: 10, color: "oklch(1 0 0 / 0.65)", letterSpacing: "0.18em", marginTop: 2 }}>
              {tier.en.toUpperCase()}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div className="mono" style={{ fontSize: 9, color: "oklch(1 0 0 / 0.55)", letterSpacing: "0.15em" }}>SERIAL</div>
            <div className="led" style={{ fontSize: 28, color: "var(--bone)", textShadow: special ? "0 0 12px var(--acid)" : "none" }}>
              #{card.id}
            </div>
            {special && <div className="mono" style={{ fontSize: 8, color: "var(--acid)", letterSpacing: "0.2em" }}>★ SPECIAL</div>}
          </div>
        </div>

        <TierScene tier={card.tier} size={w * 0.46} />

        <div style={{ position: "absolute", left: 16, top: 78, display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 14 }}>{tier.emoji}</span>
          <span className="mono" style={{ fontSize: 9, color: "oklch(1 0 0 / 0.55)", letterSpacing: "0.15em" }}>
            CLASS {String(card.tier).padStart(2, "0")}
          </span>
        </div>

        <div style={{ position: "absolute", left: 16, right: 16, bottom: 70, display: "flex", flexDirection: "column", gap: 4 }}>
          {traits.map((t, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span className="mono" style={{ fontSize: 8, color: "oklch(1 0 0 / 0.45)" }}>0{i + 1}</span>
              <div style={{ flex: 1, height: 1, background: "oklch(1 0 0 / 0.15)" }} />
              <span style={{ fontSize: 11, color: "var(--bone)", fontWeight: 700 }}>{t}</span>
            </div>
          ))}
        </div>

        <div style={{ position: "absolute", left: 16, right: 16, bottom: 12, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <div className="mono" style={{ fontSize: 8, color: "oklch(1 0 0 / 0.45)", letterSpacing: "0.2em", textTransform: "uppercase" }}>
              ✶ Swaps {card.swaps}
              {card.jackpots > 0 ? ` · ⚡${card.jackpots}` : ""}
            </div>
            <div className="display" style={{ fontSize: 10, color: card.variant === 2 ? "var(--orchid)" : card.variant === 1 ? "var(--gold-hi)" : "oklch(1 0 0 / 0.55)", letterSpacing: "0.2em", marginTop: 2 }}>
              {variantObj.cn.toUpperCase()} · {variantObj.mult.toFixed(1)}×
            </div>
          </div>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              border: "1.5px dashed oklch(1 0 0 / 0.5)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "oklch(0 0 0 / 0.3)",
            }}
          >
            <div className="mono" style={{ fontSize: 7, color: "oklch(1 0 0 / 0.55)", letterSpacing: "0.15em" }}>SIGNED</div>
            <div className="display" style={{ fontSize: sig.length > 4 ? 9 : 12, color: "var(--bone)", textAlign: "center", lineHeight: 1 }}>{sig}</div>
          </div>
        </div>

        {isBlackHumorSuit && (
          <div style={{ position: "absolute", top: 14, left: "50%", transform: "translateX(-50%)" }}>
            <div className="hk-banner" style={{ fontSize: 10, padding: "3px 16px" }}>Black Humor Suit</div>
          </div>
        )}
      </div>
    </CardFrame>
  );
}

export function CardBack({ w = 260, h = 380 }: { w?: number; h?: number }) {
  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: "var(--r-card)",
        background: "var(--ink-300)",
        border: "1px solid var(--ink-400)",
        position: "relative",
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      <div className="halftone" style={{ position: "absolute", inset: 0, opacity: 0.4 }} />
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
        <div className="display" style={{ fontSize: 48, color: "var(--bone)", letterSpacing: "0.1em" }}>?</div>
        <div className="display" style={{ fontSize: 14, color: "var(--ink-700)", letterSpacing: "0.3em" }}>CASTE · UNREVEALED</div>
        <div className="mono" style={{ fontSize: 9, color: "var(--ink-600)", letterSpacing: "0.2em" }}>commit → 2-block delay → reveal</div>
      </div>
      <div style={{ position: "absolute", inset: 8, border: "1px dashed oklch(1 0 0 / 0.15)", borderRadius: "var(--r-lg)", pointerEvents: "none" }} />
    </div>
  );
}

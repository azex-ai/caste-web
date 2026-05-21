// Shared chrome bits used by V1 pages.

export type TickerItem = { tag: string; text: string; color?: string };

export function Ticker({ items }: { items: TickerItem[] }) {
  const content = (
    <div style={{ display: "flex", gap: 36, alignItems: "center", paddingRight: 36 }}>
      {items.map((it, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontFamily: "var(--f-mono)",
            fontSize: 11,
            letterSpacing: "0.04em",
          }}
        >
          <span style={{ color: it.color ?? "var(--ink-700)" }}>{it.tag}</span>
          <span style={{ color: "var(--bone-dim)" }}>{it.text}</span>
        </div>
      ))}
    </div>
  );
  return (
    <div
      style={{
        borderBottom: "1px solid var(--ink-300)",
        background: "linear-gradient(180deg, oklch(0.10 0.005 60), oklch(0.13 0.008 60))",
        padding: "10px 0",
        overflow: "hidden",
        whiteSpace: "nowrap",
        position: "relative",
      }}
    >
      <div className="marquee">
        {content}
        {content}
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 80,
          background: "linear-gradient(90deg, var(--ink-100), transparent)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: 80,
          background: "linear-gradient(270deg, var(--ink-100), transparent)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

export function Footer() {
  return (
    <footer
      style={{
        padding: "32px 28px 28px",
        borderTop: "1px solid var(--ink-300)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        gap: 24,
        background: "var(--ink-100)",
        flexWrap: "wrap",
      }}
    >
      <div>
        <div className="display" style={{ fontSize: 22, color: "var(--bone)", letterSpacing: "0.05em" }}>
          Roll Your Caste · Trade Your Fate
        </div>
        <div className="display" style={{ fontSize: 12, color: "var(--ink-700)", letterSpacing: "0.15em", marginTop: 4 }}>
          BUY QUIET · FLIP LOUD
        </div>
      </div>
      <div
        className="mono"
        style={{
          fontSize: 10,
          color: "var(--ink-600)",
          letterSpacing: "0.1em",
          textAlign: "right",
          lineHeight: 1.6,
        }}
      >
        $CASTE · Uniswap v4 Hook Meme · Ethereum Mainnet
        <br />
        Not financial advice · DYOR · code is law
        <br />
        <span style={{ color: "var(--ink-500)" }}>hook 0x6666…CA57e · token 0x6666…6605e</span>
      </div>
    </footer>
  );
}

export function SectionLabel({ children, subtitle, hint, num }: { children: React.ReactNode; subtitle?: string; hint?: string; num?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 18 }}>
      <span className="display" style={{ fontSize: 32, color: "var(--bone)" }}>{children}</span>
      {subtitle && <span className="display" style={{ fontSize: 14, color: "var(--ink-700)", letterSpacing: "0.2em" }}>{subtitle}</span>}
      <div style={{ flex: 1, height: 1, background: "var(--ink-400)" }} />
      {hint && (
        <span className="mono" style={{ fontSize: 11, color: "var(--ink-600)", letterSpacing: "0.1em" }}>{hint}</span>
      )}
      {num && (
        <span className="mono" style={{ fontSize: 11, color: "var(--ink-600)", letterSpacing: "0.15em" }}>{num}</span>
      )}
    </div>
  );
}

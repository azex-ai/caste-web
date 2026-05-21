export function PhaseBanner({
  phase = "A",
  cardsMinted = 4019,
  cardsCap = 10000,
  sellTax = 25,
}: {
  phase?: "A" | "B";
  cardsMinted?: number;
  cardsCap?: number;
  sellTax?: number;
}) {
  return phase === "A" ? (
    <PhaseABanner cardsMinted={cardsMinted} cardsCap={cardsCap} sellTax={sellTax} />
  ) : (
    <PhaseBBanner />
  );
}

function PhaseABanner({ cardsMinted, cardsCap, sellTax }: { cardsMinted: number; cardsCap: number; sellTax: number }) {
  const pct = (cardsMinted / cardsCap) * 100;
  const remain = cardsCap - cardsMinted;
  return (
    <div
      style={{
        position: "relative",
        borderBottom: "1px solid var(--blood-lo)",
        background:
          "linear-gradient(90deg, oklch(0.16 0.04 25) 0%, oklch(0.20 0.10 25 / 0.5) 50%, oklch(0.16 0.04 25) 100%)",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", inset: 0, backgroundImage: "var(--tex-scanline)", opacity: 0.5, pointerEvents: "none" }} />
      <div
        style={{
          position: "relative",
          display: "grid",
          gridTemplateColumns: "auto 1fr auto auto",
          gap: 18,
          alignItems: "center",
          padding: "10px 28px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            className="breathe"
            style={{
              width: 8,
              height: 8,
              background: "var(--blood-hi)",
              borderRadius: "50%",
              boxShadow: "0 0 8px var(--blood-hi)",
            }}
          />
          <span className="display" style={{ fontSize: 13, color: "var(--blood-hi)", letterSpacing: "0.18em" }}>
            PHASE&nbsp;A
          </span>
          <span className="mono" style={{ fontSize: 10, color: "var(--bone-dim)", letterSpacing: "0.15em" }}>
            · MINT WINDOW · HIGH TAX
          </span>
        </div>

        <div style={{ position: "relative" }}>
          <div
            style={{
              height: 12,
              background: "oklch(0 0 0 / 0.45)",
              border: "1px solid var(--blood-lo)",
              borderRadius: 2,
              overflow: "hidden",
              position: "relative",
            }}
          >
            <div
              style={{
                width: `${pct}%`,
                height: "100%",
                background: "linear-gradient(90deg, var(--blood-lo), var(--blood-hi))",
                boxShadow: "inset 0 0 10px oklch(0 0 0 / 0.5)",
              }}
            />
            {Array.from({ length: 9 }, (_, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: `${(i + 1) * 10}%`,
                  top: 0,
                  bottom: 0,
                  width: 1,
                  background: "oklch(0 0 0 / 0.4)",
                }}
              />
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
            <span className="mono" style={{ fontSize: 9, color: "var(--bone)", letterSpacing: "0.15em" }}>
              <span className="led" style={{ fontSize: 13, color: "var(--bone)", letterSpacing: "0.02em" }}>
                {cardsMinted.toLocaleString()}
              </span>
              <span style={{ color: "var(--ink-700)" }}> / {cardsCap.toLocaleString()} sealed cards minted</span>
            </span>
            <span className="mono" style={{ fontSize: 9, color: "var(--blood-hi)", letterSpacing: "0.15em" }}>
              {remain.toLocaleString()} TO PHASE B
            </span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "4px 12px",
            border: "1px solid var(--blood-hi)",
            borderRadius: 3,
            background: "oklch(0.20 0.10 25 / 0.4)",
          }}
        >
          <span className="mono" style={{ fontSize: 9, letterSpacing: "0.2em", color: "var(--blood-hi)" }}>
            SELL TAX
          </span>
          <span className="led" style={{ fontSize: 22, color: "var(--blood-hi)", textShadow: "0 0 12px var(--blood-hi)" }}>
            {sellTax}%
          </span>
        </div>

        <div
          className="mono"
          style={{
            fontSize: 9,
            color: "var(--ink-700)",
            letterSpacing: "0.1em",
            textAlign: "right",
            lineHeight: 1.3,
            maxWidth: 180,
          }}
        >
          ▸ Drops to <span style={{ color: "var(--jade)" }}>1.5%</span> when all 10k sealed cards mint
        </div>
      </div>
    </div>
  );
}

function PhaseBBanner() {
  return (
    <div
      style={{
        position: "relative",
        borderBottom: "1px solid oklch(0.50 0.12 155 / 0.5)",
        background:
          "linear-gradient(90deg, oklch(0.16 0.04 155) 0%, oklch(0.20 0.10 155 / 0.4) 50%, oklch(0.16 0.04 155) 100%)",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", inset: 0, backgroundImage: "var(--tex-scanline)", opacity: 0.5, pointerEvents: "none" }} />
      <div
        style={{
          position: "relative",
          display: "grid",
          gridTemplateColumns: "auto 1fr auto auto",
          gap: 18,
          alignItems: "center",
          padding: "10px 28px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              width: 8,
              height: 8,
              background: "var(--jade)",
              borderRadius: "50%",
              boxShadow: "0 0 10px var(--jade)",
            }}
          />
          <span className="display" style={{ fontSize: 13, color: "var(--jade)", letterSpacing: "0.18em" }}>
            PHASE&nbsp;B
          </span>
          <span className="mono" style={{ fontSize: 10, color: "var(--bone-dim)", letterSpacing: "0.15em" }}>
            · FREE TRADING · ALL 10K MINTED
          </span>
        </div>

        <div style={{ position: "relative" }}>
          <div
            style={{
              height: 12,
              background: "oklch(0 0 0 / 0.45)",
              border: "1px solid oklch(0.50 0.12 155 / 0.5)",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                background: "linear-gradient(90deg, oklch(0.55 0.12 155), var(--jade))",
              }}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
            <span className="mono" style={{ fontSize: 9, color: "var(--bone)", letterSpacing: "0.15em" }}>
              <span className="led" style={{ fontSize: 13, color: "var(--jade)", letterSpacing: "0.02em" }}>
                10,000
              </span>
              <span style={{ color: "var(--ink-700)" }}> / 10,000 · MINT COMPLETE</span>
            </span>
            <span className="mono" style={{ fontSize: 9, color: "var(--jade)", letterSpacing: "0.15em" }}>
              📈 FREE TRADE
            </span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "4px 12px",
            border: "1px solid var(--jade)",
            borderRadius: 3,
            background: "oklch(0.20 0.10 155 / 0.3)",
          }}
        >
          <span className="mono" style={{ fontSize: 9, letterSpacing: "0.2em", color: "var(--jade)" }}>
            SELL TAX
          </span>
          <span className="led" style={{ fontSize: 22, color: "var(--jade)", textShadow: "0 0 10px var(--jade)" }}>
            1.5%
          </span>
        </div>

        <div
          className="mono"
          style={{
            fontSize: 9,
            color: "var(--ink-700)",
            letterSpacing: "0.1em",
            textAlign: "right",
            lineHeight: 1.3,
            maxWidth: 180,
          }}
        >
          ▸ Mint capped permanently. Sealed cards on secondary only.
        </div>
      </div>
    </div>
  );
}

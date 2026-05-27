import { Fragment } from "react";

type CountdownState = "calm" | "warning" | "critical";

export function Countdown({
  hh = "06",
  mm = "42",
  ss = "18",
  state = "calm",
  label = "FOMO DEADLINE",
}: {
  hh?: string;
  mm?: string;
  ss?: string;
  state?: CountdownState;
  label?: string;
}) {
  const color =
    state === "critical" ? "var(--blood-hi)" : state === "warning" ? "var(--gold-hi)" : "var(--bone)";
  const glow =
    state === "critical"
      ? "0 0 24px var(--blood-hi), 0 0 6px var(--blood)"
      : state === "warning"
      ? "0 0 18px var(--gold)"
      : "none";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <div
        className="mono"
        style={{
          fontSize: 9,
          letterSpacing: "0.28em",
          color: state === "critical" ? "var(--blood-hi)" : "var(--ink-600)",
          textTransform: "uppercase",
        }}
      >
        {state === "critical" ? "⚠ FINAL HOUR ⚠" : label}
      </div>
      <div className={state === "critical" ? "breathe" : ""} style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
        {[hh, mm, ss].map((part, i) => (
          <Fragment key={i}>
            <div style={{ position: "relative" }}>
              <div className="led" style={{ fontSize: 40, color, textShadow: glow, fontVariantNumeric: "tabular-nums" }}>{part}</div>
              <div
                className="mono"
                style={{
                  fontSize: 8,
                  color: "var(--ink-600)",
                  letterSpacing: "0.2em",
                  textAlign: "center",
                  marginTop: 2,
                }}
              >
                {["HRS", "MIN", "SEC"][i]}
              </div>
            </div>
            {i < 2 && (
              <div
                className={"led" + (state === "critical" ? " breathe" : "")}
                style={{ fontSize: 36, color, opacity: state === "critical" ? 1 : 0.4 }}
              >
                :
              </div>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

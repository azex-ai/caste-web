import { SettleScreen } from "@/components/caste/settle-screen";

export const dynamic = "force-static";

type SearchParams = Promise<{ kind?: string }>;

export default async function SettlePage({ searchParams }: { searchParams: SearchParams }) {
  const { kind } = await searchParams;
  const k = kind === "mega" ? "mega" : "hourly";
  return (
    <div style={{ padding: "40px 40px" }}>
      <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 20 }}>
        <a
          href="/caste/settle?kind=hourly"
          className="mono"
          style={{
            padding: "8px 16px",
            borderRadius: 4,
            border: "1px solid var(--ink-400)",
            color: k === "hourly" ? "var(--jade)" : "var(--ink-700)",
            background: k === "hourly" ? "oklch(0.20 0.08 155 / 0.15)" : "transparent",
            fontSize: 11,
            letterSpacing: "0.2em",
            textDecoration: "none",
          }}
        >
          HOURLY SETTLE
        </a>
        <a
          href="/caste/settle?kind=mega"
          className="mono"
          style={{
            padding: "8px 16px",
            borderRadius: 4,
            border: "1px solid var(--ink-400)",
            color: k === "mega" ? "var(--gold-hi)" : "var(--ink-700)",
            background: k === "mega" ? "oklch(0.20 0.10 82 / 0.15)" : "transparent",
            fontSize: 11,
            letterSpacing: "0.2em",
            textDecoration: "none",
          }}
        >
          MEGA SETTLE
        </a>
      </div>
      <SettleScreen kind={k} />
    </div>
  );
}

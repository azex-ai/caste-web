"use client";

import { useTranslations } from "next-intl";
import { useMetaMismatch } from "@/lib/caste/meta";
import { useIsMounted } from "@/lib/use-is-mounted";

export function MetaMismatchBanner() {
  const mounted = useIsMounted();
  const t = useTranslations("banner.configMismatch");
  const mismatch = useMetaMismatch();

  // Render nothing on SSR + first paint to avoid hydration mismatch and to
  // silently no-op when the indexer is unreachable (query data is undefined).
  if (!mounted) return null;
  if (!mismatch) return null;

  const issues: string[] = [];
  if (mismatch.chainId) {
    issues.push(
      t("issue.chainId", {
        indexer: mismatch.chainId.indexer,
        frontend: mismatch.chainId.frontend,
      }),
    );
  }
  if (mismatch.hook) {
    issues.push(
      t("issue.hook", {
        indexer: mismatch.hook.indexer.slice(0, 10),
        frontend: mismatch.hook.frontend.slice(0, 10),
      }),
    );
  }
  if (mismatch.token) issues.push(t("issue.token"));
  if (mismatch.card) issues.push(t("issue.card"));
  if (mismatch.usdc) issues.push(t("issue.usdc"));

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        padding: "10px 28px",
        background:
          "linear-gradient(90deg, oklch(0.30 0.18 25) 0%, oklch(0.22 0.12 25) 100%)",
        borderBottom: "1px solid var(--blood-hi)",
        display: "flex",
        alignItems: "center",
        gap: 18,
        boxShadow: "0 4px 12px oklch(0 0 0 / 0.4)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <span
          className="breathe"
          style={{
            width: 10,
            height: 10,
            background: "var(--bone)",
            borderRadius: "50%",
            boxShadow: "0 0 10px var(--bone)",
          }}
        />
        <span
          className="display"
          style={{ fontSize: 13, color: "var(--bone)", letterSpacing: "0.18em" }}
        >
          {t("title")}
        </span>
        <span
          className="mono"
          style={{
            fontSize: 11,
            color: "var(--bone-dim)",
            letterSpacing: "0.05em",
          }}
        >
          {t("body", { issues: issues.join(", ") })}
        </span>
      </div>
    </div>
  );
}

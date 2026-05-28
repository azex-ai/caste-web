"use client";

import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { useTranslations } from "next-intl";
import { activeChainId } from "@/lib/wagmi";
import { useIsMounted } from "@/lib/use-is-mounted";

export function WrongNetworkBanner() {
  const mounted = useIsMounted();
  const t = useTranslations("banner.wrongNetwork");
  const { isConnected } = useAccount();
  const currentChainId = useChainId();
  const { switchChain, isPending } = useSwitchChain();

  // Render nothing on SSR + first paint to avoid hydration mismatch (wagmi
  // state is client-only).
  if (!mounted) return null;
  if (!isConnected) return null;
  if (currentChainId === activeChainId) return null;

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        padding: "10px 28px",
        background: "linear-gradient(90deg, oklch(0.30 0.18 25) 0%, oklch(0.22 0.12 25) 100%)",
        borderBottom: "1px solid var(--blood-hi)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 18,
        boxShadow: "0 4px 12px oklch(0 0 0 / 0.4)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
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
        <span className="mono" style={{ fontSize: 11, color: "var(--bone-dim)", letterSpacing: "0.05em" }}>
          {t("body", { current: currentChainId, target: activeChainId })}
        </span>
      </div>
      <button type="button"
        disabled={isPending}
        onClick={() => switchChain({ chainId: activeChainId })}
        style={{
          padding: "8px 18px",
          background: isPending ? "var(--ink-300)" : "var(--bone)",
          color: isPending ? "var(--ink-600)" : "oklch(0.20 0.14 25)",
          border: "none",
          borderRadius: 3,
          fontFamily: "var(--f-display)",
          fontSize: 12,
          letterSpacing: "0.15em",
          cursor: isPending ? "wait" : "pointer",
          whiteSpace: "nowrap",
        }}
      >
        {isPending ? t("switching") : t("switchTo", { target: activeChainId })}
      </button>
    </div>
  );
}

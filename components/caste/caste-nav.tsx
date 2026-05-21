"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectButton } from "./connect-button";

const NAV_ITEMS = [
  { href: "/caste",             label: "/home" },
  { href: "/caste/swap",        label: "/swap" },
  { href: "/caste/sell",        label: "/sell" },
  { href: "/caste/mycards",     label: "/mycards" },
  { href: "/caste/pools",       label: "/pools" },
  { href: "/caste/gallery",     label: "/gallery" },
  { href: "/caste/account",     label: "/account" },
  { href: "/caste/leaderboard", label: "/leaders" },
  { href: "/caste/activity",    label: "/activity" },
  { href: "/caste/stats",       label: "/stats" },
] as const;

export function CasteNav() {
  const pathname = usePathname();
  return (
    <header
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 28px",
        borderBottom: "1px solid var(--ink-300)",
        background: "var(--ink-100)",
        flexWrap: "wrap",
        gap: 14,
      }}
    >
      <Link href="/caste" style={{ display: "flex", alignItems: "center", gap: 14, textDecoration: "none" }}>
        <div
          style={{
            position: "relative",
            width: 34,
            height: 34,
            borderRadius: 4,
            background: "var(--acid)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span className="display" style={{ fontSize: 18, color: "var(--ink-000)", letterSpacing: "-0.06em" }}>◇</span>
          <div style={{ position: "absolute", inset: 0, border: "1px solid oklch(0 0 0 / 0.4)", borderRadius: 4, pointerEvents: "none" }} />
        </div>
        <div>
          <div className="display" style={{ fontSize: 18, color: "var(--bone)", letterSpacing: "-0.01em" }}>
            $CASTE<span style={{ color: "var(--acid)" }}>.</span>
          </div>
          <div className="mono" style={{ fontSize: 8, letterSpacing: "0.3em", color: "var(--ink-600)" }}>
            v4 HOOK · MAINNET
          </div>
        </div>
      </Link>

      <nav style={{ display: "flex", alignItems: "center", gap: 2, fontFamily: "var(--f-mono)", flexWrap: "wrap" }}>
        {NAV_ITEMS.map((it) => {
          const on = it.href === "/caste" ? pathname === "/caste" : pathname.startsWith(it.href);
          return (
            <Link
              key={it.href}
              href={it.href}
              style={{
                padding: "6px 10px",
                fontSize: 10,
                letterSpacing: "0.08em",
                color: on ? "var(--ink-000)" : "var(--bone-dim)",
                background: on ? "var(--acid)" : "transparent",
                borderRadius: 3,
                textDecoration: "none",
                textTransform: "lowercase",
              }}
            >
              {it.label}
            </Link>
          );
        })}
      </nav>

      <ConnectButton />
    </header>
  );
}

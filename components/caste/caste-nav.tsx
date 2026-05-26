"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { ConnectButton } from "./connect-button";
import { LocaleSwitcher } from "./locale-switcher";

const NAV_ITEMS = [
  { href: "/",             label: "/home" },
  { href: "/swap",        label: "/swap" },
  { href: "/sell",        label: "/sell" },
  { href: "/mycards",     label: "/mycards" },
  { href: "/pools",       label: "/pools" },
  { href: "/gallery",     label: "/gallery" },
  { href: "/account",     label: "/account" },
  { href: "/leaderboard", label: "/leaders" },
  { href: "/activity",    label: "/activity" },
  { href: "/stats",       label: "/stats" },
] as const;

export function CasteNav() {
  const pathname = usePathname();
  const t = useTranslations("nav");
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
      <Link href="/" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }} aria-label={t("ariaHome")}>
        <span
          aria-hidden
          style={{
            position: "relative",
            width: 36,
            height: 36,
            border: "1px solid var(--acid-lo)",
            background: "oklch(0.08 0.02 115 / 0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "var(--glow-acid)",
            overflow: "hidden",
          }}
        >
          <span
            style={{
              position: "absolute",
              inset: 0,
              background: "var(--tex-scanline)",
              opacity: 0.55,
              pointerEvents: "none",
            }}
          />
          <span style={{ position: "absolute", top: -1, left: -1, width: 6, height: 6, borderTop: "1px solid var(--acid)", borderLeft: "1px solid var(--acid)" }} />
          <span style={{ position: "absolute", top: -1, right: -1, width: 6, height: 6, borderTop: "1px solid var(--acid)", borderRight: "1px solid var(--acid)" }} />
          <span style={{ position: "absolute", bottom: -1, left: -1, width: 6, height: 6, borderBottom: "1px solid var(--acid)", borderLeft: "1px solid var(--acid)" }} />
          <span style={{ position: "absolute", bottom: -1, right: -1, width: 6, height: 6, borderBottom: "1px solid var(--acid)", borderRight: "1px solid var(--acid)" }} />
          <span
            style={{
              fontFamily: "var(--f-led)",
              fontSize: 22,
              color: "var(--acid)",
              textShadow: "0 0 8px var(--acid)",
              lineHeight: 1,
              position: "relative",
            }}
          >
            $C
          </span>
        </span>
        <span style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
          <span
            style={{
              fontFamily: "var(--f-led)",
              fontSize: 22,
              color: "var(--acid)",
              textShadow: "0 0 8px var(--acid)",
              letterSpacing: "0.04em",
            }}
          >
            $CASTE
          </span>
          <span className="mono" style={{ fontSize: 9, letterSpacing: "0.3em", color: "var(--acid-lo)", marginTop: 4 }}>
            {t("logoTagline")}
          </span>
        </span>
      </Link>

      <nav style={{ display: "flex", alignItems: "center", gap: 2, fontFamily: "var(--f-mono)", flexWrap: "wrap" }}>
        {NAV_ITEMS.map((it) => {
          const on = it.href === "/" ? pathname === "/" : pathname.startsWith(it.href);
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

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <LocaleSwitcher />
        <ConnectButton />
      </div>
    </header>
  );
}

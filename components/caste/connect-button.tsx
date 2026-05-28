"use client";

import { useEffect, useRef, useState } from "react";
import { useAccount, useBalance, useConnect, useDisconnect } from "wagmi";

import { addresses } from "@/lib/caste/contracts";
import { useIsMounted } from "@/lib/use-is-mounted";
import { activeChainId } from "@/lib/wagmi";

// USDC is 6 decimals. Whole dollars with grouping, no decimals — keeps the
// header compact while still useful at a glance during testing.
function formatUsdcShort(wei: bigint): string {
  const whole = wei / 1_000_000n;
  return `$${whole.toLocaleString()}`;
}

// 0xABCD...1234 — first 4 hex chars + last 4. Matches Aaron's spec; differs
// from ConnectKit's default 6+4.
function shortAddress(addr: string): string {
  if (addr.length < 10) return addr;
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

function UsdcBalance({ address }: { address: `0x${string}` }) {
  const { data } = useBalance({
    address,
    token: addresses.usdc,
    chainId: activeChainId,
    query: { refetchInterval: 8_000 },
  });
  return (
    <span className="led" style={{ fontSize: 16, color: "var(--bone)" }}>
      {data ? formatUsdcShort(data.value) : "—"}
    </span>
  );
}

export function ConnectButton() {
  const { address, isConnected } = useAccount();
  const { connectors, connect, status: connectStatus, error: connectError } = useConnect();
  const { disconnect } = useDisconnect();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Wagmi hydrates from localStorage on the client, so `isConnected` flips
  // from false (server / first client paint) to true (after hydration) when
  // the user has a remembered session. Rendering two different button trees
  // across that flip causes a hydration mismatch. Gate the wallet-dependent
  // UI behind a mount flag so the first client paint matches SSR output.
  const mounted = useIsMounted();

  // Close the popover on outside click / Escape.
  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Dedup connectors: wagmi's auto-detection sometimes injects both "injected"
  // and the wallet's named connector (Metamask, Coinbase…). When the named
  // entry covers the same provider, prefer it for the friendlier label.
  const visibleConnectors = (() => {
    const seen = new Set<string>();
    const out: Array<(typeof connectors)[number]> = [];
    for (const c of connectors) {
      const key = (c as { rdns?: string }).rdns ?? c.id;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(c);
    }
    return out;
  })();

  // Before hydration completes, always render the disconnected button shell.
  // This matches what the server renders (where `isConnected` is always false)
  // and avoids React's hydration-mismatch warning. The dropdown / connected
  // state takes over once `mounted` flips to true.
  if (!mounted || !isConnected) {
    return (
      <div ref={rootRef} style={{ position: "relative" }}>
        <button type="button"
          onClick={() => setOpen((v) => !v)}
          disabled={!mounted}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 18px",
            background: "var(--acid)",
            color: "var(--ink-000)",
            border: "none",
            borderRadius: 4,
            fontFamily: "var(--f-display)",
            fontSize: 13,
            letterSpacing: "0.08em",
            cursor: mounted ? "pointer" : "default",
            opacity: mounted ? 1 : 0.85,
            boxShadow:
              "0 0 0 1px oklch(0 0 0 / 0.4), 0 4px 0 var(--acid-lo), 0 8px 18px oklch(0.90 0.20 115 / 0.35)",
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: 0,
              background: "var(--ink-000)",
              transform: "rotate(45deg)",
            }}
          />
          CONNECT WALLET
        </button>
        {open ? (
          <div
            role="menu"
            style={{
              position: "absolute",
              top: "calc(100% + 8px)",
              right: 0,
              minWidth: 240,
              padding: 8,
              background: "var(--ink-100)",
              border: "1px solid var(--ink-400)",
              borderRadius: 4,
              boxShadow: "0 8px 24px oklch(0 0 0 / 0.6)",
              zIndex: 50,
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            {visibleConnectors.length === 0 ? (
              <span
                className="mono"
                style={{ fontSize: 11, color: "var(--ink-600)", padding: "8px 10px" }}
              >
                No browser wallet detected — install Metamask or Rabby.
              </span>
            ) : (
              visibleConnectors.map((c) => (
                <button type="button"
                  key={c.uid}
                  onClick={() => {
                    connect({ connector: c });
                    setOpen(false);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 12px",
                    background: "transparent",
                    border: "1px solid transparent",
                    color: "var(--bone)",
                    fontFamily: "var(--f-mono)",
                    fontSize: 12,
                    letterSpacing: "0.04em",
                    cursor: "pointer",
                    borderRadius: 3,
                    textAlign: "left",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--ink-200)";
                    e.currentTarget.style.borderColor = "var(--ink-400)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.borderColor = "transparent";
                  }}
                >
                  <span>{c.name}</span>
                  {connectStatus === "pending" ? (
                    <span style={{ fontSize: 10, color: "var(--ink-600)" }}>…</span>
                  ) : null}
                </button>
              ))
            )}
            {connectError ? (
              <span
                className="mono"
                style={{
                  fontSize: 10,
                  color: "var(--blood-hi)",
                  padding: "6px 10px",
                  borderTop: "1px solid var(--ink-400)",
                  marginTop: 4,
                }}
              >
                {connectError.message}
              </span>
            ) : null}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div ref={rootRef} style={{ position: "relative" }}>
      <button type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          display: "inline-flex",
          alignItems: "stretch",
          borderRadius: 4,
          border: "1px solid var(--ink-400)",
          background: "var(--ink-200)",
          overflow: "hidden",
          padding: 0,
          cursor: "pointer",
          color: "var(--bone)",
        }}
      >
        <span
          style={{
            padding: "8px 12px",
            display: "flex",
            alignItems: "center",
            gap: 8,
            borderRight: "1px solid var(--ink-400)",
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "var(--jade)",
              boxShadow: "0 0 8px var(--jade)",
            }}
          />
          <span className="mono" style={{ fontSize: 12, color: "var(--bone)" }}>
            {address ? shortAddress(address) : "—"}
          </span>
        </span>
        <span
          style={{
            padding: "8px 12px",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span
            className="mono"
            style={{ fontSize: 9, color: "var(--ink-600)", letterSpacing: "0.2em" }}
          >
            USDC
          </span>
          {address ? (
            <UsdcBalance address={address} />
          ) : (
            <span className="led" style={{ fontSize: 16, color: "var(--bone)" }}>
              —
            </span>
          )}
        </span>
      </button>
      {open ? (
        <div
          role="menu"
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            minWidth: 220,
            padding: 6,
            background: "var(--ink-100)",
            border: "1px solid var(--ink-400)",
            borderRadius: 4,
            boxShadow: "0 8px 24px oklch(0 0 0 / 0.6)",
            zIndex: 50,
          }}
        >
          {address ? (
            <button type="button"
              onClick={() => {
                navigator.clipboard?.writeText(address).catch(() => {});
                setOpen(false);
              }}
              style={menuItemStyle}
            >
              Copy address
            </button>
          ) : null}
          <button type="button"
            onClick={() => {
              disconnect();
              setOpen(false);
            }}
            style={{ ...menuItemStyle, color: "var(--blood-hi)" }}
          >
            Disconnect
          </button>
        </div>
      ) : null}
    </div>
  );
}

const menuItemStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  textAlign: "left",
  padding: "8px 10px",
  background: "transparent",
  border: "none",
  color: "var(--bone)",
  fontFamily: "var(--f-mono)",
  fontSize: 12,
  letterSpacing: "0.04em",
  cursor: "pointer",
  borderRadius: 3,
};

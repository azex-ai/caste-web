"use client";

import { ConnectKitButton } from "connectkit";

export function ConnectButton({ balance = "$12,408" }: { balance?: string }) {
  return (
    <ConnectKitButton.Custom>
      {({ isConnected, show, truncatedAddress, ensName }) => {
        if (!isConnected) {
          return (
            <button
              onClick={show}
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
                cursor: "pointer",
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
          );
        }
        return (
          <button
            onClick={show}
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
                {ensName ?? truncatedAddress}
              </span>
            </span>
            <span style={{ padding: "8px 12px", display: "flex", alignItems: "center", gap: 6 }}>
              <span
                className="mono"
                style={{ fontSize: 9, color: "var(--ink-600)", letterSpacing: "0.2em" }}
              >
                USDC
              </span>
              <span className="led" style={{ fontSize: 16, color: "var(--bone)" }}>
                {balance}
              </span>
            </span>
          </button>
        );
      }}
    </ConnectKitButton.Custom>
  );
}

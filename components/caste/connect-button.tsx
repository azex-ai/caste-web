"use client";

import { ConnectKitButton } from "connectkit";

export function CasteConnectButton() {
  return (
    <ConnectKitButton.Custom>
      {({ isConnected, isConnecting, show, address, truncatedAddress }) => (
        <button
          type="button"
          onClick={show}
          aria-label={isConnected ? `已连接 ${truncatedAddress}` : "连接钱包"}
          className={[
            "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all",
            isConnected
              ? "border border-zinc-700 bg-zinc-800 text-zinc-100 hover:bg-zinc-700"
              : "bg-fuchsia-600 text-white shadow-[0_0_24px_rgb(192_38_211/0.4)] hover:bg-fuchsia-500 active:scale-95",
          ].join(" ")}
        >
          {isConnecting ? (
            <>
              <span
                className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-zinc-400 border-t-white"
                aria-hidden="true"
              />
              连接中…
            </>
          ) : isConnected ? (
            <>
              <span
                className="h-2 w-2 rounded-full bg-emerald-400"
                aria-hidden="true"
              />
              {truncatedAddress}
            </>
          ) : (
            "连接钱包"
          )}
        </button>
      )}
    </ConnectKitButton.Custom>
  );
}

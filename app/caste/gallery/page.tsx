"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import { CasteConnectButton } from "@/components/caste/connect-button";
import { CardDisplay } from "@/components/caste/card-display";
import { fetchCardsByOwner, fetchRareCards, casteQueryKeys } from "@/lib/caste/api";
import { MOCK_CARDS, getMockCardsByOwner, getMockRareCards } from "@/lib/caste/mock";
import { CONTRACTS } from "@/lib/caste/constants";
import type { CardData } from "@/lib/caste/types";

type Tab = "mine" | "rare";

function CardGrid({ cards, empty }: { cards: CardData[]; empty: string }) {
  if (cards.length === 0) {
    return (
      <div className="py-16 text-center text-zinc-500">
        <div className="text-4xl mb-3" aria-hidden="true">🃏</div>
        <p>{empty}</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <CardDisplay key={card.tokenId.toString()} card={card} />
      ))}
    </div>
  );
}

export default function GalleryPage() {
  const { address, isConnected } = useAccount();
  const [tab, setTab] = useState<Tab>("mine");
  const deployed = !!CONTRACTS.card;

  // My cards — fall back to mock on error
  const myCardsQuery = useQuery({
    queryKey: casteQueryKeys.cardsByOwner(address ?? ""),
    queryFn: async () => {
      if (!address) return [];
      try {
        return await fetchCardsByOwner(address);
      } catch {
        return getMockCardsByOwner(address);
      }
    },
    enabled: !!address,
    staleTime: 20_000,
    placeholderData: address ? getMockCardsByOwner(address) : [],
  });

  // Rare cards — fall back to mock on error
  const rareCardsQuery = useQuery({
    queryKey: casteQueryKeys.rareCards(),
    queryFn: async () => {
      try {
        return await fetchRareCards();
      } catch {
        return getMockRareCards();
      }
    },
    enabled: tab === "rare",
    staleTime: 60_000,
    placeholderData: getMockRareCards(),
  });

  const displayedCards =
    tab === "mine"
      ? (myCardsQuery.data ?? (address ? getMockCardsByOwner(address) : []))
      : (rareCardsQuery.data ?? getMockRareCards());

  const isLoading =
    tab === "mine" ? myCardsQuery.isLoading : rareCardsQuery.isLoading;

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-black text-zinc-100">
          <span aria-hidden="true">🖼️</span> Gallery
        </h1>
        <CasteConnectButton />
      </div>

      {!deployed && (
        <div className="mb-4 rounded-xl border border-amber-800 bg-amber-950/50 px-4 py-3 text-sm text-amber-300">
          合约尚未部署 — 显示 Mock 数据演示
        </div>
      )}

      {/* Tab toggle */}
      <div
        role="tablist"
        aria-label="卡片视图"
        className="mb-6 flex rounded-xl border border-zinc-700 bg-zinc-800 p-1 w-fit"
      >
        <button
          type="button"
          role="tab"
          aria-selected={tab === "mine"}
          onClick={() => setTab("mine")}
          className={[
            "px-5 py-2 rounded-lg text-sm font-semibold transition",
            tab === "mine"
              ? "bg-fuchsia-700 text-white shadow"
              : "text-zinc-400 hover:text-zinc-200",
          ].join(" ")}
        >
          我的卡
          {myCardsQuery.data ? (
            <span className="ml-2 text-xs opacity-70">
              {myCardsQuery.data.length}
            </span>
          ) : null}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "rare"}
          onClick={() => setTab("rare")}
          className={[
            "px-5 py-2 rounded-lg text-sm font-semibold transition",
            tab === "rare"
              ? "bg-fuchsia-700 text-white shadow"
              : "text-zinc-400 hover:text-zinc-200",
          ].join(" ")}
        >
          全网稀有卡
        </button>
      </div>

      {/* Connect prompt for "mine" tab */}
      {tab === "mine" && !isConnected && (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <div className="text-4xl" aria-hidden="true">🔒</div>
          <p className="text-zinc-400">连接钱包查看你的 NFT</p>
          <CasteConnectButton />
        </div>
      )}

      {/* Loading skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-48 animate-pulse rounded-2xl border border-zinc-700 bg-zinc-800"
              aria-hidden="true"
            />
          ))}
        </div>
      )}

      {/* Cards */}
      {!isLoading && (tab === "rare" || isConnected) && (
        <CardGrid
          cards={displayedCards}
          empty={
            tab === "mine"
              ? "你还没有 $CASTE 卡，去 Mint 一张吧！"
              : "暂无稀有卡数据"
          }
        />
      )}
    </main>
  );
}

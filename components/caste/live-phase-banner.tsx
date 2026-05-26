"use client";

import { useStats } from "@/lib/caste/hooks";
import { PhaseBanner } from "./phase-banner";

const CARDS_CAP = 10_000;
const PHASE_A_SELL_TAX = 25;
const PHASE_B_SELL_TAX = 1.5;

export function LivePhaseBanner() {
  const { data: stats } = useStats();
  const cardsMinted = stats?.cardsMinted ?? 0;
  const isPhaseA = cardsMinted < CARDS_CAP;
  return (
    <PhaseBanner
      phase={isPhaseA ? "A" : "B"}
      cardsMinted={cardsMinted}
      cardsCap={CARDS_CAP}
      sellTax={isPhaseA ? PHASE_A_SELL_TAX : PHASE_B_SELL_TAX}
    />
  );
}

import type { ReactNode } from "react";
import "./caste-tokens.css";
import { CasteProviders } from "./providers";
import { PhaseBanner } from "@/components/caste/phase-banner";
import { CasteNav } from "@/components/caste/caste-nav";
import { PHASE_STATE } from "@/lib/caste/mock";

export default function CasteLayout({ children }: { children: ReactNode }) {
  return (
    <CasteProviders>
      <div className="caste-root">
        <PhaseBanner
          phase={PHASE_STATE.isPhaseA ? "A" : "B"}
          cardsMinted={PHASE_STATE.cardsMinted}
          cardsCap={PHASE_STATE.cardsCap}
          sellTax={PHASE_STATE.isPhaseA ? PHASE_STATE.phaseASellTax : PHASE_STATE.phaseBSellTax}
        />
        <CasteNav />
        {children}
      </div>
    </CasteProviders>
  );
}

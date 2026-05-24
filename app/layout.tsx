import "./globals.css";
import "./caste-tokens.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { CasteProviders } from "./providers";
import { PhaseBanner } from "@/components/caste/phase-banner";
import { CasteNav } from "@/components/caste/caste-nav";
import { PHASE_STATE } from "@/lib/caste/mock";

export const metadata: Metadata = {
  title: "$CASTE — flip-card meme protocol",
  description:
    "Sealed cards, deferred reveal, phase-based economics. Live on Uniswap v4.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <CasteProviders>
          <div className="caste-root">
            <PhaseBanner
              phase={PHASE_STATE.isPhaseA ? "A" : "B"}
              cardsMinted={PHASE_STATE.cardsMinted}
              cardsCap={PHASE_STATE.cardsCap}
              sellTax={
                PHASE_STATE.isPhaseA
                  ? PHASE_STATE.phaseASellTax
                  : PHASE_STATE.phaseBSellTax
              }
            />
            <CasteNav />
            {children}
          </div>
        </CasteProviders>
      </body>
    </html>
  );
}

import "./globals.css";
import "./caste-tokens.css";
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getLocale } from "next-intl/server";
import { CasteProviders } from "./providers";
import { LivePhaseBanner } from "@/components/caste/live-phase-banner";
import { WrongNetworkBanner } from "@/components/caste/wrong-network-banner";
import { MetaMismatchBanner } from "@/components/caste/meta-mismatch-banner";
import { CasteNav } from "@/components/caste/caste-nav";

export const metadata: Metadata = {
  title: "$CASTE — flip-card meme protocol",
  description:
    "Sealed cards, deferred reveal, phase-based economics. Live on Uniswap v4.",
  applicationName: "$CASTE",
  keywords: [
    "CASTE",
    "Uniswap v4",
    "hook",
    "flip card",
    "meme",
    "Base",
    "memecoin",
  ],
  openGraph: {
    title: "$CASTE — flip-card meme protocol",
    description:
      "Sealed cards, deferred reveal, phase-based economics. Live on Uniswap v4. RANK · ROLL · REPEAT.",
    type: "website",
    siteName: "$CASTE",
  },
  twitter: {
    card: "summary_large_image",
    title: "$CASTE — flip-card meme protocol",
    description: "RANK · ROLL · REPEAT — live on Uniswap v4.",
  },
};

export const viewport: Viewport = {
  themeColor: "#caf03c",
  colorScheme: "dark",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  // getLocale + getMessages are independent — Promise.all races them so the
  // first paint isn't waterfalled by the serial awaits.
  const [locale, messages] = await Promise.all([getLocale(), getMessages()]);
  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <CasteProviders>
            <div className="caste-root">
              <WrongNetworkBanner />
              <MetaMismatchBanner />
              <LivePhaseBanner />
              <CasteNav />
              {children}
            </div>
          </CasteProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

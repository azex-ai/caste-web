import type { ReactNode } from "react";
import { CasteProviders } from "./providers";

export default function CasteLayout({ children }: { children: ReactNode }) {
  return <CasteProviders>{children}</CasteProviders>;
}

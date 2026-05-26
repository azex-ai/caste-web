"use client";

import { useEffect, useState } from "react";

// Gates client-only state (wagmi address, localStorage reads, etc.) so the
// first paint matches the server-rendered HTML and React doesn't throw a
// hydration mismatch. Returns false on the server + first render, true after
// useEffect fires (client only).
export function useIsMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

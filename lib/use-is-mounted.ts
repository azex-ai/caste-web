"use client";

import { useSyncExternalStore } from "react";

// Gates client-only state (wagmi address, localStorage reads, etc.) so the
// first paint matches the server-rendered HTML and React doesn't throw a
// hydration mismatch. Returns false on the server + first render, true after
// React commits on the client.
//
// `useSyncExternalStore` is the React 18+ idiom for this — it subscribes to a
// no-op store and uses the server snapshot to deterministically return false
// during SSR / hydration, then the client snapshot (true) on commit.
// Preferred over the `useState(false) + useEffect(setMounted, [])` pattern
// because it avoids the "initialize state in effect" anti-pattern flagged by
// react-doctor's `no-initialize-state` rule.
const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export function useIsMounted(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

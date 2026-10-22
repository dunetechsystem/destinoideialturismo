"use client";

import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

/** false no servidor e na hidratação, true depois — sem setState em effect (portais, localStorage). */
export function useHydrated() {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

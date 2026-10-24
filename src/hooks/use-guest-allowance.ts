"use client";

import { useCallback, useSyncExternalStore } from "react";

/** How many posts a signed-out visitor can vote on or skip before signing up. */
export const GUEST_FREE_LOOKS = 3;

const KEY = "secretly:guest-looks";
const EVENT = "secretly:guest-looks";

/** Fallback for when localStorage is unavailable (e.g. private mode). */
let memory = 0;

function read(): number {
  try {
    const stored = Number(localStorage.getItem(KEY) ?? 0);
    return Math.max(memory, Number.isFinite(stored) ? stored : 0);
  } catch {
    return memory;
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/**
 * Free looks for signed-out visitors, shared across the site and remembered
 * in this browser: each vote or skip uses one. Signed-in visitors ignore it.
 */
export function useGuestAllowance() {
  const used = useSyncExternalStore(subscribe, read, () => 0);
  const use = useCallback(() => {
    memory = read() + 1;
    try {
      localStorage.setItem(KEY, String(memory));
    } catch {
      // Private mode: the in-memory count still applies to this visit.
    }
    window.dispatchEvent(new Event(EVENT));
  }, []);
  return { used, left: Math.max(0, GUEST_FREE_LOOKS - used), exhausted: used >= GUEST_FREE_LOOKS, use };
}

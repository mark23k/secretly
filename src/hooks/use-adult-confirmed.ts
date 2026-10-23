"use client";

import { useCallback, useSyncExternalStore } from "react";

const KEY = "secretly:18plus";
const EVENT = "secretly:18plus";

/** Fallback for when localStorage is unavailable (e.g. private mode). */
let confirmedThisPage = false;

function read() {
  if (confirmedThisPage) return true;
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return false;
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
 * Whether this browser confirmed it's 18+ for After Dark content. Remembered
 * in localStorage; false during server rendering.
 */
export function useAdultConfirmed() {
  const confirmed = useSyncExternalStore(subscribe, read, () => false);
  const confirm = useCallback(() => {
    confirmedThisPage = true;
    try {
      localStorage.setItem(KEY, "1");
    } catch {
      // Private mode: confirmation just lasts for this page.
    }
    window.dispatchEvent(new Event(EVENT));
  }, []);
  return { confirmed, confirm };
}

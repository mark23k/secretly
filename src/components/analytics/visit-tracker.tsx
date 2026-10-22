"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const DEVICE_KEY = "secretly:device";
const VISIT_KEY = "secretly:visit";
const VISIT_TIMEOUT_MS = 30 * 60 * 1000;
const HEARTBEAT_MS = 30 * 1000;

type TrackEvent = "page" | "ping" | "resume";

function storageGet(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function storageSet(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Private mode etc.: we just count this tab as its own visit.
  }
}

/** A random id for this browser. Not linked to anything else; no cookies. */
function deviceId() {
  let id = storageGet(DEVICE_KEY);
  if (!id) {
    id = crypto.randomUUID();
    storageSet(DEVICE_KEY, id);
  }
  return id;
}

/** The current visit, shared across tabs; a new one starts after 30 idle minutes. */
function currentVisit() {
  const now = Date.now();
  let visit: { id: string; at: number } | null = null;
  try {
    visit = JSON.parse(storageGet(VISIT_KEY) ?? "null");
  } catch {}
  const isNew = !visit || now - visit.at > VISIT_TIMEOUT_MS;
  const id = isNew ? crypto.randomUUID() : visit!.id;
  storageSet(VISIT_KEY, JSON.stringify({ id, at: now }));
  return { id, isNew };
}

function send(type: TrackEvent) {
  const visit = currentVisit();
  // Coming back to an idle tab starts a new visit, which needs a page event.
  const event = visit.isNew ? "page" : type;
  const body = JSON.stringify({ session: visit.id, device: deviceId(), event });
  if (event !== "page" && navigator.sendBeacon?.(`/api/track`, body)) return;
  void fetch("/api/track", { method: "POST", body, keepalive: true }).catch(() => {});
}

/**
 * First-party, anonymous visit counting for the manager dashboard: a page
 * event per navigation and a heartbeat every 30s while the tab is visible.
 * Reads the URL, so it must render inside <Suspense>.
 */
export function VisitTracker() {
  const pathname = usePathname();
  const skip = pathname.startsWith("/admin");
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    if (skip || lastPath.current === pathname) return;
    lastPath.current = pathname;
    send("page");
  }, [pathname, skip]);

  useEffect(() => {
    if (skip) return;
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") send("ping");
    }, HEARTBEAT_MS);
    const onVisibility = () => send(document.visibilityState === "visible" ? "resume" : "ping");
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [skip]);

  return null;
}

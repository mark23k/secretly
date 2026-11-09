"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Sends one anonymous page view per page. No IP addresses are stored. */
export function VisitTracker() {
  const pathname = usePathname();
  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
    const body = JSON.stringify({ path: pathname });
    if (!navigator.sendBeacon?.("/api/track", new Blob([body], { type: "application/json" }))) {
      fetch("/api/track", { method: "POST", body, keepalive: true, headers: { "content-type": "application/json" } }).catch(() => {});
    }
  }, [pathname]);
  return null;
}

import "server-only";
import { headers } from "next/headers";
import { hmac } from "./secret";

/** Keyed hash of the caller's IP: stable for abuse checks, never reversible. */
export async function getIpHash(): Promise<string | null> {
  const h = await headers();
  // Netlify sets x-nf-client-connection-ip; other hosts use x-forwarded-for.
  const ip =
    h.get("x-nf-client-connection-ip") || h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip");
  return ip ? hmac(`ip:${ip}`).slice(0, 32) : null;
}

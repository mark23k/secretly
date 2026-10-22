import "server-only";
import { createHmac } from "node:crypto";

let warned = false;

function appSecret(): string {
  const secret = process.env.APP_SECRET;
  if (secret && secret.length >= 16) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error("APP_SECRET must be set (16+ characters) in production.");
  }
  if (!warned) {
    console.warn("[secretly] APP_SECRET not set; using an insecure development value.");
    warned = true;
  }
  return "secretly-dev-only-secret";
}

export function hmac(value: string): string {
  return createHmac("sha256", appSecret()).update(value).digest("hex");
}

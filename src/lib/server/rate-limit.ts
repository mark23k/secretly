import "server-only";
import { IP_LIMIT_MULTIPLIER, rateLimits, type RateLimitName } from "@/config/limits";
import { createAdminClient } from "@/lib/supabase/admin";
import { ActionError } from "./errors";

/**
 * Counts one hit against both the visitor's and the IP's budget for `name`.
 * Throws `rate_limited` when either is exhausted.
 */
export async function enforceRateLimit(
  name: RateLimitName,
  subject: { visitorId?: string; ipHash: string | null }
) {
  const { limit, windowSeconds } = rateLimits[name];
  const admin = createAdminClient();

  const checks: { key: string; limit: number }[] = [];
  if (subject.visitorId) checks.push({ key: `${name}:v:${subject.visitorId}`, limit });
  if (subject.ipHash) checks.push({ key: `${name}:ip:${subject.ipHash}`, limit: limit * IP_LIMIT_MULTIPLIER });

  const results = await Promise.all(
    checks.map((c) =>
      admin.rpc("hit_rate_limit", { p_key: c.key, p_limit: c.limit, p_window_seconds: windowSeconds })
    )
  );

  for (const { data, error } of results) {
    if (error) throw error;
    if (data === false) {
      throw new ActionError(
        "rate_limited",
        "You're moving a little fast. Take a breath and try again in a few minutes."
      );
    }
  }
}

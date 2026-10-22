import "server-only";
import type { z } from "zod";
import type { RateLimitName } from "@/config/limits";
import { createAdminClient, type AdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { ActionError, type ActionResult } from "./errors";
import { getIpHash } from "./ip";
import { enforceRateLimit } from "./rate-limit";
import { requireVisitor, type Visitor } from "./visitor";

export type ActionContext = { visitor: Visitor; admin: AdminClient; ipHash: string | null };

/**
 * Wraps a server action with the checks every write needs, in order:
 * input validation, signed-in account + ban check, rate limit, then the handler.
 * Handlers throw ActionError for expected failures; anything else is logged
 * and reported to the user as a generic error.
 */
export function createAction<S extends z.ZodType, T>(config: {
  schema: S;
  rateLimit?: RateLimitName;
  handler: (input: z.output<S>, ctx: ActionContext) => Promise<ActionResult<T>>;
}) {
  return async (raw: z.input<S>): Promise<ActionResult<T>> => {
    try {
      if (!isSupabaseConfigured) {
        throw new ActionError("unavailable", "Secretly isn't connected to its database yet.");
      }

      const parsed = config.schema.safeParse(raw);
      if (!parsed.success) {
        const fieldErrors: Record<string, string> = {};
        for (const issue of parsed.error.issues) {
          const key = String(issue.path[0] ?? "form");
          fieldErrors[key] ??= issue.message;
        }
        return {
          ok: false,
          code: "invalid",
          message: parsed.error.issues[0]?.message ?? "Please check your input.",
          fieldErrors,
        };
      }

      const ipHash = await getIpHash();
      const visitor = await requireVisitor(ipHash);
      if (config.rateLimit) {
        await enforceRateLimit(config.rateLimit, { visitorId: visitor.id, ipHash });
      }

      return await config.handler(parsed.data, { visitor, admin: createAdminClient(), ipHash });
    } catch (error) {
      if (error instanceof ActionError) {
        return { ok: false, code: error.code, message: error.message, fieldErrors: error.fieldErrors };
      }
      console.error("[action] unexpected error", error);
      return { ok: false, code: "server", message: "Something went wrong on our side. Please try again." };
    }
  };
}

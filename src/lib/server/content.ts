import "server-only";
import { moderate, type ContentKind, type ModerationResult } from "@/lib/moderation";
import type { AdminClient } from "@/lib/supabase/admin";
import { ActionError } from "./errors";

/**
 * Moderates text before it's stored. Rejections become a user-facing
 * `rejected` error; otherwise returns the status to store plus a `held` hint.
 */
export async function screenContent(text: string, kind: ContentKind) {
  const result = await moderate(text, kind);
  if (result.action === "reject") throw new ActionError("rejected", result.message);
  return {
    result,
    status: result.action === "publish" ? ("published" as const) : ("pending" as const),
    held:
      result.action === "crisis"
        ? ("crisis" as const)
        : result.action === "review"
          ? ("review" as const)
          : undefined,
  };
}

/** Audit-logs any automated decision other than a clean publish. */
export async function logModeration(
  admin: AdminClient,
  target: { kind: ContentKind; id: string; visitorId: string },
  result: ModerationResult
) {
  if (result.action === "publish") return;
  const { error } = await admin.from("moderation_events").insert({
    target_kind: target.kind,
    target_id: target.id,
    visitor_id: target.visitorId,
    actor: "auto",
    decision: result.action,
    reasons: result.reasons,
  });
  if (error) console.error("[moderation] failed to log event", error);
}

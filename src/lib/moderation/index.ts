import "server-only";
import type { Database } from "@/lib/supabase/database.types";
import { foldForMatching } from "./normalize";
import { describePii, findPii } from "./pii";
import { suggestsSelfHarm } from "./self-harm";
import { findFilteredWords } from "./wordlist";
import { openAIModeration } from "./openai";

export type ContentKind = Database["public"]["Enums"]["content_kind"];

/**
 * - publish: safe to show immediately
 * - review:  store as `pending` until an admin approves it
 * - crisis:  store as `pending` AND show the writer crisis resources
 * - reject:  don't store; the writer must edit (message explains why)
 */
export type ModerationResult =
  | { action: "publish"; reasons: string[] }
  | { action: "review"; reasons: string[] }
  | { action: "crisis"; reasons: string[] }
  | { action: "reject"; reasons: string[]; message: string };

const STRICT_REJECT_MESSAGE =
  "Replies go straight to a real person, so they need to be kind and safe. Please rephrase.";

/**
 * Runs all checks for a piece of user content. Replies to secrets are
 * "strict": anything questionable is rejected outright rather than queued,
 * because they're delivered directly to one person.
 */
export async function moderate(text: string, kind: ContentKind): Promise<ModerationResult> {
  const strict = kind === "secret_reply";

  const pii = findPii(text, { strict });
  if (pii.length > 0) {
    return {
      action: "reject",
      reasons: pii.map((p) => `pii:${p.kind}`),
      message: describePii(pii),
    };
  }

  const folded = foldForMatching(text);
  if (suggestsSelfHarm(folded)) {
    return { action: "crisis", reasons: ["self_harm:keywords"] };
  }

  const words = findFilteredWords(folded);
  if (words.length > 0) {
    const reasons = words.map((w) => `words:${w}`);
    return strict
      ? { action: "reject", reasons, message: STRICT_REJECT_MESSAGE }
      : { action: "review", reasons };
  }

  try {
    const external = await openAIModeration(text);
    if (external) {
      const reasons = external.categories.map((c) => `openai:${c}`);
      if (external.selfHarm) return { action: "crisis", reasons };
      if (external.flagged) {
        return strict
          ? { action: "reject", reasons, message: STRICT_REJECT_MESSAGE }
          : { action: "review", reasons };
      }
    }
  } catch (error) {
    // Fail closed: hold for review rather than publish unchecked.
    console.error("[moderation] external check failed", error);
    return { action: "review", reasons: ["external_unavailable"] };
  }

  return { action: "publish", reasons: [] };
}

export function statusFor(result: ModerationResult): "published" | "pending" {
  return result.action === "publish" ? "published" : "pending";
}

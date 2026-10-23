"use server";

import { z } from "zod";
import { textLimits } from "@/config/limits";
import { DEFAULT_THOUGHT_OPTIONS, reactionKeys, thoughtCategories, thoughtOptionLimits } from "@/config/thoughts";
import { createAction } from "@/lib/server/action";
import { logModeration, screenContent } from "@/lib/server/content";
import { ActionError, ok, type ActionResult } from "@/lib/server/errors";
import { getIpHash } from "@/lib/server/ip";
import { enforceRateLimit } from "@/lib/server/rate-limit";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { cleanText, textField } from "@/lib/text";
import { toThought, type Thought, type ThoughtComment } from "@/lib/data/thoughts";
import type { AdminClient } from "@/lib/supabase/admin";

const categoryValues = thoughtCategories.map((c) => c.value) as [
  (typeof thoughtCategories)[number]["value"],
  ...(typeof thoughtCategories)[number]["value"][],
];

async function requirePublishedThought(admin: AdminClient, id: string) {
  const { data, error } = await admin
    .from("thoughts")
    .select("id, author_id")
    .eq("id", id)
    .eq("status", "published")
    .maybeSingle();
  if (error) throw error;
  if (!data) throw new ActionError("not_found", "This thought is no longer available.");
  return data;
}

const { min: minOptions, max: maxOptions, maxLength: maxOptionLength } = thoughtOptionLimits;

/** 2-4 distinct answers, or null for the defaults ("Me too" / "Not me"). */
const optionsField = z
  .array(z.string().transform(cleanText).pipe(z.string().min(1, "Answers can't be empty.").max(maxOptionLength, `Keep each answer under ${maxOptionLength} characters.`)))
  .min(minOptions, `Give at least ${minOptions} answers.`)
  .max(maxOptions, `You can have up to ${maxOptions} answers.`)
  .refine((o) => new Set(o.map((x) => x.toLowerCase())).size === o.length, "Each answer needs to be different.")
  .nullish()
  .transform((o) => (!o || o.join("|") === DEFAULT_THOUGHT_OPTIONS.join("|") ? null : o));

export const createThought = createAction({
  schema: z.object({
    body: textField(textLimits.thought, "Your thought"),
    category: z.enum(categoryValues).default("other"),
    options: optionsField,
  }),
  rateLimit: "createThought",
  handler: async ({ body, category, options }, { visitor, admin }) => {
    const screened = await screenContent(options ? `${body}\n${options.join("\n")}` : body, "thought");
    const { data, error } = await admin
      .from("thoughts")
      .insert({ author_id: visitor.id, body, category, options, status: screened.status })
      .select("id")
      .single();
    if (error) throw error;
    await logModeration(admin, { kind: "thought", id: data.id, visitorId: visitor.id }, screened.result);
    return ok({ id: data.id }, screened.held);
  },
});

export const voteThought = createAction({
  schema: z.object({ thoughtId: z.uuid(), choice: z.number().int().min(0).max(maxOptions - 1) }),
  rateLimit: "voteThought",
  handler: async ({ thoughtId, choice }, { visitor, admin }) => {
    const { data, error } = await admin.rpc("cast_thought_vote", {
      p_thought: thoughtId,
      p_visitor: visitor.id,
      p_choice: choice,
    });
    if (error) {
      if (error.code === "P0002") throw new ActionError("not_found", "This thought is no longer available.");
      if (error.code === "42501") throw new ActionError("forbidden", "You can't vote on your own thought.");
      if (error.code === "22023") throw new ActionError("invalid", "That answer isn't one of the options.");
      throw error;
    }
    return ok(toThought(data));
  },
});

export const toggleThoughtReaction = createAction({
  schema: z.object({ thoughtId: z.uuid(), reaction: z.enum(reactionKeys) }),
  rateLimit: "reactThought",
  handler: async ({ thoughtId, reaction }, { visitor, admin }) => {
    await requirePublishedThought(admin, thoughtId);
    const key = { thought_id: thoughtId, visitor_id: visitor.id, reaction };

    const { count, error: deleteError } = await admin
      .from("thought_reactions")
      .delete({ count: "exact" })
      .match(key);
    if (deleteError) throw deleteError;
    if (!count) {
      const { error } = await admin.from("thought_reactions").upsert(key, { ignoreDuplicates: true });
      if (error) throw error;
    }

    const { data, error } = await admin
      .from("thoughts")
      .select("reaction_counts")
      .eq("id", thoughtId)
      .single();
    if (error) throw error;
    return ok({ reactionCounts: data.reaction_counts as Record<string, number>, active: !count });
  },
});

export const addThoughtComment = createAction({
  schema: z.object({
    thoughtId: z.uuid(),
    body: textField(textLimits.thoughtComment, "Your comment"),
  }),
  rateLimit: "createThoughtComment",
  handler: async ({ thoughtId, body }, { visitor, admin }) => {
    await requirePublishedThought(admin, thoughtId);
    const screened = await screenContent(body, "thought_comment");
    const { data, error } = await admin
      .from("thought_comments")
      .insert({ thought_id: thoughtId, author_id: visitor.id, body, status: screened.status })
      .select("id, body, created_at")
      .single();
    if (error) throw error;
    await logModeration(admin, { kind: "thought_comment", id: data.id, visitorId: visitor.id }, screened.result);
    const comment: ThoughtComment = { id: data.id, body: data.body, createdAt: data.created_at };
    return ok({ comment, published: screened.status === "published" }, screened.held);
  },
});

/**
 * For signed-out visitors: see a thought's result after choosing, without an
 * account. Nothing is recorded (their vote counts once they sign up).
 */
export async function peekThought(input: { thoughtId: string }): Promise<ActionResult<Thought>> {
  try {
    if (!isSupabaseConfigured) throw new ActionError("unavailable", "Secretly isn't connected to its database yet.");
    const thoughtId = z.uuid().parse(input.thoughtId);
    await enforceRateLimit("peekThought", { ipHash: await getIpHash() });
    const { data, error } = await createAdminClient().rpc("peek_thought", { p_id: thoughtId });
    if (error) throw error;
    if (!data?.id) throw new ActionError("not_found", "This thought is no longer available.");
    return ok(toThought(data));
  } catch (error) {
    if (error instanceof ActionError) return { ok: false, code: error.code, message: error.message };
    console.error("[peekThought]", error);
    return { ok: false, code: "server", message: "Something went wrong. Please try again." };
  }
}

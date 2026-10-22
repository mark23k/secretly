"use server";

import { z } from "zod";
import { textLimits } from "@/config/limits";
import { reactionKeys, thoughtCategories } from "@/config/thoughts";
import { createAction } from "@/lib/server/action";
import { logModeration, screenContent } from "@/lib/server/content";
import { ActionError, ok } from "@/lib/server/errors";
import { textField } from "@/lib/text";
import { toThought, type ThoughtComment } from "@/lib/data/thoughts";
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

export const createThought = createAction({
  schema: z.object({
    body: textField(textLimits.thought, "Your thought"),
    category: z.enum(categoryValues).default("other"),
  }),
  rateLimit: "createThought",
  handler: async ({ body, category }, { visitor, admin }) => {
    const screened = await screenContent(body, "thought");
    const { data, error } = await admin
      .from("thoughts")
      .insert({ author_id: visitor.id, body, category, status: screened.status })
      .select("id")
      .single();
    if (error) throw error;
    await logModeration(admin, { kind: "thought", id: data.id, visitorId: visitor.id }, screened.result);
    return ok({ id: data.id }, screened.held);
  },
});

export const voteThought = createAction({
  schema: z.object({ thoughtId: z.uuid(), meToo: z.boolean() }),
  rateLimit: "voteThought",
  handler: async ({ thoughtId, meToo }, { visitor, admin }) => {
    const { data, error } = await admin.rpc("cast_thought_vote", {
      p_thought: thoughtId,
      p_visitor: visitor.id,
      p_me_too: meToo,
    });
    if (error) {
      if (error.code === "P0002") throw new ActionError("not_found", "This thought is no longer available.");
      if (error.code === "42501") throw new ActionError("forbidden", "You can't vote on your own thought.");
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

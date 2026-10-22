"use server";

import { z } from "zod";
import { textLimits } from "@/config/limits";
import { questionCategories } from "@/config/questions";
import { createAction } from "@/lib/server/action";
import { logModeration, screenContent } from "@/lib/server/content";
import { ActionError, ok } from "@/lib/server/errors";
import { cleanText, textField } from "@/lib/text";
import { toAnswer, type Answer } from "@/lib/data/questions";
import type { AdminClient } from "@/lib/supabase/admin";

const categoryValues = questionCategories.map((c) => c.value) as [
  (typeof questionCategories)[number]["value"],
  ...(typeof questionCategories)[number]["value"][],
];

async function requirePublishedQuestion(admin: AdminClient, id: string) {
  const { data, error } = await admin
    .from("questions")
    .select("id, author_id, helped_answer_id")
    .eq("id", id)
    .eq("status", "published")
    .maybeSingle();
  if (error) throw error;
  if (!data) throw new ActionError("not_found", "This question is no longer available.");
  return data;
}

export const createQuestion = createAction({
  schema: z.object({
    title: textField(textLimits.questionTitle, "Your question"),
    body: z
      .string()
      .optional()
      .transform((v) => cleanText(v ?? ""))
      .pipe(z.string().max(textLimits.questionBody.max, `Details can be at most ${textLimits.questionBody.max} characters.`)),
    category: z.enum(categoryValues).default("other"),
  }),
  rateLimit: "createQuestion",
  handler: async ({ title, body, category }, { visitor, admin }) => {
    const screened = await screenContent(body ? `${title}\n\n${body}` : title, "question");
    const { data, error } = await admin
      .from("questions")
      .insert({ author_id: visitor.id, title, body, category, status: screened.status })
      .select("id")
      .single();
    if (error) throw error;
    await logModeration(admin, { kind: "question", id: data.id, visitorId: visitor.id }, screened.result);
    return ok({ id: data.id }, screened.held);
  },
});

export const addAnswer = createAction({
  schema: z.object({
    questionId: z.uuid(),
    body: textField(textLimits.answer, "Your answer"),
  }),
  rateLimit: "createAnswer",
  handler: async ({ questionId, body }, { visitor, admin }) => {
    await requirePublishedQuestion(admin, questionId);
    const screened = await screenContent(body, "answer");
    const { data, error } = await admin
      .from("answers")
      .insert({ question_id: questionId, author_id: visitor.id, body, status: screened.status })
      .select("id, body, created_at")
      .single();
    if (error) throw error;
    await logModeration(admin, { kind: "answer", id: data.id, visitorId: visitor.id }, screened.result);
    const answer: Answer = toAnswer({
      id: data.id,
      body: data.body,
      created_at: data.created_at,
      helpful_count: 0,
      voted: false,
      is_mine: true,
      helped_asker: false,
    });
    return ok({ answer, published: screened.status === "published" }, screened.held);
  },
});

/** Toggles "helpful" on someone else's answer. */
export const toggleHelpful = createAction({
  schema: z.object({ answerId: z.uuid() }),
  rateLimit: "voteAnswer",
  handler: async ({ answerId }, { visitor, admin }) => {
    const { data: answer, error: findError } = await admin
      .from("answers")
      .select("id, author_id")
      .eq("id", answerId)
      .eq("status", "published")
      .maybeSingle();
    if (findError) throw findError;
    if (!answer) throw new ActionError("not_found", "This answer is no longer available.");
    if (answer.author_id === visitor.id) throw new ActionError("forbidden", "You can't vote on your own answer.");

    const key = { answer_id: answerId, visitor_id: visitor.id };
    const { count, error: deleteError } = await admin.from("answer_votes").delete({ count: "exact" }).match(key);
    if (deleteError) throw deleteError;
    if (!count) {
      const { error } = await admin.from("answer_votes").upsert(key, { ignoreDuplicates: true });
      if (error) throw error;
    }
    const { data, error } = await admin.from("answers").select("helpful_count").eq("id", answerId).single();
    if (error) throw error;
    return ok({ helpfulCount: data.helpful_count, voted: !count });
  },
});

/** The asker marks (or unmarks) the answer that helped them. */
export const markHelped = createAction({
  schema: z.object({ questionId: z.uuid(), answerId: z.uuid() }),
  rateLimit: "markHelpful",
  handler: async ({ questionId, answerId }, { visitor, admin }) => {
    const question = await requirePublishedQuestion(admin, questionId);
    if (question.author_id !== visitor.id) {
      throw new ActionError("forbidden", "Only the person who asked can mark an answer as helpful.");
    }
    const { data: answer, error: findError } = await admin
      .from("answers")
      .select("id")
      .eq("id", answerId)
      .eq("question_id", questionId)
      .eq("status", "published")
      .maybeSingle();
    if (findError) throw findError;
    if (!answer) throw new ActionError("not_found", "This answer is no longer available.");

    const helpedAnswerId = question.helped_answer_id === answerId ? null : answerId;
    const { error } = await admin.from("questions").update({ helped_answer_id: helpedAnswerId }).eq("id", questionId);
    if (error) throw error;
    return ok({ helpedAnswerId });
  },
});

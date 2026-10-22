import "server-only";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { QuestionCategory, QuestionSort } from "@/config/questions";
import { toAnswer, toQuestion, type Answer, type Question } from "./questions";

/* Server-side reads through the visitor's own session, like thoughts.server.ts. */

export const QUESTION_PAGE_SIZE = 20;

async function db() {
  await connection();
  return isSupabaseConfigured ? createClient() : null;
}

export async function getQuestionFeed(opts: {
  sort: QuestionSort;
  category?: QuestionCategory;
  query?: string;
  offset?: number;
}): Promise<Question[]> {
  const supabase = await db();
  if (!supabase) return [];
  const { data, error } = await supabase.rpc("get_question_feed", {
    p_sort: opts.sort,
    p_category: opts.category,
    p_query: opts.query,
    p_limit: QUESTION_PAGE_SIZE,
    p_offset: opts.offset ?? 0,
  });
  if (error) throw error;
  return data.map(toQuestion);
}

export async function getQuestion(id: string): Promise<Question | null> {
  const supabase = await db();
  if (!supabase) return null;
  const { data, error } = await supabase.rpc("get_question", { p_id: id });
  if (error) throw error;
  return data[0] ? toQuestion(data[0]) : null;
}

export async function getAnswers(questionId: string): Promise<Answer[]> {
  const supabase = await db();
  if (!supabase) return [];
  const { data, error } = await supabase.rpc("get_answers", { p_question: questionId });
  if (error) throw error;
  return data.map(toAnswer);
}

export async function getMyQuestions(): Promise<Question[]> {
  const supabase = await db();
  if (!supabase) return [];
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims) return [];
  const { data, error } = await supabase.rpc("get_my_questions");
  if (error) throw error;
  return data.map(toQuestion);
}

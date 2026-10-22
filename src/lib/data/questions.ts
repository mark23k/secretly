import type { Database } from "@/lib/supabase/database.types";
import type { QuestionCategory } from "@/config/questions";

type QuestionViewRow = Database["public"]["CompositeTypes"]["question_view"];
type AnswerViewRow = Database["public"]["CompositeTypes"]["answer_view"];

export type Question = {
  id: string;
  title: string;
  body: string;
  category: QuestionCategory;
  status: Database["public"]["Enums"]["content_status"];
  createdAt: string;
  answerCount: number;
  helpedAnswerId: string | null;
  isMine: boolean;
};

export type Answer = {
  id: string;
  body: string;
  createdAt: string;
  helpfulCount: number;
  voted: boolean;
  isMine: boolean;
  helpedAsker: boolean;
};

export type SimilarQuestion = { id: string; title: string; answerCount: number; helped: boolean };

export function toQuestion(row: QuestionViewRow): Question {
  return {
    id: row.id!,
    title: row.title!,
    body: row.body ?? "",
    category: row.category!,
    status: row.status!,
    createdAt: row.created_at!,
    answerCount: row.answer_count ?? 0,
    helpedAnswerId: row.helped_answer_id,
    isMine: row.is_mine ?? false,
  };
}

export function toAnswer(row: AnswerViewRow): Answer {
  return {
    id: row.id!,
    body: row.body!,
    createdAt: row.created_at!,
    helpfulCount: row.helpful_count ?? 0,
    voted: row.voted ?? false,
    isMine: row.is_mine ?? false,
    helpedAsker: row.helped_asker ?? false,
  };
}

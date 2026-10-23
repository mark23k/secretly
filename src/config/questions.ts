import type { Database } from "@/lib/supabase/database.types";

export type QuestionCategory = Database["public"]["Enums"]["question_category"];

export const questionCategories: { value: QuestionCategory; label: string }[] = [
  { value: "relationships", label: "Love & dating" },
  { value: "body", label: "Body & health" },
  { value: "money", label: "Money" },
  { value: "social", label: "Social rules" },
  { value: "behavior", label: "Is this normal?" },
  { value: "family", label: "Family" },
  { value: "work", label: "Work & school" },
  { value: "religion", label: "Faith & beliefs" },
  { value: "other", label: "Other" },
  { value: "after_dark", label: "After Dark" },
];

export const questionCategoryLabel = Object.fromEntries(
  questionCategories.map((c) => [c.value, c.label])
) as Record<QuestionCategory, string>;

export const questionSorts = [
  { value: "newest", label: "Newest" },
  { value: "top", label: "Most answered" },
  { value: "unanswered", label: "Needs an answer" },
] as const;

export type QuestionSort = (typeof questionSorts)[number]["value"];

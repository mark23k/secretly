import type { Database } from "@/lib/supabase/database.types";
import { DEFAULT_THOUGHT_OPTIONS, type ReactionKey, type ThoughtCategory } from "@/config/thoughts";

type ThoughtViewRow = Database["public"]["CompositeTypes"]["thought_view"];

export type Thought = {
  id: string;
  body: string;
  category: ThoughtCategory;
  status: Database["public"]["Enums"]["content_status"];
  createdAt: string;
  commentCount: number;
  reactionCounts: Partial<Record<ReactionKey, number>>;
  myReactions: ReactionKey[];
  isMine: boolean;
  /** The answers to choose from: the author's own, or "Me too" / "Not me". */
  options: string[];
  /** Index into options; null = hasn't voted. */
  myChoice: number | null;
  /** Votes per option; null until the viewer has voted (or is the author). */
  result: number[] | null;
};

export type ThoughtComment = { id: string; body: string; createdAt: string };

/** Maps the `thought_view` composite returned by the read functions. */
export function toThought(row: ThoughtViewRow): Thought {
  return {
    id: row.id!,
    body: row.body!,
    category: row.category!,
    status: row.status!,
    createdAt: row.created_at!,
    commentCount: row.comment_count ?? 0,
    reactionCounts: (row.reaction_counts ?? {}) as Thought["reactionCounts"],
    myReactions: (row.my_reactions ?? []) as ReactionKey[],
    isMine: row.is_mine ?? false,
    options: row.options ?? [...DEFAULT_THOUGHT_OPTIONS],
    myChoice: row.my_choice,
    result: row.counts ?? null,
  };
}

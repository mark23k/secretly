import type { Database } from "@/lib/supabase/database.types";
import type { ReactionKey, ThoughtCategory } from "@/config/thoughts";

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
  /** null = hasn't voted */
  myVote: boolean | null;
  /** null until the viewer has voted (or is the author) */
  result: { meToo: number; notMe: number } | null;
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
    myVote: row.my_vote,
    result: row.me_too === null || row.not_me === null ? null : { meToo: row.me_too, notMe: row.not_me },
  };
}

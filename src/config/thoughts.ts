import type { Database } from "@/lib/supabase/database.types";

export type ThoughtCategory = Database["public"]["Enums"]["thought_category"];

/** The answers a thought gets unless its author writes their own (2 to 4). */
export const DEFAULT_THOUGHT_OPTIONS = ["Me too", "Not me"] as const;
export const thoughtOptionLimits = { min: 2, max: 4, maxLength: 40 } as const;

export const thoughtCategories: { value: ThoughtCategory; label: string }[] = [
  { value: "relationships", label: "Relationships" },
  { value: "work", label: "Work & school" },
  { value: "social", label: "Social" },
  { value: "habits", label: "Habits" },
  { value: "feelings", label: "Feelings" },
  { value: "body", label: "Body" },
  { value: "other", label: "Other" },
  { value: "after_dark", label: "After Dark" },
];

export const thoughtCategoryLabel = Object.fromEntries(
  thoughtCategories.map((c) => [c.value, c.label])
) as Record<ThoughtCategory, string>;

export const reactions = [
  { key: "heart", emoji: "❤️", label: "Love this" },
  { key: "hug", emoji: "🫂", label: "Sending a hug" },
  { key: "wow", emoji: "😮", label: "Didn't expect that" },
  { key: "laugh", emoji: "😂", label: "Ha, relatable" },
  { key: "sad", emoji: "😢", label: "That's heavy" },
] as const;

export type ReactionKey = (typeof reactions)[number]["key"];
export const reactionKeys = reactions.map((r) => r.key) as [ReactionKey, ...ReactionKey[]];

export const thoughtSorts = [
  { value: "trending", label: "Trending" },
  { value: "newest", label: "Newest" },
  { value: "relatable", label: "Most relatable" },
] as const;

export type ThoughtSort = (typeof thoughtSorts)[number]["value"];

export const onlyOneViews = [
  { href: "/only-one", label: "One at a time", value: "deck" },
  { href: "/only-one/browse", label: "Browse all", value: "browse" },
];

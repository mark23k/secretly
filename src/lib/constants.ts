// Shared constants, safe to import from both server and client components.

export const CATEGORIES = [
  { slug: "travel", emoji: "✈️", name: "Travel & Planes" },
  { slug: "office", emoji: "🏢", name: "Office" },
  { slug: "home", emoji: "🏠", name: "Home & Roommates" },
  { slug: "shopping", emoji: "🛒", name: "Shopping" },
  { slug: "food", emoji: "🍽️", name: "Food & Restaurants" },
  { slug: "transport", emoji: "🚌", name: "Public Transport" },
  { slug: "events", emoji: "🎬", name: "Movies & Events" },
  { slug: "online", emoji: "📱", name: "Phones & Online" },
  { slug: "social", emoji: "👥", name: "Social Life" },
  { slug: "other", emoji: "🤷", name: "Other" },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]["slug"];

export function getCategory(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug);
}

export const VERDICTS = [
  { key: "fine", label: "Totally fine", emoji: "👍", color: "bg-mint-400", text: "text-mint-700", soft: "bg-mint-100" },
  { key: "depends", label: "Depends", emoji: "🤔", color: "bg-peach-400", text: "text-peach-700", soft: "bg-peach-100" },
  { key: "dont", label: "Please don't", emoji: "🙅", color: "bg-rose-400", text: "text-rose-700", soft: "bg-rose-100" },
] as const;

export type VerdictKey = (typeof VERDICTS)[number]["key"];

export function getVerdict(key: string) {
  return VERDICTS.find((v) => v.key === key) ?? VERDICTS[1];
}

export const LIMITS = {
  title: 150,
  description: 500,
  answer: 1000,
  reply: 500,
  postsPerHour: 10,
  passwordMin: 8,
};

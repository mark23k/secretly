export const siteConfig = {
  name: "Secretly",
  tagline: "Say the thing you'd never say out loud.",
  description:
    "A calm, anonymous space to share the thoughts, questions and secrets you'd never say out loud. No names. No profiles. Just people.",
  // Netlify sets URL to the site's main address.
  url: process.env.NEXT_PUBLIC_SITE_URL || process.env.URL || "http://localhost:3000",
} as const;

export type FeatureKey = "only-one" | "ask" | "exchange";

export const features: Record<
  FeatureKey,
  { href: string; navLabel: string; title: string; pitch: string; cta: string }
> = {
  "only-one": {
    href: "/only-one",
    navLabel: "Only one?",
    title: "Am I the only one?",
    pitch:
      "Share a thought you've never admitted. See how many strangers quietly feel the same.",
    cta: "Find out",
  },
  ask: {
    href: "/ask",
    navLabel: "Ask",
    title: "The question you can't ask",
    pitch:
      "Ask what you're too embarrassed to ask anyone. Get honest answers from people who've been there.",
    cta: "Ask anonymously",
  },
  exchange: {
    href: "/exchange",
    navLabel: "Exchange",
    title: "The secret exchange",
    pitch:
      "Give a secret, get a stranger's secret back. Three a day. Nobody will ever know it was you.",
    cta: "Trade a secret",
  },
};

export const legalLinks = [
  { href: "/guidelines", label: "Community guidelines" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/support", label: "Need support?" },
] as const;

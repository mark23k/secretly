export const siteConfig = {
  name: "Secretly",
  tagline: "Say the thing you'd never say out loud.",
  description:
    "A calm, anonymous space to share the thoughts, questions and secrets you'd never say out loud. No names. No profiles. Just people.",
  // Netlify sets URL to the site's main address.
  url: process.env.NEXT_PUBLIC_SITE_URL || process.env.URL || "http://localhost:3000",
  /** Shown on the Privacy, Terms and Guidelines pages. Leave empty to hide. */
  contactEmail: "",
  /** Date shown on the legal pages; update it when you change them. */
  legalUpdated: "October 23, 2026",
} as const;

export type FeatureKey = "only-one" | "ask" | "exchange" | "after-dark";

export const features: Record<
  FeatureKey,
  { href: string; navLabel: string; title: string; pitch: string; cta: string }
> = {
  "only-one": {
    href: "/only-one",
    navLabel: "Only one?",
    title: "Am I the only one?",
    pitch: "Confess the thing you've never admitted. Then see how many strangers secretly do it too.",
    cta: "Confess something",
  },
  ask: {
    href: "/ask",
    navLabel: "Ask",
    title: "The question you can't ask",
    pitch:
      "The awkward one. The embarrassing one. Ask it here and get honest answers from people who've been there.",
    cta: "Ask the awkward one",
  },
  exchange: {
    href: "/exchange",
    navLabel: "Exchange",
    title: "The secret exchange",
    pitch: "Give a secret, get a stranger's secret back. Three a day. Make them count.",
    cta: "Peek at a stranger's secret",
  },
  "after-dark": {
    href: "/after-dark",
    navLabel: "After Dark",
    title: "After Dark",
    pitch: "The questions people only ask at 2am. Dating, sex and relationships. 18+.",
    cta: "Step inside",
  },
};

export const legalLinks = [
  { href: "/guidelines", label: "Community guidelines" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/support", label: "Need support?" },
] as const;

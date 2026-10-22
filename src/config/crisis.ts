/**
 * Crisis and support resources shown when content suggests someone may be
 * at risk. Edit or localize here; nothing else needs to change.
 */
export type CrisisResource = {
  name: string;
  description: string;
  /** Human-readable contact, e.g. "Call or text 988". */
  contact: string;
  href: string;
};

export const crisisCopy = {
  title: "You don't have to carry this alone",
  body: "It sounds like you might be going through something really heavy. We've held your post so a real person can look at it. In the meantime, these people are kind, free, and available right now.",
  emergency: "If you're in immediate danger, please call your local emergency number (911 in the US).",
  aboutSomeoneElse:
    "If you were writing about someone else, these services can help you support them too.",
} as const;

export const crisisResources: CrisisResource[] = [
  {
    name: "988 Suicide & Crisis Lifeline",
    description: "Free, confidential support 24/7 in the US.",
    contact: "Call or text 988",
    href: "https://988lifeline.org",
  },
  {
    name: "Crisis Text Line",
    description: "Text with a trained crisis counselor, 24/7.",
    contact: "Text HOME to 741741",
    href: "https://www.crisistextline.org",
  },
  {
    name: "Find a Helpline",
    description: "Free, confidential helplines in 130+ countries.",
    contact: "findahelpline.com",
    href: "https://findahelpline.com",
  },
  {
    name: "The Trevor Project",
    description: "For LGBTQ+ young people, 24/7.",
    contact: "Call 1-866-488-7386 or text START to 678-678",
    href: "https://www.thetrevorproject.org",
  },
];

/**
 * Lightweight word filter. Patterns run against foldForMatching() output
 * (lowercase, no punctuation or apostrophes, leetspeak undone).
 *
 * This is intentionally conservative: obvious slurs, threats and harassment.
 * Ambiguous content is left to community reports and the review queue.
 */

export type WordFilterCategory = "slur" | "harassment" | "threat" | "sexual_minors" | "sexual_solicitation";

const rules: { category: WordFilterCategory; pattern: RegExp }[] = [
  {
    category: "slur",
    pattern:
      /\b(?:nigg(?:er|a|ah|az)s?|niggers?|faggots?|fags?|retards?|retarded|trann(?:y|ies)|chinks?|spics?|kikes?|wetbacks?|gooks?|ragheads?|towelheads?|beaners?|coons?|sandniggers?)\b/,
  },
  {
    category: "harassment",
    pattern:
      /\b(?:kys|kill your ?self|neck your ?self|go die|hope you die|you should die|drink bleach|nobody (?:likes|loves|cares about|wants) you|no one (?:likes|loves|cares about|wants) you)\b/,
  },
  {
    category: "harassment",
    pattern:
      /\byou(?: are|re|r| r)? (?:(?:such|so|a|an|such a|fucking|fuckin|absolute|total) )*(?:idiot|moron|loser|pathetic|ugly|fat|stupid|disgusting|worthless|freak|creep|bitch|whore|slut|cunt|psycho|garbage|trash|waste of space)\b/,
  },
  {
    category: "threat",
    pattern: /\bi(?: will|ll| am going to|m going to|m gonna| gonna| want to| wanna) (?:kill|hurt|stab|shoot|find|rape) you\b/,
  },
  {
    category: "sexual_minors",
    pattern: /\b(?:child|kid|underage|minor|preteen|teen) ?(?:porn|nudes?|sex pics?)\b|\bloli\b|\bpedo(?:phile)?s?\b/,
  },
  {
    category: "sexual_solicitation",
    pattern: /\b(?:send (?:me )?(?:nudes|pics|noods)|dick pics?|show me your (?:body|tits|boobs))\b/,
  },
];

export function findFilteredWords(folded: string): WordFilterCategory[] {
  return [...new Set(rules.filter((r) => r.pattern.test(folded)).map((r) => r.category))];
}

const LEET: Record<string, string> = {
  "0": "o",
  "1": "i",
  "3": "e",
  "4": "a",
  "5": "s",
  "7": "t",
  "@": "a",
  $: "s",
  "!": "i",
};

/**
 * Folds text into a canonical form for pattern matching: lowercase, no
 * accents, common leetspeak undone, apostrophes dropped ("don't" -> "dont"),
 * punctuation turned into spaces and stretched letters squashed ("sooo" -> "so").
 */
export function foldForMatching(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[013457@$!]/g, (c) => LEET[c] ?? c)
    .replace(/['’`]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/([a-z])\1{2,}/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

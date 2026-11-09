// A small bad-word filter. It blocks slurs and the harshest insults; mild
// words like "damn" are allowed. Add words to BLOCKED as needed.
const BLOCKED = [
  "fuck", "fucking", "motherfucker", "shit", "bitch", "cunt", "asshole", "bastard",
  "dick", "pussy", "whore", "slut", "retard", "retarded", "faggot", "fag", "nigger",
  "nigga", "kike", "spic", "chink", "tranny", "kys",
];

function normalize(text: string) {
  return text
    .toLowerCase()
    .replace(/[0@]/g, "o")
    .replace(/[1!|]/g, "i")
    .replace(/3/g, "e")
    .replace(/4/g, "a")
    .replace(/[5$]/g, "s")
    .replace(/7/g, "t");
}

const pattern = new RegExp(`\\b(${BLOCKED.join("|")})s?\\b`, "i");

export function containsBadWords(...texts: (string | null | undefined)[]) {
  return texts.some((t) => t && pattern.test(normalize(t)));
}

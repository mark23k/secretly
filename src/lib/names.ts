import { createHash } from "node:crypto";

const ADJECTIVES = [
  "Quiet", "Sneaky", "Sleepy", "Polite", "Curious", "Fluffy", "Bashful", "Cheeky",
  "Gentle", "Fuzzy", "Tiny", "Brave", "Shy", "Wobbly", "Cozy", "Giggly", "Humble",
  "Jolly", "Mellow", "Nosy", "Peppy", "Snuggly", "Sunny", "Thoughtful", "Whispering",
  "Dreamy", "Grumpy", "Honest", "Lucky", "Merry", "Prickly", "Rosy", "Sassy", "Witty",
];

const NOUNS = [
  "Penguin", "Teapot", "Otter", "Pancake", "Hedgehog", "Dumpling", "Koala", "Muffin",
  "Panda", "Pickle", "Raccoon", "Biscuit", "Sloth", "Noodle", "Owl", "Croissant",
  "Fox", "Marshmallow", "Hamster", "Waffle", "Duckling", "Bumblebee", "Turtle",
  "Cupcake", "Llama", "Pebble", "Kitten", "Bagel", "Seal", "Acorn", "Frog", "Toast",
];

/**
 * A cute anonymous name that stays the same for one person inside one
 * question thread, but is different in every other thread.
 */
export function anonName(userId: string, questionId: string) {
  const secret = process.env.SESSION_SECRET ?? "dev-secret";
  const hash = createHash("sha256").update(`${secret}:${userId}:${questionId}`).digest();
  const adjective = ADJECTIVES[hash.readUInt16BE(0) % ADJECTIVES.length];
  const noun = NOUNS[hash.readUInt16BE(2) % NOUNS.length];
  return `${adjective} ${noun}`;
}

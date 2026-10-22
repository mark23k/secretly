import { describe, expect, it } from "vitest";
import { moderate } from "./index";
import { findPii } from "./pii";
import { cleanText } from "@/lib/text";

describe("findPii", () => {
  it.each([
    ["email me at jane.doe@gmail.com", "email"],
    ["jane (at) gmail (dot) com", "email"],
    ["call 555-123-4567 tonight", "phone"],
    ["+44 7700 900123", "phone"],
    ["see https://example.com/me", "url"],
    ["my blog is janedoe.com", "url"],
    ["follow @jane_doe", "handle"],
    ["snap: jane_d22", "contact"],
  ])("flags %s", (text, kind) => {
    expect(findPii(text).map((f) => f.kind)).toContain(kind);
  });

  it.each([
    "I was 25 in 2019 and it changed everything",
    "Between 2019 2020 2021 I moved three times",
    "I spend $1,200 a month on food",
    "We met at a party",
    "I'm 5'4 and 130 lbs",
    "I deleted instagram and feel better",
  ])("does not flag ordinary text: %s", (text) => {
    expect(findPii(text)).toEqual([]);
  });

  it("strict mode flags contact requests", () => {
    expect(findPii("dm me if you want to talk", { strict: true })).not.toEqual([]);
    expect(findPii("dm me if you want to talk")).toEqual([]);
  });
});

describe("moderate", () => {
  it("publishes ordinary content", async () => {
    const r = await moderate(
      "Sometimes I pretend I didn't see someone's message because I don't have the energy to reply.",
      "thought"
    );
    expect(r.action).toBe("publish");
  });

  it("rejects personal info with a helpful message", async () => {
    const r = await moderate("text me 555 123 4567", "thought");
    expect(r.action).toBe("reject");
    if (r.action === "reject") expect(r.message).toMatch(/phone number/);
  });

  it.each([
    "I've been thinking about killing myself lately",
    "sometimes I feel everyone would be better off without me",
    "I don't want to wake up anymore",
    "su1c1dal thoughts every night",
    "I've been cutting myself again",
  ])("routes self-harm to crisis: %s", async (text) => {
    expect((await moderate(text, "secret")).action).toBe("crisis");
  });

  it.each([
    "I wanted to die of embarrassment when he saw me",
    "This movie killed me, I was dying laughing",
  ])("does not treat idioms as crisis: %s", async (text) => {
    expect((await moderate(text, "thought")).action).toBe("publish");
  });

  it("holds slurs for review in posts but rejects them in replies", async () => {
    expect((await moderate("those people are such retards", "thought")).action).toBe("review");
    expect((await moderate("you're a retard", "secret_reply")).action).toBe("reject");
  });

  it("rejects harassment and contact requests in replies", async () => {
    expect((await moderate("kys honestly", "secret_reply")).action).toBe("reject");
    expect((await moderate("you are so pathetic", "secret_reply")).action).toBe("reject");
    expect((await moderate("hmu if you want to talk", "secret_reply")).action).toBe("reject");
  });

  it("allows kind replies", async () => {
    const r = await moderate("I feel this so much. You're not alone, I promise.", "secret_reply");
    expect(r.action).toBe("publish");
  });

  it("does not trip on words containing slurs (Scunthorpe)", async () => {
    expect((await moderate("A raccoon raided our trash last night", "thought")).action).toBe("publish");
    expect((await moderate("My Spicy food obsession is getting out of hand", "thought")).action).toBe("publish");
  });
});

describe("cleanText", () => {
  it("normalizes whitespace and strips invisible characters", () => {
    expect(cleanText("  hello​   world \n\n\n\n next ")).toBe("hello world\n\nnext");
  });
});

// Fills the database with example questions so the site isn't empty.
// Run with: npm run db:seed   (safe to re-run: it replaces the old examples)
import "dotenv/config";
import { randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";

const url = process.env.DATABASE_URL!;
async function makeClient() {
  if (url.startsWith("file:")) {
    const { PrismaBetterSqlite3 } = await import("@prisma/adapter-better-sqlite3");
    return new PrismaClient({ adapter: new PrismaBetterSqlite3({ url }) });
  }
  const { PrismaPg } = await import("@prisma/adapter-pg");
  return new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) });
}

type V = "fine" | "depends" | "dont";
type SeedAnswer = { v: V; text: string; likes?: number; replies?: string[] };
type SeedQuestion = { title: string; description?: string; category: string; guilty: number; answers: SeedAnswer[] };

const QUESTIONS: SeedQuestion[] = [
  {
    title: "Is it rude to eat tuna on a plane?",
    description: "Packed a tuna sandwich for a 5-hour flight. The guy next to me sighed when I opened it. Was I wrong?",
    category: "travel",
    guilty: 14,
    answers: [
      { v: "dont", text: "Recycled air + fish = everyone suffers for 5 hours. Save the tuna for the terminal.", likes: 21, replies: ["The sigh was justified tbh", "Same goes for hard-boiled eggs!!"] },
      { v: "dont", text: "Anything you can smell three rows away is a no on a plane. Tuna, eggs, durian.", likes: 12 },
      { v: "depends", text: "If it's a quick snack and you eat it fast, fine. If you're slowly savoring it for an hour… no.", likes: 6 },
      { v: "fine", text: "Airline food is terrible and expensive. People need to eat. A sandwich is a sandwich.", likes: 4, replies: ["Bring a turkey sandwich then 😅"] },
      { v: "dont", text: "I once sat next to someone eating tuna AND onions. I still think about it.", likes: 9 },
    ],
  },
  {
    title: "Should you ask before reclining your seat?",
    description: "Economy, overnight flight. I reclined without asking and the person behind me kicked my seat for an hour.",
    category: "travel",
    guilty: 31,
    answers: [
      { v: "fine", text: "The button is there for a reason. You paid for the seat including the recline.", likes: 17, replies: ["Overnight flight especially. Everyone's sleeping.", "Kicking the seat is way ruder than reclining"] },
      { v: "depends", text: "Overnight: recline away. Short daytime flight during meal service: please wait.", likes: 24 },
      { v: "depends", text: "Do it slowly! The sudden slam into someone's knees is the real crime.", likes: 19, replies: ["THIS. Slow recline is the move."] },
      { v: "dont", text: "I'm 6'4\". Every recline is a personal attack on my knees.", likes: 8 },
    ],
  },
  {
    title: "Is clapping when the plane lands embarrassing?",
    category: "travel",
    guilty: 22,
    answers: [
      { v: "fine", text: "Let people be happy! It's a little thank-you to the pilot.", likes: 11 },
      { v: "dont", text: "The pilot can't hear you. Nobody claps when the bus driver parks.", likes: 15, replies: ["Okay but now I want to clap for bus drivers"] },
      { v: "depends", text: "Rough landing in a storm? Clap. Normal Tuesday flight? Maybe not.", likes: 20 },
      { v: "fine", text: "It's tradition on flights to my parents' home country. It makes me smile every time.", likes: 13 },
    ],
  },
  {
    title: "Is it okay to take a call on speakerphone on the bus?",
    description: "Lady next to me had a full FaceTime with her sister on speaker. Twenty minutes. I know everything about the sister now.",
    category: "transport",
    guilty: 3,
    answers: [
      { v: "dont", text: "Headphones exist. They cost $5. There is no excuse.", likes: 32, replies: ["Some people genuinely don't own them though", "Then hold the phone to your ear like it's 2005"] },
      { v: "dont", text: "Speakerphone in public should be illegal. Videos with sound too.", likes: 18 },
      { v: "depends", text: "Quick 30-second 'I'm on the bus, call you later' is fine. Full conversations are not.", likes: 10 },
    ],
  },
  {
    title: "Should you thank the bus driver when you get off?",
    category: "transport",
    guilty: 40,
    answers: [
      { v: "fine", text: "Always! It costs nothing and they deal with so much.", likes: 26 },
      { v: "fine", text: "In my city everyone does it, and it makes the whole bus feel nicer.", likes: 14, replies: ["Which city? I want to move there"] },
      { v: "depends", text: "Back door on a crowded bus? Nobody hears you. Front door? Yes, always.", likes: 9 },
      { v: "fine", text: "A driver told me once it's the best part of their day. So yes.", likes: 22 },
    ],
  },
  {
    title: "Can you put the milk back with only one sip left?",
    description: "My roommate does this constantly. A carton with literally one sip in it, back in the fridge.",
    category: "home",
    guilty: 27,
    answers: [
      { v: "dont", text: "This is a crime against roommates. Finish it or throw it away.", likes: 29, replies: ["Same with the empty cereal box", "And the ice cube tray with one cube!!"] },
      { v: "dont", text: "One sip is not 'milk left'. It's a trap.", likes: 16 },
      { v: "depends", text: "If it's enough for one coffee, it counts. One sip? Nope.", likes: 7 },
      { v: "fine", text: "Okay I do this but it's because I feel guilty finishing it without buying more 😬", likes: 5, replies: ["The guilt doesn't help anyone, just buy milk 😂"] },
    ],
  },
  {
    title: "Is it okay to heat up fish in the office microwave?",
    description: "New coworker reheated salmon at lunch. The whole floor smelled it. Is there an unwritten rule here?",
    category: "office",
    guilty: 9,
    answers: [
      { v: "dont", text: "The #1 rule of office kitchens. Fish, broccoli and popcorn are banned forever.", likes: 34, replies: ["Popcorn too?? Burnt popcorn, sure, but regular popcorn??", "Burnt popcorn is the worst smell on earth"] },
      { v: "dont", text: "Eat it cold or eat it at home. The smell lingers ALL afternoon.", likes: 12 },
      { v: "depends", text: "Someone should just tell them kindly. They probably don't know it's a thing.", likes: 15 },
      { v: "fine", text: "People bring all kinds of food. I'd rather a smelly kitchen than judging what people eat.", likes: 6 },
    ],
  },
  {
    title: "Do you have to reply 'you too' in the work group chat birthday thread?",
    description: "Someone posts 'Happy birthday!' and then 40 people reply the same thing. Do I have to join?",
    category: "office",
    guilty: 18,
    answers: [
      { v: "fine", text: "Skipping it is totally fine. Just react with an emoji and move on.", likes: 13 },
      { v: "depends", text: "If it's your team or your boss, write something. If it's the whole company, an emoji is plenty.", likes: 19 },
      { v: "fine", text: "The birthday person won't notice who didn't reply. Promise.", likes: 8, replies: ["I noticed once and I'm still a little hurt 🥲"] },
    ],
  },
  {
    title: "Is it rude to leave your cart next to your car instead of returning it?",
    category: "shopping",
    guilty: 12,
    answers: [
      { v: "dont", text: "The cart test! Returning it is the purest test of character. No reward, no punishment.", likes: 27, replies: ["The shopping cart theory is so real"] },
      { v: "depends", text: "If you have a baby in the car and it's pouring rain, you're forgiven.", likes: 21 },
      { v: "dont", text: "Those carts roll into cars. Mine got dented by one.", likes: 10 },
      { v: "fine", text: "Stores literally employ people to collect them. It's not that deep.", likes: 3, replies: ["They're there to collect from the return spots, not the whole lot 😅"] },
    ],
  },
  {
    title: "Can you eat grapes in the supermarket before paying?",
    category: "shopping",
    guilty: 23,
    answers: [
      { v: "dont", text: "That's technically stealing, even if it's one grape.", likes: 14 },
      { v: "depends", text: "One grape to taste if they're sweet? Fine. A handful? You're eating lunch for free.", likes: 22 },
      { v: "fine", text: "My grandma did this my whole childhood and nobody ever said anything.", likes: 9, replies: ["Grandmas are exempt from all rules"] },
    ],
  },
  {
    title: "How much should you tip at a coffee shop when the iPad asks?",
    description: "Ordered a plain drip coffee and the screen suggested 20%, 25%, 30%. I hit 'No tip' and felt awful.",
    category: "food",
    guilty: 35,
    answers: [
      { v: "fine", text: "No tip on a plain drip coffee is fine. Tipping for counter service is optional.", likes: 18 },
      { v: "depends", text: "Fancy drink they made by hand? Tip a dollar. Pouring drip coffee? Not required.", likes: 25, replies: ["A dollar per drink is my rule too"] },
      { v: "dont", text: "Baristas earn very little. If you're a regular, please tip something.", likes: 11 },
      { v: "depends", text: "The worst part is when they turn the screen and watch you choose. That's the real problem.", likes: 30 },
    ],
  },
  {
    title: "Is it okay to split the bill evenly when you only had a salad?",
    description: "Group dinner, everyone got steak and cocktails. I had a salad and water. They split it evenly.",
    category: "food",
    guilty: 7,
    answers: [
      { v: "dont", text: "You should only pay for what you had. Speak up before the bill comes.", likes: 20 },
      { v: "depends", text: "If it's a few dollars difference, just split it. If it's $60 vs $15, ask to pay separately.", likes: 28, replies: ["The awkwardness is worth $45"] },
      { v: "fine", text: "With close friends I always split evenly. It evens out over time.", likes: 9 },
    ],
  },
  {
    title: "Is it rude to check your phone during a movie at the cinema?",
    category: "events",
    guilty: 26,
    answers: [
      { v: "dont", text: "The light is SO bright in a dark theater. It pulls everyone out of the movie.", likes: 23 },
      { v: "depends", text: "A two-second glance at the brightness lowest, pointed down? Okay. Scrolling Instagram? No.", likes: 16 },
      { v: "dont", text: "If you need your phone, sit on the end and step out.", likes: 12, replies: ["Unless you're a doctor on call, then you're forgiven"] },
    ],
  },
  {
    title: "Is it weird to leave someone on 'read' for a day?",
    category: "online",
    guilty: 38,
    answers: [
      { v: "fine", text: "People have lives. Turn off read receipts if it stresses you out.", likes: 19 },
      { v: "depends", text: "A meme? Leave it. A real question? A quick 'will reply later' is kind.", likes: 24 },
      { v: "dont", text: "If you have time to post stories, you have time to reply.", likes: 15, replies: ["Ouch, this one hurt 😭", "Posting a story takes 5 seconds, replying to a heavy message doesn't"] },
    ],
  },
  {
    title: "Can you bring a friend to a party you were invited to without asking?",
    category: "social",
    guilty: 11,
    answers: [
      { v: "dont", text: "Always ask the host. It takes one text.", likes: 18 },
      { v: "depends", text: "Big house party? Usually fine. Dinner party? Absolutely not, they planned the food.", likes: 31, replies: ["Dinner party plus-one without asking is chaos"] },
      { v: "fine", text: "In my friend group 'the more the merrier' is the default.", likes: 6 },
    ],
  },
  {
    title: "Is it okay to wear headphones while someone is talking to you at the gym?",
    category: "other",
    guilty: 16,
    answers: [
      { v: "fine", text: "Headphones at the gym are the universal 'please don't talk to me' sign.", likes: 22 },
      { v: "depends", text: "If they're staff or need the machine, take one out. Small talk? Keep them in.", likes: 13 },
      { v: "dont", text: "If someone is actually talking to you, pause the music. It takes one second.", likes: 8 },
    ],
  },
];

const HOUR = 60 * 60 * 1000;
// Never put example activity in the future.
const past = (t: number) => new Date(Math.min(t, Date.now() - 60_000 - Math.random() * HOUR));

async function main() {
  const db = await makeClient();
  // On deploys we run "seed --if-empty" so examples are only added to a brand-new site.
  if (process.argv.includes("--if-empty") && (await db.question.count()) > 0) {
    console.log("Database already has questions; skipping example content.");
    await db.$disconnect();
    return;
  }
  // Remove previous example content (cascades to their posts).
  await db.user.deleteMany({ where: { isSeed: true } });

  const unusable = await bcrypt.hash(randomBytes(24).toString("hex"), 4);
  const users = await Promise.all(
    Array.from({ length: 60 }, (_, i) =>
      db.user.create({ data: { email: `example-${i}@seed.saysecretly.invalid`, passwordHash: unusable, isSeed: true } }),
    ),
  );
  const pick = (n: number, exclude: string[] = []) =>
    users.filter((u) => !exclude.includes(u.id)).sort(() => Math.random() - 0.5).slice(0, n);

  const now = Date.now();
  for (const [i, q] of QUESTIONS.entries()) {
    const asker = pick(1)[0];
    // Spread questions over the last ~12 days, a few very recent ones.
    const askedAt = new Date(now - (i * 17 + 3 + Math.random() * 10) * HOUR);
    const question = await db.question.create({
      data: { title: q.title, description: q.description ?? null, category: q.category, authorId: asker.id, createdAt: askedAt },
    });

    const answerers = pick(q.answers.length, [asker.id]);
    let fine = 0, depends = 0, dont = 0, replyCount = 0;
    for (const [j, a] of q.answers.entries()) {
      const answeredAt = past(askedAt.getTime() + (j + 1) * (0.5 + Math.random() * 3) * HOUR);
      const likers = pick(a.likes ?? 0);
      const answer = await db.answer.create({
        data: {
          questionId: question.id,
          authorId: answerers[j].id,
          verdict: a.v,
          body: a.text,
          createdAt: answeredAt,
          likeCount: likers.length,
          likes: { create: likers.map((u) => ({ userId: u.id })) },
        },
      });
      if (a.v === "fine") fine++;
      else if (a.v === "depends") depends++;
      else dont++;
      for (const [k, text] of (a.replies ?? []).entries()) {
        // Sometimes the asker replies, so the "asker" badge shows up.
        const author = k === 0 && j % 2 === 0 ? asker : pick(1, [answerers[j].id])[0];
        await db.reply.create({
          data: {
            answerId: answer.id,
            questionId: question.id,
            authorId: author.id,
            body: text,
            createdAt: past(answeredAt.getTime() + (k + 1) * HOUR),
          },
        });
        replyCount++;
      }
    }
    const guilty = pick(q.guilty);
    await db.guilty.createMany({
      data: guilty.map((u) => ({ userId: u.id, questionId: question.id, createdAt: past(askedAt.getTime() + Math.random() * 48 * HOUR) })),
    });
    await db.question.update({
      where: { id: question.id },
      data: { answerCount: q.answers.length, replyCount, guiltyCount: guilty.length, fineCount: fine, dependsCount: depends, dontCount: dont },
    });
  }
  console.log(`Seeded ${QUESTIONS.length} example questions.`);
  await db.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

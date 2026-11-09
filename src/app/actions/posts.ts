"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { containsBadWords } from "@/lib/filter";
import { underPostLimit } from "@/lib/rate-limit";
import { recountQuestion, getFeed, type FeedTab } from "@/lib/queries";
import { CATEGORIES, LIMITS, VERDICTS } from "@/lib/constants";

export type PostState = { error?: string; ok?: boolean } | undefined;

const NICE_TRY = "Let's keep it kind 🤫 Please reword that and try again.";
const SLOW_DOWN = "You're whispering a lot! Take a breather and try again in a bit.";

async function loginPath() {
  const referer = (await headers()).get("referer");
  let next = "/";
  try {
    if (referer) next = new URL(referer).pathname;
  } catch {}
  return `/login?next=${encodeURIComponent(next)}`;
}

/** The signed-in user, or a redirect to log in. Banned users get an error. */
async function requirePoster() {
  const user = await getCurrentUser();
  if (!user) redirect(await loginPath());
  return user;
}

const questionSchema = z.object({
  title: z.string().trim().min(8, "Give your question a little more detail.").max(LIMITS.title),
  description: z.string().trim().max(LIMITS.description, `Keep the details under ${LIMITS.description} characters.`),
  category: z.enum(CATEGORIES.map((c) => c.slug) as [string, ...string[]], {
    message: "Pick a category.",
  }),
});

export async function createQuestion(_: PostState, formData: FormData): Promise<PostState> {
  const user = await requirePoster();
  if (user.banned) return { error: "Your account can't post right now." };
  const parsed = questionSchema.safeParse({
    title: formData.get("title") ?? "",
    description: formData.get("description") ?? "",
    category: formData.get("category") ?? "",
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { title, description, category } = parsed.data;
  if (containsBadWords(title, description)) return { error: NICE_TRY };
  if (!(await underPostLimit(user.id))) return { error: SLOW_DOWN };

  const q = await db.question.create({
    data: { title, description: description || null, category, authorId: user.id },
  });
  revalidatePath("/");
  redirect(`/q/${q.id}`);
}

const answerSchema = z.object({
  questionId: z.string().min(1),
  verdict: z.enum(VERDICTS.map((v) => v.key) as [string, ...string[]], {
    message: "Pick a verdict first: fine, depends, or please don't.",
  }),
  body: z
    .string()
    .trim()
    .min(2, "Say a little something with your verdict.")
    .max(LIMITS.answer, `Keep it under ${LIMITS.answer} characters.`),
});

export async function createAnswer(_: PostState, formData: FormData): Promise<PostState> {
  const user = await requirePoster();
  if (user.banned) return { error: "Your account can't post right now." };
  const parsed = answerSchema.safeParse({
    questionId: formData.get("questionId"),
    verdict: formData.get("verdict") ?? "",
    body: formData.get("body") ?? "",
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { questionId, verdict, body } = parsed.data;
  if (containsBadWords(body)) return { error: NICE_TRY };

  const question = await db.question.findUnique({ where: { id: questionId }, select: { id: true } });
  if (!question) return { error: "That question was removed." };
  const existing = await db.answer.findUnique({
    where: { questionId_authorId: { questionId, authorId: user.id } },
  });
  if (existing) return { error: "You've already whispered back here. Reply to someone instead!" };
  if (!(await underPostLimit(user.id))) return { error: SLOW_DOWN };

  await db.answer.create({ data: { questionId, verdict, body, authorId: user.id } });
  await recountQuestion(questionId);
  revalidatePath(`/q/${questionId}`);
  return { ok: true };
}

const replySchema = z.object({
  answerId: z.string().min(1),
  body: z
    .string()
    .trim()
    .min(1, "Write a reply first.")
    .max(LIMITS.reply, `Keep replies under ${LIMITS.reply} characters.`),
});

export async function createReply(_: PostState, formData: FormData): Promise<PostState> {
  const user = await requirePoster();
  if (user.banned) return { error: "Your account can't post right now." };
  const parsed = replySchema.safeParse({
    answerId: formData.get("answerId"),
    body: formData.get("body") ?? "",
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { answerId, body } = parsed.data;
  if (containsBadWords(body)) return { error: NICE_TRY };

  const answer = await db.answer.findUnique({ where: { id: answerId }, select: { questionId: true } });
  if (!answer) return { error: "That answer was removed." };
  if (!(await underPostLimit(user.id))) return { error: SLOW_DOWN };

  await db.reply.create({ data: { answerId, questionId: answer.questionId, body, authorId: user.id } });
  await recountQuestion(answer.questionId);
  revalidatePath(`/q/${answer.questionId}`);
  return { ok: true };
}

export async function toggleGuilty(questionId: string) {
  const user = await requirePoster();
  if (user.banned) return;
  const key = { userId_questionId: { userId: user.id, questionId } };
  if (await db.guilty.findUnique({ where: key })) {
    await db.guilty.delete({ where: key });
  } else {
    await db.guilty.create({ data: { userId: user.id, questionId } }).catch(() => {});
  }
  await recountQuestion(questionId);
  revalidatePath(`/q/${questionId}`);
}

export async function toggleLike(answerId: string) {
  const user = await requirePoster();
  if (user.banned) return;
  const answer = await db.answer.findUnique({ where: { id: answerId }, select: { questionId: true } });
  if (!answer) return;
  const key = { userId_answerId: { userId: user.id, answerId } };
  if (await db.answerLike.findUnique({ where: key })) {
    await db.answerLike.delete({ where: key });
  } else {
    await db.answerLike.create({ data: { userId: user.id, answerId } }).catch(() => {});
  }
  const likeCount = await db.answerLike.count({ where: { answerId } });
  await db.answer.update({ where: { id: answerId }, data: { likeCount } });
  revalidatePath(`/q/${answer.questionId}`);
}

const reportSchema = z.object({
  targetType: z.enum(["question", "answer", "reply"]),
  targetId: z.string().min(1),
  reason: z.string().trim().max(200).optional(),
});

export async function reportContent(input: z.input<typeof reportSchema>) {
  const user = await requirePoster();
  const parsed = reportSchema.safeParse(input);
  if (!parsed.success) return { error: "Couldn't send that report." };
  const { targetType, targetId, reason } = parsed.data;
  await db.report
    .create({ data: { targetType, targetId, reason: reason || null, reporterId: user.id } })
    .catch(() => {}); // already reported by this user
  return { ok: true };
}

/** Next page of a feed, for the "Load more" button. */
export async function loadMore(opts: { tab: FeedTab; category?: string; query?: string; offset: number }) {
  const tab: FeedTab = ["trending", "newest", "debated"].includes(opts.tab) ? opts.tab : "trending";
  return getFeed({ ...opts, tab, offset: Math.max(0, Math.floor(opts.offset)) });
}

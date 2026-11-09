import "server-only";
import { db, contains } from "./db";

export const PAGE_SIZE = 12;

export type FeedTab = "trending" | "newest" | "debated";

export type QuestionCard = {
  id: string;
  title: string;
  category: string;
  createdAt: string;
  answerCount: number;
  guiltyCount: number;
  fineCount: number;
  dependsCount: number;
  dontCount: number;
};

const cardSelect = {
  id: true,
  title: true,
  category: true,
  createdAt: true,
  answerCount: true,
  guiltyCount: true,
  fineCount: true,
  dependsCount: true,
  dontCount: true,
} as const;

type Row = Omit<QuestionCard, "createdAt"> & { createdAt: Date };
const toCard = (q: Row): QuestionCard => ({ ...q, createdAt: q.createdAt.toISOString() });

/** How evenly split the verdicts are: 1 = perfectly split, 0 = unanimous. */
function debateScore(q: Row) {
  const total = q.fineCount + q.dependsCount + q.dontCount;
  if (total < 2) return -1;
  const top = Math.max(q.fineCount, q.dependsCount, q.dontCount) / total;
  // top share ranges from 1/3 (perfect 3-way split) to 1 (everyone agrees)
  return (1 - top) * 1.5;
}

export async function getFeed(opts: {
  tab: FeedTab;
  category?: string;
  query?: string;
  offset?: number;
}): Promise<{ items: QuestionCard[]; hasMore: boolean }> {
  const offset = opts.offset ?? 0;
  const where: Record<string, unknown> = {};
  if (opts.category) where.category = opts.category;
  const term = opts.query?.trim();
  if (term) {
    where.OR = [
      { title: contains(term) },
      { description: contains(term) },
      { answers: { some: { body: contains(term) } } },
    ];
  }

  if (opts.tab === "newest") {
    const rows = await db.question.findMany({
      where,
      select: cardSelect,
      orderBy: { createdAt: "desc" },
      skip: offset,
      take: PAGE_SIZE + 1,
    });
    return { items: rows.slice(0, PAGE_SIZE).map(toCard), hasMore: rows.length > PAGE_SIZE };
  }

  // Trending and Most Debated are ranked in memory. Fine for thousands of
  // questions; move to SQL if the site grows much bigger.
  const rows = await db.question.findMany({ where, select: cardSelect, take: 2000, orderBy: { createdAt: "desc" } });
  let ranked: Row[];

  if (opts.tab === "debated") {
    ranked = [...rows].sort(
      (a, b) => debateScore(b) - debateScore(a) || b.answerCount - a.answerCount,
    );
  } else {
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const ids = rows.map((r) => r.id);
    const recent = { createdAt: { gte: since }, questionId: { in: ids } };
    const [answers, replies, guilties] = await Promise.all([
      db.answer.groupBy({ by: ["questionId"], where: recent, _count: { _all: true } }),
      db.reply.groupBy({ by: ["questionId"], where: recent, _count: { _all: true } }),
      db.guilty.groupBy({ by: ["questionId"], where: recent, _count: { _all: true } }),
    ]);
    const activity = new Map<string, number>();
    const add = (id: string, n: number) => activity.set(id, (activity.get(id) ?? 0) + n);
    answers.forEach((g) => add(g.questionId, g._count._all * 3));
    replies.forEach((g) => add(g.questionId, g._count._all * 2));
    guilties.forEach((g) => add(g.questionId, g._count._all));
    rows.forEach((r) => r.createdAt >= since && add(r.id, 2));
    ranked = [...rows].sort(
      (a, b) =>
        (activity.get(b.id) ?? 0) - (activity.get(a.id) ?? 0) ||
        b.createdAt.getTime() - a.createdAt.getTime(),
    );
  }

  const page = ranked.slice(offset, offset + PAGE_SIZE);
  return { items: page.map(toCard), hasMore: ranked.length > offset + PAGE_SIZE };
}

/** Recalculates a question's denormalized counters from the source rows. */
export async function recountQuestion(questionId: string) {
  const [answers, replyCount, guiltyCount] = await Promise.all([
    db.answer.groupBy({ by: ["verdict"], where: { questionId }, _count: { _all: true } }),
    db.reply.count({ where: { questionId } }),
    db.guilty.count({ where: { questionId } }),
  ]);
  const by = (v: string) => answers.find((a) => a.verdict === v)?._count._all ?? 0;
  await db.question.update({
    where: { id: questionId },
    data: {
      answerCount: answers.reduce((n, a) => n + a._count._all, 0),
      replyCount,
      guiltyCount,
      fineCount: by("fine"),
      dependsCount: by("depends"),
      dontCount: by("dont"),
    },
  });
}

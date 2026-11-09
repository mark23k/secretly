import "server-only";
import { db } from "./db";

export type Range = "7" | "30" | "all";
export type DayPoint = { day: string; value: number };

const DAY = 24 * 60 * 60 * 1000;
const TZ = process.env.ADMIN_TIMEZONE || "America/New_York";
const fmt = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" });
const dayKey = (d: Date) => fmt.format(d); // YYYY-MM-DD in the admin's timezone

function dayKeys(from: Date, to: Date) {
  const keys: string[] = [];
  for (let t = from.getTime(); t <= to.getTime() + DAY; t += DAY / 2) {
    const k = dayKey(new Date(t));
    if (keys[keys.length - 1] !== k && k <= dayKey(to)) keys.push(k);
  }
  return keys;
}

function bucket(keys: string[], dates: Date[]): DayPoint[] {
  const counts = new Map(keys.map((k) => [k, 0]));
  for (const d of dates) {
    const k = dayKey(d);
    if (counts.has(k)) counts.set(k, counts.get(k)! + 1);
  }
  return keys.map((day) => ({ day, value: counts.get(day)! }));
}

const real = { author: { isSeed: false } };

export async function getStats(range: Range) {
  const now = new Date();
  let from: Date;
  if (range === "all") {
    const firsts = await Promise.all([
      db.pageView.findFirst({ orderBy: { createdAt: "asc" }, select: { createdAt: true } }),
      db.user.findFirst({ where: { isSeed: false }, orderBy: { createdAt: "asc" }, select: { createdAt: true } }),
      db.question.findFirst({ where: real, orderBy: { createdAt: "asc" }, select: { createdAt: true } }),
    ]);
    const times = firsts.filter(Boolean).map((r) => r!.createdAt.getTime());
    from = new Date(times.length ? Math.min(...times) : now.getTime());
  } else {
    from = new Date(now.getTime() - (Number(range) - 1) * DAY);
  }
  const keys = dayKeys(from, now);
  // Fetch a little extra; bucket() drops anything outside the visible days.
  const since = { createdAt: { gte: new Date(from.getTime() - DAY) } };
  const select = { createdAt: true } as const;

  const [views, questions, answers, replies, signups] = await Promise.all([
    db.pageView.findMany({ where: since, select: { createdAt: true, visitorId: true } }),
    db.question.findMany({ where: { ...since, ...real }, select }),
    db.answer.findMany({ where: { ...since, ...real }, select }),
    db.reply.findMany({ where: { ...since, ...real }, select }),
    db.user.findMany({ where: { ...since, isSeed: false }, select }),
  ]);

  const inRange = views.filter((v) => dayKey(v.createdAt) >= keys[0]);
  const visitorsByDay = new Map(keys.map((k) => [k, new Set<string>()]));
  for (const v of inRange) visitorsByDay.get(dayKey(v.createdAt))?.add(v.visitorId);

  const series = {
    visitors: keys.map((day) => ({ day, value: visitorsByDay.get(day)!.size })),
    pageViews: bucket(keys, inRange.map((v) => v.createdAt)),
    questions: bucket(keys, questions.map((r) => r.createdAt)),
    answers: bucket(keys, answers.map((r) => r.createdAt)),
    replies: bucket(keys, replies.map((r) => r.createdAt)),
    signups: bucket(keys, signups.map((r) => r.createdAt)),
  };
  const sum = (s: DayPoint[]) => s.reduce((n, p) => n + p.value, 0);
  const totals = {
    visitors: new Set(inRange.map((v) => v.visitorId)).size,
    pageViews: sum(series.pageViews),
    questions: sum(series.questions),
    answers: sum(series.answers),
    replies: sum(series.replies),
    signups: sum(series.signups),
  };
  return { keys, series, totals };
}

export async function getSummary() {
  const today = dayKey(new Date());
  const recentViews = await db.pageView.findMany({
    where: { createdAt: { gte: new Date(Date.now() - 2 * DAY) } },
    select: { createdAt: true, visitorId: true },
  });
  const todayViews = recentViews.filter((v) => dayKey(v.createdAt) === today);
  const recent = { createdAt: { gte: new Date(Date.now() - 2 * DAY) } };
  const isToday = (rows: { createdAt: Date }[]) => rows.filter((r) => dayKey(r.createdAt) === today).length;
  const select = { createdAt: true } as const;

  const [q, a, r, u, allViews, allVisitors, allQ, allA, allR, allU] = await Promise.all([
    db.question.findMany({ where: { ...recent, ...real }, select }),
    db.answer.findMany({ where: { ...recent, ...real }, select }),
    db.reply.findMany({ where: { ...recent, ...real }, select }),
    db.user.findMany({ where: { ...recent, isSeed: false }, select }),
    db.pageView.count(),
    db.pageView.groupBy({ by: ["visitorId"] }).then((g) => g.length),
    db.question.count({ where: real }),
    db.answer.count({ where: real }),
    db.reply.count({ where: real }),
    db.user.count({ where: { isSeed: false } }),
  ]);
  return {
    today: {
      visitors: new Set(todayViews.map((v) => v.visitorId)).size,
      pageViews: todayViews.length,
      questions: isToday(q),
      answers: isToday(a),
      replies: isToday(r),
      signups: isToday(u),
    },
    allTime: { visitors: allVisitors, pageViews: allViews, questions: allQ, answers: allA, replies: allR, signups: allU },
  };
}

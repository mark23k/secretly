import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { getStats, getSummary, type Range } from "@/lib/stats";
import { getCategory } from "@/lib/constants";
import { timeAgo } from "@/lib/time";
import { BarChart } from "@/components/admin/bar-chart";
import { ModActions } from "@/components/admin/mod-actions";

export const metadata: Metadata = { title: "Admin", robots: { index: false } };

type Tab = "stats" | "moderation" | "questions";
type Props = { searchParams: Promise<{ tab?: string; range?: string }> };

export default async function AdminPage({ searchParams }: Props) {
  const user = await getCurrentUser();
  if (!user?.isAdmin) notFound();
  const sp = await searchParams;
  const tab: Tab = sp.tab === "moderation" || sp.tab === "questions" ? sp.tab : "stats";
  const range: Range = sp.range === "30" || sp.range === "all" ? sp.range : "7";
  const openReports = await db.report.groupBy({ by: ["targetType", "targetId"] }).then((g) => g.length);

  const tabs: [Tab, string][] = [
    ["stats", "📊 Stats"],
    ["moderation", `🚩 Moderation${openReports ? ` (${openReports})` : ""}`],
    ["questions", "📝 Recent questions"],
  ];

  return (
    <div className="grid gap-5">
      <h1 className="text-2xl font-black">🤫 Admin</h1>
      <nav className="flex gap-1.5 overflow-x-auto rounded-full bg-white p-1.5 ring-1 ring-line">
        {tabs.map(([key, label]) => (
          <Link
            key={key}
            href={`/admin?tab=${key}`}
            className={`flex-1 whitespace-nowrap rounded-full px-3 py-2 text-center text-sm font-extrabold ${
              tab === key ? "bg-lavender-500 text-white" : "text-ink-soft hover:bg-lavender-50"
            }`}
          >
            {label}
          </Link>
        ))}
      </nav>
      {tab === "stats" && <Stats range={range} />}
      {tab === "moderation" && <Moderation />}
      {tab === "questions" && <RecentQuestions />}
    </div>
  );
}

const METRICS = [
  ["visitors", "Unique visitors"],
  ["pageViews", "Page views"],
  ["questions", "Questions"],
  ["answers", "Answers"],
  ["replies", "Replies"],
  ["signups", "New sign-ups"],
] as const;

async function Stats({ range }: { range: Range }) {
  const [summary, stats] = await Promise.all([getSummary(), getStats(range)]);
  return (
    <div className="grid gap-5">
      {(["today", "allTime"] as const).map((when) => (
        <section key={when}>
          <h2 className="mb-2 text-sm font-extrabold uppercase tracking-wider text-ink-soft">
            {when === "today" ? "Today" : "All time"}
          </h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
            {METRICS.map(([key, name]) => (
              <div key={key} className={`rounded-2xl p-3 ${when === "today" ? "bg-lavender-100" : "bg-white ring-1 ring-line"}`}>
                <div className="text-2xl font-black">{summary[when][key].toLocaleString()}</div>
                <div className="text-xs font-bold text-ink-soft">{name}</div>
              </div>
            ))}
          </div>
        </section>
      ))}

      <section className="grid gap-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-ink-soft">Per day</h2>
          <div className="flex rounded-full bg-white p-1 text-sm font-extrabold ring-1 ring-line">
            {(["7", "30", "all"] as const).map((r) => (
              <Link
                key={r}
                href={`/admin?tab=stats&range=${r}`}
                className={`rounded-full px-3 py-1.5 ${range === r ? "bg-lavender-500 text-white" : "text-ink-soft"}`}
              >
                {r === "all" ? "All time" : `${r} days`}
              </Link>
            ))}
          </div>
        </div>
        <p className="text-xs text-ink-soft">
          Visitors are counted with an anonymous cookie (no IP addresses). Seeded example posts are not counted. Hover a bar
          for its number.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {METRICS.map(([key, name]) => (
            <BarChart key={key} title={name} total={stats.totals[key]} data={stats.series[key]} />
          ))}
        </div>
        <details className="note p-4 text-sm">
          <summary className="cursor-pointer font-extrabold">Show as a table</summary>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-right tabular-nums">
              <thead>
                <tr className="text-xs text-ink-soft">
                  <th className="py-1 text-left">Day</th>
                  {METRICS.map(([key, name]) => <th key={key} className="px-2 py-1">{name}</th>)}
                </tr>
              </thead>
              <tbody>
                {[...stats.keys].reverse().map((day, idx) => {
                  const i = stats.keys.length - 1 - idx;
                  return (
                    <tr key={day} className="border-t border-line">
                      <td className="py-1 text-left font-bold">{day}</td>
                      {METRICS.map(([key]) => <td key={key} className="px-2 py-1">{stats.series[key][i].value}</td>)}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </details>
      </section>
    </div>
  );
}

async function Moderation() {
  const groups = await db.report.groupBy({
    by: ["targetType", "targetId"],
    _count: { _all: true },
    _max: { createdAt: true },
    orderBy: { _max: { createdAt: "desc" } },
    take: 50,
  });
  const ids = (t: string) => groups.filter((g) => g.targetType === t).map((g) => g.targetId);
  const [questions, answers, replies, reasons] = await Promise.all([
    db.question.findMany({ where: { id: { in: ids("question") } }, select: { id: true, title: true, description: true } }),
    db.answer.findMany({ where: { id: { in: ids("answer") } }, select: { id: true, body: true, questionId: true } }),
    db.reply.findMany({ where: { id: { in: ids("reply") } }, select: { id: true, body: true, questionId: true } }),
    db.report.findMany({ where: { targetId: { in: groups.map((g) => g.targetId) } }, select: { targetId: true, reason: true } }),
  ]);

  const items = groups.map((g) => {
    const q = questions.find((x) => x.id === g.targetId);
    const a = answers.find((x) => x.id === g.targetId);
    const r = replies.find((x) => x.id === g.targetId);
    const text = q ? `${q.title}${q.description ? ` — ${q.description}` : ""}` : (a?.body ?? r?.body);
    const link = q ? `/q/${q.id}` : a ? `/q/${a.questionId}` : r ? `/q/${r.questionId}` : null;
    const why = [...new Set(reasons.filter((x) => x.targetId === g.targetId).map((x) => x.reason).filter(Boolean))];
    return { ...g, text, link, why };
  });

  if (items.length === 0) {
    return <p className="note p-8 text-center font-bold text-ink-soft">No open reports. All quiet 🤫</p>;
  }
  return (
    <div className="grid gap-3 lg:grid-cols-2">
      {items.map((it) => (
        <div key={`${it.targetType}:${it.targetId}`} className="note grid gap-2 p-4">
          <div className="flex flex-wrap items-center gap-2 text-xs font-extrabold">
            <span className="rounded-full bg-rose-100 px-2 py-0.5 uppercase text-rose-700">{it.targetType}</span>
            <span className="text-ink-soft">
              {it._count._all} {it._count._all === 1 ? "report" : "reports"} · {it._max.createdAt && timeAgo(it._max.createdAt)}
            </span>
            {it.link && <Link href={it.link} className="text-lavender-700 underline">open</Link>}
          </div>
          <p className="whitespace-pre-line text-sm">{it.text ?? <em className="text-ink-soft">(already deleted)</em>}</p>
          {it.why.length > 0 && <p className="text-xs text-ink-soft">Reasons: {it.why.join(", ")}</p>}
          <ModActions targetType={it.targetType as "question"} targetId={it.targetId} showBan={!!it.text} />
        </div>
      ))}
    </div>
  );
}

async function RecentQuestions() {
  const questions = await db.question.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    select: { id: true, title: true, category: true, createdAt: true, answerCount: true },
  });
  return (
    <div className="grid gap-2 lg:grid-cols-2">
      {questions.map((q) => (
        <div key={q.id} className="note flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link href={`/q/${q.id}`} className="font-extrabold hover:text-lavender-700">{q.title}</Link>
            <p className="text-xs text-ink-soft">
              {getCategory(q.category)?.emoji} {getCategory(q.category)?.name} · {timeAgo(q.createdAt)} · {q.answerCount} answers
            </p>
          </div>
          <ModActions targetType="question" targetId={q.id} showDismiss={false} showBan={false} />
        </div>
      ))}
    </div>
  );
}

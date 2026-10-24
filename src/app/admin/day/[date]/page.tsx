import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { questionCategoryLabel, type QuestionCategory } from "@/config/questions";
import { thoughtCategoryLabel, type ThoughtCategory } from "@/config/thoughts";
import { ISO_DAY } from "@/config/admin";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminNav } from "@/components/admin/admin-nav";
import { BarList } from "@/components/admin/bar-list";
import { ChartCard } from "@/components/admin/chart-card";
import { ColumnChart } from "@/components/admin/column-chart";
import { StatGrid, StatTile } from "@/components/admin/stat-tile";
import { getAccountTimeZone, getAdminStats, getDayPosts } from "@/lib/data/admin.server";
import { busiestHour, hourlyColumns, KIND_LABEL } from "@/lib/admin-stats";
import { requireAdminPage } from "@/lib/server/admin";
import { addDays, dayLabel, formatDuration, todayIn } from "@/lib/format";
import { formatCount } from "@/lib/time";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Day report",
  robots: { index: false, follow: false },
};

type Params = Promise<{ date: string }>;

export default function DayPage({ params }: { params: Params }) {
  return (
    <div className="mx-auto max-w-5xl px-5 pt-10 pb-16 sm:pt-14">
      <Suspense fallback={<DaySkeleton />}>
        <Day params={params} />
      </Suspense>
    </div>
  );
}

const STATUS_LABEL: Record<string, string> = { pending: "Held for review", hidden: "Hidden by reports", removed: "Removed" };

async function Day({ params }: { params: Params }) {
  const { date } = await params;
  const user = await requireAdminPage(`/admin/day/${date}`);
  if (!ISO_DAY.test(date)) notFound();

  const timeZone = await getAccountTimeZone(user.id);
  const today = todayIn(timeZone);
  if (date > today) notFound();

  const [stats, day] = await Promise.all([getAdminStats({ from: date, to: date }, timeZone), getDayPosts(date, timeZone)]);
  const t = stats.totals;
  const d = stats.daily[0];
  const kinds = Object.entries(stats.byKind)
    .map(([kind, value]) => ({ label: KIND_LABEL[kind] ?? kind, value }))
    .sort((a, b) => b.value - a.value);
  const prev = addDays(date, -1);
  const next = addDays(date, 1);

  return (
    <div className="space-y-8">
      <AdminNav current="dashboard" />
      <header className="space-y-4">
        <Link
          href="/admin?tab=daily"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden /> Day by day
        </Link>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold tracking-[0.14em] text-primary uppercase">Day report</p>
            <h1 className="text-4xl font-normal sm:text-5xl">{dayLabel(date, true)}</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {date === today ? "Today so far · " : ""}times in {stats.timeZone.replace(/_/g, " ")}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href={`/admin/day/${prev}`} aria-label={`Previous day, ${dayLabel(prev, true)}`}>
                <ChevronLeft data-icon="inline-start" /> {dayLabel(prev)}
              </Link>
            </Button>
            {next <= today ? (
              <Button asChild variant="outline" size="sm">
                <Link href={`/admin/day/${next}`} aria-label={`Next day, ${dayLabel(next, true)}`}>
                  {dayLabel(next)} <ChevronRight data-icon="inline-end" />
                </Link>
              </Button>
            ) : null}
            <DayJump date={date} today={today} />
          </div>
        </div>
      </header>

      <StatGrid>
        <StatTile label="Sign-ups" value={formatCount(d?.signups ?? 0)} hint="New accounts this day" />
        <StatTile label="Posts" value={formatCount(t.posts)} hint="Thoughts, questions and secrets" />
        <StatTile label="Interactions" value={formatCount(t.interactions)} hint="Posts, replies, votes and reactions" />
        <StatTile label="Visitors" value={formatCount(t.visitors)} hint={`${formatCount(t.visits)} visits · ${formatCount(t.pageViews)} page views`} />
        <StatTile label="Avg. time per visit" value={formatDuration(t.avgVisitSeconds)} hint={`Median ${formatDuration(t.medianVisitSeconds)}`} />
        <StatTile label="Busiest hour" value={busiestHour(stats, (h) => h.interactions)} hint={`${formatCount(t.activeMembers)} members took part`} />
      </StatGrid>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Interactions by hour">
          <ColumnChart data={hourlyColumns(stats, (h) => h.interactions)} valueName="interactions" categoryName="Hour" height={150} emptyText="No interactions this day." />
        </ChartCard>
        <ChartCard title="Visits by hour">
          <ColumnChart data={hourlyColumns(stats, (h) => h.visits)} valueName="visits" categoryName="Hour" height={150} emptyText="No visits this day." />
        </ChartCard>
      </div>

      <ChartCard title="What people did" description="Every interaction this day, by type.">
        <BarList items={kinds} emptyText="Nothing happened this day." />
      </ChartCard>

      <section aria-labelledby="posted-heading" className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <h2 id="posted-heading" className="font-sans text-base font-semibold tracking-normal">
            Posted this day
          </h2>
          <p className="text-xs text-muted-foreground">
            Also: {formatCount(day.counts.comments)} comments · {formatCount(day.counts.answers)} answers ·{" "}
            {formatCount(day.counts.secrets)} secrets · {formatCount(day.counts.secretReplies)} secret replies
          </p>
        </div>
        {day.posts.length === 0 ? (
          <p className="rounded-2xl bg-muted px-4 py-5 text-sm text-muted-foreground">
            No thoughts or questions were posted this day.
          </p>
        ) : (
          <ul className="space-y-2">
            {day.posts.map((p) => (
              <li key={p.id} className="rounded-2xl border bg-card px-4 py-3.5">
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span className="rounded-full bg-muted px-2 py-0.5 font-medium text-foreground/80">
                    {p.kind === "thought" ? "Thought" : "Question"}
                  </span>
                  <span>
                    {p.kind === "thought"
                      ? thoughtCategoryLabel[p.category as ThoughtCategory]
                      : questionCategoryLabel[p.category as QuestionCategory]}
                  </span>
                  <time dateTime={p.createdAt}>
                    {new Intl.DateTimeFormat("en", { hour: "numeric", minute: "2-digit", timeZone: stats.timeZone }).format(new Date(p.createdAt))}
                  </time>
                  {STATUS_LABEL[p.status] ? (
                    <span className="rounded-full bg-amber-500/15 px-2 py-0.5 font-medium text-amber-700 dark:text-amber-400">
                      {STATUS_LABEL[p.status]}
                    </span>
                  ) : null}
                  <span className="ml-auto">
                    {p.comments} {p.kind === "thought" ? (p.comments === 1 ? "comment" : "comments") : p.comments === 1 ? "answer" : "answers"}
                  </span>
                </div>
                <p className="mt-1.5 text-[0.95rem] text-pretty">{p.text}</p>
                {p.options ? (
                  <p className="mt-1 text-xs text-muted-foreground">Answers: {p.options.join(" · ")}</p>
                ) : null}
                {p.status === "published" ? (
                  <a
                    href={p.kind === "thought" ? `/only-one/${p.id}` : `/ask/${p.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                  >
                    View on site <ExternalLink className="size-3" aria-hidden />
                  </a>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

/** Jump straight to any day. */
function DayJump({ date, today }: { date: string; today: string }) {
  return (
    <form action="/admin/day/go" className="flex items-center gap-1.5">
      <label className="sr-only" htmlFor="day-jump">
        Go to a day
      </label>
      <input
        id="day-jump"
        type="date"
        name="date"
        defaultValue={date}
        max={today}
        required
        className={cn("h-8 rounded-lg border bg-background px-2 text-sm")}
      />
      <Button type="submit" size="sm" variant="secondary">
        Go
      </Button>
    </form>
  );
}

function DaySkeleton() {
  return (
    <div className="space-y-8" aria-busy="true" aria-label="Loading">
      <Skeleton className="h-10 w-64 rounded-full" />
      <Skeleton className="h-12 w-72" />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <Skeleton key={i} className="h-28 rounded-2xl" />
        ))}
      </div>
      <Skeleton className="h-60 rounded-2xl" />
    </div>
  );
}

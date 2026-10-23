import type { Metadata } from "next";
import { Suspense } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminNav } from "@/components/admin/admin-nav";
import { BarList } from "@/components/admin/bar-list";
import { ChartCard } from "@/components/admin/chart-card";
import { ColumnChart, type Column } from "@/components/admin/column-chart";
import { DashboardTabs } from "@/components/admin/dashboard-tabs";
import { dashboardTabs, rangeOptions, type DashboardTab } from "@/config/admin";
import { LiveNow } from "@/components/admin/live-now";
import { RangePicker } from "@/components/admin/range-picker";
import { StatGrid, StatTile } from "@/components/admin/stat-tile";
import { getAccountTimeZone, getAdminStats, getLiveStats, type AdminStats } from "@/lib/data/admin.server";
import { requireAdminPage } from "@/lib/server/admin";
import { dayLabel, formatDuration, hourLabel, hourRangeLabel } from "@/lib/format";
import { formatCount } from "@/lib/time";

export const metadata: Metadata = {
  title: "Manager dashboard",
  robots: { index: false, follow: false },
};

const KIND_LABEL: Record<string, string> = {
  thought: "Thoughts shared",
  thought_vote: "Me too / Not me votes",
  thought_reaction: "Reactions on thoughts",
  thought_comment: "Comments on thoughts",
  question: "Questions asked",
  answer: "Answers",
  answer_vote: "Answer votes",
  secret: "Secrets given",
  secret_reply: "Replies to secrets",
};

export default function AdminPage({ searchParams }: PageProps<"/admin">) {
  return (
    <div className="mx-auto max-w-5xl px-5 pt-10 pb-16 sm:pt-14">
      <Suspense fallback={<DashboardSkeleton />}>
        <Dashboard searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function Dashboard({ searchParams }: Pick<PageProps<"/admin">, "searchParams">) {
  const user = await requireAdminPage("/admin");
  const params = await searchParams;
  const daysParam = Number(params.days);
  const days = (rangeOptions as readonly number[]).includes(daysParam) ? daysParam : 30;
  const tab = dashboardTabs.find((t) => t.value === params.tab)?.value ?? "overview";

  const timeZone = await getAccountTimeZone(user.id);
  const [stats, live] = await Promise.all([getAdminStats(days, timeZone), getLiveStats()]);

  return (
    <div className="space-y-8">
      <AdminNav current="dashboard" />
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold tracking-[0.14em] text-primary uppercase">Only visible to managers</p>
          <h1 className="text-4xl font-normal sm:text-5xl">Dashboard</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Last {days} days · times in {stats.timeZone.replace(/_/g, " ")} · counts only, never who did what
          </p>
        </div>
        <RangePicker days={days} />
      </header>

      <LiveNow initial={live} />

      <DashboardTabs initial={tab as DashboardTab}>
        <TabsContent value="overview" className="space-y-6">
          <Overview stats={stats} />
        </TabsContent>
        <TabsContent value="visitors" className="space-y-6">
          <Visitors stats={stats} />
        </TabsContent>
        <TabsContent value="members" className="space-y-6">
          <Members stats={stats} />
        </TabsContent>
        <TabsContent value="content" className="space-y-6">
          <Content stats={stats} />
        </TabsContent>
      </DashboardTabs>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function dailyColumns(stats: AdminStats, pick: (d: AdminStats["daily"][number]) => number): Column[] {
  const n = stats.daily.length;
  const every = n <= 7 ? 1 : n <= 31 ? 7 : 15;
  return stats.daily.map((d, i) => ({
    key: d.day,
    label: dayLabel(d.day, true),
    axisLabel: (n - 1 - i) % every === 0 ? dayLabel(d.day) : undefined,
    value: pick(d),
  }));
}

function hourlyColumns(stats: AdminStats, pick: (h: AdminStats["hourly"][number]) => number): Column[] {
  return stats.hourly.map((h) => ({
    key: String(h.hour),
    label: hourRangeLabel(h.hour),
    axisLabel: h.hour % 6 === 0 ? hourLabel(h.hour, true) : undefined,
    value: pick(h),
  }));
}

function busiestHour(stats: AdminStats, pick: (h: AdminStats["hourly"][number]) => number): string {
  const best = stats.hourly.reduce((a, b) => (pick(b) > pick(a) ? b : a), stats.hourly[0]);
  return best && pick(best) > 0 ? hourRangeLabel(best.hour) : "Not enough data";
}

function ratio(n: number | null | undefined): string {
  return n == null ? "0" : Number(n).toLocaleString("en", { maximumFractionDigits: 1 });
}

// -----------------------------------------------------------------------------
// Tabs
// -----------------------------------------------------------------------------

function Overview({ stats }: { stats: AdminStats }) {
  const t = stats.totals;
  return (
    <>
      <StatGrid>
        <StatTile label="Unique visitors" value={formatCount(t.visitors)} hint={`${formatCount(t.visits)} visits`} />
        <StatTile label="Members" value={formatCount(t.members)} hint={`+${formatCount(t.newMembers)} in this period`} />
        <StatTile label="Posts" value={formatCount(t.posts)} hint="Thoughts, questions and secrets" />
        <StatTile label="Interactions" value={formatCount(t.interactions)} hint="Posts, replies, votes and reactions" />
        <StatTile label="Avg. time per visit" value={formatDuration(t.avgVisitSeconds)} hint="Time with the tab open" />
        <StatTile label="Busiest hour" value={busiestHour(stats, (h) => h.interactions)} hint="Most interactions" />
      </StatGrid>
      <ChartCard title="Visitors per day" description="Unique people who opened Secretly, signed in or not.">
        <ColumnChart data={dailyColumns(stats, (d) => d.visitors)} valueName="visitors" categoryName="Day" />
      </ChartCard>
    </>
  );
}

function Visitors({ stats }: { stats: AdminStats }) {
  const t = stats.totals;
  return (
    <>
      <StatGrid>
        <StatTile label="Unique visitors" value={formatCount(t.visitors)} hint="Counted once per browser" />
        <StatTile label="Visits" value={formatCount(t.visits)} hint="A visit ends after 30 idle minutes" />
        <StatTile label="Page views" value={formatCount(t.pageViews)} hint={`${ratio(t.visits ? t.pageViews / t.visits : 0)} per visit`} />
        <StatTile label="Avg. time per visit" value={formatDuration(t.avgVisitSeconds)} hint={`Median ${formatDuration(t.medianVisitSeconds)}`} />
        <StatTile label="Busiest hour to visit" value={busiestHour(stats, (h) => h.visits)} hint="Most visits started" />
      </StatGrid>
      <ChartCard title="Visitors per day" description="Unique people who opened Secretly, signed in or not.">
        <ColumnChart data={dailyColumns(stats, (d) => d.visitors)} valueName="visitors" categoryName="Day" />
      </ChartCard>
      <ChartCard title="Visits by hour of day" description="When visits start, across the whole period.">
        <ColumnChart data={hourlyColumns(stats, (h) => h.visits)} valueName="visits" categoryName="Hour" />
      </ChartCard>
    </>
  );
}

function Members({ stats }: { stats: AdminStats }) {
  const t = stats.totals;
  return (
    <>
      <StatGrid>
        <StatTile label="Members" value={formatCount(t.members)} hint="Accounts, all time" />
        <StatTile label="New members" value={formatCount(t.newMembers)} hint={`In the last ${stats.days} days`} />
        <StatTile label="Active members" value={formatCount(t.activeMembers)} hint="Posted, replied, voted or reacted" />
        <StatTile
          label="Members who've posted"
          value={formatCount(t.posters)}
          hint={`${t.members ? Math.round((t.posters / t.members) * 100) : 0}% of all members`}
        />
        <StatTile label="Posts per member" value={ratio(t.postsPerMember)} hint="All time, across every member" />
        <StatTile
          label="Posts per posting member"
          value={ratio(t.postsPerPoster)}
          hint="Among members who've posted"
        />
      </StatGrid>
      <ChartCard title="New members per day" description="New accounts created.">
        <ColumnChart data={dailyColumns(stats, (d) => d.signups)} valueName="new members" categoryName="Day" />
      </ChartCard>
      <ChartCard title="Signed-in members visiting per day">
        <ColumnChart data={dailyColumns(stats, (d) => d.active_members)} valueName="members" categoryName="Day" />
      </ChartCard>
    </>
  );
}

function Content({ stats }: { stats: AdminStats }) {
  const t = stats.totals;
  const kinds = Object.entries(stats.byKind)
    .map(([kind, value]) => ({ label: KIND_LABEL[kind] ?? kind, value }))
    .sort((a, b) => b.value - a.value);
  return (
    <>
      <StatGrid>
        <StatTile label="Posts" value={formatCount(t.posts)} hint="Thoughts, questions and secrets" />
        <StatTile label="Replies" value={formatCount(t.replies)} hint="Comments, answers and secret replies" />
        <StatTile label="Votes & reactions" value={formatCount(t.reactions)} />
        <StatTile label="All interactions" value={formatCount(t.interactions)} hint={`From ${formatCount(t.activeMembers)} members`} />
        <StatTile label="Most active hour" value={busiestHour(stats, (h) => h.interactions)} />
        <StatTile label="Posts per member" value={ratio(t.postsPerMember)} hint="All time" />
      </StatGrid>
      <ChartCard title="Most active hours" description="All interactions by hour of day, across the whole period.">
        <ColumnChart data={hourlyColumns(stats, (h) => h.interactions)} valueName="interactions" categoryName="Hour" />
      </ChartCard>
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Posts per day">
          <ColumnChart data={dailyColumns(stats, (d) => d.posts)} valueName="posts" categoryName="Day" height={150} />
        </ChartCard>
        <ChartCard title="Interactions per day">
          <ColumnChart data={dailyColumns(stats, (d) => d.interactions)} valueName="interactions" categoryName="Day" height={150} />
        </ChartCard>
      </div>
      <ChartCard title="What people do" description={`Every interaction in the last ${stats.days} days, by type.`}>
        <BarList items={kinds} emptyText="Nothing yet in this period." />
      </ChartCard>
    </>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8" aria-busy="true" aria-label="Loading dashboard">
      <div className="space-y-3">
        <Skeleton className="h-3 w-40" />
        <Skeleton className="h-12 w-56" />
      </div>
      <Skeleton className="h-36 rounded-3xl" />
      <Skeleton className="h-8 w-80" />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <Skeleton key={i} className="h-28 rounded-2xl" />
        ))}
      </div>
      <Skeleton className="h-72 rounded-2xl" />
    </div>
  );
}

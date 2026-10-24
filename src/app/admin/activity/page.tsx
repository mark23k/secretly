import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import {
  CircleCheck,
  ExternalLink,
  Lock,
  MessageCircle,
  MessageCircleQuestion,
  MessageSquareReply,
  NotebookPen,
  SmilePlus,
  Vote,
} from "lucide-react";
import { reactions } from "@/config/thoughts";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminNav } from "@/components/admin/admin-nav";
import { LiveRefresh } from "@/components/admin/live-refresh";
import { EmptyState } from "@/components/shared/empty-state";
import { getAccountTimeZone, getRecentActivity, type ActivityGroup, type ActivityItem } from "@/lib/data/admin.server";
import { requireAdminPage } from "@/lib/server/admin";
import { addDays, dayLabel, todayIn } from "@/lib/format";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Live feed",
  robots: { index: false, follow: false },
};

type Search = Promise<{ group?: string; before?: string }>;

const FILTERS: { value?: ActivityGroup; label: string }[] = [
  { value: undefined, label: "All" },
  { value: "post", label: "Posts" },
  { value: "reply", label: "Comments & answers" },
  { value: "reaction", label: "Votes & reactions" },
];

const EMOJI = Object.fromEntries(reactions.map((r) => [r.key, r.emoji])) as Record<string, string>;

const STATUS_LABEL: Record<string, string> = { pending: "Held for review", hidden: "Hidden", removed: "Removed" };

export default function ActivityPage({ searchParams }: { searchParams: Search }) {
  return (
    <div className="mx-auto max-w-3xl px-5 pt-10 pb-16 sm:pt-14">
      <Suspense fallback={<FeedSkeleton />}>
        <Feed searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function Feed({ searchParams }: { searchParams: Search }) {
  const user = await requireAdminPage("/admin/activity");
  const params = await searchParams;
  const group = FILTERS.find((f) => f.value && f.value === params.group)?.value;
  const before = params.before && !Number.isNaN(Date.parse(params.before)) ? params.before : undefined;

  const timeZone = await getAccountTimeZone(user.id);
  const items = await getRecentActivity({ before, group });
  const today = todayIn(timeZone);

  // Group by local day, newest first.
  const dayOf = (iso: string) => new Intl.DateTimeFormat("en-CA", { timeZone }).format(new Date(iso));
  const days = new Map<string, ActivityItem[]>();
  for (const item of items) {
    const d = dayOf(item.createdAt);
    days.set(d, [...(days.get(d) ?? []), item]);
  }
  const dayHeading = (d: string) => (d === today ? "Today" : d === addDays(today, -1) ? "Yesterday" : dayLabel(d, true));
  const time = (iso: string) =>
    new Intl.DateTimeFormat("en", { hour: "numeric", minute: "2-digit", timeZone }).format(new Date(iso));
  const hrefFor = (g?: ActivityGroup, b?: string) => {
    const q = new URLSearchParams();
    if (g) q.set("group", g);
    if (b) q.set("before", b);
    const s = q.toString();
    return `/admin/activity${s ? `?${s}` : ""}`;
  };

  return (
    <div className="space-y-8">
      <AdminNav current="activity" />
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold tracking-[0.14em] text-primary uppercase">Only visible to managers</p>
          <h1 className="text-4xl font-normal sm:text-5xl">Live feed</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Everything happening on Secretly, newest first. Never who did it.
          </p>
        </div>
        {before ? null : <LiveRefresh />}
      </header>

      <nav aria-label="Filter" className="-mx-5 overflow-x-auto px-5 [scrollbar-width:none]">
        <ul className="flex gap-2">
          {FILTERS.map((f) => (
            <li key={f.label}>
              <Link
                href={hrefFor(f.value)}
                aria-current={f.value === group ? "page" : undefined}
                className="block rounded-full border px-3.5 py-1.5 text-sm whitespace-nowrap transition-colors hover:bg-muted aria-[current=page]:border-foreground aria-[current=page]:bg-foreground aria-[current=page]:text-background"
              >
                {f.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {items.length === 0 ? (
        <EmptyState title="Nothing yet" description="New posts, comments, votes and reactions will show up here as they happen." />
      ) : (
        <div className="space-y-8">
          {[...days].map(([d, dayItems]) => (
            <section key={d} aria-label={dayHeading(d)} className="space-y-2">
              <h2 className="sticky top-16 z-10 bg-background/90 py-1 font-sans text-sm font-semibold tracking-normal text-muted-foreground backdrop-blur">
                {dayHeading(d)}
              </h2>
              <ul className="divide-y rounded-2xl border bg-card">
                {dayItems.map((item) => (
                  <ActivityRow key={item.id} item={item} time={time(item.createdAt)} />
                ))}
              </ul>
            </section>
          ))}
          {items.length >= 60 ? (
            <div className="flex justify-center">
              <Link
                href={hrefFor(group, items[items.length - 1].createdAt)}
                className="rounded-full border px-4 py-2 text-sm font-medium hover:bg-muted"
              >
                Load older
              </Link>
            </div>
          ) : null}
          {before ? (
            <p className="text-center text-sm">
              <Link href={hrefFor(group)} className="text-primary underline underline-offset-4">
                Back to the latest
              </Link>
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}

/** One event: an icon, what happened, what it was about, when. */
function ActivityRow({ item, time }: { item: ActivityItem; time: string }) {
  const { icon: Icon, title, tone } = describe(item);
  const privateKind = item.kind === "secret" || item.kind === "secret_reply";
  return (
    <li className="flex gap-3 px-4 py-3.5">
      <span
        className={cn(
          "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full",
          tone === "post" && "bg-primary text-primary-foreground",
          tone === "reply" && "bg-accent text-accent-foreground",
          tone === "reaction" && "bg-muted text-muted-foreground"
        )}
      >
        <Icon className="size-4" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
          <span className="font-semibold">{title}</span>
          {item.status && STATUS_LABEL[item.status] ? (
            <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-400">
              {STATUS_LABEL[item.status]}
            </span>
          ) : null}
          <span className="ml-auto text-xs text-muted-foreground tabular-nums">{time}</span>
        </p>
        {item.text ? <p className="mt-1 text-[0.95rem] text-pretty whitespace-pre-line">{item.text}</p> : null}
        {privateKind ? (
          <p className="mt-1 text-xs text-muted-foreground">Private between two strangers, so the text isn&apos;t shown.</p>
        ) : null}
        {item.context ? (
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
            on “{item.context}”
          </p>
        ) : null}
        {item.href ? (
          <a
            href={item.href}
            target="_blank"
            rel="noreferrer"
            className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            View <ExternalLink className="size-3" aria-hidden />
          </a>
        ) : null}
      </div>
    </li>
  );
}

function describe(item: ActivityItem): {
  icon: typeof NotebookPen;
  title: string;
  tone: "post" | "reply" | "reaction";
} {
  switch (item.kind) {
    case "thought":
      return { icon: NotebookPen, title: "New thought", tone: "post" };
    case "question":
      return { icon: MessageCircleQuestion, title: "New question", tone: "post" };
    case "secret":
      return { icon: Lock, title: "A secret was given", tone: "post" };
    case "thought_comment":
      return { icon: MessageCircle, title: "New comment", tone: "reply" };
    case "answer":
      return { icon: MessageSquareReply, title: "New answer", tone: "reply" };
    case "secret_reply":
      return { icon: Lock, title: "A reply to a secret was sent", tone: "reply" };
    case "thought_vote":
      return { icon: Vote, title: item.detail ? `Voted “${item.detail}”` : "New vote", tone: "reaction" };
    case "thought_reaction":
      return {
        icon: SmilePlus,
        title: item.detail ? `Reacted ${EMOJI[item.detail] ?? item.detail}` : "New reaction",
        tone: "reaction",
      };
    case "answer_vote":
      return { icon: CircleCheck, title: "Found an answer helpful", tone: "reaction" };
    default:
      return { icon: NotebookPen, title: "Activity", tone: "reaction" };
  }
}

function FeedSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading">
      <Skeleton className="h-10 w-72 rounded-full" />
      <Skeleton className="h-12 w-56" />
      <Skeleton className="h-64 rounded-2xl" />
    </div>
  );
}

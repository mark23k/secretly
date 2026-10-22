import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Plus } from "lucide-react";
import {
  onlyOneViews,
  thoughtCategories,
  thoughtSorts,
  type ThoughtCategory,
  type ThoughtSort,
} from "@/config/thoughts";
import { getThoughtFeed } from "@/lib/data/thoughts.server";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { SegmentedNav } from "@/components/shared/segmented-nav";
import { ThoughtFeed, ThoughtFeedSkeleton } from "@/components/thoughts/thought-feed";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Browse thoughts",
  description: "Browse anonymous thoughts by what's trending, newest, or most relatable.",
};

type Search = Promise<{ sort?: string; category?: string }>;

function parse(params: Awaited<Search>) {
  const sort = (thoughtSorts.find((s) => s.value === params.sort)?.value ?? "trending") as ThoughtSort;
  const category = thoughtCategories.find((c) => c.value === params.category)?.value as
    | ThoughtCategory
    | undefined;
  return { sort, category };
}

function hrefFor(sort: ThoughtSort, category?: ThoughtCategory) {
  const q = new URLSearchParams();
  if (sort !== "trending") q.set("sort", sort);
  if (category) q.set("category", category);
  const s = q.toString();
  return `/only-one/browse${s ? `?${s}` : ""}`;
}

export default function BrowseThoughtsPage({ searchParams }: { searchParams: Search }) {
  return (
    <div className="pb-8">
      <PageHeader eyebrow="Am I the only one?" title="Browse all thoughts" className="pb-6">
        <Button asChild size="lg" className="mt-7">
          <Link href="/only-one/new">
            <Plus data-icon="inline-start" /> Share your thought
          </Link>
        </Button>
      </PageHeader>
      <div className="mx-auto max-w-2xl space-y-6 px-5">
        <SegmentedNav label="View" items={onlyOneViews} current="browse" />
        <Suspense fallback={<ThoughtFeedSkeleton />}>
          <Filters searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}

async function Filters({ searchParams }: { searchParams: Search }) {
  const { sort, category } = parse(await searchParams);
  return (
    <>
      <div className="space-y-4">
        <nav aria-label="Sort" className="flex gap-1 border-b">
          {thoughtSorts.map((s) => (
            <Link
              key={s.value}
              href={hrefFor(s.value, category)}
              scroll={false}
              aria-current={s.value === sort ? "page" : undefined}
              className="-mb-px border-b-2 border-transparent px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground aria-[current=page]:border-primary aria-[current=page]:text-foreground"
            >
              {s.label}
            </Link>
          ))}
        </nav>
        <nav aria-label="Categories" className="-mx-5 overflow-x-auto px-5 [scrollbar-width:none]">
          <ul className="flex gap-2">
            {[{ value: undefined, label: "All" }, ...thoughtCategories].map((c) => (
              <li key={c.label}>
                <Link
                  href={hrefFor(sort, c.value)}
                  scroll={false}
                  aria-current={c.value === category ? "page" : undefined}
                  className={cn(
                    "block rounded-full border px-3.5 py-1.5 text-sm whitespace-nowrap transition-colors hover:bg-muted",
                    "aria-[current=page]:border-foreground aria-[current=page]:bg-foreground aria-[current=page]:text-background"
                  )}
                >
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <Suspense key={`${sort}-${category}`} fallback={<ThoughtFeedSkeleton />}>
        <Feed sort={sort} category={category} />
      </Suspense>
    </>
  );
}

async function Feed({ sort, category }: { sort: ThoughtSort; category?: ThoughtCategory }) {
  const thoughts = await getThoughtFeed({ sort, category });
  if (thoughts.length === 0) {
    return (
      <EmptyState
        title="Nothing here yet"
        description={category ? "No one has shared a thought in this category yet. Be the first." : "Be the first to share a thought."}
      >
        <Button asChild>
          <Link href="/only-one/new">Share a thought</Link>
        </Button>
      </EmptyState>
    );
  }
  return <ThoughtFeed initial={thoughts} sort={sort} category={category} />;
}

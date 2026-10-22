import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Plus, Search } from "lucide-react";
import { features } from "@/config/site";
import {
  questionCategories,
  questionSorts,
  type QuestionCategory,
  type QuestionSort,
} from "@/config/questions";
import { getQuestionFeed } from "@/lib/data/questions.server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { QuestionFeed, QuestionFeedSkeleton } from "@/components/questions/question-feed";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: features.ask.title,
  description: "Anonymous answers to the questions people are too embarrassed to ask anyone they know.",
};

type Search = Promise<{ sort?: string; category?: string; q?: string }>;

function parse(params: Awaited<Search>) {
  const sort = (questionSorts.find((s) => s.value === params.sort)?.value ?? "newest") as QuestionSort;
  const category = questionCategories.find((c) => c.value === params.category)?.value as
    | QuestionCategory
    | undefined;
  const query = params.q?.trim().slice(0, 200) || undefined;
  return { sort, category, query };
}

function hrefFor(sort: QuestionSort, category?: QuestionCategory, query?: string) {
  const q = new URLSearchParams();
  if (sort !== "newest") q.set("sort", sort);
  if (category) q.set("category", category);
  if (query) q.set("q", query);
  const s = q.toString();
  return `/ask${s ? `?${s}` : ""}`;
}

export default function AskPage({ searchParams }: { searchParams: Search }) {
  return (
    <div className="pb-8">
      <PageHeader
        eyebrow="The question you can't ask"
        title={
          <>
            What have you always <em className="text-primary">wanted to ask?</em>
          </>
        }
        description="The things you feel you should already know, or could never ask someone you know. Ask anonymously, get honest answers from people who've been there."
      >
        <Button asChild size="lg" className="mt-7">
          <Link href="/ask/new">
            <Plus data-icon="inline-start" /> Ask a question
          </Link>
        </Button>
      </PageHeader>
      <div className="mx-auto max-w-2xl space-y-6 px-5">
        <Suspense fallback={<QuestionFeedSkeleton />}>
          <Browse searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}

async function Browse({ searchParams }: { searchParams: Search }) {
  const { sort, category, query } = parse(await searchParams);
  return (
    <>
      <form action="/ask" role="search" className="relative">
        <label htmlFor="ask-search" className="sr-only">
          Search questions
        </label>
        <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <Input
          id="ask-search"
          name="q"
          type="search"
          defaultValue={query}
          placeholder="Search questions…"
          className="h-12 rounded-2xl bg-card pl-11 text-base"
        />
        {category ? <input type="hidden" name="category" value={category} /> : null}
        {sort !== "newest" ? <input type="hidden" name="sort" value={sort} /> : null}
      </form>

      <div className="space-y-4">
        {!query ? (
          <nav aria-label="Sort" className="flex gap-1 border-b">
            {questionSorts.map((s) => (
              <Link
                key={s.value}
                href={hrefFor(s.value, category)}
                scroll={false}
                aria-current={s.value === sort ? "page" : undefined}
                className="-mb-px border-b-2 border-transparent px-3 py-2.5 text-sm font-medium whitespace-nowrap text-muted-foreground hover:text-foreground aria-[current=page]:border-primary aria-[current=page]:text-foreground"
              >
                {s.label}
              </Link>
            ))}
          </nav>
        ) : (
          <p className="text-sm text-muted-foreground">
            Results for <span className="font-medium text-foreground">“{query}”</span> ·{" "}
            <Link href={hrefFor(sort, category)} className="underline underline-offset-4 hover:text-foreground">
              Clear search
            </Link>
          </p>
        )}
        <nav aria-label="Categories" className="-mx-5 overflow-x-auto px-5 [scrollbar-width:none]">
          <ul className="flex gap-2">
            {[{ value: undefined, label: "All" }, ...questionCategories].map((c) => (
              <li key={c.label}>
                <Link
                  href={hrefFor(sort, c.value, query)}
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

      <Suspense key={`${sort}-${category}-${query}`} fallback={<QuestionFeedSkeleton />}>
        <Feed sort={sort} category={category} query={query} />
      </Suspense>
    </>
  );
}

async function Feed({ sort, category, query }: { sort: QuestionSort; category?: QuestionCategory; query?: string }) {
  const questions = await getQuestionFeed({ sort, category, query });
  if (questions.length === 0) {
    return (
      <EmptyState
        title={query ? "No questions match that" : "Nothing here yet"}
        description={
          query
            ? "Nobody has asked this yet, which means you can be the first."
            : sort === "unanswered"
              ? "Every question has an answer right now. Nice."
              : "Be the first to ask something you've always wondered."
        }
      >
        <Button asChild>
          <Link href="/ask/new">Ask a question</Link>
        </Button>
      </EmptyState>
    );
  }
  return <QuestionFeed initial={questions} sort={sort} category={category} query={query} />;
}

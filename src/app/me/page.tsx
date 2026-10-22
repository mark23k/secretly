import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getMyThoughts } from "@/lib/data/thoughts.server";
import { getMyQuestions } from "@/lib/data/questions.server";
import { QuestionCard } from "@/components/questions/question-card";
import { QuestionFeedSkeleton } from "@/components/questions/question-feed";
import { getSessionUser } from "@/lib/server/visitor";
import { SignInPrompt } from "@/components/auth/sign-in-prompt";
import { thoughtCategoryLabel } from "@/config/thoughts";
import { timeAgo } from "@/lib/time";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { ThoughtFeedSkeleton } from "@/components/thoughts/thought-feed";

export const metadata: Metadata = {
  title: "My posts",
  robots: { index: false },
};

const STATUS_LABEL = { published: "Live", pending: "In review", hidden: "Hidden", removed: "Removed" } as const;

export default function MyPostsPage() {
  return (
    <div className="pb-8">
      <PageHeader
        eyebrow="Only visible to you"
        title="My posts"
        description="Everything you've shared. Only you can see this list; your posts appear anonymously to everyone else."
      />
      <div className="mx-auto max-w-2xl space-y-10 px-5">
        <section aria-labelledby="my-thoughts" className="space-y-4">
          <h2 id="my-thoughts" className="text-2xl font-normal">
            Thoughts
          </h2>
          <Suspense fallback={<ThoughtFeedSkeleton />}>
            <MyThoughts />
          </Suspense>
        </section>
        <section aria-labelledby="my-questions" className="space-y-4">
          <h2 id="my-questions" className="text-2xl font-normal">
            Questions
          </h2>
          <Suspense fallback={<QuestionFeedSkeleton />}>
            <MyQuestions />
          </Suspense>
        </section>
        <section aria-labelledby="my-secrets" className="space-y-3">
          <h2 id="my-secrets" className="text-2xl font-normal">
            Secrets
          </h2>
          <p className="text-sm text-muted-foreground">
            Secrets live in their own private inbox, with the replies strangers sent you.
          </p>
          <Button asChild variant="outline">
            <Link href="/exchange/inbox">Open my secrets</Link>
          </Button>
        </section>
      </div>
    </div>
  );
}

async function MyThoughts() {
  if (!(await getSessionUser())) {
    return (
      <SignInPrompt
        title="Sign in to see your posts"
        description="Your posts are linked to your private account, so you can follow their results from any device."
      />
    );
  }
  const thoughts = await getMyThoughts();
  if (thoughts.length === 0) {
    return (
      <EmptyState title="No thoughts yet" description="When you share a thought, you can follow its results here.">
        <Button asChild>
          <Link href="/only-one/new">Share a thought</Link>
        </Button>
      </EmptyState>
    );
  }
  return (
    <ul className="space-y-3">
      {thoughts.map((t) => {
        const total = t.result ? t.result.meToo + t.result.notMe : 0;
        const pct = total ? Math.round((t.result!.meToo / total) * 100) : null;
        return (
          <li key={t.id}>
            <Link
              href={`/only-one/${t.id}`}
              className="block rounded-2xl border bg-card p-5 transition-colors hover:border-primary/40"
            >
              <p className="font-heading text-lg leading-snug">{t.body}</p>
              <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                <span className="rounded-full bg-muted px-2 py-0.5 font-medium text-foreground/80">
                  {STATUS_LABEL[t.status]}
                </span>
                <span>{thoughtCategoryLabel[t.category]}</span>
                <span suppressHydrationWarning>{timeAgo(t.createdAt)}</span>
                <span className="font-medium text-primary">
                  {pct === null ? "No votes yet" : `${pct}% relate · ${total} votes`}
                </span>
              </p>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

async function MyQuestions() {
  if (!(await getSessionUser())) return null;
  const questions = await getMyQuestions();
  if (questions.length === 0) {
    return (
      <EmptyState title="No questions yet" description="Ask the thing you've always wondered, anonymously.">
        <Button asChild>
          <Link href="/ask/new">Ask a question</Link>
        </Button>
      </EmptyState>
    );
  }
  return (
    <ul className="space-y-3">
      {questions.map((q) => (
        <li key={q.id}>
          <QuestionCard question={q} />
          {q.status !== "published" ? (
            <p className="mt-1.5 px-2 text-xs text-muted-foreground">{STATUS_LABEL[q.status]}</p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

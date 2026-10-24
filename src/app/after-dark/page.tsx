import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { MessageCircleQuestion, Moon, Plus } from "lucide-react";
import { getQuestionFeed } from "@/lib/data/questions.server";
import { getThoughtFeed } from "@/lib/data/thoughts.server";
import { Button } from "@/components/ui/button";
import { AfterDarkVeil } from "@/components/after-dark/after-dark-veil";
import { QuestionCard } from "@/components/questions/question-card";
import { QuestionFeedSkeleton } from "@/components/questions/question-feed";
import { ThoughtCard } from "@/components/thoughts/thought-card";

export const metadata: Metadata = {
  title: "After Dark",
  description: "The questions people only ask at 2am. Anonymous, 18+.",
  robots: { index: false },
};

/** Always dark, whatever the visitor's theme: it's the 2am corner of Secretly. */
export default function AfterDarkPage() {
  return (
    <div className="dark -mb-px min-h-[calc(100dvh-4rem)] bg-background text-foreground">
      <div className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-48 mx-auto h-[30rem] max-w-3xl rounded-full bg-primary/20 blur-3xl"
        />
        <header className="relative mx-auto max-w-2xl px-5 pt-14 pb-10 text-center sm:pt-20">
          <p className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-card/60 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-primary">
            <Moon className="size-3.5" aria-hidden /> After Dark · 18+
          </p>
          <h1 className="text-[2.5rem] leading-[1.05] font-normal sm:text-6xl">
            The questions people only ask <em className="text-primary">at 2am.</em>
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-lg text-pretty text-muted-foreground">
            Dating, sex, crushes and everything in between. Ask anything, confess anything. Nobody will ever know it
            was you.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="rounded-full">
              <Link href="/ask/new?category=after_dark">
                <MessageCircleQuestion data-icon="inline-start" /> Ask the awkward one
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full">
              <Link href="/only-one/new?category=after_dark">
                <Plus data-icon="inline-start" /> Confess something
              </Link>
            </Button>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            Suggestive is fine, explicit isn&apos;t. Be kind. See the{" "}
            <Link href="/guidelines" className="underline underline-offset-4 hover:text-foreground">
              guidelines
            </Link>
            .
          </p>
        </header>
      </div>

      <div className="mx-auto max-w-2xl px-5 pb-20">
        <Suspense fallback={<QuestionFeedSkeleton />}>
          <AfterDarkContent />
        </Suspense>
      </div>
    </div>
  );
}

async function AfterDarkContent() {
  const [questions, thoughts] = await Promise.all([
    getQuestionFeed({ sort: "newest", category: "after_dark" }),
    getThoughtFeed({ sort: "trending", category: "after_dark" }),
  ]);

  return (
    <AfterDarkVeil>
      <div className="space-y-14">
        <section aria-labelledby="ad-questions" className="space-y-4">
          <h2 id="ad-questions" className="text-2xl font-normal">
            Asked after dark
          </h2>
          {questions.length === 0 ? (
            <p className="rounded-2xl bg-muted px-4 py-5 text-sm text-muted-foreground">Be the first to ask.</p>
          ) : (
            <ul className="space-y-3">
              {questions.map((q) => (
                <li key={q.id}>
                  <QuestionCard question={q} />
                </li>
              ))}
            </ul>
          )}
        </section>

        <section aria-labelledby="ad-thoughts" className="space-y-4">
          <h2 id="ad-thoughts" className="text-2xl font-normal">
            Confessed after dark
          </h2>
          {thoughts.length === 0 ? (
            <p className="rounded-2xl bg-muted px-4 py-5 text-sm text-muted-foreground">Be the first to confess.</p>
          ) : (
            <ul className="space-y-4">
              {thoughts.map((t) => (
                <li key={t.id}>
                  <ThoughtCard thought={t} variant="list" />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </AfterDarkVeil>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, MessageCircleQuestion, Plus, Sparkles } from "lucide-react";
import { features } from "@/config/site";
import { onlyOneViews } from "@/config/thoughts";
import { getNextThoughts, getThoughtFeed } from "@/lib/data/thoughts.server";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { SegmentedNav } from "@/components/shared/segmented-nav";
import { ThoughtDeck, ThoughtDeckSkeleton } from "@/components/thoughts/thought-deck";
import { ThoughtCard } from "@/components/thoughts/thought-card";
import { ThoughtFeedSkeleton } from "@/components/thoughts/thought-feed";

export const metadata: Metadata = {
  title: features["only-one"].title,
  description: "Anonymous thoughts people have never said out loud. Vote, then see how many people feel the same.",
};

export default function OnlyOnePage() {
  return (
    <div className="pb-8">
      <PageHeader
        eyebrow="Am I the only one?"
        title={
          <>
            Does anyone else <em className="text-primary">feel this way?</em>
          </>
        }
        description="Read a thought someone has never said out loud. Vote honestly, then see how many people feel the same."
      >
        <Button asChild size="lg" className="mt-7">
          <Link href="/only-one/new">
            <Plus data-icon="inline-start" /> Share your thought
          </Link>
        </Button>
      </PageHeader>

      <div className="mx-auto max-w-xl space-y-6 px-5">
        <SegmentedNav label="View" items={onlyOneViews} current="deck" />
        <Suspense
          fallback={
            <div className="space-y-16">
              <ThoughtDeckSkeleton />
              <ThoughtFeedSkeleton />
            </div>
          }
        >
          <DeckAndMore />
        </Suspense>
        <AlsoOnSecretly />
      </div>
    </div>
  );
}

async function DeckAndMore() {
  const [deck, newest] = await Promise.all([getNextThoughts(), getThoughtFeed({ sort: "newest" })]);
  const inDeck = new Set(deck.map((t) => t.id));
  const more = newest.filter((t) => !inDeck.has(t.id)).slice(0, 3);

  return (
    <div className="space-y-16">
      <ThoughtDeck initial={deck} />
      {more.length > 0 ? (
        <section aria-labelledby="new-thoughts" className="space-y-4">
          <div className="flex items-end justify-between gap-3">
            <h2 id="new-thoughts" className="text-2xl font-normal">
              New thoughts
            </h2>
            <Link
              href="/only-one/browse?sort=newest"
              className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              See all <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          <ul className="space-y-4">
            {more.map((t) => (
              <li key={t.id}>
                <ThoughtCard thought={t} variant="list" />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

/** Cross-links so people discover the other two features. */
function AlsoOnSecretly() {
  const items = [
    {
      href: "/ask",
      icon: MessageCircleQuestion,
      title: "The question you can't ask",
      body: "Get honest answers to the things you're too embarrassed to ask anyone you know.",
    },
    {
      href: "/exchange",
      icon: Sparkles,
      title: "The secret exchange",
      body: "Give a secret, get a stranger's secret back. Three a day.",
    },
  ];
  return (
    <section aria-labelledby="also-heading" className="mt-16 space-y-4">
      <h2 id="also-heading" className="text-2xl font-normal">
        Also on Secretly
      </h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map(({ href, icon: Icon, title, body }) => (
          <Link
            key={href}
            href={href}
            className="group rounded-3xl border bg-card p-5 transition-colors hover:border-primary/40"
          >
            <span className="inline-flex size-9 items-center justify-center rounded-xl bg-accent text-accent-foreground">
              <Icon className="size-4.5" aria-hidden />
            </span>
            <span className="mt-3 block font-heading text-lg leading-snug group-hover:text-primary">{title}</span>
            <span className="mt-1 block text-sm text-muted-foreground">{body}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

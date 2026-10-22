import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Plus } from "lucide-react";
import { features } from "@/config/site";
import { onlyOneViews } from "@/config/thoughts";
import { getNextThoughts } from "@/lib/data/thoughts.server";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { SegmentedNav } from "@/components/shared/segmented-nav";
import { ThoughtDeck, ThoughtDeckSkeleton } from "@/components/thoughts/thought-deck";

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
        <Suspense fallback={<ThoughtDeckSkeleton />}>
          <Deck />
        </Suspense>
      </div>
    </div>
  );
}

async function Deck() {
  const thoughts = await getNextThoughts();
  return <ThoughtDeck initial={thoughts} />;
}

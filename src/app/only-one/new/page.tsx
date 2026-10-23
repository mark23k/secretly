import type { Metadata } from "next";
import { Suspense } from "react";
import { thoughtCategories, type ThoughtCategory } from "@/config/thoughts";
import { PageHeader } from "@/components/shared/page-header";
import { ThoughtComposer } from "@/components/thoughts/thought-composer";

export const metadata: Metadata = {
  title: "Share a thought",
  description: "Post a thought anonymously and find out how many people feel the same.",
};

export default function NewThoughtPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  return (
    <div className="pb-8">
      <PageHeader
        eyebrow="Am I the only one?"
        title="What do you secretly wonder if anyone else does?"
        description="Something you think, feel or do that you've never admitted. Strangers will vote, and you'll see how many relate."
      />
      <div className="mx-auto max-w-xl px-5">
        <Suspense fallback={<ThoughtComposer />}>
          <Composer searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}

async function Composer({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const initial = thoughtCategories.find((c) => c.value === category)?.value as ThoughtCategory | undefined;
  return <ThoughtComposer key={initial ?? "none"} initialCategory={initial ?? null} />;
}

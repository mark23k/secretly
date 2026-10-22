import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { ThoughtComposer } from "@/components/thoughts/thought-composer";

export const metadata: Metadata = {
  title: "Share a thought",
  description: "Post a thought anonymously and find out how many people feel the same.",
};

export default function NewThoughtPage() {
  return (
    <div className="pb-8">
      <PageHeader
        eyebrow="Am I the only one?"
        title="What do you secretly wonder if anyone else does?"
        description="Something you think, feel or do that you've never admitted. Strangers will vote, and you'll see how many relate."
      />
      <div className="mx-auto max-w-xl px-5">
        <ThoughtComposer />
      </div>
    </div>
  );
}

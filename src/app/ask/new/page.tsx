import type { Metadata } from "next";
import { Suspense } from "react";
import { questionCategories, type QuestionCategory } from "@/config/questions";
import { PageHeader } from "@/components/shared/page-header";
import { QuestionComposer } from "@/components/questions/question-composer";

export const metadata: Metadata = {
  title: "Ask a question",
  description: "Ask the question you can't ask anyone you know. Anonymously.",
};

export default function NewQuestionPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  return (
    <div className="pb-8">
      <PageHeader
        eyebrow="The question you can't ask"
        title="What have you always wanted to ask?"
        description="No question is too embarrassing. Nobody will ever know it was you."
      />
      <div className="mx-auto max-w-xl px-5">
        <Suspense fallback={<QuestionComposer />}>
          <Composer searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}

async function Composer({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const initial = questionCategories.find((c) => c.value === category)?.value as QuestionCategory | undefined;
  return <QuestionComposer key={initial ?? "none"} initialCategory={initial ?? null} />;
}

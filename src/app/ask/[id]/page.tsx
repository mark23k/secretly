import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import { z } from "zod";
import { getAnswers, getQuestion } from "@/lib/data/questions.server";
import { QuestionDetail } from "@/components/questions/question-detail";
import { QuestionFeedSkeleton } from "@/components/questions/question-feed";

type Params = Promise<{ id: string }>;
type Search = Promise<{ new?: string }>;

async function load(params: Params) {
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) return null;
  return getQuestion(id);
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const question = await load(params);
  if (!question || question.status !== "published") return { title: "Question", robots: { index: false } };
  return {
    title: question.title,
    description: `${question.answerCount} anonymous ${question.answerCount === 1 ? "answer" : "answers"} on Secretly.`,
    openGraph: { title: question.title, description: "Anonymous, honest answers on Secretly." },
  };
}

export default function QuestionPage({ params, searchParams }: { params: Params; searchParams: Search }) {
  return (
    <div className="mx-auto max-w-2xl px-5 pt-8 pb-8 sm:pt-12">
      <Link
        href="/ask"
        className="mb-6 inline-flex items-center gap-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden /> All questions
      </Link>
      <Suspense fallback={<QuestionFeedSkeleton />}>
        <Detail params={params} searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function Detail({ params, searchParams }: { params: Params; searchParams: Search }) {
  const [question, search] = await Promise.all([load(params), searchParams]);
  if (!question) notFound();
  const answers = question.status === "published" ? await getAnswers(question.id) : [];
  return <QuestionDetail question={question} answers={answers} isNew={search.new === "1"} />;
}

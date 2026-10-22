import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import { z } from "zod";
import { getThought, getThoughtComments } from "@/lib/data/thoughts.server";
import { ThoughtDetail } from "@/components/thoughts/thought-detail";
import { ThoughtDeckSkeleton } from "@/components/thoughts/thought-deck";

type Params = Promise<{ id: string }>;
type Search = Promise<{ new?: string }>;

async function load(params: Params) {
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) return null;
  return getThought(id);
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const thought = await load(params);
  if (!thought || thought.status !== "published") return { title: "Thought", robots: { index: false } };
  const title = `“${thought.body.length > 80 ? `${thought.body.slice(0, 77)}…` : thought.body}”`;
  return {
    title: "Am I the only one?",
    description: thought.body,
    openGraph: { title, description: "Do you relate? Vote anonymously on Secretly." },
  };
}

export default function ThoughtPage({ params, searchParams }: { params: Params; searchParams: Search }) {
  return (
    <div className="mx-auto max-w-xl px-5 pt-8 pb-8 sm:pt-12">
      <Link
        href="/only-one"
        className="mb-6 inline-flex items-center gap-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden /> More thoughts
      </Link>
      <h1 className="sr-only">Am I the only one?</h1>
      <Suspense fallback={<ThoughtDeckSkeleton />}>
        <Detail params={params} searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function Detail({ params, searchParams }: { params: Params; searchParams: Search }) {
  const [thought, search] = await Promise.all([load(params), searchParams]);
  if (!thought) notFound();
  const comments = thought.status === "published" ? await getThoughtComments(thought.id) : [];
  return <ThoughtDetail thought={thought} comments={comments} isNew={search.new === "1"} />;
}

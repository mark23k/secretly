"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Link2, Lock } from "lucide-react";
import type { Thought, ThoughtComment } from "@/lib/data/thoughts";
import { Button } from "@/components/ui/button";
import { ThoughtCard } from "./thought-card";
import { ThoughtComments } from "./thought-comments";

const LIVE_REFRESH_MS = 20_000;

export function ThoughtDetail({
  thought,
  comments,
  isNew,
}: {
  thought: Thought;
  comments: ThoughtComment[];
  isNew: boolean;
}) {
  const router = useRouter();
  const [revealed, setRevealed] = useState(thought.result !== null);

  // The author's page is a live results page: refresh the counts periodically.
  useEffect(() => {
    if (!thought.isMine || thought.status !== "published") return;
    const id = setInterval(() => router.refresh(), LIVE_REFRESH_MS);
    return () => clearInterval(id);
  }, [router, thought.isMine, thought.status]);

  const resultKey = thought.result ? `${thought.result.meToo}-${thought.result.notMe}` : "none";

  return (
    <div className="space-y-10">
      {isNew && thought.isMine ? <PostedBanner pending={thought.status === "pending"} /> : null}

      <ThoughtCard
        key={thought.isMine ? resultKey : thought.id}
        thought={thought}
        variant="detail"
        onVoted={() => setRevealed(true)}
      />

      {thought.status === "published" ? (
        revealed ? (
          <ThoughtComments thoughtId={thought.id} initial={comments} canComment />
        ) : (
          <p className="flex items-center justify-center gap-2 rounded-2xl border border-dashed px-4 py-6 text-center text-sm text-muted-foreground">
            <Lock className="size-4" aria-hidden />
            Vote to read {thought.commentCount > 0 ? `${thought.commentCount} ` : ""}
            {thought.commentCount === 1 ? "experience" : "experiences"} from others.
          </p>
        )
      ) : null}
    </div>
  );
}

function PostedBanner({ pending }: { pending: boolean }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(window.location.href.replace(/\?.*$/, ""));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked; the URL is still in the address bar.
    }
  }

  return (
    <div className="animate-fade-up rounded-3xl bg-accent/60 p-5 text-accent-foreground sm:p-6">
      <p className="font-heading text-xl">{pending ? "Almost there." : "It's out there now."}</p>
      <p className="mt-1 text-sm opacity-90">
        {pending
          ? "Your thought is waiting for a quick review before it goes public. Come back to this page any time."
          : "This page updates as people vote. Bookmark it, or find it later under “My posts”."}
      </p>
      <Button variant="outline" size="sm" className="mt-4 bg-background/70" onClick={copy}>
        {copied ? <Check data-icon="inline-start" /> : <Link2 data-icon="inline-start" />}
        {copied ? "Link copied" : "Copy link"}
      </Button>
    </div>
  );
}

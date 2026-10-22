"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { addThoughtComment } from "@/app/actions/thoughts";
import { textLimits } from "@/config/limits";
import type { ThoughtComment } from "@/lib/data/thoughts";
import { useAction } from "@/hooks/use-action";
import { timeAgo } from "@/lib/time";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AnonymityNote } from "@/components/shared/anonymity-note";
import { CharCounter } from "@/components/shared/char-counter";
import { ReportButton } from "@/components/shared/report-button";

export function ThoughtComments({
  thoughtId,
  initial,
  canComment,
}: {
  thoughtId: string;
  initial: ThoughtComment[];
  canComment: boolean;
}) {
  const [comments, setComments] = useState(initial);
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { execute, pending } = useAction(addThoughtComment, {
    toastErrors: false,
    heldMessage: "Thanks for sharing. It'll appear after a quick review.",
  });
  const ids = { input: useId(), counter: useId(), error: useId(), heading: useId() };
  const { min, max } = textLimits.thoughtComment;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await execute({ thoughtId, body });
    if (res.ok) {
      setBody("");
      if (res.data.published) setComments((c) => [...c, res.data.comment]);
    } else {
      setError(res.fieldErrors?.body ?? res.message);
    }
  }

  return (
    <section aria-labelledby={ids.heading} className="space-y-5">
      <h2 id={ids.heading} className="text-2xl font-normal">
        Experiences <span className="text-muted-foreground">{comments.length > 0 ? comments.length : ""}</span>
      </h2>

      {comments.length === 0 ? (
        <p className="rounded-2xl bg-muted px-4 py-5 text-sm text-muted-foreground">
          No one has shared their experience yet. Yours could be the one that makes someone feel less alone.
        </p>
      ) : (
        <ol className="space-y-3">
          <AnimatePresence initial={false}>
            {comments.map((c) => (
              <motion.li
                key={c.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border bg-card px-4 py-3.5"
              >
                <p className="text-[0.95rem] text-pretty whitespace-pre-line">{c.body}</p>
                <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                  <time dateTime={c.createdAt} suppressHydrationWarning>
                    {timeAgo(c.createdAt)}
                  </time>
                  <ReportButton kind="thought_comment" id={c.id} className="-mr-2" />
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ol>
      )}

      {canComment ? (
        <form onSubmit={submit} className="space-y-3" noValidate>
          <label htmlFor={ids.input} className="text-sm font-medium">
            Add your experience
          </label>
          <Textarea
            id={ids.input}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={3}
            maxLength={max + 30}
            placeholder="What's it like for you?"
            aria-describedby={`${ids.counter} ${error ? ids.error : ""}`}
            aria-invalid={Boolean(error)}
            className="rounded-2xl bg-card"
          />
          {error ? (
            <p id={ids.error} role="alert" className="text-sm text-destructive">
              {error}
            </p>
          ) : null}
          <div className="flex items-center justify-between gap-3">
            <CharCounter value={body} max={max} id={ids.counter} />
            <Button type="submit" disabled={pending || body.trim().length < min || body.length > max}>
              {pending ? "Sharing…" : "Share anonymously"}
            </Button>
          </div>
          <AnonymityNote />
        </form>
      ) : null}
    </section>
  );
}

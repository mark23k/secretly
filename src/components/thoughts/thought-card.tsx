"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { AnimatePresence, motion } from "motion/react";
import { Clock, MessageCircle, Moon } from "lucide-react";
import { peekThought, voteThought } from "@/app/actions/thoughts";
import { thoughtCategoryLabel } from "@/config/thoughts";
import type { Thought } from "@/lib/data/thoughts";
import { useAction } from "@/hooks/use-action";
import { timeAgo } from "@/lib/time";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ReportButton } from "@/components/shared/report-button";
import { AfterDarkVeil } from "@/components/after-dark/after-dark-veil";
import { useAuth } from "@/components/providers/auth-provider";
import { useGuestAllowance } from "@/hooks/use-guest-allowance";
import { ResultBar } from "./result-bar";
import { ReactionBar } from "./reaction-bar";

type Variant = "deck" | "list" | "detail";

/**
 * A thought with its full voting lifecycle: vote first, then see the result,
 * react, and jump to the experiences (comments).
 */
export function ThoughtCard({
  thought: initial,
  variant,
  onVoted,
  voteRef,
  className,
}: {
  thought: Thought;
  variant: Variant;
  onVoted?: (t: Thought) => void;
  /** Lets the deck vote by swipe or keyboard. Set while the card can be voted on. */
  voteRef?: React.RefObject<((choice: number) => void) | null>;
  className?: string;
}) {
  const [thought, setThought] = useState(initial);
  const [hidden, setHidden] = useState(false);
  const [peeked, setPeeked] = useState(false);
  const [peeking, setPeeking] = useState(false);
  const { user, openAuth } = useAuth();
  const guest = useGuestAllowance();
  const { execute, pending: voting } = useAction(voteThought, {
    authReason: "That's your 3 free looks. Create a free account to keep going, it stays anonymous.",
  });
  const pending = voting || peeking;
  const revealed = thought.result !== null;
  const href = `/only-one/${thought.id}`;

  async function vote(choice: number) {
    // Signed out: a few free looks show the result straight away (not counted).
    // After that, voting asks them to sign up and then counts the vote.
    if (user === null && !guest.exhausted) {
      guest.use();
      setPeeking(true);
      const res = await peekThought({ thoughtId: thought.id });
      setPeeking(false);
      if (res.ok) {
        const peekedThought = { ...res.data, myChoice: choice };
        setThought(peekedThought);
        setPeeked(true);
        onVoted?.(peekedThought);
      } else {
        toast.error(res.message);
      }
      return;
    }
    const res = await execute({ thoughtId: thought.id, choice });
    if (res.ok) {
      setThought(res.data);
      onVoted?.(res.data);
    }
  }

  useEffect(() => {
    if (!voteRef) return;
    const own = thought.result === null && !pending ? (choice: number) => void vote(choice) : null;
    voteRef.current = own;
    return () => {
      // A card animating out unmounts after the next card took over: leave that one alone.
      if (voteRef.current === own) voteRef.current = null;
    };
  });

  if (thought.category === "after_dark") {
    return (
      <AfterDarkVeil className={className} size={variant === "list" ? "compact" : "card"}>
        {renderCard()}
      </AfterDarkVeil>
    );
  }
  return renderCard();

  function renderCard() {
    if (hidden) {
      return (
        <div
          className={cn(
            "rounded-3xl border border-dashed p-6 text-center text-sm text-muted-foreground",
            className,
          )}
        >
          Thanks. You won&apos;t see this one again.
        </div>
      );
    }

    return (
      <article
        aria-label="Anonymous thought"
        className={cn(
          "rounded-3xl border bg-card shadow-[0_1px_2px_rgb(0_0_0/0.03)]",
          variant === "list" ? "p-5 sm:p-6" : "p-6 sm:p-8",
          className,
        )}
      >
        <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
          <p className="flex items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 font-medium text-foreground/80",
                thought.category === "after_dark" && "bg-[#2b1633] text-[#e2c3ea]",
              )}
            >
              {thought.category === "after_dark" ? <Moon className="size-3" aria-hidden /> : null}
              {thoughtCategoryLabel[thought.category]}
            </span>
            <time dateTime={thought.createdAt} suppressHydrationWarning>
              {timeAgo(thought.createdAt)}
            </time>
            {thought.isMine ? <span className="font-medium text-primary">· Yours</span> : null}
          </p>
          {!thought.isMine ? (
            <ReportButton kind="thought" id={thought.id} onReported={() => setHidden(true)} />
          ) : null}
        </div>

        {thought.status === "pending" ? (
          <p className="mt-4 flex items-center gap-2 rounded-xl bg-accent/60 px-3 py-2 text-xs text-accent-foreground">
            <Clock className="size-3.5" aria-hidden /> Waiting for a quick review. Only you can see
            this for now.
          </p>
        ) : null}

        <BodyText thought={thought} variant={variant} href={href} />

        <AnimatePresence mode="wait" initial={false}>
          {!revealed ? (
            <motion.div
              key="vote"
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="mt-6 space-y-3"
            >
              <p className="text-sm text-muted-foreground" id={`prompt-${thought.id}`}>
                {thought.options[0] === "Me too" && thought.options.length === 2
                  ? "Do you relate? Vote to see how many people do."
                  : "Pick your answer to see what everyone said."}
              </p>
              <div
                role="group"
                aria-labelledby={`prompt-${thought.id}`}
                className={cn("grid gap-2.5", thought.options.length === 2 ? "grid-cols-2" : "grid-cols-1")}
              >
                {thought.options.map((label, i) => (
                  <Button
                    key={label}
                    size="lg"
                    variant={i === 0 && thought.options.length === 2 ? "default" : "outline"}
                    onClick={() => vote(i)}
                    disabled={pending}
                    className={cn("h-auto min-h-10 py-2.5 whitespace-normal", thought.options.length > 2 && "justify-start text-left")}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 space-y-5"
            >
              <ResultBar
                options={thought.options}
                counts={thought.result!}
                myChoice={thought.myChoice}
                mine={thought.isMine}
              />
              {peeked ? (
                <p className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-accent/60 px-3 py-2 text-xs text-accent-foreground">
                  <span>Your vote isn&apos;t counted yet.</span>
                  <button
                    type="button"
                    onClick={() => openAuth("sign-up")}
                    className="rounded font-semibold underline underline-offset-4 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                  >
                    Make it count, it&apos;s free
                  </button>
                </p>
              ) : null}
              {thought.status === "published" ? (
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <ReactionBar
                    thoughtId={thought.id}
                    counts={thought.reactionCounts}
                    mine={thought.myReactions}
                  />
                  {variant !== "detail" ? (
                    <Link
                      href={href}
                      className="inline-flex items-center gap-1.5 rounded-lg px-1 py-1 text-sm font-medium text-muted-foreground hover:text-foreground"
                    >
                      <MessageCircle className="size-4" aria-hidden />
                      {thought.commentCount > 0
                        ? `${thought.commentCount} ${thought.commentCount === 1 ? "experience" : "experiences"}`
                        : "Share your experience"}
                    </Link>
                  ) : null}
                </div>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>
      </article>
    );
  }
}

function BodyText({
  thought,
  variant,
  href,
}: {
  thought: Thought;
  variant: Variant;
  href: string;
}) {
  const text = (
    <p
      className={cn(
        "font-heading leading-snug tracking-[-0.01em] text-pretty whitespace-pre-line",
        variant === "list" ? "text-xl" : "text-2xl sm:text-[1.75rem]",
      )}
    >
      {thought.body}
    </p>
  );
  if (variant === "list") {
    return (
      <Link href={href} className="mt-4 block rounded-lg hover:text-primary/90">
        {text}
      </Link>
    );
  }
  return <div className="mt-5">{text}</div>;
}

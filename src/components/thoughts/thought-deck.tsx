"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValue, useTransform, type PanInfo } from "motion/react";
import { ArrowRight, Flame, Plus, SkipForward } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toThought, type Thought } from "@/lib/data/thoughts";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { ThoughtCard } from "./thought-card";

const SWIPE_DISTANCE = 110;
const SWIPE_VELOCITY = 550;

/**
 * Card mode: a deck of thoughts. Vote by tapping, swiping (right = me too,
 * left = not me) or arrow keys, see the result, then swipe/tap to the next.
 * Prefetches more unseen thoughts as the queue runs low.
 */
export function ThoughtDeck({ initial }: { initial: Thought[] }) {
  const [queue, setQueue] = useState(initial);
  const [index, setIndex] = useState(0);
  const [voted, setVoted] = useState(false);
  const [votedCount, setVotedCount] = useState(0);
  const [exitDir, setExitDir] = useState<1 | -1>(-1);
  const [exhausted, setExhausted] = useState(initial.length === 0);
  const seen = useRef(new Set(initial.map((t) => t.id)));
  const loading = useRef(false);
  const voteRef = useRef<((meToo: boolean) => void) | null>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  const current = queue[index];
  const behind = queue.slice(index + 1, index + 3);

  const loadMore = useCallback(async () => {
    if (loading.current) return;
    loading.current = true;
    try {
      const { data, error } = await createClient().rpc("get_next_thoughts", {
        p_limit: 8,
        p_exclude: [...seen.current],
      });
      if (error) throw error;
      const fresh = data.map(toThought).filter((t) => !seen.current.has(t.id));
      fresh.forEach((t) => seen.current.add(t.id));
      if (fresh.length === 0) setExhausted(true);
      setQueue((q) => [...q, ...fresh]);
    } catch {
      setExhausted(true);
    } finally {
      loading.current = false;
    }
  }, []);

  useEffect(() => {
    if (voted) nextRef.current?.focus({ preventScroll: true });
  }, [voted]);

  const next = useCallback(
    (dir: 1 | -1 = -1) => {
      setExitDir(dir);
      setVoted(false);
      setIndex(index + 1);
      if (!exhausted && queue.length - (index + 1) <= 3) void loadMore();
    },
    [index, exhausted, queue.length, loadMore]
  );

  /** Right = "me too" (or next once voted), left = "not me" (or next). */
  const act = useCallback(
    (dir: 1 | -1) => {
      if (voted) return next(dir);
      voteRef.current?.(dir === 1);
    },
    [voted, next]
  );

  // Keyboard: ← / → vote (then move on), S skips. Ignored while typing.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const el = e.target as HTMLElement | null;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (el?.closest("input, textarea, [contenteditable], [role=dialog]")) return;
      if (e.key === "ArrowRight") act(1);
      else if (e.key === "ArrowLeft") act(-1);
      else if (e.key.toLowerCase() === "s" && !voted) next(-1);
      else return;
      e.preventDefault();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [act, next, voted]);

  if (!current) {
    return (
      <EmptyState
        title={queue.length === 0 ? "It's quiet in here" : "You've seen every thought for now"}
        description="New thoughts arrive all the time. Why not add yours? Someone out there is wondering the same thing."
      >
        <Button asChild>
          <Link href="/only-one/new">
            <Plus data-icon="inline-start" /> Share a thought
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/only-one/browse">Browse all</Link>
        </Button>
      </EmptyState>
    );
  }

  return (
    <div className="space-y-5">
      <div className="relative isolate">
        {/* The next cards peek out from behind, so it reads as a deck. */}
        {behind.map((t, i) => (
          <div
            key={t.id}
            aria-hidden
            className="absolute inset-x-0 top-0 h-full rounded-3xl border bg-card shadow-sm"
            style={{
              transform: `translateY(${(i + 1) * 10}px) rotate(${i === 0 ? -2.5 : 3}deg) scale(${1 - (i + 1) * 0.025})`,
              opacity: 1 - (i + 1) * 0.25,
              zIndex: -1 - i,
            }}
          />
        ))}

        <AnimatePresence mode="popLayout" initial={false} custom={exitDir}>
          <SwipeCard key={current.id} onSwipe={act} voted={voted}>
            <ThoughtCard
              thought={current}
              variant="deck"
              voteRef={voteRef}
              onVoted={() => {
                setVoted(true);
                setVotedCount((n) => n + 1);
              }}
            />
          </SwipeCard>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between gap-3 pt-3">
        <p className="flex min-w-24 items-center gap-1.5 text-sm text-muted-foreground" aria-live="polite">
          {votedCount > 0 ? (
            <>
              <Flame className="size-4 text-primary" aria-hidden />
              <span className="font-medium text-foreground tabular-nums">{votedCount}</span> voted
            </>
          ) : (
            <span className="hidden sm:inline">Swipe or use ← →</span>
          )}
        </p>
        {voted ? (
          <Button ref={nextRef} onClick={() => next(-1)} size="lg" className="rounded-full px-6">
            Next thought <ArrowRight data-icon="inline-end" />
          </Button>
        ) : (
          <Button variant="outline" onClick={() => next(-1)} className="rounded-full px-5">
            Skip <SkipForward data-icon="inline-end" />
          </Button>
        )}
      </div>
      <p className="text-center text-xs text-muted-foreground sm:hidden">
        Swipe right for <span className="font-medium text-foreground">me too</span>, left for{" "}
        <span className="font-medium text-foreground">not me</span>
      </p>
    </div>
  );
}

/** The top card: draggable left/right, tilting as it goes, with stamp hints. */
const cardVariants = {
  enter: { opacity: 0, y: 14, scale: 0.97 },
  center: { opacity: 1, y: 0, scale: 1 },
  // `dir` comes from AnimatePresence's `custom`, so it's the latest swipe direction.
  exit: (dir: 1 | -1) => ({ opacity: 0, x: dir * 320, rotate: dir * 12, transition: { duration: 0.28 } }),
};

function SwipeCard({
  children,
  onSwipe,
  voted,
}: {
  children: React.ReactNode;
  onSwipe: (dir: 1 | -1) => void;
  voted: boolean;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-240, 240], [-9, 9]);
  const yesOpacity = useTransform(x, [15, 70], [0, 1]);
  const noOpacity = useTransform(x, [-70, -15], [1, 0]);

  function onDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x > SWIPE_DISTANCE || info.velocity.x > SWIPE_VELOCITY) onSwipe(1);
    else if (info.offset.x < -SWIPE_DISTANCE || info.velocity.x < -SWIPE_VELOCITY) onSwipe(-1);
  }

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.85}
      dragSnapToOrigin
      onDragEnd={onDragEnd}
      style={{ x, rotate }}
      variants={cardVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      className="relative cursor-grab touch-pan-y active:cursor-grabbing"
    >
      {children}
      {!voted ? (
        <>
          <motion.span
            aria-hidden
            style={{ opacity: yesOpacity }}
            className="pointer-events-none absolute top-6 left-6 -rotate-12 rounded-xl border-2 border-primary bg-card px-3 py-1 font-sans text-lg font-bold tracking-wide text-primary uppercase"
          >
            Me too
          </motion.span>
          <motion.span
            aria-hidden
            style={{ opacity: noOpacity }}
            className="pointer-events-none absolute top-6 right-6 rotate-12 rounded-xl border-2 border-muted-foreground bg-card px-3 py-1 font-sans text-lg font-bold tracking-wide text-muted-foreground uppercase"
          >
            Not me
          </motion.span>
        </>
      ) : null}
    </motion.div>
  );
}

export function ThoughtDeckSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading thoughts" className="rounded-3xl border bg-card p-6 sm:p-8">
      <div className="flex gap-2">
        <div className="h-6 w-20 animate-pulse rounded-full bg-muted" />
        <div className="h-6 w-14 animate-pulse rounded-full bg-muted" />
      </div>
      <div className="mt-6 space-y-3">
        <div className="h-6 w-full animate-pulse rounded-lg bg-muted" />
        <div className="h-6 w-11/12 animate-pulse rounded-lg bg-muted" />
        <div className="h-6 w-2/3 animate-pulse rounded-lg bg-muted" />
      </div>
      <div className="mt-8 grid grid-cols-2 gap-2.5">
        <div className="h-12 animate-pulse rounded-xl bg-muted" />
        <div className="h-12 animate-pulse rounded-xl bg-muted" />
      </div>
    </div>
  );
}

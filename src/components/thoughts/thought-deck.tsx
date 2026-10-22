"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toThought, type Thought } from "@/lib/data/thoughts";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { ThoughtCard } from "./thought-card";

/**
 * Card mode: one thought at a time. Vote → see result → next.
 * Prefetches more unseen thoughts as the queue runs low.
 */
export function ThoughtDeck({ initial }: { initial: Thought[] }) {
  const [queue, setQueue] = useState(initial);
  const [index, setIndex] = useState(0);
  const [voted, setVoted] = useState(false);
  const [exhausted, setExhausted] = useState(initial.length === 0);
  const seen = useRef(new Set(initial.map((t) => t.id)));
  const loading = useRef(false);
  const nextRef = useRef<HTMLButtonElement>(null);

  const current = queue[index];

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

  function next() {
    setVoted(false);
    setIndex(index + 1);
    if (!exhausted && queue.length - (index + 1) <= 3) void loadMore();
  }

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
    <div className="space-y-4">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={current.id}
          initial={{ opacity: 0, x: 40, rotate: 1.5 }}
          animate={{ opacity: 1, x: 0, rotate: 0 }}
          exit={{ opacity: 0, x: -40, rotate: -1.5 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        >
          <ThoughtCard thought={current} variant="deck" onVoted={() => setVoted(true)} />
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-between gap-3 px-1">
        <p className="text-xs text-muted-foreground tabular-nums" aria-live="polite">
          {index + 1} {exhausted ? `of ${queue.length}` : ""}
        </p>
        {voted ? (
          <Button ref={nextRef} onClick={next} size="lg">
            Next thought <ArrowRight data-icon="inline-end" />
          </Button>
        ) : (
          <Button variant="ghost" onClick={next} className="text-muted-foreground">
            Skip
          </Button>
        )}
      </div>
    </div>
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

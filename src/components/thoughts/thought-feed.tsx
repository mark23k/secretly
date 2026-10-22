"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toThought, type Thought } from "@/lib/data/thoughts";
import type { ThoughtCategory, ThoughtSort } from "@/config/thoughts";
import { Button } from "@/components/ui/button";
import { ThoughtCard } from "./thought-card";

const PAGE_SIZE = 20;

export function ThoughtFeed({
  initial,
  sort,
  category,
}: {
  initial: Thought[];
  sort: ThoughtSort;
  category?: ThoughtCategory;
}) {
  const [items, setItems] = useState(initial);
  const [done, setDone] = useState(initial.length < PAGE_SIZE);
  const [loading, setLoading] = useState(false);

  async function loadMore() {
    setLoading(true);
    const { data, error } = await createClient().rpc("get_thought_feed", {
      p_sort: sort,
      p_category: category,
      p_limit: PAGE_SIZE,
      p_offset: items.length,
    });
    setLoading(false);
    if (error) return;
    const ids = new Set(items.map((t) => t.id));
    const fresh = data.map(toThought).filter((t) => !ids.has(t.id));
    setItems((cur) => [...cur, ...fresh]);
    if (data.length < PAGE_SIZE) setDone(true);
  }

  return (
    <div className="space-y-4">
      <ul className="space-y-4">
        {items.map((t) => (
          <li key={t.id}>
            <ThoughtCard thought={t} variant="list" />
          </li>
        ))}
      </ul>
      {!done ? (
        <div className="flex justify-center pt-2">
          <Button variant="outline" onClick={loadMore} disabled={loading}>
            {loading ? "Loading…" : "Show more"}
          </Button>
        </div>
      ) : null}
    </div>
  );
}

export function ThoughtFeedSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading thoughts" className="space-y-4">
      {[0, 1, 2].map((i) => (
        <div key={i} className="rounded-3xl border bg-card p-6">
          <div className="h-5 w-24 animate-pulse rounded-full bg-muted" />
          <div className="mt-5 h-5 w-full animate-pulse rounded-lg bg-muted" />
          <div className="mt-2 h-5 w-3/4 animate-pulse rounded-lg bg-muted" />
          <div className="mt-6 grid grid-cols-2 gap-2.5">
            <div className="h-12 animate-pulse rounded-xl bg-muted" />
            <div className="h-12 animate-pulse rounded-xl bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}

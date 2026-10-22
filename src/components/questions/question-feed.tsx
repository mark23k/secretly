"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toQuestion, type Question } from "@/lib/data/questions";
import type { QuestionCategory, QuestionSort } from "@/config/questions";
import { Button } from "@/components/ui/button";
import { QuestionCard } from "./question-card";

const PAGE_SIZE = 20;

export function QuestionFeed({
  initial,
  sort,
  category,
  query,
}: {
  initial: Question[];
  sort: QuestionSort;
  category?: QuestionCategory;
  query?: string;
}) {
  const [items, setItems] = useState(initial);
  const [done, setDone] = useState(initial.length < PAGE_SIZE);
  const [loading, setLoading] = useState(false);

  async function loadMore() {
    setLoading(true);
    const { data, error } = await createClient().rpc("get_question_feed", {
      p_sort: sort,
      p_category: category,
      p_query: query,
      p_limit: PAGE_SIZE,
      p_offset: items.length,
    });
    setLoading(false);
    if (error) return;
    const ids = new Set(items.map((q) => q.id));
    setItems((cur) => [...cur, ...data.map(toQuestion).filter((q) => !ids.has(q.id))]);
    if (data.length < PAGE_SIZE) setDone(true);
  }

  return (
    <div className="space-y-4">
      <ul className="space-y-3">
        {items.map((q) => (
          <li key={q.id}>
            <QuestionCard question={q} />
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

export function QuestionFeedSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading questions" className="space-y-3">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="rounded-3xl border bg-card p-6">
          <div className="h-5 w-28 animate-pulse rounded-full bg-muted" />
          <div className="mt-4 h-5 w-full animate-pulse rounded-lg bg-muted" />
          <div className="mt-2 h-5 w-2/3 animate-pulse rounded-lg bg-muted" />
          <div className="mt-5 h-4 w-24 animate-pulse rounded-lg bg-muted" />
        </div>
      ))}
    </div>
  );
}

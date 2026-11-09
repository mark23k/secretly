"use client";

import { useState, useTransition } from "react";
import { loadMore } from "@/app/actions/posts";
import type { FeedTab, QuestionCard as Card } from "@/lib/queries";
import { QuestionCard } from "./question-card";

type Props = {
  initial: Card[];
  initialHasMore: boolean;
  tab: FeedTab;
  category?: string;
  query?: string;
  empty?: React.ReactNode;
};

export function FeedList({ initial, initialHasMore, tab, category, query, empty }: Props) {
  const [items, setItems] = useState(initial);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [pending, startTransition] = useTransition();

  if (items.length === 0) return <>{empty}</>;

  return (
    <div>
      <div className="grid gap-3">
        {items.map((q, i) => (
          <QuestionCard key={q.id} q={q} index={i} />
        ))}
      </div>
      {hasMore && (
        <div className="mt-5 flex justify-center">
          <button
            className="btn btn-soft px-6 py-3"
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                const next = await loadMore({ tab, category, query, offset: items.length });
                setItems((prev) => {
                  const seen = new Set(prev.map((p) => p.id));
                  return [...prev, ...next.items.filter((q) => !seen.has(q.id))];
                });
                setHasMore(next.hasMore);
              })
            }
          >
            {pending ? "Unfolding more notes…" : "Load more"}
          </button>
        </div>
      )}
    </div>
  );
}

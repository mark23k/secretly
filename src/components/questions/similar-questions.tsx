"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, CircleCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { SimilarQuestion } from "@/lib/data/questions";
import { answerLabel } from "./question-card";

const DEBOUNCE_MS = 350;
const MIN_CHARS = 8;

/** Finds already-asked questions similar to what's being typed. */
export async function findSimilarQuestions(text: string): Promise<SimilarQuestion[]> {
  const { data, error } = await createClient().rpc("search_similar_questions", { p_text: text, p_limit: 5 });
  if (error) return [];
  return data.map((q) => ({ id: q.id, title: q.title, answerCount: q.answer_count, helped: q.helped }));
}

/** "Similar questions already asked", updated as the asker types. */
export function SimilarQuestions({ text }: { text: string }) {
  const [results, setResults] = useState<{ for: string; items: SimilarQuestion[] }>({ for: "", items: [] });
  const query = text.trim();
  const active = isSupabaseConfigured && query.length >= MIN_CHARS;

  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    const timer = setTimeout(async () => {
      const items = await findSimilarQuestions(query);
      if (!cancelled) setResults({ for: query, items });
    }, DEBOUNCE_MS);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query, active]);

  const items = active ? results.items : [];

  return (
    <div aria-live="polite">
      <AnimatePresence initial={false}>
        {items.length > 0 ? (
          <motion.section
            key="similar"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            aria-label="Similar questions already asked"
            className="rounded-3xl border border-primary/25 bg-accent/40 p-4 sm:p-5"
          >
            <h2 className="font-sans text-sm font-semibold tracking-normal">Similar questions already asked</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Your answer might already be here. Or carry on and ask yours anyway.
            </p>
            <ul className="mt-3 space-y-2">
              {items.map((q) => (
                <li key={q.id}>
                  <Link
                    href={`/ask/${q.id}`}
                    target="_blank"
                    className="group flex items-start justify-between gap-3 rounded-2xl border bg-card px-4 py-3 transition-colors hover:border-primary/40"
                  >
                    <span>
                      <span className="block text-[0.95rem] leading-snug group-hover:text-primary">{q.title}</span>
                      <span className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                        {answerLabel(q.answerCount)}
                        {q.helped ? (
                          <span className="inline-flex items-center gap-1 text-primary">
                            <CircleCheck className="size-3.5" aria-hidden /> Helped the asker
                          </span>
                        ) : null}
                      </span>
                    </span>
                    <ArrowUpRight className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-label="Opens in a new tab" />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.section>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

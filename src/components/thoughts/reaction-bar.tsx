"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { toggleThoughtReaction } from "@/app/actions/thoughts";
import { reactions, type ReactionKey } from "@/config/thoughts";
import { useAction } from "@/hooks/use-action";
import { cn } from "@/lib/utils";

export function ReactionBar({
  thoughtId,
  counts: initialCounts,
  mine: initialMine,
  disabled = false,
}: {
  thoughtId: string;
  counts: Partial<Record<ReactionKey, number>>;
  mine: ReactionKey[];
  disabled?: boolean;
}) {
  const [counts, setCounts] = useState(initialCounts);
  const [mine, setMine] = useState(new Set(initialMine));
  const { execute } = useAction(toggleThoughtReaction);

  async function toggle(key: ReactionKey) {
    const wasOn = mine.has(key);
    // Optimistic update; roll back on failure.
    const prev = { counts, mine };
    setMine((s) => {
      const next = new Set(s);
      if (wasOn) next.delete(key);
      else next.add(key);
      return next;
    });
    setCounts((c) => ({ ...c, [key]: Math.max(0, (c[key] ?? 0) + (wasOn ? -1 : 1)) }));

    const res = await execute({ thoughtId, reaction: key });
    if (!res.ok) {
      setCounts(prev.counts);
      setMine(prev.mine);
    } else {
      setCounts(res.data.reactionCounts);
    }
  }

  return (
    <div role="group" aria-label="Reactions" className="flex flex-wrap gap-1.5">
      {reactions.map((r) => {
        const on = mine.has(r.key);
        const count = counts[r.key] ?? 0;
        return (
          <button
            key={r.key}
            type="button"
            disabled={disabled}
            onClick={() => toggle(r.key)}
            aria-pressed={on}
            aria-label={`${r.label}${count ? ` (${count})` : ""}`}
            title={r.label}
            className={cn(
              "inline-flex h-9 items-center gap-1.5 rounded-full border px-3 text-sm transition-all active:scale-95 disabled:opacity-50",
              on
                ? "border-primary/40 bg-accent text-accent-foreground"
                : "border-border bg-background hover:border-foreground/20 hover:bg-muted"
            )}
          >
            <motion.span
              aria-hidden
              key={on ? "on" : "off"}
              initial={{ scale: on ? 0.6 : 1 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
            >
              {r.emoji}
            </motion.span>
            {count > 0 ? <span className="text-xs font-medium tabular-nums">{count}</span> : null}
          </button>
        );
      })}
    </div>
  );
}

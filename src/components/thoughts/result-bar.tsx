"use client";

import { useEffect } from "react";
import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { formatCount } from "@/lib/time";

/**
 * "73% said me too" with a bar that fills and a number that counts up.
 * Respects reduced-motion via the app-wide MotionConfig.
 */
export function ResultBar({ meToo, notMe, mine = false }: { meToo: number; notMe: number; mine?: boolean }) {
  const total = meToo + notMe;
  const pct = total === 0 ? 0 : Math.round((meToo / total) * 100);
  const value = useMotionValue(0);
  const rounded = useTransform(value, (v) => `${Math.round(v)}%`);

  useEffect(() => {
    const controls = animate(value, pct, { duration: 0.9, ease: [0.22, 1, 0.36, 1] });
    return () => controls.stop();
  }, [pct, value]);

  if (total === 0) {
    return (
      <p className="rounded-2xl bg-muted px-4 py-3 text-sm text-muted-foreground">
        {mine ? "No votes yet. Check back soon, people are reading." : "You're the first to vote."}
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <p className="sr-only" aria-live="polite">
        {pct}% of {total} people said me too.
      </p>
      <div aria-hidden className="flex items-end justify-between gap-4">
        <p className="flex items-baseline gap-2">
          <motion.span className="font-heading text-4xl font-medium text-primary tabular-nums sm:text-5xl">
            {rounded}
          </motion.span>
          <span className="text-sm text-muted-foreground">said &ldquo;me too&rdquo;</span>
        </p>
        <span className="pb-1 text-xs text-muted-foreground tabular-nums">
          {formatCount(total)} {total === 1 ? "vote" : "votes"}
        </span>
      </div>
      <div aria-hidden className="h-2.5 overflow-hidden rounded-full bg-muted">
        <motion.div
          className="h-full rounded-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      <p aria-hidden className="text-sm text-muted-foreground">
        {pct >= 50
          ? `You're far from alone. ${formatCount(meToo)} ${meToo === 1 ? "person" : "people"} feel the same.`
          : `${formatCount(meToo)} ${meToo === 1 ? "person relates" : "people relate"}. Rarer, but not alone.`}
      </p>
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { Check } from "lucide-react";
import { DEFAULT_THOUGHT_OPTIONS } from "@/config/thoughts";
import { formatCount } from "@/lib/time";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

function isDefault(options: string[]) {
  return options.length === 2 && options[0] === DEFAULT_THOUGHT_OPTIONS[0] && options[1] === DEFAULT_THOUGHT_OPTIONS[1];
}

/**
 * The result after voting. "Me too / Not me" gets the big "73% said me too"
 * headline; custom answers get one animated bar per option. Respects
 * reduced-motion via the app-wide MotionConfig.
 */
export function ResultBar({
  options,
  counts,
  myChoice,
  mine = false,
}: {
  options: string[];
  counts: number[];
  myChoice: number | null;
  mine?: boolean;
}) {
  const total = counts.reduce((a, b) => a + b, 0);

  if (total === 0) {
    return (
      <p className="rounded-2xl bg-muted px-4 py-3 text-sm text-muted-foreground">
        {mine ? "No votes yet. Check back soon, people are reading." : "You're the first to vote."}
      </p>
    );
  }
  return isDefault(options) ? (
    <MeTooResult meToo={counts[0]} total={total} />
  ) : (
    <OptionsResult options={options} counts={counts} total={total} myChoice={myChoice} />
  );
}

function MeTooResult({ meToo, total }: { meToo: number; total: number }) {
  const pct = Math.round((meToo / total) * 100);
  const value = useMotionValue(0);
  const rounded = useTransform(value, (v) => `${Math.round(v)}%`);

  useEffect(() => {
    const controls = animate(value, pct, { duration: 0.9, ease: EASE });
    return () => controls.stop();
  }, [pct, value]);

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
          transition={{ duration: 0.9, ease: EASE }}
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

function OptionsResult({
  options,
  counts,
  total,
  myChoice,
}: {
  options: string[];
  counts: number[];
  total: number;
  myChoice: number | null;
}) {
  const top = Math.max(...counts);
  return (
    <div className="space-y-3">
      <ul className="space-y-2" aria-label="Results">
        {options.map((label, i) => {
          const pct = Math.round(((counts[i] ?? 0) / total) * 100);
          const picked = myChoice === i;
          const leading = counts[i] === top;
          return (
            <li key={label} className="relative overflow-hidden rounded-xl border bg-background">
              <motion.div
                aria-hidden
                className={cn("absolute inset-y-0 left-0", picked ? "bg-primary/20" : "bg-muted")}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.9, ease: EASE, delay: i * 0.06 }}
              />
              <div className="relative flex items-center justify-between gap-3 px-3.5 py-2.5 text-sm">
                <span className={cn("flex items-center gap-1.5", leading && "font-semibold")}>
                  {picked ? <Check className="size-4 text-primary" aria-label="Your answer" /> : null}
                  {label}
                </span>
                <span className={cn("tabular-nums", leading ? "font-semibold text-primary" : "text-muted-foreground")}>
                  {pct}%
                </span>
              </div>
            </li>
          );
        })}
      </ul>
      <p className="text-xs text-muted-foreground tabular-nums">
        {formatCount(total)} {total === 1 ? "vote" : "votes"}
      </p>
    </div>
  );
}

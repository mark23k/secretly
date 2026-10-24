"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CalendarRange } from "lucide-react";
import { rangeOptions } from "@/config/admin";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PRESET_LABEL: Record<number, string> = { 7: "7 days", 30: "30 days", 90: "90 days", 365: "1 year" };

/** Date range presets plus a custom from–to range. Keeps the open tab. */
export function RangePicker({
  days,
  from,
  to,
  today,
}: {
  /** The active preset, or null for a custom range. */
  days: number | null;
  from: string;
  to: string;
  today: string;
}) {
  const params = useSearchParams();
  const tab = params.get("tab");

  return (
    <div className="flex flex-col items-start gap-2 sm:items-end">
      <nav aria-label="Date range" className="inline-flex flex-wrap rounded-lg bg-muted p-[3px] text-sm">
        {rangeOptions.map((d) => {
          const next = new URLSearchParams();
          next.set("days", String(d));
          if (tab) next.set("tab", tab);
          return (
            <Link
              key={d}
              href={`?${next}`}
              scroll={false}
              aria-current={d === days ? "true" : undefined}
              className={cn(
                "rounded-md px-3 py-1 font-medium text-muted-foreground transition-colors hover:text-foreground",
                d === days && "bg-background text-foreground shadow-sm"
              )}
            >
              {PRESET_LABEL[d] ?? `${d} days`}
            </Link>
          );
        })}
      </nav>
      <details className="group" open={days === null}>
        <summary
          className={cn(
            "inline-flex cursor-pointer list-none items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium text-muted-foreground hover:text-foreground",
            days === null && "text-foreground"
          )}
        >
          <CalendarRange className="size-4" aria-hidden /> Custom dates
        </summary>
        <form action="/admin" className="mt-2 flex flex-wrap items-end gap-2 rounded-xl border bg-card p-3 text-sm">
          {tab ? <input type="hidden" name="tab" value={tab} /> : null}
          <label className="grid gap-1">
            <span className="text-xs text-muted-foreground">From</span>
            <input
              type="date"
              name="from"
              defaultValue={from}
              max={today}
              required
              className="h-9 rounded-lg border bg-background px-2"
            />
          </label>
          <label className="grid gap-1">
            <span className="text-xs text-muted-foreground">To</span>
            <input
              type="date"
              name="to"
              defaultValue={to}
              max={today}
              required
              className="h-9 rounded-lg border bg-background px-2"
            />
          </label>
          <Button type="submit" size="sm" className="h-9">
            Show
          </Button>
        </form>
      </details>
    </div>
  );
}

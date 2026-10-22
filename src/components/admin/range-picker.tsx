"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { rangeOptions } from "@/config/admin";
import { cn } from "@/lib/utils";

/** Date range presets; keeps the open tab. */
export function RangePicker({ days }: { days: number }) {
  const params = useSearchParams();
  return (
    <nav aria-label="Date range" className="inline-flex rounded-lg bg-muted p-[3px] text-sm">
      {rangeOptions.map((d) => {
        const next = new URLSearchParams(params);
        next.set("days", String(d));
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
            {d} days
          </Link>
        );
      })}
    </nav>
  );
}

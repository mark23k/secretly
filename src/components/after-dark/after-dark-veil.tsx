"use client";

import { Moon } from "lucide-react";
import { useAdultConfirmed } from "@/hooks/use-adult-confirmed";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Hides After Dark content behind a one-tap "I'm 18 or older" confirmation.
 * The real text isn't rendered until confirmed; the blurred lines are decoys.
 */
export function AfterDarkVeil({
  children,
  className,
  size = "card",
}: {
  children: React.ReactNode;
  className?: string;
  size?: "card" | "compact";
}) {
  const { confirmed, confirm } = useAdultConfirmed();
  if (confirmed) return <>{children}</>;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border border-primary/30 bg-[#1c1422] text-[#f4ecf7]",
        size === "card" ? "min-h-56 p-6 sm:p-8" : "min-h-40 p-5",
        className
      )}
    >
      <div aria-hidden className="pointer-events-none space-y-3 opacity-60 blur-[7px] select-none">
        <div className="h-5 w-24 rounded-full bg-white/25" />
        <div className="h-6 w-full rounded-lg bg-white/30" />
        <div className="h-6 w-4/5 rounded-lg bg-white/30" />
        {size === "card" ? <div className="h-6 w-2/3 rounded-lg bg-white/30" /> : null}
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-b from-[#1c1422]/40 to-[#1c1422]/80 p-5 text-center">
        <p className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide">
          <Moon className="size-3.5" aria-hidden /> After Dark · 18+
        </p>
        {size === "card" ? (
          <p className="max-w-xs text-sm text-pretty text-white/75">
            Frank talk about dating, sex and relationships. Suggestive, never explicit.
          </p>
        ) : null}
        <Button size="sm" onClick={confirm} className="rounded-full bg-[#e2c3ea] text-[#2b1633] hover:bg-[#f0dcf5]">
          I&apos;m 18 or older, show me
        </Button>
      </div>
    </div>
  );
}

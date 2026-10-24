"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

const REFRESH_MS = 20_000;

/** Re-fetches the page every 20 seconds while visible; can be paused. */
export function LiveRefresh() {
  const router = useRouter();
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      if (document.visibilityState === "visible") router.refresh();
    }, REFRESH_MS);
    return () => clearInterval(id);
  }, [paused, router]);

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="flex items-center gap-1.5 text-muted-foreground">
        <span className="relative flex size-2.5" aria-hidden>
          {!paused ? (
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-60 motion-reduce:animate-none" />
          ) : null}
          <span className={`relative inline-flex size-2.5 rounded-full ${paused ? "bg-muted-foreground" : "bg-emerald-500"}`} />
        </span>
        {paused ? "Paused" : "Live, updates every 20s"}
      </span>
      <Button variant="ghost" size="icon-sm" onClick={() => setPaused((p) => !p)} aria-label={paused ? "Resume updates" : "Pause updates"}>
        {paused ? <Play /> : <Pause />}
      </Button>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { fetchLiveStats } from "@/app/actions/admin";
import type { LiveStats } from "@/lib/data/admin.server";

const REFRESH_MS = 15_000;

/** "People on Secretly right now", refreshed every 15s while the tab is visible. */
export function LiveNow({ initial }: { initial: LiveStats }) {
  const [live, setLive] = useState(initial);

  useEffect(() => {
    const timer = window.setInterval(async () => {
      if (document.visibilityState !== "visible") return;
      const next = await fetchLiveStats().catch(() => null);
      if (next) setLive(next);
    }, REFRESH_MS);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section
      aria-labelledby="live-heading"
      className="flex flex-col gap-4 rounded-3xl border bg-card p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7"
    >
      <div>
        <h2 id="live-heading" className="flex items-center gap-2 font-sans text-sm font-medium tracking-normal text-muted-foreground">
          <span className="relative flex size-2.5" aria-hidden>
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-60 motion-reduce:animate-none" />
            <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
          </span>
          On the site right now
        </h2>
        <p className="mt-2 font-sans text-5xl font-semibold tracking-tight sm:text-6xl" aria-live="polite">
          {live.online.toLocaleString("en")}
        </p>
      </div>
      <dl className="flex gap-8 text-sm">
        <div>
          <dt className="text-muted-foreground">Signed in</dt>
          <dd className="mt-0.5 text-xl font-semibold">{live.members.toLocaleString("en")}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Guests</dt>
          <dd className="mt-0.5 text-xl font-semibold">{live.guests.toLocaleString("en")}</dd>
        </div>
      </dl>
    </section>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function parts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return { h: Math.floor(s / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
}

/** Live "4h 12m 09s" until `to`; refreshes the page when it hits zero. */
export function Countdown({ to }: { to: string }) {
  const router = useRouter();
  const target = new Date(to).getTime();
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => {
      const t = Date.now();
      setNow(t);
      if (t >= target) router.refresh();
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target, router]);

  if (now === null) return <span className="tabular-nums">--h --m --s</span>;
  const { h, m, s } = parts(target - now);
  return (
    <span className="tabular-nums" aria-label={`${h} hours ${m} minutes`}>
      {h}h {String(m).padStart(2, "0")}m {String(s).padStart(2, "0")}s
    </span>
  );
}

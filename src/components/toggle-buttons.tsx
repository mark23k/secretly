"use client";

import Link from "next/link";
import { useOptimistic, useTransition } from "react";
import { toggleGuilty, toggleLike } from "@/app/actions/posts";

type ToggleProps = { id: string; active: boolean; count: number; signedIn: boolean; loginHref: string };

function useToggle(active: boolean, count: number) {
  return useOptimistic({ active, count }, (s) => ({ active: !s.active, count: s.count + (s.active ? -1 : 1) }));
}

export function GuiltyButton({ id, active, count, signedIn, loginHref }: ToggleProps) {
  const [state, flip] = useToggle(active, count);
  const [, startTransition] = useTransition();
  const className = `btn w-full px-5 py-3 text-base ring-2 ${
    state.active ? "bg-butter-300 text-ink ring-butter-300" : "bg-white text-ink ring-line hover:bg-butter-100"
  }`;
  const label = (
    <>
      <span key={String(state.active)} className={state.active ? "pop" : ""}>🙋</span>
      {state.active ? "Guilty! You've done this" : "Guilty: I've done this"}
      <span className="rounded-full bg-ink/10 px-2 py-0.5 text-sm">{state.count}</span>
    </>
  );
  if (!signedIn) return <Link href={loginHref} className={className}>{label}</Link>;
  return (
    <button
      aria-pressed={state.active}
      className={className}
      onClick={() =>
        startTransition(async () => {
          flip(null);
          await toggleGuilty(id);
        })
      }
    >
      {label}
    </button>
  );
}

export function LikeButton({ id, active, count, signedIn, loginHref }: ToggleProps) {
  const [state, flip] = useToggle(active, count);
  const [, startTransition] = useTransition();
  const className = `inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-extrabold transition ${
    state.active ? "bg-lavender-200 text-lavender-700" : "text-ink-soft hover:bg-lavender-50"
  }`;
  const label = (
    <>
      <span key={String(state.active)} className={state.active ? "pop" : ""}>🤫</span>
      Good point{state.count > 0 && ` · ${state.count}`}
    </>
  );
  if (!signedIn) return <Link href={loginHref} className={className}>{label}</Link>;
  return (
    <button
      aria-pressed={state.active}
      className={className}
      onClick={() =>
        startTransition(async () => {
          flip(null);
          await toggleLike(id);
        })
      }
    >
      {label}
    </button>
  );
}

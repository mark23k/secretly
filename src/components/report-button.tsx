"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { reportContent } from "@/app/actions/posts";

const REASONS = ["Mean or hateful", "Spam", "Shares someone's private info", "Something else"];

type Props = { targetType: "question" | "answer" | "reply"; targetId: string; signedIn: boolean; loginHref: string };

export function ReportButton({ targetType, targetId, signedIn, loginHref }: Props) {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [pending, startTransition] = useTransition();
  const cls = "rounded-full px-2.5 py-1.5 text-xs font-bold text-ink-soft/80 hover:bg-rose-100 hover:text-rose-700";

  if (done) return <span className="px-2.5 py-1.5 text-xs font-bold text-mint-700">Thanks, we&apos;ll take a look 💜</span>;
  if (!signedIn) return <Link href={loginHref} className={cls}>🚩 Report</Link>;

  return (
    <span className="relative">
      <button className={cls} onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        🚩 Report
      </button>
      {open && (
        <span className="note absolute right-0 top-9 z-20 grid w-60 gap-1 p-2 text-left">
          <span className="px-2 py-1 text-xs font-extrabold text-ink-soft">What&apos;s wrong?</span>
          {REASONS.map((reason) => (
            <button
              key={reason}
              disabled={pending}
              className="rounded-xl px-3 py-2 text-left text-sm font-bold hover:bg-rose-100"
              onClick={() =>
                startTransition(async () => {
                  await reportContent({ targetType, targetId, reason });
                  setOpen(false);
                  setDone(true);
                })
              }
            >
              {reason}
            </button>
          ))}
        </span>
      )}
    </span>
  );
}

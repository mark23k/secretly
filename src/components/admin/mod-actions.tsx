"use client";

import { useTransition } from "react";
import { banAuthor, deleteContent, dismissReports } from "@/app/actions/admin";

type T = "question" | "answer" | "reply";

export function ModActions({ targetType, targetId, showDismiss = true, showBan = true }: {
  targetType: T; targetId: string; showDismiss?: boolean; showBan?: boolean;
}) {
  const [pending, start] = useTransition();
  const run = (fn: () => Promise<void>, confirmText?: string) => {
    if (confirmText && !window.confirm(confirmText)) return;
    start(fn);
  };
  return (
    <div className="flex flex-wrap gap-2">
      {showDismiss && (
        <button disabled={pending} onClick={() => run(() => dismissReports(targetType, targetId))} className="btn btn-soft px-3 py-1.5 text-xs">
          ✓ Dismiss
        </button>
      )}
      <button
        disabled={pending}
        onClick={() => run(() => deleteContent(targetType, targetId), `Delete this ${targetType}? This can't be undone.`)}
        className="btn bg-rose-100 px-3 py-1.5 text-xs text-rose-700 hover:bg-rose-400 hover:text-white"
      >
        🗑 Delete
      </button>
      {showBan && (
        <button
          disabled={pending}
          onClick={() => run(() => banAuthor(targetType, targetId), "Ban the author and delete this post?")}
          className="btn bg-ink px-3 py-1.5 text-xs text-white hover:bg-rose-700"
        >
          ⛔ Ban user
        </button>
      )}
    </div>
  );
}

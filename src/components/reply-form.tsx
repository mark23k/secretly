"use client";

import { useActionState, useState } from "react";
import { createReply, type PostState } from "@/app/actions/posts";
import { LIMITS } from "@/lib/constants";

export function ReplyForm({ answerId }: { answerId: string }) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(async (prev: PostState, formData: FormData) => {
    const result = await createReply(prev, formData);
    if (result?.ok) setOpen(false);
    return result;
  }, undefined);

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="rounded-full px-2.5 py-1.5 text-xs font-bold text-ink-soft hover:bg-lavender-50">
        ↩️ Reply
      </button>
    );
  }
  return (
    <form action={action} className="mt-2 grid w-full gap-2">
      <input type="hidden" name="answerId" value={answerId} />
      <textarea
        name="body"
        rows={2}
        autoFocus
        required
        maxLength={LIMITS.reply}
        className="field resize-none text-sm"
        placeholder="Whisper a reply…"
      />
      {state?.error && <p className="text-sm font-bold text-rose-700">{state.error}</p>}
      <div className="flex justify-end gap-2">
        <button type="button" onClick={() => setOpen(false)} className="rounded-full px-3 py-2 text-sm font-bold text-ink-soft">
          Cancel
        </button>
        <button disabled={pending} className="btn btn-primary px-4 py-2 text-sm">
          {pending ? "Sending…" : "Reply"}
        </button>
      </div>
    </form>
  );
}

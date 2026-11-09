"use client";

import { useActionState, useState } from "react";
import { createAnswer, type PostState } from "@/app/actions/posts";
import { LIMITS, VERDICTS } from "@/lib/constants";

export function AnswerForm({ questionId }: { questionId: string }) {
  const [verdict, setVerdict] = useState("");
  const [body, setBody] = useState("");
  const [state, action, pending] = useActionState(async (prev: PostState, formData: FormData) => {
    const result = await createAnswer(prev, formData);
    if (result?.ok) {
      setBody("");
      setVerdict("");
    }
    return result;
  }, undefined);

  return (
    <form action={action} className="note grid gap-4 p-4 sm:p-5">
      <input type="hidden" name="questionId" value={questionId} />
      <div>
        <p className="mb-2 font-extrabold">What&apos;s your verdict?</p>
        <div className="grid grid-cols-3 gap-2">
          {VERDICTS.map((v) => (
            <label
              key={v.key}
              className={`cursor-pointer rounded-2xl px-2 py-3 text-center text-sm font-extrabold ring-2 transition ${
                verdict === v.key ? `${v.soft} ${v.text} ring-current` : "bg-white text-ink-soft ring-line hover:bg-lavender-50"
              }`}
            >
              <input
                type="radio"
                name="verdict"
                value={v.key}
                className="sr-only"
                checked={verdict === v.key}
                onChange={() => setVerdict(v.key)}
              />
              <span className="block text-2xl">{v.emoji}</span>
              {v.label}
            </label>
          ))}
        </div>
      </div>
      <label className="grid gap-1.5">
        <span className="sr-only">Your answer</span>
        <textarea
          name="body"
          rows={3}
          maxLength={LIMITS.answer}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="field resize-none"
          placeholder="Tell them what you really think…"
        />
        <span className="text-right text-xs text-ink-soft">
          {body.length}/{LIMITS.answer}
        </span>
      </label>
      {state?.error && (
        <p role="alert" className="rounded-2xl bg-rose-100 px-4 py-3 text-sm font-bold text-rose-700">
          {state.error}
        </p>
      )}
      <button disabled={pending} className="btn btn-primary py-3">
        {pending ? "Whispering…" : "🤫 Whisper back"}
      </button>
    </form>
  );
}

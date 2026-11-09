"use client";

import { useActionState, useState } from "react";
import { createQuestion } from "@/app/actions/posts";
import { CATEGORIES, LIMITS } from "@/lib/constants";

export function QuestionForm() {
  const [state, action, pending] = useActionState(createQuestion, undefined);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  return (
    <form action={action} className="grid gap-5">
      <label className="grid gap-1.5">
        <span className="font-extrabold">Your question</span>
        <input
          name="title"
          required
          maxLength={LIMITS.title}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="field text-lg font-bold"
          placeholder="Is it rude to eat tuna on a plane?"
        />
      </label>

      <label className="grid gap-1.5">
        <span className="font-extrabold">
          A little context <span className="font-semibold text-ink-soft">(optional)</span>
        </span>
        <textarea
          name="description"
          rows={4}
          maxLength={LIMITS.description}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="field resize-none"
          placeholder="Set the scene. What happened? Who was there?"
        />
        <span className="text-right text-xs text-ink-soft">
          {description.length}/{LIMITS.description}
        </span>
      </label>

      <fieldset className="grid gap-2">
        <legend className="mb-1.5 font-extrabold">Pick a category</legend>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <label
              key={c.slug}
              className={`cursor-pointer rounded-full px-3.5 py-2 text-sm font-bold ring-1 transition ${
                category === c.slug
                  ? "bg-lavender-500 text-white ring-lavender-500"
                  : "bg-white text-ink-soft ring-line hover:bg-lavender-50"
              }`}
            >
              <input
                type="radio"
                name="category"
                value={c.slug}
                className="sr-only"
                checked={category === c.slug}
                onChange={() => setCategory(c.slug)}
              />
              {c.emoji} {c.name}
            </label>
          ))}
        </div>
      </fieldset>

      {state?.error && (
        <p role="alert" className="rounded-2xl bg-rose-100 px-4 py-3 text-sm font-bold text-rose-700">
          {state.error}
        </p>
      )}

      <button disabled={pending} className="btn btn-primary py-3.5 text-base">
        {pending ? "Folding your note…" : "🤫 Whisper it"}
      </button>
    </form>
  );
}

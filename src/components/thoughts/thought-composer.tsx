"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { createThought } from "@/app/actions/thoughts";
import { textLimits } from "@/config/limits";
import { thoughtCategories, type ThoughtCategory } from "@/config/thoughts";
import { useAction } from "@/hooks/use-action";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AnonymityNote } from "@/components/shared/anonymity-note";
import { CharCounter } from "@/components/shared/char-counter";
import { cn } from "@/lib/utils";

const examples = [
  "I pretend I didn't see messages because I don't have the energy to reply, even to people I love.",
  "I practice conversations in the shower that will never happen.",
  "I feel relieved when plans get cancelled, even ones I was looking forward to.",
];

export function ThoughtComposer() {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [category, setCategory] = useState<ThoughtCategory | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { execute, pending } = useAction(createThought, {
    toastErrors: false,
    heldMessage: "Posted! It'll appear publicly after a quick review.",
  });
  const ids = { body: useId(), counter: useId(), error: useId(), cats: useId() };
  const { min, max } = textLimits.thought;
  const tooShort = body.trim().length < min;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await execute({ body, category: category ?? "other" });
    if (res.ok) {
      router.push(`/only-one/${res.data.id}?new=1`);
    } else {
      setError(res.fieldErrors?.body ?? res.message);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-6" noValidate>
      <div className="rounded-3xl border bg-card p-2 shadow-[0_1px_2px_rgb(0_0_0/0.03)] focus-within:border-primary/40 focus-within:ring-4 focus-within:ring-primary/10">
        <label htmlFor={ids.body} className="sr-only">
          Your thought
        </label>
        <Textarea
          id={ids.body}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          maxLength={max + 50}
          rows={5}
          autoFocus
          placeholder={examples[0]}
          aria-describedby={`${ids.counter} ${error ? ids.error : ""}`}
          aria-invalid={Boolean(error)}
          className="min-h-36 resize-none border-0 bg-transparent px-4 pt-4 font-heading text-xl leading-snug shadow-none placeholder:text-muted-foreground/60 focus-visible:ring-0 dark:bg-transparent"
        />
        <div className="flex items-center justify-end px-4 pb-2">
          <CharCounter value={body} max={max} id={ids.counter} />
        </div>
      </div>

      {error ? (
        <p id={ids.error} role="alert" className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <fieldset>
        <legend id={ids.cats} className="mb-3 text-sm font-medium">
          What&apos;s it about? <span className="font-normal text-muted-foreground">(optional)</span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {thoughtCategories.map((c) => (
            <button
              key={c.value}
              type="button"
              aria-pressed={category === c.value}
              onClick={() => setCategory(category === c.value ? null : c.value)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-sm transition-colors",
                category === c.value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "bg-background hover:bg-muted"
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="space-y-4">
        <AnonymityNote />
        <Button type="submit" size="lg" className="w-full" disabled={pending || tooShort || body.length > max}>
          {pending ? "Posting…" : "Post anonymously"}
        </Button>
      </div>
    </form>
  );
}

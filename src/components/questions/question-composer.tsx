"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { createQuestion } from "@/app/actions/questions";
import { textLimits } from "@/config/limits";
import { questionCategories, type QuestionCategory } from "@/config/questions";
import { useAction } from "@/hooks/use-action";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AnonymityNote } from "@/components/shared/anonymity-note";
import { CharCounter } from "@/components/shared/char-counter";
import { cn } from "@/lib/utils";
import { SimilarQuestions } from "./similar-questions";

export function QuestionComposer() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [category, setCategory] = useState<QuestionCategory | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { execute, pending } = useAction(createQuestion, {
    toastErrors: false,
    heldMessage: "Asked! It'll appear publicly after a quick review.",
  });
  const ids = { title: useId(), counter: useId(), body: useId(), error: useId() };
  const limits = textLimits.questionTitle;
  const tooShort = title.trim().length < limits.min;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await execute({ title, body, category: category ?? "other" });
    if (res.ok) router.push(`/ask/${res.data.id}?new=1`);
    else setError(res.fieldErrors?.title ?? res.fieldErrors?.body ?? res.message);
  }

  return (
    <form onSubmit={submit} className="space-y-6" noValidate>
      <div className="rounded-3xl border bg-card p-2 shadow-[0_1px_2px_rgb(0_0_0/0.03)] focus-within:border-primary/40 focus-within:ring-4 focus-within:ring-primary/10">
        <label htmlFor={ids.title} className="sr-only">
          Your question
        </label>
        <Textarea
          id={ids.title}
          value={title}
          onChange={(e) => setTitle(e.target.value.replace(/\n/g, " "))}
          maxLength={limits.max + 30}
          rows={3}
          autoFocus
          placeholder="How do you know if someone actually likes you or is just being nice?"
          aria-describedby={`${ids.counter} ${error ? ids.error : ""}`}
          aria-invalid={Boolean(error)}
          className="min-h-28 resize-none border-0 bg-transparent px-4 pt-4 font-heading text-xl leading-snug shadow-none placeholder:text-muted-foreground/60 focus-visible:ring-0 dark:bg-transparent"
        />
        <div className="flex items-center justify-end px-4 pb-2">
          <CharCounter value={title} max={limits.max} id={ids.counter} />
        </div>
      </div>

      <SimilarQuestions text={title} />

      {showDetails ? (
        <div className="space-y-2">
          <label htmlFor={ids.body} className="text-sm font-medium">
            Add some context <span className="font-normal text-muted-foreground">(optional)</span>
          </label>
          <Textarea
            id={ids.body}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={4}
            maxLength={textLimits.questionBody.max + 50}
            placeholder="Anything that helps people give you a better answer."
            className="rounded-2xl bg-card"
          />
          <div className="flex justify-end">
            <CharCounter value={body} max={textLimits.questionBody.max} />
          </div>
        </div>
      ) : (
        <Button type="button" variant="ghost" size="sm" className="-ml-2" onClick={() => setShowDetails(true)}>
          + Add context (optional)
        </Button>
      )}

      {error ? (
        <p id={ids.error} role="alert" className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <fieldset>
        <legend className="mb-3 text-sm font-medium">
          What&apos;s it about? <span className="font-normal text-muted-foreground">(optional)</span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {questionCategories.map((c) => (
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
        <Button type="submit" size="lg" className="w-full" disabled={pending || tooShort || title.length > limits.max}>
          {pending ? "Asking…" : "Ask anonymously"}
        </Button>
      </div>
    </form>
  );
}

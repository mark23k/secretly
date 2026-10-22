"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CircleCheck, Heart } from "lucide-react";
import { addAnswer, markHelped, toggleHelpful } from "@/app/actions/questions";
import { textLimits } from "@/config/limits";
import { questionCategoryLabel } from "@/config/questions";
import type { Answer, Question } from "@/lib/data/questions";
import { useAction } from "@/hooks/use-action";
import { timeAgo } from "@/lib/time";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AnonymityNote } from "@/components/shared/anonymity-note";
import { CharCounter } from "@/components/shared/char-counter";
import { ReportButton } from "@/components/shared/report-button";

/** Best first: the asker's pick, then most helpful, then oldest. */
function rank(answers: Answer[]) {
  return [...answers].sort(
    (a, b) =>
      Number(b.helpedAsker) - Number(a.helpedAsker) ||
      b.helpfulCount - a.helpfulCount ||
      a.createdAt.localeCompare(b.createdAt)
  );
}

export function QuestionDetail({
  question,
  answers: initial,
  isNew,
}: {
  question: Question;
  answers: Answer[];
  isNew: boolean;
}) {
  const [answers, setAnswers] = useState(initial);
  const published = question.status === "published";

  function update(id: string, patch: Partial<Answer>) {
    setAnswers((cur) => cur.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  }

  function setHelped(id: string | null) {
    setAnswers((cur) => rank(cur.map((a) => ({ ...a, helpedAsker: a.id === id }))));
  }

  return (
    <div className="space-y-10">
      {isNew && question.isMine ? (
        <div className="animate-fade-up rounded-3xl bg-accent/60 p-5 text-accent-foreground sm:p-6">
          <p className="font-heading text-xl">{published ? "Your question is live." : "Almost there."}</p>
          <p className="mt-1 text-sm opacity-90">
            {published
              ? "Answers will appear here. When one helps, tap “This helped me” so others know too. You'll find it later under “My posts”."
              : "Your question is waiting for a quick review before it goes public. You'll find it under “My posts”."}
          </p>
        </div>
      ) : null}

      <article className="rounded-3xl border bg-card p-6 shadow-[0_1px_2px_rgb(0_0_0/0.03)] sm:p-8">
        <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
          <p className="flex items-center gap-2">
            <span className="rounded-full bg-muted px-2.5 py-1 font-medium text-foreground/80">
              {questionCategoryLabel[question.category]}
            </span>
            <time dateTime={question.createdAt} suppressHydrationWarning>
              Asked {timeAgo(question.createdAt)}
            </time>
            {question.isMine ? <span className="font-medium text-primary">· Yours</span> : null}
          </p>
          {!question.isMine && published ? <ReportButton kind="question" id={question.id} /> : null}
        </div>
        <h1 className="mt-4 font-heading text-[1.7rem] leading-tight text-pretty sm:text-3xl">{question.title}</h1>
        {question.body ? (
          <p className="mt-4 text-[0.98rem] text-pretty whitespace-pre-line text-muted-foreground">{question.body}</p>
        ) : null}
      </article>

      {published ? (
        <section aria-labelledby="answers-heading" className="space-y-5">
          <h2 id="answers-heading" className="text-2xl font-normal">
            Answers <span className="text-muted-foreground">{answers.length > 0 ? answers.length : ""}</span>
          </h2>
          {answers.length === 0 ? (
            <p className="rounded-2xl bg-muted px-4 py-5 text-sm text-muted-foreground">
              No answers yet. If you&apos;ve been there, your answer could be exactly what they needed.
            </p>
          ) : (
            <ol className="space-y-3">
              <AnimatePresence initial={false}>
                {answers.map((a) => (
                  <motion.li key={a.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                    <AnswerItem
                      answer={a}
                      question={question}
                      onChange={(patch) => update(a.id, patch)}
                      onHelped={setHelped}
                    />
                  </motion.li>
                ))}
              </AnimatePresence>
            </ol>
          )}
          {!question.isMine ? (
            <AnswerForm
              questionId={question.id}
              onAnswered={(a) => setAnswers((cur) => rank([...cur, a]))}
            />
          ) : null}
        </section>
      ) : null}
    </div>
  );
}

function AnswerItem({
  answer,
  question,
  onChange,
  onHelped,
}: {
  answer: Answer;
  question: Question;
  onChange: (patch: Partial<Answer>) => void;
  onHelped: (answerId: string | null) => void;
}) {
  const helpful = useAction(toggleHelpful);
  const helped = useAction(markHelped);

  async function vote() {
    const res = await helpful.execute({ answerId: answer.id });
    if (res.ok) onChange({ helpfulCount: res.data.helpfulCount, voted: res.data.voted });
  }

  async function markAsHelped() {
    const res = await helped.execute({ questionId: question.id, answerId: answer.id });
    if (res.ok) onHelped(res.data.helpedAnswerId);
  }

  return (
    <div
      className={cn(
        "rounded-2xl border bg-card px-4 py-4 sm:px-5",
        answer.helpedAsker && "border-primary/50 bg-accent/30"
      )}
    >
      {answer.helpedAsker ? (
        <p className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
          <CircleCheck className="size-4" aria-hidden /> This helped the asker
        </p>
      ) : null}
      <p className="text-[0.98rem] text-pretty whitespace-pre-line">{answer.body}</p>
      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-muted-foreground">
        <time dateTime={answer.createdAt} suppressHydrationWarning>
          {timeAgo(answer.createdAt)}
        </time>
        {answer.isMine ? <span className="font-medium text-primary">Your answer</span> : null}
        <span className="ml-auto flex items-center gap-1">
          {answer.isMine ? (
            <span className="inline-flex items-center gap-1.5 px-2">
              <Heart className="size-3.5" aria-hidden /> {answer.helpfulCount} found this helpful
            </span>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              aria-pressed={answer.voted}
              disabled={helpful.pending}
              onClick={vote}
              className={cn("h-8 rounded-full text-xs", answer.voted && "bg-accent text-accent-foreground")}
            >
              <Heart className={cn("size-3.5", answer.voted && "fill-current")} aria-hidden />
              Helpful{answer.helpfulCount > 0 ? ` · ${answer.helpfulCount}` : ""}
            </Button>
          )}
          {question.isMine ? (
            <Button
              variant={answer.helpedAsker ? "default" : "outline"}
              size="sm"
              aria-pressed={answer.helpedAsker}
              disabled={helped.pending}
              onClick={markAsHelped}
              className="h-8 rounded-full text-xs"
            >
              <CircleCheck className="size-3.5" aria-hidden />
              {answer.helpedAsker ? "Helped me" : "This helped me"}
            </Button>
          ) : null}
          {!answer.isMine ? <ReportButton kind="answer" id={answer.id} /> : null}
        </span>
      </div>
    </div>
  );
}

function AnswerForm({ questionId, onAnswered }: { questionId: string; onAnswered: (a: Answer) => void }) {
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { execute, pending } = useAction(addAnswer, {
    toastErrors: false,
    heldMessage: "Thanks! Your answer will appear after a quick review.",
  });
  const ids = { input: useId(), counter: useId(), error: useId() };
  const { min, max } = textLimits.answer;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await execute({ questionId, body });
    if (res.ok) {
      setBody("");
      if (res.data.published) onAnswered(res.data.answer);
    } else {
      setError(res.fieldErrors?.body ?? res.message);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3 pt-2" noValidate>
      <label htmlFor={ids.input} className="text-sm font-medium">
        Your answer
      </label>
      <Textarea
        id={ids.input}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={4}
        maxLength={max + 50}
        placeholder="Be honest and kind. What would you tell a friend?"
        aria-describedby={`${ids.counter} ${error ? ids.error : ""}`}
        aria-invalid={Boolean(error)}
        className="rounded-2xl bg-card"
      />
      {error ? (
        <p id={ids.error} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
      <div className="flex items-center justify-between gap-3">
        <CharCounter value={body} max={max} id={ids.counter} />
        <Button type="submit" disabled={pending || body.trim().length < min || body.length > max}>
          {pending ? "Posting…" : "Answer anonymously"}
        </Button>
      </div>
      <AnonymityNote />
    </form>
  );
}

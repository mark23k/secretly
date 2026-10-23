import Link from "next/link";
import { CircleCheck, MessageCircle, Moon } from "lucide-react";
import { questionCategoryLabel } from "@/config/questions";
import type { Question } from "@/lib/data/questions";
import { timeAgo } from "@/lib/time";
import { cn } from "@/lib/utils";
import { AfterDarkVeil } from "@/components/after-dark/after-dark-veil";

export function answerLabel(n: number) {
  return n === 0 ? "No answers yet" : n === 1 ? "1 answer" : `${n} answers`;
}

/** A question in a list; the whole card links to its page. */
export function QuestionCard({ question }: { question: Question }) {
  if (question.category === "after_dark") {
    return (
      <AfterDarkVeil size="compact">
        <QuestionLink question={question} />
      </AfterDarkVeil>
    );
  }
  return <QuestionLink question={question} />;
}

function QuestionLink({ question }: { question: Question }) {
  return (
    <Link
      href={`/ask/${question.id}`}
      className="group block rounded-3xl border bg-card p-5 shadow-[0_1px_2px_rgb(0_0_0/0.03)] transition-colors hover:border-primary/40 sm:p-6"
    >
      <p className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 font-medium text-foreground/80",
            question.category === "after_dark" && "bg-[#2b1633] text-[#e2c3ea]"
          )}
        >
          {question.category === "after_dark" ? <Moon className="size-3" aria-hidden /> : null}
          {questionCategoryLabel[question.category]}
        </span>
        <time dateTime={question.createdAt} suppressHydrationWarning>
          {timeAgo(question.createdAt)}
        </time>
        {question.isMine ? <span className="font-medium text-primary">· Yours</span> : null}
      </p>
      <h2 className="mt-3 font-heading text-xl leading-snug text-pretty group-hover:text-primary sm:text-[1.35rem]">
        {question.title}
      </h2>
      <p className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <MessageCircle className="size-4" aria-hidden />
          {answerLabel(question.answerCount)}
        </span>
        {question.helpedAnswerId ? (
          <span className="inline-flex items-center gap-1.5 font-medium text-primary">
            <CircleCheck className="size-4" aria-hidden />
            Asker found an answer
          </span>
        ) : null}
      </p>
    </Link>
  );
}

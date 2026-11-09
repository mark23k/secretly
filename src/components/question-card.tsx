import Link from "next/link";
import { getCategory } from "@/lib/constants";
import { timeAgo } from "@/lib/time";
import type { QuestionCard as Card } from "@/lib/queries";
import { MiniVerdictBar } from "./verdict-bar";

const TINTS = ["hover:bg-lavender-50", "hover:bg-peach-100/40", "hover:bg-mint-100/40"];

export function QuestionCard({ q, index = 0 }: { q: Card; index?: number }) {
  const cat = getCategory(q.category);
  return (
    <Link
      href={`/q/${q.id}`}
      className={`note flex h-full flex-col p-4 transition hover:-translate-y-0.5 sm:p-5 ${TINTS[index % TINTS.length]}`}
    >
      <div className="mb-2 flex items-center justify-between gap-2 text-xs font-bold text-ink-soft">
        <span className="rounded-full bg-lavender-50 px-2.5 py-1 text-lavender-700">
          {cat?.emoji} {cat?.name}
        </span>
        <span suppressHydrationWarning>{timeAgo(q.createdAt)}</span>
      </div>
      <h3 className="text-[1.05rem] font-extrabold leading-snug text-ink sm:text-lg">{q.title}</h3>
      <div className="mt-auto pt-3">
        <MiniVerdictBar {...q} />
      </div>
      <div className="mt-2.5 flex gap-4 text-xs font-bold text-ink-soft">
        <span>💬 {q.answerCount} {q.answerCount === 1 ? "answer" : "answers"}</span>
        <span>🙋 {q.guiltyCount} guilty</span>
      </div>
    </Link>
  );
}

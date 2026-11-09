import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { anonName } from "@/lib/names";
import { getCategory, getVerdict } from "@/lib/constants";
import { timeAgo } from "@/lib/time";
import { VerdictMeter } from "@/components/verdict-bar";
import { AnswerForm } from "@/components/answer-form";
import { ReplyForm } from "@/components/reply-form";
import { GuiltyButton, LikeButton } from "@/components/toggle-buttons";
import { ReportButton } from "@/components/report-button";

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ sort?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const q = await db.question.findUnique({ where: { id: (await params).id }, select: { title: true, description: true } });
  return q ? { title: q.title, description: q.description ?? "What do you think? Vote anonymously on SaySecretly." } : {};
}

export default async function QuestionPage({ params, searchParams }: Props) {
  const { id } = await params;
  const sort = (await searchParams).sort === "new" ? "new" : "top";
  const [user, question] = await Promise.all([
    getCurrentUser(),
    db.question.findUnique({
      where: { id },
      include: {
        answers: {
          orderBy: sort === "new" ? [{ createdAt: "desc" }] : [{ likeCount: "desc" }, { createdAt: "asc" }],
          include: { replies: { orderBy: { createdAt: "asc" } } },
        },
      },
    }),
  ]);
  if (!question) notFound();

  const [guilty, likes] = user
    ? await Promise.all([
        db.guilty.findUnique({ where: { userId_questionId: { userId: user.id, questionId: id } } }),
        db.answerLike.findMany({
          where: { userId: user.id, answerId: { in: question.answers.map((a) => a.id) } },
          select: { answerId: true },
        }),
      ])
    : [null, []];
  const liked = new Set(likes.map((l) => l.answerId));
  const myAnswer = user ? question.answers.find((a) => a.authorId === user.id) : undefined;
  const cat = getCategory(question.category);
  const signedIn = !!user;
  const loginHref = `/login?next=/q/${id}`;

  const name = (authorId: string) => (
    <span className="flex flex-wrap items-center gap-1.5">
      <span className="font-extrabold text-ink">{anonName(authorId, id)}</span>
      {authorId === question.authorId && (
        <span className="rounded-full bg-peach-100 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-peach-700">asker</span>
      )}
      {user?.id === authorId && (
        <span className="rounded-full bg-lavender-100 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-lavender-700">you</span>
      )}
    </span>
  );

  return (
    <div className="grid gap-5">
      <Link href="/" className="text-sm font-bold text-ink-soft hover:text-lavender-700">← Back to the feed</Link>

      <article className="note p-5 sm:p-7">
        <div className="mb-3 flex items-center justify-between gap-2 text-xs font-bold text-ink-soft">
          <Link href={`/c/${question.category}`} className="rounded-full bg-lavender-50 px-2.5 py-1 text-lavender-700 hover:bg-lavender-100">
            {cat?.emoji} {cat?.name}
          </Link>
          <span>{timeAgo(question.createdAt)}</span>
        </div>
        <h1 className="text-balance text-2xl font-black leading-tight sm:text-3xl">{question.title}</h1>
        {question.description && (
          <p className="mt-3 whitespace-pre-line text-pretty leading-relaxed text-ink-soft">{question.description}</p>
        )}
        <div className="mt-4 flex items-center justify-between gap-2 text-xs text-ink-soft">
          <span>whispered by {name(question.authorId)}</span>
          <ReportButton targetType="question" targetId={id} signedIn={signedIn} loginHref={loginHref} />
        </div>

        <div className="mt-6">
          <VerdictMeter {...question} />
        </div>
        <div className="mt-5">
          <GuiltyButton id={id} active={!!guilty} count={question.guiltyCount} signedIn={signedIn} loginHref={loginHref} />
        </div>
      </article>

      <section className="grid gap-3">
        {!user ? (
          <div className="note flex flex-col items-center gap-3 p-6 text-center">
            <p className="font-extrabold">What&apos;s your verdict?</p>
            <p className="text-sm text-ink-soft">Sign up in seconds to vote and whisper back. You stay anonymous.</p>
            <div className="flex gap-2">
              <Link href={`/signup?next=/q/${id}`} className="btn btn-primary px-5 py-3">Sign up to whisper back</Link>
              <Link href={loginHref} className="btn btn-soft px-5 py-3">Log in</Link>
            </div>
          </div>
        ) : myAnswer ? (
          <p className="rounded-2xl bg-mint-100 px-4 py-3 text-center text-sm font-bold text-mint-700">
            You voted {getVerdict(myAnswer.verdict).emoji} {getVerdict(myAnswer.verdict).label}. Reply to others below!
          </p>
        ) : user.banned ? null : (
          <AnswerForm questionId={id} />
        )}
      </section>

      <section className="grid gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black">
            {question.answerCount} {question.answerCount === 1 ? "whisper" : "whispers"}
          </h2>
          <div className="flex rounded-full bg-white p-1 text-sm font-extrabold ring-1 ring-line">
            {(["top", "new"] as const).map((s) => (
              <Link
                key={s}
                href={s === "top" ? `/q/${id}` : `/q/${id}?sort=new`}
                scroll={false}
                className={`rounded-full px-3 py-1.5 ${sort === s ? "bg-lavender-500 text-white" : "text-ink-soft"}`}
              >
                {s === "top" ? "Top" : "Newest"}
              </Link>
            ))}
          </div>
        </div>

        {question.answers.length === 0 && (
          <p className="note p-6 text-center text-ink-soft">No whispers yet. Go on, say what everyone&apos;s thinking.</p>
        )}

        {question.answers.map((a) => {
          const v = getVerdict(a.verdict);
          return (
            <div key={a.id} className="note p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                {name(a.authorId)}
                <span className={`rounded-full px-2.5 py-1 text-xs font-extrabold ${v.soft} ${v.text}`}>
                  {v.emoji} {v.label}
                </span>
              </div>
              <p className="mt-2 whitespace-pre-line text-pretty leading-relaxed">{a.body}</p>
              <div className="mt-2 flex flex-wrap items-center gap-1 text-xs text-ink-soft">
                <span className="mr-1">{timeAgo(a.createdAt)}</span>
                <LikeButton id={a.id} active={liked.has(a.id)} count={a.likeCount} signedIn={signedIn} loginHref={loginHref} />
                {signedIn && !user.banned ? <ReplyForm answerId={a.id} /> : (
                  <Link href={loginHref} className="rounded-full px-2.5 py-1.5 text-xs font-bold text-ink-soft hover:bg-lavender-50">↩️ Reply</Link>
                )}
                <span className="ml-auto">
                  <ReportButton targetType="answer" targetId={a.id} signedIn={signedIn} loginHref={loginHref} />
                </span>
              </div>

              {a.replies.length > 0 && (
                <div className="mt-3 grid gap-2 border-l-4 border-lavender-100 pl-3 sm:pl-4">
                  {a.replies.map((r) => (
                    <div key={r.id} className="rounded-2xl bg-lavender-50/70 px-3.5 py-2.5">
                      <div className="flex items-center justify-between gap-2 text-xs">
                        {name(r.authorId)}
                        <span className="text-ink-soft">{timeAgo(r.createdAt)}</span>
                      </div>
                      <p className="mt-1 whitespace-pre-line text-sm leading-relaxed">{r.body}</p>
                      <div className="flex justify-end">
                        <ReportButton targetType="reply" targetId={r.id} signedIn={signedIn} loginHref={loginHref} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </section>
    </div>
  );
}

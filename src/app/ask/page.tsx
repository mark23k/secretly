import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { QuestionForm } from "@/components/question-form";

export const metadata: Metadata = { title: "Whisper a question" };

export default async function AskPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/ask");

  return (
    <div className="mx-auto grid max-w-xl gap-5">
      <div className="text-center">
        <p className="text-5xl">🤫</p>
        <h1 className="mt-2 text-3xl font-black">Whisper a question</h1>
        <p className="mt-1 text-ink-soft">
          Nobody will know it was you. You&apos;ll get a cute secret name in your thread.
        </p>
      </div>
      <div className="note p-5 sm:p-6">
        {user.banned ? (
          <p className="text-center font-bold text-rose-700">Your account can&apos;t post right now.</p>
        ) : (
          <QuestionForm />
        )}
      </div>
    </div>
  );
}

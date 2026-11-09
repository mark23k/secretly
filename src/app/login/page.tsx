import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { AuthForm } from "@/components/auth-form";

export const metadata: Metadata = { title: "Log in" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const raw = (await searchParams).next ?? "/";
  const next = raw.startsWith("/") && !raw.startsWith("//") ? raw : "/";
  if (await getCurrentUser()) redirect(next);

  return (
    <div className="mx-auto grid max-w-sm gap-5 pt-4">
      <div className="text-center">
        <p className="text-5xl">🤫</p>
        <h1 className="mt-2 text-3xl font-black">Welcome back</h1>
        <p className="mt-1 text-ink-soft">Log in to whisper, answer and react.</p>
      </div>
      <div className="note p-5 sm:p-6">
        <AuthForm mode="login" next={next} />
      </div>
    </div>
  );
}

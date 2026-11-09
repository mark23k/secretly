import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { AuthForm } from "@/components/auth-form";

export const metadata: Metadata = { title: "Sign up" };

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const raw = (await searchParams).next ?? "/";
  const next = raw.startsWith("/") && !raw.startsWith("//") ? raw : "/";
  if (await getCurrentUser()) redirect(next);

  return (
    <div className="mx-auto grid max-w-sm gap-5 pt-4">
      <div className="text-center">
        <p className="text-5xl">🤫</p>
        <h1 className="mt-2 text-3xl font-black">Join the whispers</h1>
        <p className="mt-1 text-ink-soft">Just an email and a password. Nobody ever sees your email.</p>
      </div>
      <div className="note p-5 sm:p-6">
        <AuthForm mode="signup" next={next} />
      </div>
    </div>
  );
}

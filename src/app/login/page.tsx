import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false },
};

export default function LoginPage() {
  return (
    <div className="mx-auto w-full max-w-md px-5 py-12 sm:py-20">
      <div className="rounded-3xl border bg-card p-6 shadow-sm sm:p-8">
        <Suspense fallback={<div className="h-96" aria-hidden />}>
          <LoginForm />
        </Suspense>
      </div>
      <p className="mt-6 text-center text-xs text-pretty text-muted-foreground">
        You don&apos;t need an account to read. You need one to post, vote and reply, so we can keep
        Secretly fair and spam-free. Your email is never shown to anyone.
      </p>
    </div>
  );
}

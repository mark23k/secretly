"use client";

import Link from "next/link";
import { useActionState } from "react";
import { logIn, signUp } from "@/app/actions/auth";

export function AuthForm({ mode, next }: { mode: "signup" | "login"; next: string }) {
  const [state, action, pending] = useActionState(mode === "signup" ? signUp : logIn, undefined);
  const isSignup = mode === "signup";
  const other = isSignup ? "/login" : "/signup";
  const nextQuery = next !== "/" ? `?next=${encodeURIComponent(next)}` : "";

  return (
    <form action={action} className="grid gap-4">
      <input type="hidden" name="next" value={next} />
      <label className="grid gap-1.5">
        <span className="text-sm font-bold">Email</span>
        <input name="email" type="email" required autoComplete="email" defaultValue={state?.email} className="field" placeholder="you@example.com" />
      </label>
      <label className="grid gap-1.5">
        <span className="text-sm font-bold">Password</span>
        <input
          name="password"
          type="password"
          required
          minLength={isSignup ? 8 : undefined}
          autoComplete={isSignup ? "new-password" : "current-password"}
          className="field"
          placeholder={isSignup ? "At least 8 characters" : "Your password"}
        />
      </label>
      {state?.error && (
        <p role="alert" className="rounded-2xl bg-rose-100 px-4 py-3 text-sm font-bold text-rose-700">
          {state.error}
        </p>
      )}
      <button disabled={pending} className="btn btn-primary py-3.5 text-base">
        {pending ? "One sec…" : isSignup ? "Create my account 🤫" : "Log in"}
      </button>
      <p className="text-center text-sm text-ink-soft">
        {isSignup ? "Already have an account? " : "New here? "}
        <Link href={`${other}${nextQuery}`} className="font-bold text-lavender-700 underline-offset-2 hover:underline">
          {isSignup ? "Log in" : "Sign up"}
        </Link>
      </p>
    </form>
  );
}

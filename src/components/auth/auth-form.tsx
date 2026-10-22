"use client";

import { useId, useRef, useState } from "react";
import type { AuthError } from "@supabase/supabase-js";
import { Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getTurnstileToken } from "@/lib/turnstile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export type AuthMode = "sign-in" | "sign-up";

const MIN_PASSWORD = 8;
const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

const COPY: Record<AuthMode, { title: string; submit: string; busy: string }> = {
  "sign-in": { title: "Welcome back", submit: "Sign in", busy: "Signing in…" },
  "sign-up": { title: "Create your account", submit: "Create account", busy: "Creating account…" },
};

function friendlyError(error: AuthError): string {
  switch (error.code) {
    case "invalid_credentials":
      return "That email and password don't match.";
    case "user_already_exists":
    case "email_exists":
      return "There's already an account with that email. Try signing in.";
    case "weak_password":
      return "Please choose a stronger password.";
    case "over_request_rate_limit":
      return "Too many attempts. Please wait a few minutes and try again.";
    case "captcha_failed":
      return "The bot check failed. Please try again.";
    case "signup_disabled":
      return "New sign-ups are paused right now.";
    default:
      return error.message || "Something went wrong. Please try again.";
  }
}

/**
 * Sign in or create an account: just an email and a password, no emails are
 * sent. Used in the sign-in dialog and on /login. Successful sign-ins are
 * picked up by AuthProvider.
 */
export function AuthForm({
  initialMode = "sign-in",
  headingLevel = "h2",
}: {
  initialMode?: AuthMode;
  headingLevel?: "h1" | "h2";
}) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ids = { email: useId(), password: useId(), error: useId() };
  const captchaRef = useRef<HTMLDivElement>(null);
  const Heading = headingLevel;

  function switchMode(m: AuthMode) {
    setMode(m);
    setError(null);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (mode === "sign-up" && password.length < MIN_PASSWORD) {
      setError(`Use at least ${MIN_PASSWORD} characters for your password.`);
      return;
    }

    setPending(true);
    try {
      const supabase = createClient();
      const captchaToken = turnstileSiteKey ? await getTurnstileToken(turnstileSiteKey, captchaRef.current) : undefined;

      if (mode === "sign-in") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
          options: { captchaToken },
        });
        if (error) return setError(friendlyError(error));
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            captchaToken,
            data: { time_zone: Intl.DateTimeFormat().resolvedOptions().timeZone },
          },
        });
        if (error) return setError(friendlyError(error));
        // Only happens if "Confirm email" is still on in Supabase (see README).
        if (!data.session)
          setError(
            "Your account was created, but sign-in is switched off. Please try again later.",
          );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  }

  const copy = COPY[mode];

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="space-y-1.5">
        <Heading className="font-heading text-2xl">{copy.title}</Heading>
        <p className="text-sm text-muted-foreground">
          Your email stays private. Everything you post, vote and reply is anonymous.
        </p>
      </div>

      <div
        role="tablist"
        aria-label="Account"
        className="grid grid-cols-2 rounded-xl bg-muted p-1 text-sm"
      >
        {(["sign-in", "sign-up"] as const).map((m) => (
          <button
            key={m}
            type="button"
            role="tab"
            aria-selected={mode === m}
            onClick={() => switchMode(m)}
            className={cn(
              "rounded-lg px-3 py-1.5 font-medium text-muted-foreground transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
              mode === m && "bg-background text-foreground shadow-sm",
            )}
          >
            {m === "sign-in" ? "Sign in" : "Create account"}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label htmlFor={ids.email}>Email</Label>
          <Input
            id={ids.email}
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-describedby={error ? ids.error : undefined}
            className="h-11"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={ids.password}>Password</Label>
          <div className="relative">
            <Input
              id={ids.password}
              type={showPassword ? "text" : "password"}
              autoComplete={mode === "sign-up" ? "new-password" : "current-password"}
              required
              minLength={mode === "sign-up" ? MIN_PASSWORD : undefined}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-describedby={error ? ids.error : undefined}
              className="h-11 pr-11"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute top-1/2 right-1.5 -translate-y-1/2 text-muted-foreground"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </Button>
          </div>
          {mode === "sign-up" && (
            <p className="text-xs text-muted-foreground">At least {MIN_PASSWORD} characters.</p>
          )}
        </div>
      </div>

      {error && (
        <p
          id={ids.error}
          role="alert"
          className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {error}
        </p>
      )}

      {/* Turnstile shows here only if Cloudflare asks for a click. */}
      <div ref={captchaRef} className="flex justify-center empty:hidden" />

      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? copy.busy : copy.submit}
      </Button>
    </form>
  );
}

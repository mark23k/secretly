"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthForm } from "@/components/auth/auth-form";
import { useAuth } from "@/components/providers/auth-provider";
import { safeNext } from "@/lib/safe-next";

export function LoginForm() {
  const params = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const next = safeNext(params.get("next"));

  // Signed in (here, in the header dialog, or in another tab): carry on.
  useEffect(() => {
    if (user) router.replace(next);
  }, [user, next, router]);

  return (
    <AuthForm initialMode={params.get("mode") === "sign-up" ? "sign-up" : "sign-in"} headingLevel="h1" />
  );
}

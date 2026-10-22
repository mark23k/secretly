"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";

export function SignInPrompt({ title, description }: { title: string; description: string }) {
  const { openAuth } = useAuth();
  return (
    <EmptyState title={title} description={description}>
      <div className="flex flex-wrap justify-center gap-2">
        <Button onClick={() => openAuth("sign-in")}>Sign in</Button>
        <Button variant="outline" onClick={() => openAuth("sign-up")}>
          Create account
        </Button>
      </div>
    </EmptyState>
  );
}

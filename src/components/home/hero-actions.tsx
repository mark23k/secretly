"use client";

import { ArrowDown } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";

/** "Start swiping" scrolls to the deck; "Sign up free" only shows when signed out. */
export function HeroActions() {
  const { user, openAuth } = useAuth();
  return (
    <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
      <Button asChild size="lg" className="w-full rounded-full px-7 sm:w-auto">
        <a href="#deck">
          Start swiping <ArrowDown data-icon="inline-end" />
        </a>
      </Button>
      {user === null ? (
        <Button
          size="lg"
          variant="outline"
          className="w-full rounded-full bg-background/70 px-7 sm:w-auto"
          onClick={() => openAuth("sign-up")}
        >
          Sign up free
        </Button>
      ) : null}
    </div>
  );
}

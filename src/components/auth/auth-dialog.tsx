"use client";

import { Lock } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { AuthForm, type AuthMode } from "./auth-form";

export type { AuthMode };

/** The sign-in dialog opened by AuthProvider (requireAuth / openAuth). */
export function AuthDialog({
  open,
  onOpenChange,
  initialMode,
  reason,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialMode: AuthMode;
  reason?: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-3xl p-6 sm:max-w-md sm:p-8">
        <DialogTitle className="sr-only">Sign in to Secretly</DialogTitle>
        <DialogDescription className="sr-only">
          Sign in or create a free account. Your email is never shown to anyone.
        </DialogDescription>
        {reason && (
          <p className="-mb-1 flex items-center gap-2 text-sm font-medium text-primary">
            <Lock className="size-3.5" aria-hidden />
            {reason}
          </p>
        )}
        <AuthForm initialMode={initialMode} />
      </DialogContent>
    </Dialog>
  );
}

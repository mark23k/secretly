"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";
import { AuthCancelledError, useAuth } from "@/components/providers/auth-provider";
import { useCrisis } from "@/components/providers/crisis-provider";
import type { ActionResult } from "@/lib/server/errors";

type Options = {
  /** Show non-field errors as toasts (default true). */
  toastErrors?: boolean;
  /** Message when content is saved but held for review. */
  heldMessage?: string;
  /** Shown above the sign-in dialog if the visitor isn't signed in yet. */
  authReason?: string;
};

const DEFAULT_AUTH_REASON = "Sign in to join in. It stays anonymous.";

/**
 * Runs a server action from the client: makes sure the visitor is signed in
 * first (opening the sign-in dialog if not), retries once if the session
 * expired on the server, and handles the shared UX
 * (error toasts, "held for review" notice, crisis resources).
 */
export function useAction<I, O>(action: (input: I) => Promise<ActionResult<O>>, options: Options = {}) {
  const { requireAuth } = useAuth();
  const { showCrisis } = useCrisis();
  const [pending, setPending] = useState(false);
  const {
    toastErrors = true,
    heldMessage = "Thanks! It'll appear once a moderator has had a quick look.",
    authReason = DEFAULT_AUTH_REASON,
  } = options;

  const execute = useCallback(
    async (input: I): Promise<ActionResult<O>> => {
      setPending(true);
      try {
        await requireAuth({ reason: authReason });
        let result = await action(input);
        if (!result.ok && result.code === "auth_required") {
          await requireAuth({ force: true, reason: authReason });
          result = await action(input);
        }

        if (result.ok && result.held === "crisis") showCrisis();
        else if (result.ok && result.held === "review") toast(heldMessage);
        else if (!result.ok && toastErrors && !result.fieldErrors) toast.error(result.message);
        return result;
      } catch (error) {
        if (error instanceof AuthCancelledError) {
          return { ok: false, code: "auth_required", message: error.message };
        }
        const message = error instanceof Error ? error.message : "Something went wrong.";
        if (toastErrors) toast.error(message);
        return { ok: false, code: "server", message };
      } finally {
        setPending(false);
      }
    },
    [action, authReason, heldMessage, requireAuth, showCrisis, toastErrors]
  );

  return { execute, pending };
}

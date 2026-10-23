"use server";

import { isAdminEmail } from "@/lib/server/admin";
import { ok, type ActionResult } from "@/lib/server/errors";
import { getSessionUser } from "@/lib/server/visitor";
import { createAdminClient } from "@/lib/supabase/admin";

/** What the header needs to know about the signed-in account. */
export async function getViewer(): Promise<{ isAdmin: boolean }> {
  const user = await getSessionUser();
  return { isAdmin: isAdminEmail(user?.email) };
}

/**
 * Permanently deletes the signed-in account and everything posted with it
 * (all content tables cascade from the account).
 */
export async function deleteMyAccount(): Promise<ActionResult> {
  const user = await getSessionUser();
  if (!user) return { ok: false, code: "auth_required", message: "Please sign in first." };
  const { error } = await createAdminClient().auth.admin.deleteUser(user.id);
  if (error) {
    console.error("[deleteMyAccount]", error);
    return { ok: false, code: "server", message: "Couldn't delete your account. Please try again." };
  }
  return ok(null);
}

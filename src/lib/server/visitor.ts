import "server-only";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { Database } from "@/lib/supabase/database.types";
import { ActionError } from "./errors";

export type Visitor = Database["public"]["Tables"]["visitors"]["Row"];

export type SessionUser = { id: string; email: string | null };

/** The signed-in account from the verified session cookie, if any. */
export async function getSessionUser(): Promise<SessionUser | null> {
  if (!isSupabaseConfigured) return null;
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims?.sub || claims.is_anonymous) return null;
  return { id: claims.sub, email: typeof claims.email === "string" ? claims.email : null };
}

export async function getSessionUserId(): Promise<string | null> {
  return (await getSessionUser())?.id ?? null;
}

/**
 * Loads the visitor row for the signed-in account (creating it if the sign-up
 * trigger somehow didn't). Throws `auth_required` if signed out and `banned`
 * if banned.
 */
export async function requireVisitor(ipHash: string | null): Promise<Visitor> {
  const id = await getSessionUserId();
  if (!id) {
    throw new ActionError("auth_required", "Please sign in to continue.");
  }

  const admin = createAdminClient();
  const { data: existing, error } = await admin
    .from("visitors")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;

  let visitor = existing;
  if (!visitor) {
    const { data: created, error: insertError } = await admin
      .from("visitors")
      .upsert({ id, ip_hash: ipHash }, { onConflict: "id" })
      .select("*")
      .single();
    if (insertError) throw insertError;
    visitor = created;
  } else if (!visitor.ip_hash && ipHash) {
    await admin.from("visitors").update({ ip_hash: ipHash }).eq("id", id);
  }

  if (visitor.banned) {
    throw new ActionError(
      "banned",
      "This account can no longer post on Secretly because of a guidelines violation."
    );
  }
  return visitor;
}

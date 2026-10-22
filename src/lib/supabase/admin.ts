import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import { supabaseUrl } from "./env";

/**
 * Service-role client. Bypasses RLS: use only in server actions/route handlers
 * after the caller has been validated. Never import from client components.
 */
export function createAdminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !key) {
    throw new Error("Supabase service role is not configured (SUPABASE_SERVICE_ROLE_KEY).");
  }
  return createClient<Database>(supabaseUrl, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export type AdminClient = ReturnType<typeof createAdminClient>;

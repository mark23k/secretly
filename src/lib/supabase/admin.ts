import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import { ConfigError } from "@/lib/server/errors";
import { supabaseUrl } from "./env";

/**
 * Service-role client. Bypasses RLS: use only in server actions/route handlers
 * after the caller has been validated. Never import from client components.
 */
export function createAdminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !key) {
    throw new ConfigError(key ? "NEXT_PUBLIC_SUPABASE_URL" : "SUPABASE_SERVICE_ROLE_KEY", "is not set");
  }
  return createClient<Database>(supabaseUrl, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export type AdminClient = ReturnType<typeof createAdminClient>;

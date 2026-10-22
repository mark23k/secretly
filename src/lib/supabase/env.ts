// Tolerates the common copy-paste of the REST endpoint (".../rest/v1/") instead of the project URL.
export const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

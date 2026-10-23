import "server-only";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { ThoughtCategory, ThoughtSort } from "@/config/thoughts";
import { toThought, type Thought, type ThoughtComment } from "./thoughts";

/*
 * Server-side reads. These go through the visitor's own session (anon key +
 * cookies), so RLS and the security-definer read functions decide what's
 * visible, exactly as they would from the browser.
 */

export const FEED_PAGE_SIZE = 20;

/** Always request-time (per-visitor data); null when Supabase isn't configured. */
async function db() {
  await connection();
  return isSupabaseConfigured ? createClient() : null;
}

export async function getThoughtFeed(opts: {
  sort: ThoughtSort;
  category?: ThoughtCategory;
  offset?: number;
}): Promise<Thought[]> {
  const supabase = await db();
  if (!supabase) return [];
  const { data, error } = await supabase.rpc("get_thought_feed", {
    p_sort: opts.sort,
    p_category: opts.category,
    p_limit: FEED_PAGE_SIZE,
    p_offset: opts.offset ?? 0,
  });
  if (error) throw error;
  return data.map(toThought);
}

export async function getNextThoughts(category?: ThoughtCategory): Promise<Thought[]> {
  const supabase = await db();
  if (!supabase) return [];
  const { data, error } = await supabase.rpc("get_next_thoughts", { p_limit: 8, p_category: category });
  if (error) throw error;
  return data.map(toThought);
}

export async function getThought(id: string): Promise<Thought | null> {
  const supabase = await db();
  if (!supabase) return null;
  const { data, error } = await supabase.rpc("get_thought", { p_id: id });
  if (error) throw error;
  return data[0] ? toThought(data[0]) : null;
}

export async function getThoughtComments(thoughtId: string): Promise<ThoughtComment[]> {
  const supabase = await db();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("thought_comments")
    .select("id, body, created_at")
    .eq("thought_id", thoughtId)
    .order("created_at", { ascending: true })
    .limit(200);
  if (error) throw error;
  return data.map((c) => ({ id: c.id, body: c.body, createdAt: c.created_at }));
}

export async function getMyThoughts(): Promise<Thought[]> {
  const supabase = await db();
  if (!supabase) return [];
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims) return [];
  const { data, error } = await supabase.rpc("get_my_thoughts");
  if (error) throw error;
  return data.map(toThought);
}

/** The hand-picked thoughts that open the home page deck. */
export async function getFeaturedThoughts(): Promise<Thought[]> {
  const supabase = await db();
  if (!supabase) return [];
  const { data, error } = await supabase.rpc("get_featured_thoughts", { p_limit: 12 });
  if (error) throw error;
  return data.map(toThought);
}

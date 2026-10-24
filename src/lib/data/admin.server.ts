import "server-only";
import { connection } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/lib/supabase/database.types";

export type LiveStats = { online: number; members: number; guests: number };

export type DailyStat = {
  day: string;
  visitors: number;
  active_members: number;
  visits: number;
  signups: number;
  posts: number;
  interactions: number;
};

export type HourlyStat = { hour: number; interactions: number; visits: number };

export type AdminStats = {
  /** First and last local day of the range, "YYYY-MM-DD". */
  from: string;
  to: string;
  days: number;
  timeZone: string;
  generatedAt: string;
  totals: {
    members: number;
    newMembers: number;
    visitors: number;
    visits: number;
    pageViews: number;
    avgVisitSeconds: number;
    medianVisitSeconds: number;
    posts: number;
    replies: number;
    reactions: number;
    interactions: number;
    activeMembers: number;
    postsAllTime: number;
    posters: number;
    postsPerMember: number | null;
    postsPerPoster: number | null;
  };
  daily: DailyStat[];
  hourly: HourlyStat[];
  byKind: Record<string, number>;
};

/**
 * Dashboard numbers for a range of local days. `from`/`to` are "YYYY-MM-DD";
 * omit them for the last 30 days. Callers must check the viewer is an admin
 * first (see lib/server/admin).
 */
export async function getAdminStats(
  range: { from?: string; to?: string },
  timeZone: string
): Promise<AdminStats> {
  await connection();
  const { data, error } = await createAdminClient().rpc("admin_stats_range", {
    p_from: range.from as string,
    p_to: range.to as string,
    p_tz: timeZone,
  });
  if (error) throw error;
  return data as unknown as AdminStats;
}

export type DayPost = {
  kind: "thought" | "question";
  id: string;
  text: string;
  category: string;
  status: "published" | "pending" | "hidden" | "removed";
  createdAt: string;
  options: string[] | null;
  /** Comments (thoughts) or answers (questions). */
  comments: number;
};

export type DayPosts = {
  posts: DayPost[];
  counts: { comments: number; answers: number; secrets: number; secretReplies: number };
};

/** What real members posted on one local day. Admin only. */
export async function getDayPosts(day: string, timeZone: string): Promise<DayPosts> {
  await connection();
  const { data, error } = await createAdminClient().rpc("admin_day_posts", { p_day: day, p_tz: timeZone });
  if (error) throw error;
  return data as unknown as DayPosts;
}

export async function getLiveStats(): Promise<LiveStats> {
  const { data, error } = await createAdminClient().rpc("admin_live_stats");
  if (error) throw error;
  return data as unknown as LiveStats;
}

/** The admin's own time zone (captured at sign-up), for days and hours. */
export async function getAccountTimeZone(userId: string): Promise<string> {
  const { data } = await createAdminClient().from("visitors").select("time_zone").eq("id", userId).maybeSingle();
  return data?.time_zone ?? "UTC";
}

export type ModerationItem = {
  kind: Database["public"]["Enums"]["content_kind"];
  id: string;
  text: string;
  context: string | null;
  status: "pending" | "hidden" | "published";
  createdAt: string;
  openReports: number;
  reportReasons: string[];
  reportDetails: string[];
  autoReasons: string[];
  author: string;
  authorBanned: boolean;
};

export type ModerationQueue = {
  counts: { pending: number; hidden: number; reported: number };
  items: ModerationItem[];
  banned: { id: string; author: string; bannedAt: string; reason: string | null }[];
};

/** Callers must check the viewer is an admin first. */
export async function getModerationQueue(): Promise<ModerationQueue> {
  await connection();
  const { data, error } = await createAdminClient().rpc("admin_moderation_queue", { p_limit: 150 });
  if (error) throw error;
  return data as unknown as ModerationQueue;
}

export type ActivityItem = {
  id: number;
  kind: Database["public"]["Enums"]["activity_kind"];
  createdAt: string;
  /** The new post or reply's own text (never for secrets). */
  text: string | null;
  /** What it was about: the thought, question or answer. */
  context: string | null;
  /** The answer picked (votes) or the reaction key. */
  detail: string | null;
  status: string | null;
  href: string | null;
};

export type ActivityGroup = "post" | "reply" | "reaction";

/** Newest activity first, with no account information. Admin only. */
export async function getRecentActivity(opts: { before?: string; group?: ActivityGroup }): Promise<ActivityItem[]> {
  await connection();
  const { data, error } = await createAdminClient().rpc("admin_recent_activity", {
    p_limit: 60,
    p_before: opts.before as string,
    p_group: opts.group as string,
  });
  if (error) throw error;
  return data as unknown as ActivityItem[];
}

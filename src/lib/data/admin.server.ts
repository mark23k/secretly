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

/** Callers must check the viewer is an admin first (see lib/server/admin). */
export async function getAdminStats(days: number, timeZone: string): Promise<AdminStats> {
  await connection();
  const { data, error } = await createAdminClient().rpc("admin_stats", { p_days: days, p_tz: timeZone });
  if (error) throw error;
  return data as unknown as AdminStats;
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

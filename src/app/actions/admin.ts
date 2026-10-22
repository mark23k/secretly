"use server";

import { getLiveStats, type LiveStats } from "@/lib/data/admin.server";
import { getAdminUser } from "@/lib/server/admin";

/** Polled by the "online now" tile. */
export async function fetchLiveStats(): Promise<LiveStats | null> {
  if (!(await getAdminUser())) return null;
  return getLiveStats();
}

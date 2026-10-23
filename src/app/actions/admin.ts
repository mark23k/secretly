"use server";

import { z } from "zod";
import { getLiveStats, type LiveStats } from "@/lib/data/admin.server";
import { getAdminUser } from "@/lib/server/admin";
import { ActionError, ok, type ActionResult } from "@/lib/server/errors";
import { createAdminClient } from "@/lib/supabase/admin";
import { Constants } from "@/lib/supabase/database.types";

/** Polled by the "online now" tile. */
export async function fetchLiveStats(): Promise<LiveStats | null> {
  if (!(await getAdminUser())) return null;
  return getLiveStats();
}

const target = z.object({ kind: z.enum(Constants.public.Enums.content_kind), id: z.uuid() });

/** Runs a manager-only action, mapping failures to friendly results. */
async function asAdmin(run: (adminEmail: string) => Promise<void>): Promise<ActionResult> {
  try {
    const admin = await getAdminUser();
    if (!admin) throw new ActionError("forbidden", "Only managers can do that.");
    await run(admin.email ?? "admin");
    return ok(null);
  } catch (error) {
    if (error instanceof ActionError) return { ok: false, code: error.code, message: error.message };
    if (error && typeof error === "object" && "code" in error && error.code === "P0002") {
      return { ok: false, code: "not_found", message: "That no longer exists. Refresh the page." };
    }
    console.error("[admin action]", error);
    return { ok: false, code: "server", message: "Something went wrong. Please try again." };
  }
}

export async function moderateContent(input: z.input<typeof target> & { action: "approve" | "remove" }) {
  return asAdmin(async (email) => {
    const { kind, id } = target.parse(input);
    const action = z.enum(["approve", "remove"]).parse(input.action);
    const { error } = await createAdminClient().rpc("admin_moderate", {
      p_kind: kind,
      p_id: id,
      p_action: action,
      p_admin: email,
    });
    if (error) throw error;
  });
}

export async function banAuthor(input: z.input<typeof target> & { reason: string }) {
  return asAdmin(async (email) => {
    const { kind, id } = target.parse(input);
    const reason = z.string().trim().min(1).max(300).catch("Guidelines violation").parse(input.reason);
    const { error } = await createAdminClient().rpc("admin_ban_author", {
      p_kind: kind,
      p_id: id,
      p_reason: reason,
      p_admin: email,
    });
    if (error) throw error;
  });
}

export async function unbanAccount(input: { visitorId: string }) {
  return asAdmin(async () => {
    const visitorId = z.uuid().parse(input.visitorId);
    const { error } = await createAdminClient().rpc("admin_unban", { p_visitor: visitorId });
    if (error) throw error;
  });
}

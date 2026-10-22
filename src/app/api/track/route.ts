import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getIpHash } from "@/lib/server/ip";
import { enforceRateLimit } from "@/lib/server/rate-limit";
import { getSessionUserId } from "@/lib/server/visitor";

const schema = z.object({
  session: z.uuid(),
  device: z.uuid(),
  event: z.enum(["page", "ping", "resume"]),
});

const BOT_UA = /bot|crawl|spider|slurp|preview|headless|lighthouse|monitor/i;

/**
 * Visit heartbeat from <VisitTracker />. Powers "online now", daily visitors
 * and time on site. Always answers 204 so failures never surface to visitors.
 */
export async function POST(request: Request) {
  const done = new Response(null, { status: 204 });
  if (!isSupabaseConfigured || BOT_UA.test(request.headers.get("user-agent") ?? "")) return done;

  try {
    const parsed = schema.safeParse(JSON.parse(await request.text()));
    if (!parsed.success) return done;
    const { session, device, event } = parsed.data;

    // Only page views can start a visit, so only they need a rate limit and
    // the (slightly slower) session lookup.
    let userId: string | null = null;
    if (event === "page") {
      await enforceRateLimit("trackVisit", { ipHash: await getIpHash() });
      userId = await getSessionUserId();
    }

    const { error } = await createAdminClient().rpc("track_visit", {
      p_session: session,
      p_device: device,
      p_user: userId as string,
      p_event: event,
    });
    if (error) console.error("[track]", error.message);
  } catch {
    // Rate limited or malformed: drop silently.
  }
  return done;
}

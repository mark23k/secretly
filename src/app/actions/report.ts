"use server";

import { z } from "zod";
import { REPORT_HIDE_THRESHOLD, textLimits } from "@/config/limits";
import { createAction } from "@/lib/server/action";
import { ActionError, ok } from "@/lib/server/errors";
import { cleanText } from "@/lib/text";
import { Constants } from "@/lib/supabase/database.types";
import { reportReasonValues } from "@/config/report";

const schema = z.object({
  kind: z.enum(Constants.public.Enums.content_kind),
  id: z.uuid(),
  reason: z.enum(reportReasonValues),
  details: z
    .string()
    .optional()
    .transform((v) => (v ? cleanText(v).slice(0, textLimits.reportDetails.max) : null)),
});

export const reportContent = createAction({
  schema,
  rateLimit: "report",
  handler: async ({ kind, id, reason, details }, { visitor, admin }) => {
    const { error } = await admin.from("reports").upsert(
      { target_kind: kind, target_id: id, reporter_id: visitor.id, reason, details },
      { onConflict: "target_kind,target_id,reporter_id", ignoreDuplicates: true }
    );
    if (error) throw error;

    const { data: count, error: rpcError } = await admin.rpc("register_report", {
      p_kind: kind,
      p_id: id,
      p_threshold: REPORT_HIDE_THRESHOLD,
    });
    if (rpcError) throw rpcError;
    if (count === null) throw new ActionError("not_found", "That post no longer exists.");
    return ok(null);
  },
});

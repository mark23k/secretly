"use server";

import { z } from "zod";
import { DAILY_SECRET_EXCHANGES, textLimits } from "@/config/limits";
import { createAction } from "@/lib/server/action";
import { logModeration, screenContent } from "@/lib/server/content";
import { ActionError, ok } from "@/lib/server/errors";
import { textField } from "@/lib/text";
import type { ReceivedSecret } from "@/lib/data/secrets";

/** Give a secret, get a stranger's secret back (if one is available). */
export const exchangeSecret = createAction({
  schema: z.object({ body: textField(textLimits.secret, "Your secret") }),
  rateLimit: "exchangeSecret",
  handler: async ({ body }, { visitor, admin }) => {
    const screened = await screenContent(body, "secret");
    const { data, error } = await admin.rpc("exchange_secret", {
      p_visitor: visitor.id,
      p_body: body,
      p_status: screened.status,
      p_daily_limit: DAILY_SECRET_EXCHANGES,
    });
    if (error) {
      if (error.message === "daily_limit") {
        throw new ActionError("limit_reached", "That's all three for today. Come back tomorrow for more.");
      }
      throw error;
    }
    const result = data as unknown as {
      givenId: string;
      used: number;
      limit: number;
      resetsAt: string;
      received: ReceivedSecret | null;
    };
    await logModeration(admin, { kind: "secret", id: result.givenId, visitorId: visitor.id }, screened.result);
    return ok(
      { used: result.used, limit: result.limit, resetsAt: result.resetsAt, received: result.received },
      screened.held
    );
  },
});

/** One short message to the author of a secret you received. Strictly moderated. */
export const replyToSecret = createAction({
  schema: z.object({
    deliveryId: z.uuid(),
    body: textField(textLimits.secretReply, "Your message"),
  }),
  rateLimit: "replySecret",
  handler: async ({ deliveryId, body }, { visitor, admin }) => {
    const { data: secretId, error: checkError } = await admin.rpc("check_secret_reply", {
      p_visitor: visitor.id,
      p_delivery: deliveryId,
    });
    if (checkError) {
      if (checkError.code === "23505") throw new ActionError("forbidden", "You've already replied to this secret.");
      if (checkError.code === "P0002") throw new ActionError("not_found", "This secret is no longer available.");
      throw checkError;
    }

    const screened = await screenContent(body, "secret_reply");
    const { data, error } = await admin
      .from("secret_replies")
      .insert({ delivery_id: deliveryId, secret_id: secretId, author_id: visitor.id, body, status: screened.status })
      .select("id")
      .single();
    if (error) {
      if (error.code === "23505") throw new ActionError("forbidden", "You've already replied to this secret.");
      throw error;
    }
    await logModeration(admin, { kind: "secret_reply", id: data.id, visitorId: visitor.id }, screened.result);
    return ok(null, screened.held);
  },
});

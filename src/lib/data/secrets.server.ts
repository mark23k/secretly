import "server-only";
import { connection } from "next/server";
import { DAILY_SECRET_EXCHANGES } from "@/config/limits";
import { createAdminClient } from "@/lib/supabase/admin";
import type { ExchangeState, MySecret, ReceivedSecret } from "./secrets";

/*
 * Secrets are never readable with the visitor's own key, so these use the
 * service role. Callers must pass the verified account id (getSessionUser).
 */

export async function getExchangeState(visitorId: string): Promise<ExchangeState> {
  await connection();
  const { data, error } = await createAdminClient().rpc("get_exchange_state", {
    p_visitor: visitorId,
    p_daily_limit: DAILY_SECRET_EXCHANGES,
  });
  if (error) throw error;
  return data as unknown as ExchangeState;
}

export async function getMySecrets(visitorId: string): Promise<MySecret[]> {
  await connection();
  const { data, error } = await createAdminClient().rpc("get_my_secrets", { p_visitor: visitorId });
  if (error) throw error;
  return data as unknown as MySecret[];
}

export async function getReceivedSecrets(visitorId: string): Promise<ReceivedSecret[]> {
  await connection();
  const { data, error } = await createAdminClient().rpc("get_received_secrets", { p_visitor: visitorId });
  if (error) throw error;
  return data as unknown as ReceivedSecret[];
}

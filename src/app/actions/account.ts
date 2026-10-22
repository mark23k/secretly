"use server";

import { isAdminEmail } from "@/lib/server/admin";
import { getSessionUser } from "@/lib/server/visitor";

/** What the header needs to know about the signed-in account. */
export async function getViewer(): Promise<{ isAdmin: boolean }> {
  const user = await getSessionUser();
  return { isAdmin: isAdminEmail(user?.email) };
}

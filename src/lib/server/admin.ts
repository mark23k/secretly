import "server-only";
import { notFound, redirect } from "next/navigation";
import { getSessionUser, type SessionUser } from "./visitor";

/** Comma-separated ADMIN_EMAILS: accounts that can open the manager dashboard. */
const adminEmails = new Set(
  (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
);

export function isAdminEmail(email: string | null | undefined): boolean {
  return Boolean(email && adminEmails.has(email.toLowerCase()));
}

/** For admin pages: sends signed-out visitors to sign in, and 404s everyone else. */
export async function requireAdminPage(next: string): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(next)}`);
  if (!isAdminEmail(user.email)) notFound();
  return user;
}

/** For admin actions: returns null unless the caller is an admin. */
export async function getAdminUser(): Promise<SessionUser | null> {
  const user = await getSessionUser();
  return user && isAdminEmail(user.email) ? user : null;
}

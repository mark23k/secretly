import "server-only";
import { cookies } from "next/headers";
import { cache } from "react";
import { createHash, randomBytes } from "node:crypto";
import { db } from "./db";

const COOKIE = "ss_session";
const MAX_AGE_DAYS = 30;

function hashToken(token: string) {
  const secret = process.env.SESSION_SECRET;
  if (!secret && process.env.NODE_ENV === "production") {
    throw new Error("SESSION_SECRET must be set in production.");
  }
  return createHash("sha256").update(`${secret ?? "dev-secret"}:${token}`).digest("hex");
}

export function isAdminEmail(email: string) {
  const admin = (process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();
  return admin !== "" && email.trim().toLowerCase() === admin;
}

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + MAX_AGE_DAYS * 24 * 60 * 60 * 1000);
  await db.session.create({ data: { id: hashToken(token), userId, expiresAt } });
  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function destroySession() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (token) await db.session.deleteMany({ where: { id: hashToken(token) } });
  jar.delete(COOKIE);
}

export type CurrentUser = { id: string; isAdmin: boolean; banned: boolean };

/** The signed-in user for this request, or null. Never exposes the email. */
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  const session = await db.session.findUnique({
    where: { id: hashToken(token) },
    include: { user: { select: { id: true, isAdmin: true, banned: true } } },
  });
  if (!session || session.expiresAt < new Date()) return null;
  return session.user;
});

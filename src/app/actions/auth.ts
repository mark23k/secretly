"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { createSession, destroySession, isAdminEmail } from "@/lib/auth";
import { LIMITS } from "@/lib/constants";

export type FormState = { error?: string; email?: string } | undefined;

const credentials = z.object({
  email: z.string().trim().toLowerCase().email("That email doesn't look right."),
  password: z.string().min(1, "Enter your password."),
});

/** Only allow redirects back into this site. */
function safeNext(value: FormDataEntryValue | null) {
  const next = typeof value === "string" ? value : "";
  return next.startsWith("/") && !next.startsWith("//") ? next : "/";
}

export async function signUp(_: FormState, formData: FormData): Promise<FormState> {
  const parsed = credentials.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  const typed = String(formData.get("email") ?? "");
  if (!parsed.success) return { error: parsed.error.issues[0].message, email: typed };
  const { email, password } = parsed.data;
  if (password.length < LIMITS.passwordMin) {
    return { error: `Use at least ${LIMITS.passwordMin} characters for your password.`, email };
  }
  if (await db.user.findUnique({ where: { email } })) {
    return { error: "That email already has an account. Try logging in instead.", email };
  }
  const user = await db.user.create({
    data: { email, passwordHash: await bcrypt.hash(password, 12), isAdmin: isAdminEmail(email) },
  });
  await createSession(user.id);
  redirect(safeNext(formData.get("next")));
}

export async function logIn(_: FormState, formData: FormData): Promise<FormState> {
  const parsed = credentials.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message, email: String(formData.get("email") ?? "") };
  const { email, password } = parsed.data;
  const user = await db.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return { error: "Wrong email or password.", email };
  }
  if (user.banned) return { error: "This account has been suspended.", email };
  // The ADMIN_EMAIL account becomes admin automatically when it logs in.
  if (isAdminEmail(email) && !user.isAdmin) {
    await db.user.update({ where: { id: user.id }, data: { isAdmin: true } });
  }
  await createSession(user.id);
  redirect(safeNext(formData.get("next")));
}

export async function logOut() {
  await destroySession();
  redirect("/");
}

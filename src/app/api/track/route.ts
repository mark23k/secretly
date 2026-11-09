import { NextResponse, type NextRequest } from "next/server";
import { randomUUID } from "node:crypto";
import { db } from "@/lib/db";

const COOKIE = "ss_vid";
const BOTS = /bot|crawl|spider|slurp|preview|facebookexternalhit|headless|lighthouse/i;

/** Records an anonymous page view. Uses a random cookie ID; never stores IPs. */
export async function POST(req: NextRequest) {
  const res = new NextResponse(null, { status: 204 });
  if (BOTS.test(req.headers.get("user-agent") ?? "")) return res;

  let path = "/";
  try {
    const body = await req.json();
    if (typeof body?.path === "string") path = body.path.slice(0, 200);
  } catch {}
  if (path.startsWith("/admin")) return res;

  let visitorId = req.cookies.get(COOKIE)?.value;
  if (!visitorId || !/^[0-9a-f-]{36}$/.test(visitorId)) {
    visitorId = randomUUID();
    res.cookies.set(COOKIE, visitorId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
  }
  await db.pageView.create({ data: { visitorId, path } });
  return res;
}

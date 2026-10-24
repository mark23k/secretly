import { NextResponse, type NextRequest } from "next/server";
import { ISO_DAY } from "@/config/admin";

/** The day page's "Go to a day" form lands here: /admin/day/go?date=YYYY-MM-DD. */
export function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get("date") ?? "";
  const target = ISO_DAY.test(date) ? `/admin/day/${date}` : "/admin?tab=daily";
  return NextResponse.redirect(new URL(target, request.url));
}

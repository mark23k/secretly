import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from "@/lib/supabase/env";
import { bypassesMaintenance, comingSoonHtml, maintenanceMode } from "@/lib/coming-soon";

/**
 * Keeps a signed-in visitor's Supabase session fresh. Signed-out visitors
 * have no sb- cookies, so their requests pass straight through.
 * In maintenance mode, public pages get the "coming soon" page instead.
 */
export async function proxy(request: NextRequest) {
  if (maintenanceMode && !bypassesMaintenance(request.nextUrl.pathname)) {
    return new NextResponse(comingSoonHtml, {
      status: 503,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "retry-after": "86400",
        "cache-control": "no-store",
      },
    });
  }

  let response = NextResponse.next({ request });
  if (!isSupabaseConfigured) return response;

  const hasSession = request.cookies.getAll().some((c) => c.name.startsWith("sb-"));
  if (!hasSession) return response;

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });
  await supabase.auth.getClaims();
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|api/track|icon|apple-icon|opengraph-image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff2?)$).*)",
  ],
};

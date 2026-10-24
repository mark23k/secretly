"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Flame, Mail, MessageCircleQuestion, Moon, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/", label: "Swipe", icon: Flame, match: (p: string) => p === "/" || p.startsWith("/only-one") },
  { href: "/ask", label: "Ask", icon: MessageCircleQuestion, match: (p: string) => p.startsWith("/ask") },
  { href: "/after-dark", label: "After Dark", icon: Moon, match: (p: string) => p.startsWith("/after-dark"), hot: true },
  { href: "/exchange", label: "Secrets", icon: Mail, match: (p: string) => p.startsWith("/exchange") },
  { href: "/me", label: "Me", icon: UserRound, match: (p: string) => p.startsWith("/me") },
];

/** App-style bottom navigation on phones. Reads the URL, so render inside <Suspense>. */
export function MobileTabBar() {
  return <MobileTabBarLinks pathname={usePathname()} />;
}

/** URL-independent render, used as the Suspense fallback. */
export function MobileTabBarLinks({ pathname }: { pathname: string }) {
  return (
    <nav
      aria-label="App"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl sm:hidden"
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-around px-1">
        {tabs.map(({ href, label, icon: Icon, match, hot }) => {
          const active = pathname ? match(pathname) : false;
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex h-16 flex-col items-center justify-center gap-1 text-[0.68rem] font-medium text-muted-foreground transition-colors",
                  active && "text-primary"
                )}
              >
                <span className="relative">
                  <Icon className={cn("size-[1.35rem]", active && "fill-primary/15")} aria-hidden />
                  {hot ? (
                    <span className="absolute -top-0.5 -right-1 size-2 rounded-full bg-[#d6a4e3] shadow-[0_0_8px_#d6a4e3]" aria-hidden />
                  ) : null}
                </span>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

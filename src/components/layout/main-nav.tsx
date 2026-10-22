"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { features, legalLinks } from "@/config/site";
import { AccountMenu, MobileAccountLinks } from "@/components/layout/account-menu";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Wordmark } from "@/components/brand/logo";
import { cn } from "@/lib/utils";

const navItems = Object.values(features);

function activeMatcher(pathname: string) {
  return (href: string) => pathname === href || pathname.startsWith(`${href}/`);
}

/** Reads the URL, so it must render inside <Suspense> (see SiteHeader). */
export function MainNav() {
  return <MainNavLinks pathname={usePathname()} />;
}

export function MobileNav() {
  return <MobileNavSheet pathname={usePathname()} />;
}

/** URL-independent render, used as the Suspense fallback during prerendering. */
export function MainNavLinks({ pathname }: { pathname: string }) {
  const isActive = activeMatcher(pathname);
  return (
    <nav aria-label="Main" className="hidden items-center gap-1 sm:flex">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={isActive(item.href) ? "page" : undefined}
          className={cn(
            "rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
            "aria-[current=page]:text-foreground"
          )}
        >
          {item.navLabel}
        </Link>
      ))}
      <AccountMenu />
    </nav>
  );
}

export function MobileNavSheet({ pathname }: { pathname: string }) {
  const isActive = activeMatcher(pathname);
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="sm:hidden" aria-label="Open menu">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[85%] max-w-sm gap-0 p-6">
        <SheetTitle>
          <Wordmark />
        </SheetTitle>
        <SheetDescription className="mt-2">
          Anonymous. Always.
        </SheetDescription>
        <nav aria-label="Mobile" className="mt-8 flex flex-col gap-1">
          {navItems.map((item) => (
            <SheetClose asChild key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className="rounded-xl px-4 py-3 text-base font-medium transition-colors hover:bg-muted aria-[current=page]:bg-accent aria-[current=page]:text-accent-foreground"
              >
                {item.title}
              </Link>
            </SheetClose>
          ))}
          <MobileAccountLinks isActive={isActive} />
        </nav>
        <div className="mt-auto flex flex-col gap-1 border-t pt-6">
          {legalLinks.map((l) => (
            <SheetClose asChild key={l.href}>
              <Link
                href={l.href}
                className="rounded-lg px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
              >
                {l.label}
              </Link>
            </SheetClose>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}

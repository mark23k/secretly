import { LogoLink } from "@/components/brand/logo";
import { Suspense } from "react";
import {
  MainNav,
  MainNavLinks,
  MobileNav,
  MobileNavSheet,
} from "@/components/layout/main-nav";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { MobileSignUp } from "@/components/layout/account-menu";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/70">
      <a
        href="#main"
        className="sr-only rounded-md bg-primary px-3 py-2 text-primary-foreground focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50"
      >
        Skip to content
      </a>
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-5">
        <LogoLink />
        <div className="flex items-center gap-1">
          <Suspense fallback={<MainNavLinks pathname="" />}>
            <MainNav />
          </Suspense>
          <MobileSignUp />
          <ThemeToggle />
          <Suspense fallback={<MobileNavSheet pathname="" />}>
            <MobileNav />
          </Suspense>
        </div>
      </div>
    </header>
  );
}

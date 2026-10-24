"use client";

import Link from "next/link";
import { BarChart3, LogOut, NotebookPen, UserRound } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SheetClose } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

async function signOutWithToast(signOut: () => Promise<void>) {
  await signOut();
  toast("You've signed out.");
}

/** Header account control (desktop): "Sign in", or a menu once signed in. */
export function AccountMenu({ className }: { className?: string }) {
  const { user, openAuth, signOut } = useAuth();

  if (user === undefined) return <div className={cn("h-8 w-40", className)} aria-hidden />;

  if (!user) {
    return (
      <div className={cn("ml-2 flex items-center gap-1", className)}>
        <Button variant="ghost" size="sm" className="hidden rounded-lg lg:inline-flex" onClick={() => openAuth("sign-in")}>
          Sign in
        </Button>
        <Button size="sm" className="rounded-full px-4" onClick={() => openAuth("sign-up")}>
          Sign up free
        </Button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon-sm" className={cn("ml-2 rounded-full", className)} aria-label="Your account">
          <UserRound className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60 rounded-xl">
        <DropdownMenuLabel className="font-normal">
          <span className="block truncate text-sm font-medium">{user.email}</span>
          <span className="block text-xs text-muted-foreground">Private. Never shown on your posts.</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/me">
            <NotebookPen /> My posts
          </Link>
        </DropdownMenuItem>
        {user.isAdmin && (
          <DropdownMenuItem asChild>
            <Link href="/admin">
              <BarChart3 /> Manager dashboard
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => void signOutWithToast(signOut)}>
          <LogOut /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const sheetLink =
  "rounded-xl px-4 py-3 text-left text-base font-medium text-muted-foreground transition-colors hover:bg-muted aria-[current=page]:bg-accent aria-[current=page]:text-accent-foreground";

/** Account links for the mobile menu sheet. */
export function MobileAccountLinks({ isActive }: { isActive: (href: string) => boolean }) {
  const { user, openAuth, signOut } = useAuth();
  if (user === undefined) return null;

  if (!user) {
    return (
      <SheetClose asChild>
        <Button className="mt-4 h-11 rounded-xl" onClick={() => openAuth()}>
          Sign in or create account
        </Button>
      </SheetClose>
    );
  }

  return (
    <>
      <SheetClose asChild>
        <Link href="/me" aria-current={isActive("/me") ? "page" : undefined} className={sheetLink}>
          My posts
        </Link>
      </SheetClose>
      {user.isAdmin && (
        <SheetClose asChild>
          <Link href="/admin" aria-current={isActive("/admin") ? "page" : undefined} className={sheetLink}>
            Manager dashboard
          </Link>
        </SheetClose>
      )}
      <SheetClose asChild>
        <button type="button" className={sheetLink} onClick={() => void signOutWithToast(signOut)}>
          Sign out
        </button>
      </SheetClose>
    </>
  );
}

/** Phone header: a compact "Sign up" for signed-out visitors (desktop has AccountMenu). */
export function MobileSignUp() {
  const { user, openAuth } = useAuth();
  if (user !== null) return null;
  return (
    <Button size="sm" className="rounded-full px-3.5 sm:hidden" onClick={() => openAuth("sign-up")}>
      Sign up
    </Button>
  );
}

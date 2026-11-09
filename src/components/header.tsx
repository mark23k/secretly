import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { logOut } from "@/app/actions/auth";
import { Logo } from "./logo";

export async function Header() {
  const user = await getCurrentUser();
  return (
    <header className="sticky top-0 z-30 border-b border-line/70 bg-paper/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-3xl items-center justify-between gap-3 px-4">
        <Logo />
        <nav className="flex items-center gap-1.5 text-sm font-bold sm:gap-2">
          <Link
            href="/search"
            aria-label="Search"
            className="grid size-10 place-items-center rounded-full text-lg hover:bg-lavender-100"
          >
            🔍
          </Link>
          <Link href="/ask" className="btn btn-primary hidden px-4 py-2.5 sm:inline-flex">
            ✏️ Whisper a question
          </Link>
          {user ? (
            <>
              {user.isAdmin && (
                <Link href="/admin" className="rounded-full px-3 py-2 text-lavender-700 hover:bg-lavender-100">
                  Admin
                </Link>
              )}
              <form action={logOut}>
                <button className="rounded-full px-3 py-2 text-ink-soft hover:bg-lavender-100">Log out</button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="rounded-full px-3 py-2 text-ink-soft hover:bg-lavender-100">
                Log in
              </Link>
              <Link href="/signup" className="btn btn-soft px-4 py-2.5">
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

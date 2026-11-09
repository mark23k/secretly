import Link from "next/link";
import { CATEGORIES, VERDICTS } from "@/lib/constants";
import { getFeed } from "@/lib/queries";
import { MiniVerdictBar } from "./verdict-bar";

/** Vertical category list for laptops (hidden on phones). */
export function CategorySidebar({ active }: { active?: string }) {
  const item = (on: boolean) =>
    `flex items-center gap-2.5 rounded-2xl px-3 py-2 text-sm font-bold transition ${
      on ? "bg-lavender-500 text-white shadow" : "text-ink-soft hover:bg-white hover:text-ink"
    }`;
  return (
    <aside className="hidden lg:block">
      <nav className="sticky top-20 grid gap-0.5">
        <p className="mb-1 px-3 text-xs font-extrabold uppercase tracking-wider text-ink-soft">Categories</p>
        <Link href="/" className={item(!active)}>
          <span className="w-5 text-center">🌈</span> Everything
        </Link>
        {CATEGORIES.map((c) => (
          <Link key={c.slug} href={`/c/${c.slug}`} className={item(active === c.slug)}>
            <span className="w-5 text-center">{c.emoji}</span> {c.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

/** Right column on wide screens: hot debates and how it works. */
export async function RightRail() {
  const hot = (await getFeed({ tab: "debated" })).items.slice(0, 4);
  return (
    <aside className="hidden xl:block">
      <div className="sticky top-20 grid gap-4">
        <section className="note p-4">
          <h2 className="mb-3 text-sm font-black">⚖️ Hot debates</h2>
          <div className="grid gap-3">
            {hot.map((q) => (
              <Link key={q.id} href={`/q/${q.id}`} className="group grid gap-1.5">
                <span className="text-sm font-bold leading-snug group-hover:text-lavender-700">{q.title}</span>
                <MiniVerdictBar {...q} />
              </Link>
            ))}
          </div>
        </section>
        <section className="note p-4 text-sm">
          <h2 className="mb-2 font-black">🤫 How it works</h2>
          <ol className="grid gap-2 text-ink-soft">
            <li><b className="text-ink">1.</b> Whisper a question about an everyday unwritten rule.</li>
            <li>
              <b className="text-ink">2.</b> Everyone votes{" "}
              {VERDICTS.map((v) => v.emoji).join(" ")} and explains why.
            </li>
            <li><b className="text-ink">3.</b> Tap 🙋 Guilty if you&apos;ve done it too.</li>
          </ol>
          <p className="mt-3 text-xs text-ink-soft">No names, ever. You get a new secret name in every thread.</p>
          <Link href="/ask" className="btn btn-primary mt-3 w-full py-2.5 text-sm">✏️ Whisper a question</Link>
        </section>
      </div>
    </aside>
  );
}

/** Sidebar + main column (+ right rail on wide screens). */
export function BrowseLayout({ active, children }: { active?: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[200px_minmax(0,1fr)] xl:grid-cols-[200px_minmax(0,1fr)_280px]">
      <CategorySidebar active={active} />
      <div className="grid min-w-0 content-start gap-5">{children}</div>
      <RightRail />
    </div>
  );
}

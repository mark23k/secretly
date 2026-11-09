import Link from "next/link";
import { CATEGORIES } from "@/lib/constants";

export function Footer() {
  return (
    <>
      {/* Floating "ask" button on phones */}
      <Link
        href="/ask"
        className="btn btn-primary fixed bottom-5 left-1/2 z-30 -translate-x-1/2 px-6 py-3.5 text-base shadow-xl sm:hidden"
      >
        ✏️ Whisper a question
      </Link>
      <footer className="mx-auto max-w-3xl px-4 pb-10 pt-4 text-sm text-ink-soft">
        <div className="note flex flex-col gap-4 p-5">
          <p className="font-bold text-ink">🤫 SaySecretly: say what everyone&apos;s thinking.</p>
          <div className="flex flex-wrap gap-x-3 gap-y-1.5">
            {CATEGORIES.map((c) => (
              <Link key={c.slug} href={`/c/${c.slug}`} className="hover:text-lavender-700">
                {c.emoji} {c.name}
              </Link>
            ))}
          </div>
          <p className="text-xs">
            Everyone is anonymous here. Names like &quot;Quiet Penguin&quot; change in every thread. Be kind,
            and report anything mean.
          </p>
        </div>
      </footer>
    </>
  );
}

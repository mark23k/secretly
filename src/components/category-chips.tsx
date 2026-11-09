import Link from "next/link";
import { CATEGORIES } from "@/lib/constants";

export function CategoryChips({ active }: { active?: string }) {
  return (
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
      <Link
        href="/"
        className={`whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-bold ring-1 ring-line ${
          !active ? "bg-ink text-white" : "bg-white text-ink-soft hover:bg-lavender-50"
        }`}
      >
        All
      </Link>
      {CATEGORIES.map((c) => (
        <Link
          key={c.slug}
          href={`/c/${c.slug}`}
          className={`whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-bold ring-1 ring-line ${
            active === c.slug ? "bg-ink text-white" : "bg-white text-ink-soft hover:bg-lavender-50"
          }`}
        >
          {c.emoji} {c.name}
        </Link>
      ))}
    </div>
  );
}

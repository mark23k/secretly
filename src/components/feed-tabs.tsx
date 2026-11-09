import Link from "next/link";
import type { FeedTab } from "@/lib/queries";

const TABS: { key: FeedTab; label: string }[] = [
  { key: "trending", label: "🔥 Trending" },
  { key: "newest", label: "✨ Newest" },
  { key: "debated", label: "⚖️ Most Debated" },
];

export function FeedTabs({ active, basePath }: { active: FeedTab; basePath: string }) {
  return (
    <div className="flex gap-1.5 overflow-x-auto rounded-full bg-white/70 p-1.5 ring-1 ring-line [scrollbar-width:none]">
      {TABS.map((t) => (
        <Link
          key={t.key}
          href={t.key === "trending" ? basePath : `${basePath}?tab=${t.key}`}
          scroll={false}
          className={`flex-1 whitespace-nowrap rounded-full px-3 py-2 text-center text-sm font-extrabold transition ${
            active === t.key ? "bg-lavender-500 text-white shadow" : "text-ink-soft hover:bg-lavender-50"
          }`}
        >
          {t.label}
        </Link>
      ))}
    </div>
  );
}

export function parseTab(value: string | string[] | undefined): FeedTab {
  return value === "newest" || value === "debated" ? value : "trending";
}

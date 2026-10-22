import Link from "next/link";
import { cn } from "@/lib/utils";

/** Pill-style navigation between sibling views (rendered as links). */
export function SegmentedNav({
  items,
  current,
  label,
  className,
}: {
  items: { href: string; label: string; value: string }[];
  current: string;
  label: string;
  className?: string;
}) {
  return (
    <nav aria-label={label} className={cn("flex justify-center", className)}>
      <ul className="inline-flex rounded-full border bg-card p-1">
        {items.map((item) => (
          <li key={item.value}>
            <Link
              href={item.href}
              scroll={false}
              aria-current={item.value === current ? "page" : undefined}
              className="block rounded-full px-4 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground aria-[current=page]:bg-foreground aria-[current=page]:text-background"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

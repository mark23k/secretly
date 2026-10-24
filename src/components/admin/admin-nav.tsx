import Link from "next/link";
import { cn } from "@/lib/utils";

/** Switches between the manager pages. */
export function AdminNav({
  current,
  queueCount,
}: {
  current: "dashboard" | "activity" | "moderation";
  queueCount?: number;
}) {
  const items = [
    { value: "dashboard", href: "/admin", label: "Dashboard" },
    { value: "activity", href: "/admin/activity", label: "Live feed" },
    { value: "moderation", href: "/admin/moderation", label: "Moderation" },
  ] as const;
  return (
    <nav aria-label="Manager pages" className="inline-flex rounded-full border bg-card p-1 text-sm">
      {items.map((item) => (
        <Link
          key={item.value}
          href={item.href}
          aria-current={item.value === current ? "page" : undefined}
          className={cn(
            "flex items-center gap-1.5 rounded-full px-4 py-1.5 font-medium text-muted-foreground transition-colors hover:text-foreground",
            "aria-[current=page]:bg-foreground aria-[current=page]:text-background"
          )}
        >
          {item.label}
          {item.value === "moderation" && queueCount ? (
            <span className="rounded-full bg-primary px-1.5 text-[0.7rem] text-primary-foreground">{queueCount}</span>
          ) : null}
        </Link>
      ))}
    </nav>
  );
}

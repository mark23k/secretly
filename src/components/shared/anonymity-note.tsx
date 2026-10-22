import { ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

/** Shown next to every compose box before posting. */
export function AnonymityNote({ className }: { className?: string }) {
  return (
    <p className={cn("flex items-start gap-2 text-xs text-muted-foreground", className)}>
      <ShieldAlert className="mt-px size-3.5 shrink-0" aria-hidden />
      <span>
        Don&apos;t include names or details that could identify you or anyone else. Links, emails and
        @handles are blocked.
      </span>
    </p>
  );
}

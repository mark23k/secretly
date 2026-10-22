import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Text wordmark: "Secretly" set in Fraunces italic, with the final stop
 * in the accent colour, like a whispered full stop.
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "font-heading text-[1.4rem] leading-none font-medium tracking-[-0.03em] italic select-none",
        className
      )}
    >
      Secretly<span className="text-primary not-italic">.</span>
    </span>
  );
}

export function LogoLink({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Secretly home"
      className={cn("rounded-md transition-opacity hover:opacity-80", className)}
    >
      <Wordmark />
    </Link>
  );
}

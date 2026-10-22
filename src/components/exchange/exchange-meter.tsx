import { cn } from "@/lib/utils";

/** "2 of 3 left today" with one dot per exchange. */
export function ExchangeMeter({ used, limit }: { used: number; limit: number }) {
  const left = Math.max(0, limit - used);
  return (
    <div className="flex items-center justify-center gap-3 text-sm">
      <span className="flex gap-1.5" aria-hidden>
        {Array.from({ length: limit }, (_, i) => (
          <span
            key={i}
            className={cn(
              "size-2.5 rounded-full border border-primary transition-colors",
              i < left ? "bg-primary" : "bg-transparent opacity-50"
            )}
          />
        ))}
      </span>
      <span className="font-medium">
        {left} of {limit} left today
      </span>
    </div>
  );
}

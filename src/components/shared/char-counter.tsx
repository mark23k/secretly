import { cn } from "@/lib/utils";

export function CharCounter({ value, max, id }: { value: string; max: number; id?: string }) {
  const left = max - value.length;
  return (
    <span
      id={id}
      aria-live={left <= 20 ? "polite" : "off"}
      className={cn(
        "text-xs tabular-nums text-muted-foreground",
        left <= 20 && "text-foreground",
        left < 0 && "font-medium text-destructive"
      )}
    >
      {left <= 20 ? `${left} characters left` : `${value.length}/${max}`}
    </span>
  );
}

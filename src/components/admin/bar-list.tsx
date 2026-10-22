/** Horizontal bars for a breakdown ("which kinds of interaction"). */
export function BarList({ items, emptyText }: { items: { label: string; value: number }[]; emptyText: string }) {
  const max = Math.max(0, ...items.map((i) => i.value));
  if (max === 0) return <p className="py-6 text-center text-sm text-muted-foreground">{emptyText}</p>;
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.label} className="space-y-1">
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span>{item.label}</span>
            <span className="font-medium tabular-nums">{item.value.toLocaleString("en")}</span>
          </div>
          <div className="h-2 rounded-full bg-muted" aria-hidden>
            <div
              className="h-full rounded-full bg-primary/80"
              style={{ width: item.value > 0 ? `max(4px, ${(item.value / max) * 100}%)` : 0 }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

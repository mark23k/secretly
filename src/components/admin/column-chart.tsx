import { formatTick, niceTicks } from "@/lib/format";
import { cn } from "@/lib/utils";

export type Column = {
  key: string;
  /** Axis label; omit to leave this column unlabelled. */
  axisLabel?: string;
  /** Full label for the tooltip and table, e.g. "Thu, Oct 22". */
  label: string;
  value: number;
};

/**
 * Single-series column chart in the accent colour. Hover or focus a column
 * for its value; the same numbers are in the table below the chart.
 */
export function ColumnChart({
  data,
  valueName,
  categoryName,
  height = 180,
  emptyText = "No data yet for this period.",
}: {
  data: Column[];
  /** e.g. "visitors". */
  valueName: string;
  /** Table header for the categories, e.g. "Day". */
  categoryName: string;
  height?: number;
  emptyText?: string;
}) {
  const max = Math.max(0, ...data.map((d) => d.value));
  const ticks = niceTicks(max);
  const top = ticks[ticks.length - 1];
  const peak = max > 0 ? data.findIndex((d) => d.value === max) : -1;

  return (
    <figure className="space-y-3">
      <div className="flex gap-2">
        {/* y axis */}
        <div className="relative w-8 shrink-0 text-right text-[0.7rem] text-muted-foreground tabular-nums" style={{ height }} aria-hidden>
          {ticks.map((t) => (
            <span key={t} className="absolute right-0 -translate-y-1/2" style={{ bottom: `${(t / top) * 100}%` }}>
              {formatTick(t)}
            </span>
          ))}
        </div>

        <div className="min-w-0 flex-1">
          <div className="relative" style={{ height }}>
            {ticks.map((t) => (
              <div
                key={t}
                aria-hidden
                className={cn("absolute inset-x-0 h-px", t === 0 ? "bg-border" : "bg-border/50")}
                style={{ bottom: `${(t / top) * 100}%` }}
              />
            ))}
            {max === 0 && (
              <p className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
                {emptyText}
              </p>
            )}
            <ul className="absolute inset-0 flex items-end" aria-label={`${valueName} by ${categoryName.toLowerCase()}`}>
              {data.map((d, i) => {
                const align = i < data.length / 4 ? "left-0" : i >= (data.length * 3) / 4 ? "right-0" : "left-1/2 -translate-x-1/2";
                return (
                  <li
                    key={d.key}
                    tabIndex={0}
                    aria-label={`${d.label}: ${d.value.toLocaleString("en")} ${valueName}`}
                    className="group relative flex h-full flex-1 items-end justify-center px-px outline-none"
                  >
                    <span
                      className={cn(
                        "block w-full max-w-6 rounded-t-[4px] bg-primary/80 transition-colors group-hover:bg-primary group-focus-visible:bg-primary",
                        i === peak && "bg-primary"
                      )}
                      style={{ height: d.value > 0 ? `max(2px, ${(d.value / top) * 100}%)` : 0 }}
                    />
                    <span
                      role="presentation"
                      className={cn(
                        "pointer-events-none absolute bottom-full z-10 mb-1 rounded-lg border bg-popover px-2.5 py-1.5 text-left whitespace-nowrap opacity-0 shadow-md transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100",
                        align
                      )}
                    >
                      <span className="block text-sm font-semibold text-foreground">
                        {d.value.toLocaleString("en")} {valueName}
                      </span>
                      <span className="block text-xs text-muted-foreground">{d.label}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
          {/* x axis */}
          <div className="mt-1.5 flex text-[0.7rem] text-muted-foreground" aria-hidden>
            {data.map((d) => (
              <span key={d.key} className="relative flex-1">
                {d.axisLabel ? (
                  <span className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap">{d.axisLabel}</span>
                ) : null}
              </span>
            ))}
          </div>
        </div>
      </div>

      <details className="group/table pt-3 text-sm">
        <summary className="w-fit cursor-pointer rounded text-xs text-muted-foreground hover:text-foreground">
          Show as table
        </summary>
        <div className="mt-2 max-h-64 overflow-y-auto rounded-xl border">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 bg-muted text-xs text-muted-foreground">
              <tr>
                <th scope="col" className="px-3 py-2 font-medium">{categoryName}</th>
                <th scope="col" className="px-3 py-2 text-right font-medium capitalize">{valueName}</th>
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {data.map((d) => (
                <tr key={d.key} className="border-t">
                  <td className="px-3 py-1.5">{d.label}</td>
                  <td className="px-3 py-1.5 text-right">{d.value.toLocaleString("en")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  );
}

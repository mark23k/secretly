import { VERDICTS } from "@/lib/constants";

type Counts = { fineCount: number; dependsCount: number; dontCount: number };

function shares(c: Counts) {
  const values = [c.fineCount, c.dependsCount, c.dontCount];
  const total = values.reduce((a, b) => a + b, 0);
  return { total, pct: values.map((v) => (total ? Math.round((v / total) * 100) : 0)) };
}

/** Thin bar for question cards. */
export function MiniVerdictBar(props: Counts) {
  const { total, pct } = shares(props);
  if (!total) {
    return <div className="h-2 w-full rounded-full bg-line" aria-label="No verdicts yet" />;
  }
  return (
    <div
      className="flex h-2 w-full overflow-hidden rounded-full bg-line"
      aria-label={VERDICTS.map((v, i) => `${v.label} ${pct[i]}%`).join(", ")}
    >
      {VERDICTS.map((v, i) => (
        <div key={v.key} className={v.color} style={{ width: `${pct[i]}%` }} />
      ))}
    </div>
  );
}

/** Big verdict meter for the question page. */
export function VerdictMeter(props: Counts) {
  const { total, pct } = shares(props);
  return (
    <div>
      <div className="flex h-5 w-full overflow-hidden rounded-full bg-line">
        {total > 0 &&
          VERDICTS.map((v, i) =>
            pct[i] > 0 ? (
              <div key={v.key} className={`${v.color} transition-all duration-500`} style={{ width: `${pct[i]}%` }} />
            ) : null,
          )}
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center text-sm">
        {VERDICTS.map((v, i) => (
          <div key={v.key} className={`rounded-2xl ${v.soft} px-2 py-2`}>
            <div className={`text-lg font-black ${v.text}`}>{total ? `${pct[i]}%` : "–"}</div>
            <div className="text-xs font-bold text-ink-soft">
              {v.emoji} {v.label}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-2 text-center text-xs text-ink-soft">
        {total === 0 ? "No verdicts yet. Be the first!" : `${total} ${total === 1 ? "verdict" : "verdicts"}`}
      </p>
    </div>
  );
}

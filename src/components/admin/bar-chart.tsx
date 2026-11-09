import type { DayPoint } from "@/lib/stats";

const W = 360;
const H = 150;
const PAD_L = 26;
const PAD_B = 22;
const PAD_T = 8;

function niceMax(max: number) {
  if (max <= 4) return 4;
  const step = Math.pow(10, Math.floor(Math.log10(max)));
  return Math.ceil(max / step) * step;
}

function label(day: string) {
  const [, m, d] = day.split("-");
  return `${Number(m)}/${Number(d)}`;
}

/** Single-series daily bar chart. Hover a bar for its exact value. */
export function BarChart({ title, total, data }: { title: string; total: number; data: DayPoint[] }) {
  const max = niceMax(Math.max(0, ...data.map((d) => d.value)));
  const plotW = W - PAD_L;
  const plotH = H - PAD_B - PAD_T;
  const slot = plotW / Math.max(1, data.length);
  const barW = Math.max(2, Math.min(28, slot - 2));
  const every = Math.ceil(data.length / 6);

  return (
    <figure className="note p-4">
      <figcaption className="mb-2 flex items-baseline justify-between gap-2">
        <span className="text-sm font-extrabold text-ink-soft">{title}</span>
        <span className="text-2xl font-black text-ink">{total.toLocaleString()}</span>
      </figcaption>
      <svg viewBox={`0 ${-PAD_T} ${W} ${H}`} className="h-auto w-full" role="img" aria-label={`${title} per day`}>
        {[0, 0.5, 1].map((f) => {
          const y = plotH - f * plotH + 0.5;
          return (
            <g key={f}>
              <line x1={PAD_L} x2={W} y1={y} y2={y} stroke="#efe6da" strokeWidth={1} />
              <text x={PAD_L - 6} y={y + 4} textAnchor="end" fontSize={11} fill="#8a819c">
                {Math.round(max * f)}
              </text>
            </g>
          );
        })}
        {data.map((d, i) => {
          const h = (d.value / max) * plotH;
          const x = PAD_L + i * slot + (slot - barW) / 2;
          const r = Math.min(4, barW / 2, h);
          return (
            <g key={d.day} className="group">
              <title>{`${d.day}: ${d.value.toLocaleString()}`}</title>
              <rect x={PAD_L + i * slot} y={0} width={slot} height={plotH} fill="transparent" />
              {h > 0 && (
                <path
                  className="fill-lavender-500 transition-opacity group-hover:opacity-75"
                  d={`M${x},${plotH} V${plotH - h + r} Q${x},${plotH - h} ${x + r},${plotH - h} H${x + barW - r} Q${x + barW},${plotH - h} ${x + barW},${plotH - h + r} V${plotH} Z`}
                />
              )}
              {i % every === 0 && (
                <text x={PAD_L + i * slot + slot / 2} y={plotH + 15} textAnchor="middle" fontSize={11} fill="#8a819c">
                  {label(d.day)}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </figure>
  );
}

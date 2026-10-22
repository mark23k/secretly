/** "2m 14s", "45s", "1h 05m". */
export function formatDuration(totalSeconds: number): string {
  const s = Math.max(0, Math.round(totalSeconds));
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ${String(s % 60).padStart(2, "0")}s`;
  return `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, "0")}m`;
}

/** Axis ticks: 0, 1K, 2.5K. */
export function formatTick(n: number): string {
  return new Intl.NumberFormat("en", { notation: n >= 1000 ? "compact" : "standard" }).format(n);
}

/** 0 → "12 AM", 13 → "1 PM". */
export function hourLabel(hour: number, short = false): string {
  const h = hour % 12 === 0 ? 12 : hour % 12;
  const suffix = hour < 12 ? "AM" : "PM";
  return short ? `${h}${suffix[0].toLowerCase()}` : `${h} ${suffix}`;
}

export function hourRangeLabel(hour: number): string {
  return `${hourLabel(hour)} – ${hourLabel((hour + 1) % 24)}`;
}

/** "2026-10-22" → "Oct 22" (or "Thu, Oct 22" when long). */
export function dayLabel(isoDay: string, long = false): string {
  const [y, m, d] = isoDay.split("-").map(Number);
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    weekday: long ? "short" : undefined,
    timeZone: "UTC",
  }).format(new Date(Date.UTC(y, m - 1, d)));
}

/** 0 → 4 nicely rounded gridline values covering `max`. */
export function niceTicks(max: number, count = 4): number[] {
  if (max <= 0) return [0, 1, 2, 3, 4].slice(0, count + 1);
  const raw = max / count;
  const mag = 10 ** Math.floor(Math.log10(raw));
  // Counts are whole numbers, so steps are too.
  const step = Math.max(1, [1, 2, 5, 10].map((f) => f * mag).find((s) => s >= raw) ?? 10 * mag);
  return Array.from({ length: count + 1 }, (_, i) => i * step);
}

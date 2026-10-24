import type { Column } from "@/components/admin/column-chart";
import type { AdminStats } from "@/lib/data/admin.server";
import { hourLabel, hourRangeLabel } from "@/lib/format";

/** Shared by the dashboard and the day pages. */
export const KIND_LABEL: Record<string, string> = {
  thought: "Thoughts shared",
  thought_vote: "Votes on thoughts",
  thought_reaction: "Reactions on thoughts",
  thought_comment: "Comments on thoughts",
  question: "Questions asked",
  answer: "Answers",
  answer_vote: "Answer votes",
  secret: "Secrets given",
  secret_reply: "Replies to secrets",
};

export function hourlyColumns(stats: AdminStats, pick: (h: AdminStats["hourly"][number]) => number): Column[] {
  return stats.hourly.map((h) => ({
    key: String(h.hour),
    label: hourRangeLabel(h.hour),
    axisLabel: h.hour % 6 === 0 ? hourLabel(h.hour, true) : undefined,
    value: pick(h),
  }));
}

export function busiestHour(stats: AdminStats, pick: (h: AdminStats["hourly"][number]) => number): string {
  const best = stats.hourly.reduce((a, b) => (pick(b) > pick(a) ? b : a), stats.hourly[0]);
  return best && pick(best) > 0 ? hourRangeLabel(best.hour) : "Not enough data";
}

export function ratio(n: number | null | undefined): string {
  return n == null ? "0" : Number(n).toLocaleString("en", { maximumFractionDigits: 1 });
}

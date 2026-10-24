/** Manager dashboard tabs and date-range presets (shared by server and client). */
export const dashboardTabs = [
  { value: "overview", label: "Overview" },
  { value: "daily", label: "Day by day" },
  { value: "visitors", label: "Visitors" },
  { value: "members", label: "Members" },
  { value: "content", label: "Posts & activity" },
] as const;

export type DashboardTab = (typeof dashboardTabs)[number]["value"];

/** Preset ranges, in days. A custom from/to range can also be picked. */
export const rangeOptions = [7, 30, 90, 365] as const;

/** "2026-10-24", as used in URLs for custom ranges and day pages. */
export const ISO_DAY = /^\d{4}-\d{2}-\d{2}$/;

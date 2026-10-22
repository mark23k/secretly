/** Manager dashboard tabs and date-range presets (shared by server and client). */
export const dashboardTabs = [
  { value: "overview", label: "Overview" },
  { value: "visitors", label: "Visitors" },
  { value: "members", label: "Members" },
  { value: "content", label: "Posts & activity" },
] as const;

export type DashboardTab = (typeof dashboardTabs)[number]["value"];

export const rangeOptions = [7, 30, 90] as const;

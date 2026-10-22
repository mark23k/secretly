export const reportReasons = [
  { value: "harassment", label: "Harassment or bullying" },
  { value: "personal_info", label: "Shares someone's identity or contact info" },
  { value: "hate", label: "Hate or discrimination" },
  { value: "sexual", label: "Sexual or explicit content" },
  { value: "self_harm", label: "Someone may be at risk" },
  { value: "spam", label: "Spam or advertising" },
  { value: "other", label: "Something else" },
] as const;

export const reportReasonValues = reportReasons.map((r) => r.value) as [
  (typeof reportReasons)[number]["value"],
  ...(typeof reportReasons)[number]["value"][],
];

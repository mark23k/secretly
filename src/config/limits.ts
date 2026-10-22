/** Text length limits, shared by client counters and server validation. */
export const textLimits = {
  thought: { min: 10, max: 300 },
  thoughtComment: { min: 2, max: 300 },
  questionTitle: { min: 10, max: 200 },
  questionBody: { min: 0, max: 1000 },
  answer: { min: 5, max: 1000 },
  secret: { min: 10, max: 500 },
  secretReply: { min: 2, max: 200 },
  reportDetails: { min: 0, max: 300 },
} as const;

/** Secrets an account can exchange per local day. */
export const DAILY_SECRET_EXCHANGES = 3;

/** Open reports that auto-hide a piece of content pending review. */
export const REPORT_HIDE_THRESHOLD = 3;

/**
 * Rate limits for write actions: `limit` hits per `windowSeconds`.
 * Applied per account AND per hashed IP (IP limit = limit × ipMultiplier).
 */
export const rateLimits = {
  createThought: { limit: 5, windowSeconds: 3600 },
  voteThought: { limit: 120, windowSeconds: 3600 },
  reactThought: { limit: 120, windowSeconds: 3600 },
  createThoughtComment: { limit: 20, windowSeconds: 3600 },
  createQuestion: { limit: 5, windowSeconds: 3600 },
  createAnswer: { limit: 20, windowSeconds: 3600 },
  voteAnswer: { limit: 120, windowSeconds: 3600 },
  markHelpful: { limit: 20, windowSeconds: 3600 },
  searchQuestions: { limit: 120, windowSeconds: 60 },
  exchangeSecret: { limit: 10, windowSeconds: 3600 },
  replySecret: { limit: 10, windowSeconds: 3600 },
  report: { limit: 20, windowSeconds: 3600 },
  trackVisit: { limit: 300, windowSeconds: 3600 },
} as const satisfies Record<string, { limit: number; windowSeconds: number }>;

export type RateLimitName = keyof typeof rateLimits;

/** Several visitors can share one IP (homes, offices, mobile carriers). */
export const IP_LIMIT_MULTIPLIER = 5;

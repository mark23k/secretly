export type ErrorCode =
  | "auth_required"
  | "banned"
  | "rate_limited"
  | "invalid"
  | "rejected"
  | "not_found"
  | "forbidden"
  | "limit_reached"
  | "unavailable"
  | "server";

/** `held` tells the UI the content was saved but is waiting for review. */
export type ActionResult<T = null> =
  | { ok: true; data: T; held?: "review" | "crisis" }
  | { ok: false; code: ErrorCode; message: string; fieldErrors?: Record<string, string> };

/**
 * A missing or invalid environment variable. Its name (never its value) is
 * shown to the user, so a half-configured deploy says what to fix.
 */
export class ConfigError extends Error {
  constructor(public variable: string, detail = "is missing or invalid") {
    super(`${variable} ${detail}`);
  }
}

/** Throw inside an action handler to return a typed, user-facing error. */
export class ActionError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
    public fieldErrors?: Record<string, string>
  ) {
    super(message);
  }
}

export function ok<T>(data: T, held?: "review" | "crisis"): ActionResult<T> {
  return held ? { ok: true, data, held } : { ok: true, data };
}

export type PiiKind = "email" | "phone" | "url" | "handle" | "contact";

export type PiiFinding = { kind: PiiKind; match: string };

const EMAIL = /[a-z0-9._%+-]+\s*(?:@|\(at\)|\[at\])\s*[a-z0-9.-]+\s*(?:\.|\(dot\)|\[dot\])\s*[a-z]{2,}/gi;
const URL =
  /\b(?:https?:\/\/|www\.)[^\s]+|\b[a-z0-9-]{2,}\s*(?:\.|\sdot\s)\s*(?:com|net|org|io|co|me|app|ly|gg|tv|info|biz|xyz|link|site|online|dev|uk|ca|de|fr|in|au)\b(?:\/[^\s]*)?/gi;
const HANDLE = /(?:^|[^\w@.])@[a-z0-9_][a-z0-9_.]{1,29}/gi;
const PHONE_CANDIDATE = /\+?\(?\d[\d\s().-]{6,}\d/g;
/** Social platform followed by a handle-ish token, e.g. "snap: maria_22", "ig @x". */
const PLATFORM_HANDLE =
  /\b(?:snap(?:chat)?|insta(?:gram)?|ig|tiktok|telegram|whatsapp|discord|kik|signal|twitter|facebook|fb|wechat|venmo|cashapp)\s*(?::|-|=|@|\bis\b|\bhandle\b|\busername\b|\bid\b)\s*@?[a-z0-9_.]{3,}/gi;
/** Asking someone to reach out off-platform. Only enforced in strict mode. */
const CONTACT_REQUEST =
  /\b(?:dm|text|email|e-mail|add|follow|message|msg|contact|reach)\s+me\b|\bhmu\b|\bhit me up\b|\bmy (?:number|phone|socials?|insta|snap|email)\b/gi;

function looksLikePhone(candidate: string): boolean {
  const digits = candidate.replace(/\D/g, "");
  if (digits.length < 7 || digits.length > 15) return false;
  // Lists of years ("2019 2020 2021") or plain counts aren't phone numbers.
  const groups = candidate.trim().split(/[\s,]+/);
  if (groups.every((g) => /^(19|20)\d{2}$/.test(g))) return false;
  // Require phone-like grouping: separators, a leading +, or a long unbroken run.
  return /[\s().+-]/.test(candidate) || digits.length >= 10;
}

/**
 * Finds personal / contact information. In strict mode (direct replies) any
 * 7+ digit number and requests to make contact are also flagged.
 */
export function findPii(text: string, { strict = false } = {}): PiiFinding[] {
  const findings: PiiFinding[] = [];
  const push = (kind: PiiKind, re: RegExp) => {
    for (const m of text.matchAll(re)) findings.push({ kind, match: m[0].trim() });
  };

  push("email", EMAIL);
  const withoutEmails = text.replace(EMAIL, " ");
  for (const m of withoutEmails.matchAll(URL)) findings.push({ kind: "url", match: m[0].trim() });
  for (const m of withoutEmails.matchAll(HANDLE)) findings.push({ kind: "handle", match: m[0].trim() });
  for (const m of text.matchAll(PHONE_CANDIDATE)) {
    if (looksLikePhone(m[0]) || (strict && m[0].replace(/\D/g, "").length >= 7)) {
      findings.push({ kind: "phone", match: m[0].trim() });
    }
  }
  push("contact", PLATFORM_HANDLE);
  if (strict) push("contact", CONTACT_REQUEST);
  return findings;
}

const PII_LABEL: Record<PiiKind, string> = {
  email: "an email address",
  phone: "a phone number",
  url: "a link",
  handle: "an @handle",
  contact: "contact details",
};

export function describePii(findings: PiiFinding[]): string {
  const kinds = [...new Set(findings.map((f) => f.kind))].map((k) => PII_LABEL[k]);
  const list =
    kinds.length > 1 ? `${kinds.slice(0, -1).join(", ")} and ${kinds.at(-1)}` : kinds[0];
  return `This looks like it includes ${list}. Please remove it. Secretly only works if nobody can be identified.`;
}

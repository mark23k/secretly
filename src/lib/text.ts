import { z } from "zod";

const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const INVISIBLE_CHARS = /[​-‏‪-‮⁠-⁤﻿]/g;

/**
 * Normalizes user text before validation and storage: Unicode NFC, strips
 * control / invisible characters, collapses runs of spaces and blank lines.
 * Content is stored as plain text and rendered escaped by React.
 */
export function cleanText(input: string): string {
  return input
    .normalize("NFC")
    .replace(CONTROL_CHARS, "")
    .replace(INVISIBLE_CHARS, "")
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t]+/g, " ")
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Zod field: cleans text, then enforces length limits with friendly messages. */
export function textField(limits: { min: number; max: number }, label = "This") {
  return z
    .string()
    .transform(cleanText)
    .pipe(
      z
        .string()
        .min(limits.min, limits.min <= 1 ? `${label} can't be empty.` : `${label} needs at least ${limits.min} characters.`)
        .max(limits.max, `${label} can be at most ${limits.max} characters.`)
    );
}

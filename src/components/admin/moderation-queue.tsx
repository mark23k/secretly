"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Ban, Check, ShieldAlert, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { banAuthor, moderateContent, unbanAccount } from "@/app/actions/admin";
import { reportReasons } from "@/config/report";
import type { ModerationItem, ModerationQueue as Queue } from "@/lib/data/admin.server";
import type { ActionResult } from "@/lib/server/errors";
import { timeAgo } from "@/lib/time";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";

const KIND_LABEL: Record<ModerationItem["kind"], string> = {
  thought: "Thought",
  thought_comment: "Comment",
  question: "Question",
  answer: "Answer",
  secret: "Secret",
  secret_reply: "Reply to a secret",
};

const STATUS: Record<ModerationItem["status"], { label: string; className: string }> = {
  hidden: { label: "Hidden after reports", className: "bg-destructive/15 text-destructive" },
  pending: { label: "Held by the filters", className: "bg-amber-500/15 text-amber-700 dark:text-amber-400" },
  published: { label: "Live, but reported", className: "bg-muted text-foreground/80" },
};

const REPORT_LABEL = Object.fromEntries(reportReasons.map((r) => [r.value, r.label])) as Record<string, string>;

/** "words:xyz" → "Filtered word: xyz", etc. */
function autoReasonLabel(reason: string) {
  const [source, detail] = reason.split(":");
  switch (source) {
    case "words":
      return `Filtered word: “${detail}”`;
    case "pii":
      return `Personal info (${detail})`;
    case "self_harm":
      return "Possible self-harm (crisis resources were shown)";
    case "openai":
      return `AI check: ${detail?.replace(/[/_-]/g, " ")}`;
    case "external_unavailable":
      return "AI check was unavailable";
    default:
      return reason;
  }
}

function viewHref(item: ModerationItem) {
  if (item.kind === "thought") return `/only-one/${item.id}`;
  if (item.kind === "question") return `/ask/${item.id}`;
  return null;
}

export function ModerationQueue({ initial }: { initial: Queue }) {
  const [items, setItems] = useState(initial.items);
  const [banned, setBanned] = useState(initial.banned);
  const [busy, setBusy] = useState<string | null>(null);
  const [confirmBan, setConfirmBan] = useState<string | null>(null);

  async function run(key: string, action: () => Promise<ActionResult>, onDone: () => void, success: string) {
    setBusy(key);
    const res = await action();
    setBusy(null);
    if (res.ok) {
      onDone();
      toast.success(success);
    } else {
      toast.error(res.message);
    }
  }

  const removeItem = (id: string) => setItems((cur) => cur.filter((i) => i.id !== id));

  return (
    <div className="space-y-12">
      <section aria-labelledby="queue-heading" className="space-y-4">
        <h2 id="queue-heading" className="text-2xl font-normal">
          Needs a look <span className="text-muted-foreground">{items.length || ""}</span>
        </h2>
        {items.length === 0 ? (
          <EmptyState title="All clear" description="Nothing is waiting for review. Held and reported posts will show up here." />
        ) : (
          <ul className="space-y-4">
            <AnimatePresence initial={false}>
              {items.map((item) => {
                const key = `${item.kind}:${item.id}`;
                const href = viewHref(item);
                return (
                  <motion.li
                    key={key}
                    layout
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    className="overflow-hidden rounded-3xl border bg-card p-5 sm:p-6"
                  >
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="rounded-full bg-muted px-2.5 py-1 font-medium">{KIND_LABEL[item.kind]}</span>
                      <span className={cn("rounded-full px-2.5 py-1 font-medium", STATUS[item.status].className)}>
                        {STATUS[item.status].label}
                      </span>
                      <span className="text-muted-foreground" suppressHydrationWarning>
                        {timeAgo(item.createdAt)} · by account {item.author}
                        {item.authorBanned ? " (banned)" : ""}
                      </span>
                    </div>

                    {item.context ? (
                      <p className="mt-3 line-clamp-2 text-xs text-muted-foreground">{item.context}</p>
                    ) : null}
                    <p className="mt-2 text-[0.98rem] text-pretty whitespace-pre-line">{item.text}</p>

                    {item.autoReasons.length > 0 || item.openReports > 0 ? (
                      <div className="mt-4 space-y-1.5 rounded-2xl bg-muted/60 px-4 py-3 text-sm">
                        {item.autoReasons.map((r) => (
                          <p key={r} className="flex items-start gap-2">
                            <ShieldAlert className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
                            {autoReasonLabel(r)}
                          </p>
                        ))}
                        {item.openReports > 0 ? (
                          <p className="flex items-start gap-2">
                            <ShieldAlert className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
                            {item.openReports} {item.openReports === 1 ? "report" : "reports"}:{" "}
                            {item.reportReasons.map((r) => REPORT_LABEL[r] ?? r).join(", ")}
                          </p>
                        ) : null}
                        {item.reportDetails.map((d, i) => (
                          <p key={i} className="pl-6 text-muted-foreground italic">
                            “{d}”
                          </p>
                        ))}
                      </div>
                    ) : null}

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      {confirmBan === key ? (
                        <>
                          <span className="text-sm">Ban {item.author} and remove everything they&apos;ve posted?</span>
                          <Button
                            size="sm"
                            variant="destructive"
                            disabled={busy === key}
                            onClick={() =>
                              run(
                                key,
                                () => banAuthor({ kind: item.kind, id: item.id, reason: item.reportReasons[0] ?? "Guidelines violation" }),
                                () => {
                                  setItems((cur) => cur.filter((i) => i.author !== item.author));
                                  setBanned((cur) => [
                                    { id: "", author: item.author, bannedAt: new Date().toISOString(), reason: null },
                                    ...cur,
                                  ]);
                                  setConfirmBan(null);
                                },
                                `Banned ${item.author}.`
                              )
                            }
                          >
                            Yes, ban
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => setConfirmBan(null)}>
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            disabled={busy === key}
                            onClick={() =>
                              run(
                                key,
                                () => moderateContent({ kind: item.kind, id: item.id, action: "approve" }),
                                () => removeItem(item.id),
                                item.status === "published" ? "Kept, reports cleared." : "Approved and published."
                              )
                            }
                          >
                            <Check data-icon="inline-start" /> {item.status === "published" ? "Keep it" : "Approve"}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={busy === key}
                            onClick={() =>
                              run(
                                key,
                                () => moderateContent({ kind: item.kind, id: item.id, action: "remove" }),
                                () => removeItem(item.id),
                                "Removed."
                              )
                            }
                          >
                            <Trash2 data-icon="inline-start" /> Remove
                          </Button>
                          {!item.authorBanned ? (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-destructive hover:text-destructive"
                              onClick={() => setConfirmBan(key)}
                            >
                              <Ban data-icon="inline-start" /> Ban author
                            </Button>
                          ) : null}
                          {href ? (
                            <Button asChild size="sm" variant="link" className="ml-auto">
                              <a href={href} target="_blank" rel="noreferrer">
                                View on site
                              </a>
                            </Button>
                          ) : null}
                        </>
                      )}
                    </div>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>
        )}
      </section>

      <section aria-labelledby="banned-heading" className="space-y-4">
        <h2 id="banned-heading" className="text-2xl font-normal">
          Banned accounts <span className="text-muted-foreground">{banned.length || ""}</span>
        </h2>
        {banned.length === 0 ? (
          <p className="rounded-2xl bg-muted px-4 py-5 text-sm text-muted-foreground">Nobody is banned.</p>
        ) : (
          <ul className="divide-y rounded-2xl border bg-card">
            {banned.map((b) => (
              <li key={b.author} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm">
                <span>
                  <span className="font-medium">Account {b.author}</span>
                  <span className="text-muted-foreground" suppressHydrationWarning>
                    {" "}
                    · banned {timeAgo(b.bannedAt)}
                    {b.reason ? ` · ${REPORT_LABEL[b.reason] ?? b.reason}` : ""}
                  </span>
                </span>
                {b.id ? (
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={busy === b.id}
                    onClick={() =>
                      run(
                        b.id,
                        () => unbanAccount({ visitorId: b.id }),
                        () => setBanned((cur) => cur.filter((x) => x.id !== b.id)),
                        `Unbanned ${b.author}. Their removed posts stay removed.`
                      )
                    }
                  >
                    Unban
                  </Button>
                ) : (
                  <span className="text-xs text-muted-foreground">Refresh to manage</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

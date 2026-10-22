import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowLeft, Eye, Mail } from "lucide-react";
import { getMySecrets, getReceivedSecrets } from "@/lib/data/secrets.server";
import { getSessionUser } from "@/lib/server/visitor";
import { timeAgo } from "@/lib/time";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { ReportButton } from "@/components/shared/report-button";
import { SignInPrompt } from "@/components/auth/sign-in-prompt";
import { SecretReplyForm } from "@/components/exchange/secret-reply-form";

export const metadata: Metadata = {
  title: "My secrets",
  robots: { index: false },
};

const STATUS_NOTE = { pending: "Waiting for a quick review", hidden: "Hidden after reports", published: null, removed: null };

export default function InboxPage() {
  return (
    <div className="pb-8">
      <PageHeader
        eyebrow="Only visible to you"
        title="My secrets"
        description="The secrets you've given, how many strangers have read them, and the messages they sent back."
      >
        <Link
          href="/exchange"
          className="mt-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden /> Back to the exchange
        </Link>
      </PageHeader>
      <div className="mx-auto max-w-2xl space-y-12 px-5">
        <Suspense fallback={<InboxSkeleton />}>
          <Inbox />
        </Suspense>
      </div>
    </div>
  );
}

async function Inbox() {
  const user = await getSessionUser();
  if (!user) {
    return (
      <SignInPrompt
        title="Sign in to see your secrets"
        description="Your secrets and the replies to them are tied to your private account."
      />
    );
  }
  const [mine, received] = await Promise.all([getMySecrets(user.id), getReceivedSecrets(user.id)]);

  return (
    <>
      <section aria-labelledby="given-heading" className="space-y-4">
        <h2 id="given-heading" className="text-2xl font-normal">
          Secrets you gave
        </h2>
        {mine.length === 0 ? (
          <EmptyState title="No secrets yet" description="Give one to get a stranger's secret in return.">
            <Button asChild>
              <Link href="/exchange">Trade a secret</Link>
            </Button>
          </EmptyState>
        ) : (
          <ul className="space-y-4">
            {mine.map((s) => (
              <li key={s.id} className="rounded-3xl border bg-card p-5 sm:p-6">
                <p className="font-heading text-lg leading-snug text-pretty whitespace-pre-line">“{s.body}”</p>
                <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <time dateTime={s.createdAt} suppressHydrationWarning>
                    {timeAgo(s.createdAt)}
                  </time>
                  <span className="inline-flex items-center gap-1.5">
                    <Eye className="size-3.5" aria-hidden />
                    Read by {s.timesDelivered} {s.timesDelivered === 1 ? "stranger" : "strangers"}
                  </span>
                  {STATUS_NOTE[s.status] ? <span>{STATUS_NOTE[s.status]}</span> : null}
                </p>
                {s.replies.length > 0 ? (
                  <ul className="mt-4 space-y-2 border-t pt-4">
                    {s.replies.map((r) => (
                      <li
                        key={r.id}
                        className={cn(
                          "flex items-start gap-3 rounded-2xl bg-muted px-4 py-3",
                          r.unread && "bg-accent text-accent-foreground"
                        )}
                      >
                        <Mail className="mt-0.5 size-4 shrink-0 opacity-70" aria-hidden />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-pretty whitespace-pre-line">{r.body}</p>
                          <p className="mt-1 text-xs opacity-70">
                            {r.unread ? <span className="font-semibold">New · </span> : null}
                            <time dateTime={r.createdAt} suppressHydrationWarning>
                              {timeAgo(r.createdAt)}
                            </time>
                          </p>
                        </div>
                        <ReportButton kind="secret_reply" id={r.id} />
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="received-heading" className="space-y-4">
        <h2 id="received-heading" className="text-2xl font-normal">
          Secrets you received
        </h2>
        {received.length === 0 ? (
          <p className="rounded-2xl bg-muted px-4 py-5 text-sm text-muted-foreground">
            Secrets strangers trust you with will be kept here.
          </p>
        ) : (
          <ul className="space-y-4">
            {received.map((r) => (
              <li key={r.deliveryId} className="space-y-3 rounded-3xl border bg-card p-5 sm:p-6">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-heading text-lg leading-snug text-pretty whitespace-pre-line">“{r.body}”</p>
                  <ReportButton kind="secret" id={r.secretId} />
                </div>
                <p className="text-xs text-muted-foreground">
                  Received{" "}
                  <time dateTime={r.receivedAt} suppressHydrationWarning>
                    {timeAgo(r.receivedAt)}
                  </time>
                </p>
                {r.reply ? (
                  <p className="rounded-2xl bg-muted px-4 py-3 text-sm">
                    <span className="text-muted-foreground">You replied: </span>
                    {r.reply}
                  </p>
                ) : (
                  <SecretReplyForm deliveryId={r.deliveryId} replied={r.replied} />
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

function InboxSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-36 rounded-3xl" />
      <Skeleton className="h-36 rounded-3xl" />
    </div>
  );
}

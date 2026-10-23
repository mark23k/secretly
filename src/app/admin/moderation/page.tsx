import type { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminNav } from "@/components/admin/admin-nav";
import { ModerationQueue } from "@/components/admin/moderation-queue";
import { getModerationQueue } from "@/lib/data/admin.server";
import { requireAdminPage } from "@/lib/server/admin";

export const metadata: Metadata = {
  title: "Moderation",
  robots: { index: false, follow: false },
};

export default function ModerationPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 pt-10 pb-16 sm:pt-14">
      <Suspense fallback={<QueueSkeleton />}>
        <Moderation />
      </Suspense>
    </div>
  );
}

async function Moderation() {
  await requireAdminPage("/admin/moderation");
  const queue = await getModerationQueue();
  const { pending, hidden, reported } = queue.counts;
  return (
    <div className="space-y-8">
      <header className="space-y-4">
        <AdminNav current="moderation" queueCount={queue.items.length} />
        <div>
          <p className="mb-2 text-xs font-semibold tracking-[0.14em] text-primary uppercase">Only visible to managers</p>
          <h1 className="text-4xl font-normal sm:text-5xl">Moderation</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {hidden} hidden by reports · {pending} held by the filters · {reported} live but reported. Authors are
            shown as a code, never an email.
          </p>
        </div>
      </header>
      <ModerationQueue initial={queue} />
    </div>
  );
}

function QueueSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading">
      <Skeleton className="h-10 w-64 rounded-full" />
      <Skeleton className="h-12 w-56" />
      <Skeleton className="h-44 rounded-3xl" />
      <Skeleton className="h-44 rounded-3xl" />
    </div>
  );
}

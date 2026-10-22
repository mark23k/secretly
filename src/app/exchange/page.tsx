import type { Metadata } from "next";
import { Suspense } from "react";
import { features } from "@/config/site";
import { getExchangeState } from "@/lib/data/secrets.server";
import { getSessionUser } from "@/lib/server/visitor";
import { PageHeader } from "@/components/shared/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { SecretExchange } from "@/components/exchange/secret-exchange";

export const metadata: Metadata = {
  title: features.exchange.title,
  description: "Give a secret, get a stranger's secret back. Three a day. Nobody will ever know it was you.",
};

export default function ExchangePage() {
  return (
    <div className="pb-8">
      <PageHeader
        eyebrow="The secret exchange"
        title={
          <>
            Give a secret. <em className="text-primary">Get one back.</em>
          </>
        }
        description="Tell us something you've never told anyone. In return, a stranger's secret is yours to read. Three a day."
      />
      <div className="mx-auto max-w-xl px-5">
        <Suspense fallback={<ExchangeSkeleton />}>
          <Exchange />
        </Suspense>
      </div>
    </div>
  );
}

async function Exchange() {
  const user = await getSessionUser();
  const state = user ? await getExchangeState(user.id) : null;
  // Keyed by account so signing in (or out) starts from that account's state.
  return <SecretExchange key={user?.id ?? "guest"} initial={state} />;
}

function ExchangeSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading">
      <Skeleton className="mx-auto h-5 w-40 rounded-full" />
      <Skeleton className="h-48 rounded-3xl" />
      <Skeleton className="h-11 rounded-xl" />
    </div>
  );
}

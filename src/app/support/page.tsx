import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { CrisisResourceList } from "@/components/providers/crisis-provider";
import { crisisCopy } from "@/config/crisis";

export const metadata: Metadata = {
  title: "Need support?",
  description: "Free, confidential people you can talk to right now.",
};

export default function SupportPage() {
  return (
    <div className="pb-8">
      <PageHeader
        eyebrow="You matter"
        title={crisisCopy.title}
        description="Whatever you're carrying, there are people ready to listen right now. Free, confidential, and no judgement."
      />
      <div className="mx-auto max-w-lg space-y-6 px-5">
        <CrisisResourceList />
        <p className="rounded-2xl bg-muted p-4 text-sm text-muted-foreground">
          {crisisCopy.emergency} {crisisCopy.aboutSomeoneElse}
        </p>
      </div>
    </div>
  );
}

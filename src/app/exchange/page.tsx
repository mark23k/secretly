import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";

export const metadata: Metadata = { title: "The secret exchange" };

// Placeholder: built in a later step.
export default function Page() {
  return <PageHeader title="The secret exchange" description="Coming together right now. Check back soon." />;
}

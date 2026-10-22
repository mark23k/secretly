import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";

export const metadata: Metadata = { title: "The question you can't ask" };

// Placeholder: built in a later step.
export default function Page() {
  return <PageHeader title="The question you can't ask" description="Coming together right now. Check back soon." />;
}

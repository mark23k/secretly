import Link from "next/link";
import { siteConfig } from "@/config/site";
import { PageHeader } from "./page-header";

/** Layout for the Guidelines, Privacy and Terms pages. */
export function LegalPage({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="pb-12">
      <PageHeader eyebrow={eyebrow} title={title} description={intro}>
        <p className="mt-4 text-xs text-muted-foreground">Last updated {siteConfig.legalUpdated}</p>
      </PageHeader>
      <div className="mx-auto max-w-2xl space-y-10 px-5 text-[0.98rem] leading-relaxed text-pretty [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_li]:pl-1 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
        {children}
        <ContactLine />
      </div>
    </div>
  );
}

export function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-2xl font-normal">{title}</h2>
      {children}
    </section>
  );
}

function ContactLine() {
  return (
    <p className="rounded-2xl bg-muted px-4 py-4 text-sm text-muted-foreground">
      Questions about this page?{" "}
      {siteConfig.contactEmail ? (
        <>
          Email us at <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>.
        </>
      ) : (
        <>
          Use the report button on any post, or see <Link href="/guidelines">our guidelines</Link>.
        </>
      )}
    </p>
  );
}

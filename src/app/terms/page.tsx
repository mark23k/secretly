import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, LegalSection } from "@/components/shared/legal";

export const metadata: Metadata = {
  title: "Terms of use",
  description: "The rules for using Secretly.",
};

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Terms of use"
      title="The ground rules"
      intro="By using Secretly you agree to these terms. They're short, so please read them."
    >
      <LegalSection title="Who can use Secretly">
        <p>You must be 18 or older, or the minimum age where you live if that&apos;s higher.</p>
      </LegalSection>

      <LegalSection title="Your account">
        <p>
          Keep your password safe. We don&apos;t send emails, so <strong>we can&apos;t recover an account if you
          forget your password</strong>. You&apos;re responsible for what&apos;s posted from your account. One
          person, one account: don&apos;t create accounts to get around limits or bans.
        </p>
      </LegalSection>

      <LegalSection title="What you post">
        <p>
          You keep ownership of what you write. By posting, you allow Secretly to store it and show it on the site
          (for secrets, to individual people through the exchange). You can delete everything by deleting your
          account.
        </p>
        <p>
          You agree to follow the <Link href="/guidelines">community guidelines</Link>. We may remove any content
          and suspend or ban any account that breaks them, at our discretion.
        </p>
      </LegalSection>

      <LegalSection title="Not professional advice">
        <p>
          Answers on Secretly come from anonymous strangers. They are not medical, mental health, legal or financial
          advice. If you&apos;re in crisis, please contact a professional or <Link href="/support">one of these
          services</Link>. In an emergency, call your local emergency number.
        </p>
      </LegalSection>

      <LegalSection title="The service">
        <p>
          Secretly is provided as it is, without guarantees. We may change, pause or end features at any time. To
          the extent the law allows, we&apos;re not liable for content posted by users or for losses from using the
          site.
        </p>
      </LegalSection>

      <LegalSection title="Changes">
        <p>
          We may update these terms. If we do, we&apos;ll change the date at the top. Continuing to use Secretly
          means you accept the updated terms.
        </p>
      </LegalSection>
    </LegalPage>
  );
}

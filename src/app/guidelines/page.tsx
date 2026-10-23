import type { Metadata } from "next";
import Link from "next/link";
import { REPORT_HIDE_THRESHOLD } from "@/config/limits";
import { LegalPage, LegalSection } from "@/components/shared/legal";

export const metadata: Metadata = {
  title: "Community guidelines",
  description: "How Secretly stays a calm, kind and safe place to be honest.",
};

export default function GuidelinesPage() {
  return (
    <LegalPage
      eyebrow="Community guidelines"
      title="Honest, kind, anonymous"
      intro="Secretly works because people feel safe saying things they've never said out loud. These guidelines keep it that way."
    >
      <LegalSection title="Be kind">
        <p>
          Everyone here is sharing something that took courage. Answer the way you&apos;d want a stranger to answer
          you on your worst day. Disagree gently, never mock, and remember there&apos;s a real person behind every
          post.
        </p>
      </LegalSection>

      <LegalSection title="Keep it anonymous, for you and everyone else">
        <ul>
          <li>Don&apos;t include names, workplaces, schools, locations or details that could identify you or anyone else.</li>
          <li>No phone numbers, emails, social media handles or links. These are blocked automatically.</li>
          <li>Never try to work out who wrote something, or ask people to reveal who they are.</li>
        </ul>
      </LegalSection>

      <LegalSection title="Not allowed">
        <ul>
          <li>Harassment, bullying, threats, or encouraging anyone to harm themselves.</li>
          <li>Hate or discrimination against people for who they are.</li>
          <li>Sexually explicit content, and anything sexual involving minors, ever.</li>
          <li>Sharing someone else&apos;s secrets, private information or images.</li>
          <li>Spam, advertising, scams, or promoting other sites.</li>
          <li>Content that breaks the law or promotes violence.</li>
        </ul>
      </LegalSection>

      <LegalSection title="After Dark">
        <p>
          After Dark is the 18+ corner for dating, sex and relationships. Frank, honest questions and confessions are
          welcome there. Graphic descriptions, explicit sexual content and anything involving minors are not: they&apos;re
          held for review or removed, and serious cases lead to a ban.
        </p>
      </LegalSection>

      <LegalSection title="Replies to secrets">
        <p>
          When you receive a stranger&apos;s secret, you can send them one short message. It goes straight to a
          real person, so it&apos;s checked more strictly. Make it kind, or don&apos;t send it.
        </p>
      </LegalSection>

      <LegalSection title="If you're struggling">
        <p>
          If you post something that suggests you might be at risk, we&apos;ll hold it and show you people you can
          talk to right now. That&apos;s not a punishment: we&apos;d rather you get real support.{" "}
          <Link href="/support">Find support</Link> any time.
        </p>
      </LegalSection>

      <LegalSection title="Reporting and what happens next">
        <p>
          Every post has a report button. Reports are anonymous. A post with {REPORT_HIDE_THRESHOLD} reports is
          hidden until a moderator reviews it. Posts that break these guidelines are removed, and accounts that
          repeatedly or seriously break them are banned.
        </p>
      </LegalSection>

      <LegalSection title="Who can use Secretly">
        <p>You must be 18 or older, or the minimum age required where you live if that&apos;s higher.</p>
      </LegalSection>
    </LegalPage>
  );
}

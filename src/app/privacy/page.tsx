import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, LegalSection } from "@/components/shared/legal";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "What Secretly collects, what's public, and how to delete everything.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Privacy policy"
      title="Your privacy, in plain words"
      intro="Secretly is built so that nothing you share can be traced back to you by other people. Here's exactly what we collect and why."
    >
      <LegalSection title="What other people can see">
        <p>
          Only the words you post, the category you chose and roughly when you posted. Never your email, never your
          account, and never which posts are yours. Votes, reactions and reports are never shown with who made them.
        </p>
        <p>
          Secrets are never shown in a public feed. Each one is only shown to individual people through the secret
          exchange, one at a time.
        </p>
      </LegalSection>

      <LegalSection title="What we collect">
        <ul>
          <li>
            <strong>Your account:</strong> your email address and password. Your password is stored scrambled
            (hashed), so nobody can read it. We don&apos;t send you emails.
          </li>
          <li>
            <strong>Your time zone</strong>, so the daily secret exchange resets at your midnight.
          </li>
          <li>
            <strong>What you post</strong> and your votes, reactions, answers, replies and reports, linked to your
            account so you can see your own posts and so limits (like 3 secrets a day) work.
          </li>
          <li>
            <strong>A scrambled version of your IP address</strong>, used only to prevent spam and abuse. Our own
            database never stores your actual IP address (our sign-in provider may log it briefly for security).
          </li>
          <li>
            <strong>Anonymous visit statistics:</strong> a random ID stored in your browser (not a cookie), the
            pages you view and how long the tab is open. We use this only to count visitors and see how the site is
            used, never for advertising.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="Cookies">
        <p>
          We use cookies only to keep you signed in. There are no advertising or third-party tracking cookies.
        </p>
      </LegalSection>

      <LegalSection title="How posts are checked">
        <p>
          Everything you post is checked automatically for personal information, harmful content and signs that
          someone may be at risk. Some posts are held for a person to review. Moderators see the post and an
          anonymous account code, not your email.
        </p>
      </LegalSection>

      <LegalSection title="Services we use">
        <ul>
          <li>Supabase stores the database and handles sign-in.</li>
          <li>Netlify hosts the website.</li>
          <li>Cloudflare Turnstile checks that sign-ups come from people, not bots.</li>
          <li>We may use an automated moderation service (such as OpenAI&apos;s) to check the text of posts.</li>
        </ul>
        <p>They process data only to provide these services to us. We never sell your data or share it for advertising.</p>
      </LegalSection>

      <LegalSection title="Deleting your data">
        <p>
          You can delete your account at any time from <Link href="/me">My posts</Link>. This permanently deletes
          your account and everything you posted. Visit statistics that are no longer linked to an account may be
          kept as anonymous totals.
        </p>
      </LegalSection>

      <LegalSection title="When we might share information">
        <p>
          Only if we&apos;re legally required to, or if we believe someone&apos;s life is in danger. Because we
          don&apos;t collect real names, there is very little we could share.
        </p>
      </LegalSection>

      <LegalSection title="Age">
        <p>Secretly is only for people aged 18 or older, or the minimum age where you live if that&apos;s higher.</p>
      </LegalSection>

      <LegalSection title="Changes">
        <p>If we change this policy, we&apos;ll update the date at the top of this page.</p>
      </LegalSection>
    </LegalPage>
  );
}

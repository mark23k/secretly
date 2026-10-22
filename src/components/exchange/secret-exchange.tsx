"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Inbox, Moon, Sparkles } from "lucide-react";
import { exchangeSecret } from "@/app/actions/secrets";
import { DAILY_SECRET_EXCHANGES, textLimits } from "@/config/limits";
import type { ExchangeState, ReceivedSecret } from "@/lib/data/secrets";
import { useAction } from "@/hooks/use-action";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AnonymityNote } from "@/components/shared/anonymity-note";
import { CharCounter } from "@/components/shared/char-counter";
import { Countdown } from "./countdown";
import { ExchangeMeter } from "./exchange-meter";
import { SecretEnvelope } from "./secret-envelope";
import { SecretReplyForm } from "./secret-reply-form";

const examples = [
  "I sometimes wish I could start my life over in a city where absolutely nobody knows me.",
  "I still check the profile of someone I haven't spoken to in years.",
  "I pretend to be busy so people think my life is more exciting than it is.",
];

type Reveal = { kind: "secret"; secret: ReceivedSecret } | { kind: "none" };

/**
 * The exchange loop: write a secret → open a stranger's → send one kind
 * message → go again (3 a day). `initial` is null when signed out; the first
 * exchange asks them to sign in and then carries on.
 */
export function SecretExchange({ initial }: { initial: ExchangeState | null }) {
  const [state, setState] = useState<ExchangeState>(
    initial ?? {
      used: 0,
      limit: DAILY_SECRET_EXCHANGES,
      resetsAt: "",
      owed: 0,
      unreadReplies: 0,
      received: [],
    }
  );
  const [reveal, setReveal] = useState<Reveal | null>(null);
  const [opened, setOpened] = useState(false);
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { execute, pending } = useAction(exchangeSecret, {
    toastErrors: false,
    heldMessage: "Your secret will go out to strangers after a quick review.",
    authReason: "Sign in to trade secrets. Nobody will ever know it was you.",
  });
  const ids = { body: useId(), counter: useId(), error: useId() };
  const { min, max } = textLimits.secret;
  const left = Math.max(0, state.limit - state.used);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await execute({ body });
    if (res.ok) {
      const { received, used, limit, resetsAt } = res.data;
      setBody("");
      setOpened(false);
      setState((s) => ({
        ...s,
        used,
        limit,
        resetsAt,
        owed: received ? s.owed : s.owed + 1,
        received: received ? [received, ...s.received] : s.received,
      }));
      setReveal(received ? { kind: "secret", secret: received } : { kind: "none" });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (res.code === "limit_reached") {
      setState((s) => ({ ...s, used: s.limit }));
      setReveal(null);
    } else if (res.code !== "auth_required") {
      setError(res.fieldErrors?.body ?? res.message);
    }
  }

  function markReplied(deliveryId: string) {
    setState((s) => ({
      ...s,
      received: s.received.map((r) => (r.deliveryId === deliveryId ? { ...r, replied: true } : r)),
    }));
  }

  const current = reveal?.kind === "secret" ? reveal.secret : null;
  const earlier = state.received.filter((r) => r.deliveryId !== current?.deliveryId);

  return (
    <div className="space-y-10">
      <div className="flex flex-col items-center gap-3">
        <ExchangeMeter used={state.used} limit={state.limit} />
        {initial ? (
          <Link
            href="/exchange/inbox"
            className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <Inbox className="size-3.5" aria-hidden /> My secrets
            {state.unreadReplies > 0 ? (
              <span className="rounded-full bg-primary px-1.5 text-[0.7rem] text-primary-foreground">
                {state.unreadReplies} new {state.unreadReplies === 1 ? "reply" : "replies"}
              </span>
            ) : null}
          </Link>
        ) : null}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {reveal ? (
          <motion.section
            key={current?.deliveryId ?? "none"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -12 }}
            aria-live="polite"
            className="space-y-6"
          >
            {current ? (
              <>
                <p className="text-center text-sm text-muted-foreground">
                  Your secret is out there. Here&apos;s one in return.
                </p>
                <SecretEnvelope secretId={current.secretId} body={current.body} onOpen={() => setOpened(true)} />
                {opened ? (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                    <SecretReplyForm
                      deliveryId={current.deliveryId}
                      replied={current.replied}
                      onReplied={() => markReplied(current.deliveryId)}
                    />
                  </motion.div>
                ) : null}
              </>
            ) : (
              <div className="rounded-3xl border border-dashed px-6 py-10 text-center">
                <Sparkles className="mx-auto size-6 text-primary" aria-hidden />
                <p className="mt-3 font-heading text-2xl">You&apos;re early.</p>
                <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                  Your secret is in, but there&apos;s no stranger&apos;s secret for you yet. You&apos;ll get one
                  the next time you visit. It&apos;s saved for you.
                </p>
              </div>
            )}
            {left > 0 && (current ? opened : true) ? (
              <div className="flex justify-center">
                <Button variant="outline" size="lg" onClick={() => setReveal(null)}>
                  Trade another secret · {left} left
                </Button>
              </div>
            ) : null}
          </motion.section>
        ) : null}
      </AnimatePresence>

      {!reveal && left > 0 ? (
        <form onSubmit={submit} className="space-y-5" noValidate>
          <div className="rounded-3xl border bg-card p-2 shadow-[0_1px_2px_rgb(0_0_0/0.03)] focus-within:border-primary/40 focus-within:ring-4 focus-within:ring-primary/10">
            <label htmlFor={ids.body} className="sr-only">
              Your secret
            </label>
            <Textarea
              id={ids.body}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={5}
              maxLength={max + 50}
              placeholder={examples[state.used % examples.length]}
              aria-describedby={`${ids.counter} ${error ? ids.error : ""}`}
              aria-invalid={Boolean(error)}
              className="min-h-36 resize-none border-0 bg-transparent px-4 pt-4 font-heading text-xl leading-snug shadow-none placeholder:text-muted-foreground/60 focus-visible:ring-0 dark:bg-transparent"
            />
            <div className="flex items-center justify-end px-4 pb-2">
              <CharCounter value={body} max={max} id={ids.counter} />
            </div>
          </div>
          {error ? (
            <p id={ids.error} role="alert" className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </p>
          ) : null}
          <AnonymityNote />
          <Button type="submit" size="lg" className="w-full" disabled={pending || body.trim().length < min || body.length > max}>
            {pending ? "Sealing your secret…" : "Give my secret, get one back"}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Your secret is only ever shown to strangers, one at a time. Never in a public feed.
          </p>
        </form>
      ) : null}

      {left === 0 ? <OutForToday resetsAt={state.resetsAt} hasInbox={Boolean(initial)} /> : null}

      {state.owed > 0 && reveal?.kind !== "none" ? (
        <p className="text-center text-sm text-muted-foreground">
          {state.owed === 1 ? "One of your secrets is" : `${state.owed} of your secrets are`} still waiting for a
          stranger&apos;s secret in return. You&apos;ll get {state.owed === 1 ? "it" : "them"} on your next visit.
        </p>
      ) : null}

      {earlier.length > 0 ? (
        <section aria-labelledby="today-heading" className="space-y-4">
          <h2 id="today-heading" className="text-2xl font-normal">
            Secrets you received today
          </h2>
          <ul className="space-y-6">
            {earlier.map((r) => (
              <li key={r.deliveryId} className="space-y-3">
                <SecretEnvelope secretId={r.secretId} body={r.body} opened />
                <SecretReplyForm deliveryId={r.deliveryId} replied={r.replied} onReplied={() => markReplied(r.deliveryId)} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

function OutForToday({ resetsAt, hasInbox }: { resetsAt: string; hasInbox: boolean }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border bg-gradient-to-br from-accent/70 to-card px-6 py-10 text-center"
    >
      <Moon className="mx-auto size-7 text-primary" aria-hidden />
      <h2 className="mt-3 text-3xl font-normal">That&apos;s your three for today.</h2>
      <p className="mx-auto mt-2 max-w-sm text-sm text-pretty text-muted-foreground">
        Three strangers trusted you with something they&apos;ve never said out loud. Your secrets are out there
        being read right now.
      </p>
      {resetsAt ? (
        <p className="mt-6 text-sm">
          New secrets in <span className="font-semibold text-primary">{<Countdown to={resetsAt} />}</span>
        </p>
      ) : null}
      {hasInbox ? (
        <Button asChild variant="outline" className="mt-6 bg-background/70">
          <Link href="/exchange/inbox">See if anyone replied</Link>
        </Button>
      ) : null}
    </motion.section>
  );
}

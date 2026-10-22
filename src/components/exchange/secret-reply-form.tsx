"use client";

import { useId, useState } from "react";
import { Check, Send } from "lucide-react";
import { replyToSecret } from "@/app/actions/secrets";
import { textLimits } from "@/config/limits";
import { useAction } from "@/hooks/use-action";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CharCounter } from "@/components/shared/char-counter";

/** The one message you can send to a secret's author. */
export function SecretReplyForm({
  deliveryId,
  replied,
  onReplied,
}: {
  deliveryId: string;
  replied: boolean;
  onReplied?: () => void;
}) {
  const [body, setBody] = useState("");
  const [sent, setSent] = useState(replied);
  const [error, setError] = useState<string | null>(null);
  const { execute, pending } = useAction(replyToSecret, {
    toastErrors: false,
    heldMessage: "Sent for a quick check. If it's kind, they'll receive it soon.",
    authReason: "Sign in to reply. It stays anonymous.",
  });
  const ids = { input: useId(), counter: useId(), error: useId() };
  const { min, max } = textLimits.secretReply;

  if (sent) {
    return (
      <p className="flex items-center justify-center gap-2 rounded-2xl bg-muted px-4 py-3 text-sm text-muted-foreground">
        <Check className="size-4 text-primary" aria-hidden /> Your message is on its way to them.
      </p>
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await execute({ deliveryId, body });
    if (res.ok) {
      setSent(true);
      onReplied?.();
    } else if (res.code !== "auth_required") {
      setError(res.fieldErrors?.body ?? res.message);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-2" noValidate>
      <label htmlFor={ids.input} className="text-sm font-medium">
        Send them one message <span className="font-normal text-muted-foreground">(only one, no replies back)</span>
      </label>
      <Textarea
        id={ids.input}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={2}
        maxLength={max + 20}
        placeholder="You're not alone in this…"
        aria-describedby={`${ids.counter} ${error ? ids.error : ""}`}
        aria-invalid={Boolean(error)}
        className="rounded-2xl bg-card"
      />
      {error ? (
        <p id={ids.error} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
      <div className="flex items-center justify-between gap-3">
        <CharCounter value={body} max={max} id={ids.counter} />
        <Button type="submit" size="sm" disabled={pending || body.trim().length < min || body.length > max}>
          <Send data-icon="inline-start" /> {pending ? "Sending…" : "Send kindly"}
        </Button>
      </div>
    </form>
  );
}

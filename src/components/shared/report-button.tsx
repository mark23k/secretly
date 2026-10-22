"use client";

import { useId, useState } from "react";
import { Flag } from "lucide-react";
import { toast } from "sonner";
import { reportContent } from "@/app/actions/report";
import { reportReasons } from "@/config/report";
import { useAction } from "@/hooks/use-action";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { textLimits } from "@/config/limits";
import type { Database } from "@/lib/supabase/database.types";
import { cn } from "@/lib/utils";

type ContentKind = Database["public"]["Enums"]["content_kind"];
type ReportReason = (typeof reportReasons)[number]["value"];

const KIND_LABEL: Record<ContentKind, string> = {
  thought: "thought",
  thought_comment: "comment",
  question: "question",
  answer: "answer",
  secret: "secret",
  secret_reply: "reply",
};

export function ReportButton({
  kind,
  id,
  className,
  onReported,
}: {
  kind: ContentKind;
  id: string;
  className?: string;
  onReported?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<ReportReason | "">("");
  const [details, setDetails] = useState("");
  const { execute, pending } = useAction(reportContent);
  const detailsId = useId();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!reason) return;
    const res = await execute({ kind, id, reason, details });
    if (res.ok) {
      toast.success("Thanks for looking out. We'll take a look.");
      setOpen(false);
      setReason("");
      setDetails("");
      onReported?.();
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className={cn("text-muted-foreground hover:text-foreground", className)}
          aria-label={`Report this ${KIND_LABEL[kind]}`}
        >
          <Flag className="size-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-3xl sm:max-w-md">
        <form onSubmit={submit} className="space-y-5">
          <DialogHeader>
            <DialogTitle className="text-xl font-normal">Report this {KIND_LABEL[kind]}</DialogTitle>
            <DialogDescription>
              Reports are anonymous. Posts with several reports are hidden until a moderator reviews them.
            </DialogDescription>
          </DialogHeader>
          <fieldset className="space-y-2">
            <legend className="sr-only">Reason</legend>
            {reportReasons.map((r) => (
              <label
                key={r.value}
                className="flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-colors hover:bg-muted has-checked:border-primary has-checked:bg-accent/50 has-focus-visible:ring-2 has-focus-visible:ring-ring"
              >
                <input
                  type="radio"
                  name="reason"
                  value={r.value}
                  checked={reason === r.value}
                  onChange={() => setReason(r.value)}
                  className="size-4 accent-[var(--primary)]"
                />
                {r.label}
              </label>
            ))}
          </fieldset>
          <div className="space-y-2">
            <Label htmlFor={detailsId} className="text-muted-foreground">
              Anything else? (optional)
            </Label>
            <Textarea
              id={detailsId}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              maxLength={textLimits.reportDetails.max}
              rows={2}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!reason || pending}>
              {pending ? "Sending…" : "Send report"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

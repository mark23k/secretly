"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteMyAccount } from "@/app/actions/account";
import { useAuth } from "@/components/providers/auth-provider";
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

/** Permanently deletes the account and everything posted with it. */
export function DeleteAccount() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);

  if (!user) return null;

  async function remove() {
    setPending(true);
    const res = await deleteMyAccount();
    if (!res.ok) {
      setPending(false);
      toast.error(res.message);
      return;
    }
    await signOut().catch(() => {});
    toast("Your account and everything you posted have been deleted.");
    router.push("/");
  }

  return (
    <section aria-labelledby="delete-heading" className="space-y-3 border-t pt-8">
      <h2 id="delete-heading" className="font-sans text-base font-semibold tracking-normal">
        Delete my account
      </h2>
      <p className="text-sm text-muted-foreground">
        Permanently deletes your account and everything you&apos;ve posted: thoughts, comments, questions, answers,
        secrets and replies. This can&apos;t be undone.
      </p>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="text-destructive hover:text-destructive">
            Delete my account
          </Button>
        </DialogTrigger>
        <DialogContent className="rounded-3xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-normal">Delete your account?</DialogTitle>
            <DialogDescription>
              Everything you&apos;ve posted on Secretly will be deleted for good, and you&apos;ll be signed out. You
              can always create a new account later.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)} disabled={pending}>
              Keep my account
            </Button>
            <Button variant="destructive" onClick={remove} disabled={pending}>
              {pending ? "Deleting…" : "Delete everything"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}

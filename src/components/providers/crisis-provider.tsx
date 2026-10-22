"use client";

import { createContext, useCallback, useContext, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Heart } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { crisisCopy, crisisResources } from "@/config/crisis";

const CrisisContext = createContext<{ showCrisis: () => void } | null>(null);

export function CrisisProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const showCrisis = useCallback(() => setOpen(true), []);

  return (
    <CrisisContext.Provider value={{ showCrisis }}>
      {children}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto rounded-3xl sm:max-w-md">
          <DialogHeader>
            <span className="mb-2 inline-flex size-11 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
              <Heart className="size-5" aria-hidden />
            </span>
            <DialogTitle className="text-2xl font-normal">{crisisCopy.title}</DialogTitle>
            <DialogDescription className="text-[0.95rem] leading-relaxed">
              {crisisCopy.body}
            </DialogDescription>
          </DialogHeader>
          <CrisisResourceList />
          <p className="text-sm text-muted-foreground">{crisisCopy.emergency}</p>
          <DialogFooter className="gap-2 sm:justify-between">
            <Button variant="ghost" asChild>
              <Link href="/support" onClick={() => setOpen(false)}>
                More support options
              </Link>
            </Button>
            <Button onClick={() => setOpen(false)}>Thank you</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </CrisisContext.Provider>
  );
}

export function CrisisResourceList() {
  return (
    <ul className="space-y-2">
      {crisisResources.map((r) => (
        <li key={r.name}>
          <a
            href={r.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-start justify-between gap-3 rounded-2xl border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-accent/40"
          >
            <span>
              <span className="block font-medium">{r.name}</span>
              <span className="block text-sm text-muted-foreground">{r.description}</span>
              <span className="mt-1 block text-sm font-medium text-primary">{r.contact}</span>
            </span>
            <ArrowUpRight
              className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden
            />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

export function useCrisis() {
  const ctx = useContext(CrisisContext);
  if (!ctx) throw new Error("useCrisis must be used inside <CrisisProvider>");
  return ctx;
}

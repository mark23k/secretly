"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ReportButton } from "@/components/shared/report-button";

/**
 * A sealed card that flips open to reveal a stranger's secret. Starts sealed
 * (tap to open) unless `opened`. Reduced motion skips the flip.
 */
export function SecretEnvelope({
  secretId,
  body,
  opened: initiallyOpened = false,
  onOpen,
}: {
  secretId: string;
  body: string;
  opened?: boolean;
  onOpen?: () => void;
}) {
  const [opened, setOpened] = useState(initiallyOpened);

  return (
    <div className="[perspective:1400px]">
      <motion.div
        initial={initiallyOpened ? false : { opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1, rotateY: opened ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 140, damping: 18 }}
        className="relative grid min-h-64 [transform-style:preserve-3d]"
      >
        {/* Sealed side */}
        <button
          type="button"
          onClick={() => {
            setOpened(true);
            onOpen?.();
          }}
          disabled={opened}
          aria-hidden={opened}
          tabIndex={opened ? -1 : 0}
          className="col-start-1 row-start-1 flex flex-col items-center justify-center gap-4 overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-accent to-card p-8 shadow-lg [backface-visibility:hidden] focus-visible:ring-4 focus-visible:ring-primary/30 focus-visible:outline-none"
        >
          <span
            aria-hidden
            className="absolute inset-x-0 top-0 h-1/2 bg-card/60 [clip-path:polygon(0_0,100%_0,50%_100%)]"
          />
          <span className="relative flex size-16 items-center justify-center rounded-full bg-primary font-heading text-3xl text-primary-foreground italic shadow-md">
            S
          </span>
          <span className="relative text-center">
            <span className="block font-heading text-xl">A stranger&apos;s secret</span>
            <span className="mt-1 block text-sm text-muted-foreground">Tap to open</span>
          </span>
        </button>

        {/* Revealed side */}
        <article
          aria-hidden={!opened}
          aria-label="A stranger's secret"
          className="col-start-1 row-start-1 flex flex-col justify-between rounded-3xl border bg-card p-6 shadow-lg [backface-visibility:hidden] [transform:rotateY(180deg)] sm:p-8"
        >
          <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">A stranger told you</p>
          <p className="my-5 font-heading text-[1.4rem] leading-snug text-pretty whitespace-pre-line sm:text-2xl">
            “{body}”
          </p>
          <div className="flex justify-end">
            {opened ? <ReportButton kind="secret" id={secretId} /> : null}
          </div>
        </article>
      </motion.div>
    </div>
  );
}

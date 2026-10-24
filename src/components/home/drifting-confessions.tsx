/**
 * Decorative background for the home hero: anonymous confession snippets
 * drifting slowly, blurred and faint. Hidden from screen readers; the drift
 * stops for people who prefer reduced motion.
 */
const SNIPPETS: { text: string; className: string; dx: number; dy: number; delay: number }[] = [
  { text: "I've never told anyone that…", className: "left-[2%] top-[12%] -rotate-6", dx: 28, dy: -14, delay: 0 },
  { text: "I still think about…", className: "right-[3%] top-[8%] rotate-3", dx: -22, dy: 18, delay: -4 },
  { text: "Nobody knows I…", className: "left-[6%] top-[58%] rotate-2", dx: 20, dy: 16, delay: -9 },
  { text: "I've had a dream about…", className: "right-[4%] top-[52%] -rotate-3", dx: -26, dy: -12, delay: -2 },
  { text: "Is it normal to…", className: "left-[34%] top-[2%] rotate-1", dx: 16, dy: 20, delay: -6 },
  { text: "My partner doesn't know…", className: "left-[24%] bottom-[4%] -rotate-2", dx: -18, dy: -16, delay: -11 },
  { text: "At 2am I…", className: "right-[22%] bottom-[8%] rotate-6", dx: 22, dy: -20, delay: -7 },
];

export function DriftingConfessions() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-x-0 -top-40 mx-auto h-[30rem] max-w-3xl rounded-full bg-primary/15 blur-3xl dark:bg-primary/20" />
      {SNIPPETS.map((s) => (
        <span
          key={s.text}
          className={`absolute hidden animate-drift rounded-2xl border border-primary/15 bg-card/60 px-4 py-2 font-heading text-base text-foreground/50 italic shadow-sm blur-[1.5px] sm:block ${s.className}`}
          style={
            {
              "--drift-x": `${s.dx}px`,
              "--drift-y": `${s.dy}px`,
              animationDelay: `${s.delay}s`,
            } as React.CSSProperties
          }
        >
          {s.text}
        </span>
      ))}
      {/* Phones: fewer, smaller snippets so the headline stays readable. */}
      {SNIPPETS.slice(0, 4).map((s) => (
        <span
          key={`m-${s.text}`}
          className={`absolute animate-drift rounded-xl border border-primary/15 bg-card/50 px-3 py-1.5 font-heading text-xs text-foreground/35 italic blur-[1px] sm:hidden ${s.className}`}
          style={{ "--drift-x": `${s.dx / 2}px`, "--drift-y": `${s.dy / 2}px`, animationDelay: `${s.delay}s` } as React.CSSProperties}
        >
          {s.text}
        </span>
      ))}
    </div>
  );
}

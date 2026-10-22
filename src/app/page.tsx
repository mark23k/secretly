import Link from "next/link";
import { ArrowRight, EyeOff, HeartHandshake, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { features, type FeatureKey } from "@/config/site";

const order: FeatureKey[] = ["only-one", "ask", "exchange"];

export default function HomePage() {
  return (
    <>
      <Hero />
      <section
        id="features"
        aria-labelledby="features-heading"
        className="mx-auto max-w-5xl scroll-mt-20 px-5"
      >
        <h2 id="features-heading" className="sr-only">
          Three ways to be honest
        </h2>
        <div className="grid gap-5 md:grid-cols-3">
          {order.map((key, i) => (
            <FeatureCard key={key} featureKey={key} index={i} />
          ))}
        </div>
      </section>
      <SafetyPromise />
    </>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-40 -z-10 mx-auto h-[28rem] max-w-3xl rounded-full bg-primary/10 blur-3xl dark:bg-primary/15"
      />
      <div className="mx-auto max-w-3xl px-5 pt-16 pb-14 text-center sm:pt-24 sm:pb-20">
        <p className="mx-auto mb-6 inline-flex animate-fade-up items-center gap-2 rounded-full border bg-card/60 px-3.5 py-1.5 text-xs font-medium text-muted-foreground">
          <span className="size-1.5 rounded-full bg-primary" aria-hidden />
          Anonymous. Always. Free to read.
        </p>
        <h1 className="animate-fade-up text-[2.6rem] leading-[1.05] font-normal [animation-delay:60ms] sm:text-6xl">
          Say the thing you&apos;d never{" "}
          <em className="text-primary">say out loud.</em>
        </h1>
        <p className="mx-auto mt-6 max-w-xl animate-fade-up text-lg text-pretty text-muted-foreground [animation-delay:120ms]">
          A quiet place for the thoughts, questions and secrets you keep to
          yourself. No names, no profiles, no one watching. Just people being
          honest.
        </p>
        <div className="mt-9 flex animate-fade-up flex-col items-center justify-center gap-3 [animation-delay:180ms] sm:flex-row">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href={features.exchange.href}>
              Trade a secret <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="ghost" className="w-full sm:w-auto">
            <a href="#features">See all three</a>
          </Button>
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ featureKey, index }: { featureKey: FeatureKey; index: number }) {
  const f = features[featureKey];
  return (
    <article
      className="group flex animate-fade-up flex-col rounded-3xl border bg-card p-2 shadow-[0_1px_2px_rgb(0_0_0/0.03)] transition-shadow hover:shadow-lg hover:shadow-primary/5"
      style={{ animationDelay: `${240 + index * 80}ms` }}
    >
      <div className="flex min-h-44 flex-col justify-center rounded-2xl bg-muted/70 p-5">
        <Preview featureKey={featureKey} />
      </div>
      <div className="flex flex-1 flex-col p-4 pt-5">
        <p className="text-xs font-medium text-muted-foreground">0{index + 1}</p>
        <h3 className="mt-1 text-[1.4rem] leading-tight font-medium">{f.title}</h3>
        <p className="mt-2 flex-1 text-[0.95rem] text-pretty text-muted-foreground">{f.pitch}</p>
        <Button asChild variant={featureKey === "exchange" ? "default" : "secondary"} className="mt-6 w-full">
          <Link href={f.href}>
            {f.cta} <ArrowRight data-icon="inline-end" />
          </Link>
        </Button>
      </div>
    </article>
  );
}

/** Small illustrative previews: decorative, so hidden from screen readers. */
function Preview({ featureKey }: { featureKey: FeatureKey }) {
  if (featureKey === "only-one") {
    return (
      <div aria-hidden className="space-y-4">
        <p className="font-heading text-[0.95rem] leading-snug italic">
          &ldquo;I rehearse phone calls in my head before I make them.&rdquo;
        </p>
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-primary">Me too</span>
            <span className="text-muted-foreground">81%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-background">
            <div className="h-full w-[81%] rounded-full bg-primary" />
          </div>
        </div>
      </div>
    );
  }
  if (featureKey === "ask") {
    return (
      <div aria-hidden className="space-y-3">
        <p className="font-heading text-[0.95rem] leading-snug italic">
          &ldquo;How do you know if someone likes you or is just being nice?&rdquo;
        </p>
        <div className="rounded-xl bg-background p-3 text-xs text-muted-foreground">
          <span className="font-medium text-success">✓ Helped the asker</span>
          <span className="mt-1 block line-clamp-2">
            Watch who starts the conversations. Nice people respond; interested people reach out.
          </span>
        </div>
      </div>
    );
  }
  return (
    <div aria-hidden className="relative flex h-[7.25rem] items-center justify-center">
      <div className="absolute h-20 w-36 rotate-[-6deg] rounded-xl border bg-background/70" />
      <div className="absolute h-20 w-36 rotate-[4deg] rounded-xl border bg-background/90" />
      <div className="relative flex h-20 w-36 flex-col items-center justify-center rounded-xl border bg-background shadow-sm transition-transform duration-500 group-hover:-translate-y-1 group-hover:rotate-[-2deg]">
        <span className="font-heading text-sm italic">A secret</span>
        <span className="text-[0.7rem] text-muted-foreground">waiting for you</span>
      </div>
    </div>
  );
}

const promises = [
  {
    icon: EyeOff,
    title: "Your name stays yours",
    body: "Reading needs no account. To post, you sign up with just an email, which is never shown to anyone, not even next to your own posts.",
  },
  {
    icon: ShieldCheck,
    title: "Moderated with care",
    body: "Every post is checked. Names, contact details and cruelty don't make it through.",
  },
  {
    icon: HeartHandshake,
    title: "Kind by design",
    body: "No followers, no clout, no comment wars. Just honest people helping each other feel less alone.",
  },
];

function SafetyPromise() {
  return (
    <section aria-labelledby="promise-heading" className="mx-auto mt-24 max-w-5xl px-5">
      <div className="rounded-3xl border bg-card px-6 py-12 sm:px-12">
        <h2 id="promise-heading" className="max-w-md text-3xl font-normal sm:text-4xl">
          Safe enough to be <em className="text-primary">completely</em> honest.
        </h2>
        <ul className="mt-10 grid gap-8 sm:grid-cols-3">
          {promises.map(({ icon: Icon, title, body }) => (
            <li key={title}>
              <span className="inline-flex size-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <Icon className="size-5" aria-hidden />
              </span>
              <h3 className="mt-4 font-sans text-base font-semibold tracking-normal">{title}</h3>
              <p className="mt-1.5 text-sm text-pretty text-muted-foreground">{body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

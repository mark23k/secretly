import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, EyeOff, HeartHandshake, Moon, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { features, type FeatureKey } from "@/config/site";
import { getQuestionFeed } from "@/lib/data/questions.server";
import { getFeaturedThoughts, getHomeTeasers, getNextThoughts, getThoughtFeed } from "@/lib/data/thoughts.server";
import { ThoughtDeck, ThoughtDeckSkeleton } from "@/components/thoughts/thought-deck";
import { DriftingConfessions } from "@/components/home/drifting-confessions";
import { HeroActions } from "@/components/home/hero-actions";

const order: FeatureKey[] = ["only-one", "ask", "exchange"];

export default function HomePage() {
  return (
    <>
      <Hero />
      <section id="deck" aria-labelledby="deck-heading" className="mx-auto max-w-xl scroll-mt-20 px-5">
        <h2 id="deck-heading" className="mb-5 text-center font-sans text-sm font-semibold tracking-normal text-muted-foreground">
          👉 Swipe right if you&apos;ve done it too
        </h2>
        <Suspense fallback={<ThoughtDeckSkeleton />}>
          <HomeDeck />
        </Suspense>
      </section>
      <section aria-labelledby="teasers-heading" className="mx-auto mt-24 max-w-5xl px-5">
        <h2 id="teasers-heading" className="text-center text-3xl font-normal sm:text-4xl">
          Things people <em className="text-primary">won&apos;t</em> say out loud
        </h2>
        <p className="mx-auto mt-3 max-w-md text-center text-muted-foreground">
          Real posts from real people. No names attached, ever.
        </p>
        <Suspense fallback={<div className="mt-10 h-64 animate-pulse rounded-3xl bg-muted" />}>
          <Teasers />
        </Suspense>
      </section>
      <section
        id="features"
        aria-labelledby="features-heading"
        className="mx-auto mt-24 max-w-5xl scroll-mt-20 px-5"
      >
        <h2 id="features-heading" className="mb-8 text-center text-3xl font-normal sm:text-4xl">
          Three ways to finally say it
        </h2>
        <div className="grid gap-5 md:grid-cols-3">
          {order.map((key, i) => (
            <FeatureCard key={key} featureKey={key} index={i} />
          ))}
        </div>
      </section>
      <AfterDarkBanner />
      <SafetyPromise />
    </>
  );
}

function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <DriftingConfessions />
      <div className="mx-auto max-w-3xl px-5 pt-12 pb-10 text-center sm:pt-20 sm:pb-12">
        <p className="mx-auto mb-5 inline-flex animate-fade-up items-center gap-2 rounded-full border bg-card/70 px-3.5 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur">
          <span className="size-1.5 rounded-full bg-primary" aria-hidden />
          100% anonymous · 18+ · Free
        </p>
        <h1 className="animate-fade-up text-[2.6rem] leading-[1.05] font-normal [animation-delay:60ms] sm:text-6xl">
          Go on. <em className="text-primary">Nobody will know it was you.</em>
        </h1>
        <p className="mx-auto mt-5 max-w-lg animate-fade-up text-lg text-pretty text-muted-foreground [animation-delay:120ms]">
          Anonymous confessions, awkward questions and secrets swapped with strangers.
        </p>
        <ol className="mx-auto mt-7 grid max-w-xl animate-fade-up grid-cols-3 gap-2 text-left text-xs [animation-delay:160ms] sm:gap-3 sm:text-sm">
          {[
            ["Swipe", "a stranger's confession"],
            ["See", "how many people do it too"],
            ["Sign up free", "to post your own"],
          ].map(([strong, rest], i) => (
            <li key={strong} className="rounded-2xl border bg-card/70 p-3 backdrop-blur">
              <span className="mb-1 flex size-6 items-center justify-center rounded-full bg-primary text-[0.7rem] font-semibold text-primary-foreground">
                {i + 1}
              </span>
              <span className="font-semibold text-foreground">{strong}</span>{" "}
              <span className="text-muted-foreground">{rest}</span>
            </li>
          ))}
        </ol>
        <div className="mt-8 animate-fade-up [animation-delay:220ms]">
          <HeroActions />
        </div>
      </div>
    </section>
  );
}

/** The playable deck: hand-picked openers first, then everything else. */
async function HomeDeck() {
  const featured = await getFeaturedThoughts();
  const rest = await getNextThoughts();
  const seen = new Set(featured.map((t) => t.id));
  return <ThoughtDeck initial={[...featured, ...rest.filter((t) => !seen.has(t.id))]} />;
}

/** Cut a post off mid-sentence, so you have to tap to read the rest. */
function tease(text: string) {
  const words = text.split(/\s+/);
  const keep = Math.max(4, Math.ceil(words.length * 0.55));
  return keep >= words.length ? `${text}”` : `${words.slice(0, keep).join(" ")}…`;
}

async function Teasers() {
  const curated = await getHomeTeasers();
  let items = curated.map((t) => ({
    id: t.id,
    kind: t.kind === "question" ? "Someone asked" : "Someone confessed",
    text: t.body,
    href: t.kind === "question" ? `/ask/${t.id}` : `/only-one/${t.id}`,
  }));
  if (items.length === 0) {
    // Nothing curated yet: fall back to the most relatable posts.
    const [thoughts, questions] = await Promise.all([
      getThoughtFeed({ sort: "relatable" }),
      getQuestionFeed({ sort: "top" }),
    ]);
    items = [
      ...thoughts.slice(0, 3).map((t) => ({ id: t.id, kind: "Someone confessed", text: t.body, href: `/only-one/${t.id}` })),
      ...questions.slice(0, 2).map((q) => ({ id: q.id, kind: "Someone asked", text: q.title, href: `/ask/${q.id}` })),
    ];
  }
  // Alternate confessions and questions.
  const thoughtItems = items.filter((t) => t.kind === "Someone confessed");
  const questionItems = items.filter((t) => t.kind === "Someone asked");
  const mixed = thoughtItems.flatMap((t, i) => (questionItems[i] ? [t, questionItems[i]] : [t]));

  return (
    <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {mixed.map((item) => (
        <li key={item.id}>
          <Link
            href={item.href}
            className="group relative flex h-full flex-col overflow-hidden rounded-3xl border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
          >
            <span className="text-xs font-semibold tracking-wide text-primary uppercase">{item.kind}</span>
            <span className="mt-3 flex-1 font-heading text-xl leading-snug text-pretty">“{tease(item.text)}</span>
            <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground group-hover:text-foreground">
              Tap to read <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </span>
          </Link>
        </li>
      ))}
      <li>
        <Link
          href="/after-dark"
          className="group relative flex h-full min-h-56 flex-col justify-between overflow-hidden rounded-3xl border border-primary/30 bg-[#1c1422] p-6 text-[#f4ecf7] transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/20"
        >
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide">
            <Moon className="size-3.5" aria-hidden /> After Dark · 18+
          </span>
          <span aria-hidden className="my-4 space-y-2.5 opacity-60 blur-[6px]">
            <span className="block h-5 w-full rounded-lg bg-white/30" />
            <span className="block h-5 w-4/5 rounded-lg bg-white/30" />
          </span>
          <span>
            <span className="block font-heading text-xl leading-snug">The questions people only ask at 2am.</span>
            <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-white/80 group-hover:text-white">
              Tap to enter <ArrowRight className="size-4" aria-hidden />
            </span>
          </span>
        </Link>
      </li>
    </ul>
  );
}

function AfterDarkBanner() {
  return (
    <section aria-labelledby="after-dark-heading" className="mx-auto mt-24 max-w-5xl px-5">
      <div className="relative overflow-hidden rounded-3xl bg-[#1c1422] px-6 py-12 text-center text-[#f4ecf7] sm:px-12">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-32 mx-auto h-72 max-w-xl rounded-full bg-[#8a3f9a]/40 blur-3xl"
        />
        <p className="relative inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide">
          <Moon className="size-3.5" aria-hidden /> 18+
        </p>
        <h2 id="after-dark-heading" className="relative mt-4 text-4xl font-normal sm:text-5xl">
          After <em className="text-[#e2c3ea]">Dark</em>
        </h2>
        <p className="relative mx-auto mt-3 max-w-md text-pretty text-white/75">
          Dating, sex, crushes and the things you&apos;d only admit at 2am. Ask anything. Nobody will ever know.
        </p>
        <Button asChild size="lg" className="relative mt-7 rounded-full bg-[#e2c3ea] text-[#2b1633] hover:bg-[#f0dcf5]">
          <Link href="/after-dark">
            Step inside <ArrowRight data-icon="inline-end" />
          </Link>
        </Button>
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

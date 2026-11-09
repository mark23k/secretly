import Link from "next/link";
import { getFeed } from "@/lib/queries";
import { FeedList } from "@/components/feed-list";
import { FeedTabs, parseTab } from "@/components/feed-tabs";
import { SearchBox } from "@/components/search-box";
import { CategoryChips } from "@/components/category-chips";

export default async function Home({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const tab = parseTab((await searchParams).tab);
  const feed = await getFeed({ tab });

  return (
    <div className="grid gap-5">
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-lavender-100 via-peach-100 to-mint-100 px-5 py-8 text-center sm:px-10 sm:py-12">
        <span aria-hidden className="absolute -left-1 -top-1 rotate-[-14deg] text-3xl opacity-40 sm:text-4xl">✈️</span>
        <span aria-hidden className="absolute -right-1 top-1 rotate-[12deg] text-2xl opacity-40 sm:text-3xl">🍽️</span>
        <span aria-hidden className="absolute bottom-3 left-8 rotate-[8deg] text-3xl opacity-50">🚌</span>
        <span aria-hidden className="absolute -bottom-1 right-10 rotate-[-10deg] text-4xl opacity-50">🏢</span>
        <p className="mb-2 text-xs font-extrabold uppercase tracking-widest text-lavender-600 sm:text-sm">The unwritten rules of everyday life</p>
        <h1 className="text-balance text-3xl font-black leading-tight text-ink sm:text-5xl">
          Say what everyone&apos;s thinking.
        </h1>
        <p className="mx-auto mt-3 max-w-md text-pretty text-ink-soft sm:text-lg">
          Is it rude to recline your seat? Can you eat tuna on a plane? Ask anonymously and let everyone vote.
        </p>
        <div className="mx-auto mt-5 max-w-md">
          <SearchBox />
        </div>
        <Link href="/ask" className="btn btn-primary mt-4 hidden px-6 py-3 sm:inline-flex">
          ✏️ Whisper a question
        </Link>
      </section>

      <CategoryChips />
      <FeedTabs active={tab} basePath="/" />
      <FeedList key={tab} initial={feed.items} initialHasMore={feed.hasMore} tab={tab} empty={<EmptyFeed />} />
    </div>
  );
}

function EmptyFeed() {
  return (
    <div className="note p-8 text-center">
      <p className="text-4xl">🤫</p>
      <p className="mt-2 font-extrabold">It&apos;s quiet in here…</p>
      <Link href="/ask" className="btn btn-primary mt-4 px-5 py-3">
        Whisper the first question
      </Link>
    </div>
  );
}

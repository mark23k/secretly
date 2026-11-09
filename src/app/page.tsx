import Link from "next/link";
import { getFeed } from "@/lib/queries";
import { FeedList } from "@/components/feed-list";
import { FeedTabs, parseTab } from "@/components/feed-tabs";
import { SearchBox } from "@/components/search-box";
import { CategoryChips } from "@/components/category-chips";
import { BrowseLayout } from "@/components/sidebar";

export default async function Home({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const tab = parseTab((await searchParams).tab);
  const feed = await getFeed({ tab });

  return (
    <BrowseLayout>
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-lavender-100 via-peach-100 to-mint-100 px-5 py-8 text-center sm:px-10 sm:py-12 lg:px-10 lg:py-9 lg:text-left">
        <span aria-hidden className="absolute -left-1 -top-1 rotate-[-14deg] text-3xl opacity-40 sm:text-4xl lg:hidden">✈️</span>
        <span aria-hidden className="absolute -right-1 top-1 rotate-[12deg] text-2xl opacity-40 sm:text-3xl">🍽️</span>
        <span aria-hidden className="absolute bottom-3 left-8 rotate-[8deg] text-3xl opacity-50 lg:hidden">🚌</span>
        <span aria-hidden className="absolute -bottom-1 right-10 rotate-[-10deg] text-4xl opacity-50">🏢</span>
        <div className="relative">
          <div>
            <p className="mb-2 text-xs font-extrabold uppercase tracking-widest text-lavender-600 sm:text-sm">
              The unwritten rules of everyday life
            </p>
            <h1 className="text-balance text-3xl font-black leading-tight text-ink sm:text-5xl lg:text-[2.6rem]">
              Say what everyone&apos;s thinking.
            </h1>
            <p className="mx-auto mt-3 max-w-md text-pretty text-ink-soft sm:text-lg lg:mx-0 lg:max-w-xl">
              Is it rude to recline your seat? Can you eat tuna on a plane? Ask anonymously and let everyone vote.
            </p>
          </div>
          <div className="mx-auto mt-5 grid max-w-md gap-3 lg:mx-0 lg:mt-6 lg:flex lg:max-w-none lg:items-center">
            <div className="lg:hidden">
              <SearchBox />
            </div>
            <Link href="/ask" className="btn btn-primary hidden shrink-0 px-6 py-3.5 sm:inline-flex">
              ✏️ Whisper a question
            </Link>
          </div>
        </div>
      </section>

      <CategoryChips />
      <FeedTabs active={tab} basePath="/" />
      <FeedList key={tab} initial={feed.items} initialHasMore={feed.hasMore} tab={tab} empty={<EmptyFeed />} />
    </BrowseLayout>
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

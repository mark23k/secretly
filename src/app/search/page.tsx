import Link from "next/link";
import type { Metadata } from "next";
import { getFeed } from "@/lib/queries";
import { FeedList } from "@/components/feed-list";
import { SearchBox } from "@/components/search-box";
import { BrowseLayout } from "@/components/sidebar";

export const metadata: Metadata = { title: "Search" };

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const q = ((await searchParams).q ?? "").trim().slice(0, 100);
  const feed = q ? await getFeed({ tab: "newest", query: q }) : null;

  return (
    <BrowseLayout>
      <h1 className="text-2xl font-black">Search</h1>
      <SearchBox defaultValue={q} autoFocus={!q} />
      {feed ? (
        <>
          <p className="text-sm font-bold text-ink-soft">
            Results for &ldquo;{q}&rdquo;
          </p>
          <FeedList
            key={q}
            initial={feed.items}
            initialHasMore={feed.hasMore}
            tab="newest"
            query={q}
            empty={
              <div className="note p-8 text-center">
                <p className="text-4xl">🤔</p>
                <p className="mt-2 font-extrabold">Nobody has asked that yet.</p>
                <p className="text-ink-soft">Be the one who finally says it.</p>
                <Link href="/ask" className="btn btn-primary mt-4 px-5 py-3">✏️ Whisper a question</Link>
              </div>
            }
          />
        </>
      ) : (
        <p className="text-center text-ink-soft">Search questions and answers. Try &ldquo;plane&rdquo;, &ldquo;roommate&rdquo; or &ldquo;tip&rdquo;.</p>
      )}
    </BrowseLayout>
  );
}

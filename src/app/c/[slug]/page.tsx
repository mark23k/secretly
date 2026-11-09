import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCategory } from "@/lib/constants";
import { getFeed } from "@/lib/queries";
import { FeedList } from "@/components/feed-list";
import { FeedTabs, parseTab } from "@/components/feed-tabs";
import { CategoryChips } from "@/components/category-chips";
import { BrowseLayout } from "@/components/sidebar";

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ tab?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cat = getCategory((await params).slug);
  return { title: cat ? `${cat.emoji} ${cat.name}` : "Category" };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const cat = getCategory(slug);
  if (!cat) notFound();
  const tab = parseTab((await searchParams).tab);
  const feed = await getFeed({ tab, category: slug });

  return (
    <BrowseLayout active={slug}>
      <section className="rounded-[2rem] bg-lavender-100 px-5 py-7 text-center lg:flex lg:items-center lg:gap-5 lg:px-8 lg:py-6 lg:text-left">
        <p className="text-5xl">{cat.emoji}</p>
        <div>
          <h1 className="mt-2 text-3xl font-black lg:mt-0">{cat.name}</h1>
          <p className="mt-1 text-ink-soft">The unwritten rules of {cat.name.toLowerCase()}.</p>
        </div>
      </section>
      <CategoryChips active={slug} />
      <FeedTabs active={tab} basePath={`/c/${slug}`} />
      <FeedList
        key={tab}
        initial={feed.items}
        initialHasMore={feed.hasMore}
        tab={tab}
        category={slug}
        empty={
          <div className="note p-8 text-center">
            <p className="font-extrabold">No questions here yet.</p>
            <Link href="/ask" className="btn btn-primary mt-4 px-5 py-3">✏️ Whisper the first one</Link>
          </div>
        }
      />
    </BrowseLayout>
  );
}

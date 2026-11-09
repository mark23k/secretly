import Link from "next/link";

export default function NotFound() {
  return (
    <div className="note mx-auto mt-6 max-w-md p-8 text-center">
      <p className="text-5xl">🙈</p>
      <h1 className="mt-2 text-2xl font-black">This note got lost</h1>
      <p className="mt-1 text-ink-soft">It may have been removed, or it never existed.</p>
      <Link href="/" className="btn btn-primary mt-5 px-5 py-3">Back to the feed</Link>
    </div>
  );
}

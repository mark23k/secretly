export function SearchBox({
  defaultValue = "",
  autoFocus = false,
  compact = false,
}: {
  defaultValue?: string;
  autoFocus?: boolean;
  compact?: boolean;
}) {
  return (
    <form action="/search" role="search" className="relative w-full">
      <span className={`pointer-events-none absolute top-1/2 -translate-y-1/2 ${compact ? "left-3.5 text-sm" : "left-4 text-lg"}`}>
        🔍
      </span>
      <input
        name="q"
        type="search"
        defaultValue={defaultValue}
        autoFocus={autoFocus}
        placeholder="What's been bothering you?"
        aria-label="Search questions"
        className={`field rounded-full ${compact ? "py-2 pl-10 pr-4 text-sm" : "py-3.5 pl-12 pr-4 text-base"}`}
      />
    </form>
  );
}

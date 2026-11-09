export function SearchBox({ defaultValue = "", autoFocus = false }: { defaultValue?: string; autoFocus?: boolean }) {
  return (
    <form action="/search" role="search" className="relative">
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg">🔍</span>
      <input
        name="q"
        type="search"
        defaultValue={defaultValue}
        autoFocus={autoFocus}
        placeholder="What's been bothering you?"
        aria-label="Search questions"
        className="field rounded-full py-3.5 pl-12 pr-4 text-base"
      />
    </form>
  );
}

import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="group flex items-center gap-2" aria-label="SaySecretly home">
      <span className="grid size-9 place-items-center rounded-2xl bg-lavender-200 text-xl shadow-[inset_0_-3px_0_rgba(117,82,201,0.18)] transition group-hover:rotate-[-8deg]">
        🤫
      </span>
      <span className="text-lg font-black tracking-tight text-ink">
        Say<span className="text-lavender-600">Secretly</span>
      </span>
    </Link>
  );
}

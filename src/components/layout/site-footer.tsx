import Link from "next/link";
import { Wordmark } from "@/components/brand/logo";
import { features, legalLinks, siteConfig } from "@/config/site";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/60">
      <div className="mx-auto grid max-w-5xl gap-10 px-5 py-12 sm:grid-cols-[1.5fr_1fr_1fr]">
        <div className="space-y-3">
          <Wordmark />
          <p className="max-w-xs text-sm text-muted-foreground">{siteConfig.tagline}</p>
          <p className="text-xs text-muted-foreground">
            For adults 18+ (or the minimum age in your region).
          </p>
        </div>
        <nav aria-label="Features" className="space-y-3">
          <h2 className="font-sans text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Explore
          </h2>
          <ul className="space-y-2 text-sm">
            {Object.values(features).map((f) => (
              <li key={f.href}>
                <Link href={f.href} className="hover:text-primary">
                  {f.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Legal" className="space-y-3">
          <h2 className="font-sans text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Trust
          </h2>
          <ul className="space-y-2 text-sm">
            {legalLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-primary">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="mx-auto max-w-5xl px-5 pb-10 text-xs text-muted-foreground">
        © Secretly. Everything here is anonymous.
      </div>
    </footer>
  );
}

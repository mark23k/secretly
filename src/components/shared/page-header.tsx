import { cn } from "@/lib/utils";

export function PageHeader({
  eyebrow,
  title,
  description,
  className,
  children,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className={cn("mx-auto max-w-2xl px-5 pt-12 pb-8 text-center sm:pt-16", className)}>
      {eyebrow ? (
        <p className="mb-3 text-xs font-semibold tracking-[0.14em] text-primary uppercase">{eyebrow}</p>
      ) : null}
      <h1 className="text-4xl leading-[1.08] font-normal sm:text-5xl">{title}</h1>
      {description ? (
        <p className="mx-auto mt-4 max-w-lg text-base text-pretty text-muted-foreground sm:text-lg">
          {description}
        </p>
      ) : null}
      {children}
    </header>
  );
}

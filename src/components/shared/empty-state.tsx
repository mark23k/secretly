import { cn } from "@/lib/utils";

export function EmptyState({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-3xl border border-dashed px-6 py-12 text-center", className)}>
      <p aria-hidden className="font-heading text-3xl text-primary/60 italic">
        ~
      </p>
      <h2 className="mt-2 text-2xl font-normal">{title}</h2>
      {description ? (
        <p className="mx-auto mt-2 max-w-sm text-sm text-pretty text-muted-foreground">{description}</p>
      ) : null}
      {children ? <div className="mt-6 flex flex-wrap justify-center gap-2">{children}</div> : null}
    </div>
  );
}

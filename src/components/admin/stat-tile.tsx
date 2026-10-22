import { cn } from "@/lib/utils";

export function StatTile({
  label,
  value,
  hint,
  className,
}: {
  label: string;
  value: string;
  hint?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-2xl border bg-card p-4 sm:p-5", className)}>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1.5 font-sans text-2xl font-semibold tracking-tight sm:text-3xl">{value}</p>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

export function StatGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">{children}</div>;
}

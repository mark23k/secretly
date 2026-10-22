export function ChartCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border bg-card p-4 sm:p-6">
      <h3 className="font-sans text-base font-semibold tracking-normal">{title}</h3>
      {description ? <p className="mt-0.5 text-sm text-muted-foreground">{description}</p> : null}
      <div className="mt-7">{children}</div>
    </section>
  );
}

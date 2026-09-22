import { cn } from "@/lib/utils";

export function SectionCard({
  title,
  action,
  className,
  bodyClassName,
  children,
}: {
  title?: string;
  action?: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={cn("rounded-card bg-card shadow-card-sm", className)}>
      {title ? (
        <header className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-sm font-bold text-ink">{title}</h2>
          {action}
        </header>
      ) : null}
      <div className={cn("p-5", bodyClassName)}>{children}</div>
    </section>
  );
}

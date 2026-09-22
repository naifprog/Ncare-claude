import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";

export function RequestsToolbar() {
  return (
    <div className="flex flex-col gap-3 rounded-card bg-card p-4 shadow-card-sm sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Icon
          name="search"
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
        />
        <input
          type="text"
          placeholder="Search…"
          className="w-full rounded-card border border-border bg-page py-2.5 pl-9 pr-3 text-sm text-ink placeholder:text-ink-muted focus:border-brand focus:outline-none"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <DateField label="From" />
        <DateField label="To" />
      </div>

      <Button variant="primary" className="rounded-pill sm:ml-2">
        <Icon name="plus" size={16} />
        New request
      </Button>
    </div>
  );
}

function DateField({ label }: { label: string }) {
  return (
    <label className="flex items-center gap-2 rounded-card border border-border bg-page px-3 py-2 text-xs text-ink-muted">
      {label}
      <input type="date" className="bg-transparent text-xs text-ink focus:outline-none" />
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-orange text-white">
        <Icon name="calendar" size={12} />
      </span>
    </label>
  );
}

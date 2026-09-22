import { Icon, type IconName } from "@/components/ui/Icon";

export function ComingSoon({ title, icon }: { title: string; icon: IconName }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-card bg-card py-24 text-center shadow-card-sm">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-tint-teal text-brand">
        <Icon name={icon} size={28} />
      </span>
      <div>
        <p className="text-base font-bold text-ink">{title}</p>
        <p className="mt-1 text-sm text-ink-muted">This screen is coming in the next build phase.</p>
      </div>
    </div>
  );
}

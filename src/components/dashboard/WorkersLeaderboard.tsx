import { Avatar } from "@/components/ui/Avatar";
import { Icon } from "@/components/ui/Icon";
import { Tag } from "@/components/ui/Badge";
import { SectionCard } from "@/components/ui/SectionCard";
import { cn } from "@/lib/utils";
import type { Worker } from "@/types";

export function WorkersLeaderboard({ workers }: { workers: Worker[] }) {
  return (
    <SectionCard title="Workers sort by most earnings">
      <ul className="divide-y divide-border">
        {workers.map((worker, index) => (
          <li
            key={worker.id}
            className={cn(
              "flex flex-wrap items-center gap-3 py-3 first:pt-0 last:pb-0 sm:flex-nowrap sm:gap-4",
              worker.disabled && "opacity-40",
            )}
          >
            <span className="w-4 shrink-0 text-sm font-semibold text-ink-muted">{index + 1}.</span>
            <Avatar seed={worker.avatarSeed} flag={worker.nationalityFlag} />
            <span className="min-w-[110px] flex-1 text-sm font-semibold text-ink sm:flex-none">
              {worker.name}
            </span>
            <Tag className="hidden sm:inline-flex">{worker.role}</Tag>
            <span className="ml-auto flex items-center gap-1 text-sm font-bold text-positive sm:ml-0">
              <Icon name="arrowUp" size={12} />
              {worker.earnings} SAR
            </span>
            <button
              type="button"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-brand-orange text-white transition-opacity hover:opacity-90"
              aria-label={`View ${worker.name}`}
            >
              <Icon name="arrowRight" size={16} />
            </button>
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}

import { Avatar } from "@/components/ui/Avatar";
import { Icon } from "@/components/ui/Icon";
import { Tag } from "@/components/ui/Badge";
import { PriorityBadge } from "@/components/ui/Badge";
import { SectionCard } from "@/components/ui/SectionCard";
import { cn } from "@/lib/utils";
import type { ServiceRow } from "@/types";

export function ServicesLeaderboard({ services }: { services: ServiceRow[] }) {
  return (
    <SectionCard title="Most requested services">
      <ul className="divide-y divide-border">
        {services.map((service, index) => (
          <li
            key={service.id}
            className={cn(
              "flex flex-wrap items-center gap-3 py-3 first:pt-0 last:pb-0 sm:flex-nowrap sm:gap-4",
              service.disabled && "opacity-40",
            )}
          >
            <span className="w-4 shrink-0 text-sm font-semibold text-ink-muted">{index + 1}.</span>
            <span className="min-w-[70px] flex-1 text-sm font-semibold text-ink sm:flex-none">
              {service.name}
            </span>
            <span className="flex -space-x-2">
              {service.workerAvatars.map((seed, i) => (
                <Avatar key={i} seed={seed} size={26} className="ring-2 ring-card" />
              ))}
            </span>
            <Tag className="hidden sm:inline-flex">{service.category}</Tag>
            <PriorityBadge priority={service.priority} />
            <span className="ml-auto text-sm font-bold text-info sm:ml-0">{service.price} SAR</span>
            <button
              type="button"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-info text-white transition-opacity hover:opacity-90"
              aria-label={`View ${service.name}`}
            >
              <Icon name="arrowRight" size={16} />
            </button>
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}

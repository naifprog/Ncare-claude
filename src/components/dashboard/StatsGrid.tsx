import { cn } from "@/lib/utils";
import type { StatItem } from "@/types";

/** Arch-shaped stat tiles (138×155, fully rounded top, 5px bottom corners). */
export function StatsGrid({ stats, className }: { stats: StatItem[]; className?: string }) {
  return (
    <div className={cn("grid grid-cols-2 justify-items-center gap-5 sm:flex sm:gap-[33px] sm:pl-1.5", className)}>
      {stats.map((stat) => (
        <div
          key={stat.id}
          className="flex h-[155px] w-[138px] flex-col items-center rounded-t-[69px] rounded-b-[5px] bg-page pt-[47px] text-ink shadow-card"
        >
          <span className="text-[36px] font-bold leading-none">{stat.value}</span>
          <span className="mt-[21px] text-xl leading-none">{stat.label}</span>
        </div>
      ))}
    </div>
  );
}

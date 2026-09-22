import type { StatItem } from "@/types";

export function StatsGrid({ stats }: { stats: StatItem[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.id}
          className="flex aspect-square flex-col items-center justify-center gap-1 rounded-full bg-[#f2f2f2] p-4 text-center"
        >
          <span className="text-2xl font-bold text-ink sm:text-3xl">{stat.value}</span>
          <span className="text-xs font-medium text-ink-muted sm:text-sm">{stat.label}</span>
        </div>
      ))}
    </div>
  );
}

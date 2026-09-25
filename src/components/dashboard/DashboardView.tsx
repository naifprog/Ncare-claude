import { NewRequestsPanel } from "@/components/dashboard/NewRequestsPanel";
import { ServicesLeaderboard } from "@/components/dashboard/ServicesLeaderboard";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import type { SalonRequest, ServiceRow, StatItem } from "@/types";

/**
 * Dashboard frame shared by the salon and multi-branch owner roles (designs 1, 26):
 * one white card filling the viewport under the header (20 + 80 + 10 + 20 = 130px),
 * stats, a leaderboard, most requested services and the new-requests column.
 */
export function DashboardView({
  stats,
  leaderboard,
  services,
  requests,
  basePath = "",
}: {
  stats: StatItem[];
  leaderboard: React.ReactNode;
  services: ServiceRow[];
  requests: SalonRequest[];
  /** Route prefix of the dashboard's context ("" salon, "/main" multi-branch owner). */
  basePath?: string;
}) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] overflow-hidden rounded-card bg-card shadow-card xl:h-[calc(100vh-130px)] xl:min-h-[860px] xl:grid-cols-[minmax(0,1fr)_300px] desk:grid-cols-[minmax(0,1fr)_341px]">
      <div className="flex min-h-0 min-w-0 flex-col">
        <div className="px-5 pt-5">
          <StatsGrid stats={stats} />
        </div>
        <hr className="mx-5 mt-10 border-divider" />
        {leaderboard}
        <hr className="mx-5 border-divider" />
        <ServicesLeaderboard services={services} basePath={`${basePath}/services`} />
      </div>
      <NewRequestsPanel requests={requests} />
    </div>
  );
}

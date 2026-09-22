import { AppShell } from "@/components/layout/AppShell";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { WorkersLeaderboard } from "@/components/dashboard/WorkersLeaderboard";
import { ServicesLeaderboard } from "@/components/dashboard/ServicesLeaderboard";
import { NewRequestsPanel } from "@/components/dashboard/NewRequestsPanel";
import { dashboardStats, mostRequestedServices, newRequests, workers } from "@/lib/mock-data";

export default function DashboardPage() {
  return (
    <AppShell title="Dashboard">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <StatsGrid stats={dashboardStats} />
          <WorkersLeaderboard workers={workers} />
          <ServicesLeaderboard services={mostRequestedServices} />
        </div>
        <NewRequestsPanel requests={newRequests} />
      </div>
    </AppShell>
  );
}

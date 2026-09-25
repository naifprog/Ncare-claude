import { AppShell } from "@/components/layout/AppShell";
import { DashboardView } from "@/components/dashboard/DashboardView";
import { WorkersLeaderboard } from "@/components/dashboard/WorkersLeaderboard";
import { dashboardStats, mostRequestedServices, newRequests, workers } from "@/lib/mock-data";

export default function DashboardPage() {
  return (
    <AppShell title="Dashboard">
      <DashboardView
        stats={dashboardStats}
        leaderboard={<WorkersLeaderboard workers={workers} />}
        services={mostRequestedServices}
        requests={newRequests}
      />
    </AppShell>
  );
}

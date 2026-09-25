import { AppShell } from "@/components/layout/AppShell";
import { BranchesLeaderboard } from "@/components/dashboard/BranchesLeaderboard";
import { DashboardView } from "@/components/dashboard/DashboardView";
import { mostRequestedServices } from "@/lib/mock-data";
import { mainDashboardStats, mainRequests, topBranches } from "@/lib/mock-main";

/** Main Salon UI dashboard (design 26). */
export default function MainDashboardPage() {
  return (
    <AppShell title="Dashboard" role="main">
      <DashboardView
        stats={mainDashboardStats}
        leaderboard={<BranchesLeaderboard branches={topBranches} />}
        services={mostRequestedServices}
        requests={mainRequests.new}
      />
    </AppShell>
  );
}

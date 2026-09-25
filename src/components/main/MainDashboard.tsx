"use client";

import { useAccess } from "@/components/auth/AccessProvider";
import { BranchesLeaderboard } from "@/components/dashboard/BranchesLeaderboard";
import { DashboardView } from "@/components/dashboard/DashboardView";
import { mostRequestedServices, salonServices, workerProfiles } from "@/lib/mock-data";
import { branchesByEarnings, mainRequests } from "@/lib/mock-main";
import type { StatItem } from "@/types";

/**
 * Multi-branch owner dashboard (design 26), scoped to the branches the signed-in
 * user can access: counters, leaderboard and new requests only cover those branches.
 */
export function MainDashboard() {
  const { branches, canAccessBranch } = useAccess();
  const inScope = (ids: string[] | undefined) => !!ids?.some(canAccessBranch);
  const requests = Object.values(mainRequests)
    .flat()
    .filter((r) => r.branchId && canAccessBranch(r.branchId));

  const stats: StatItem[] = [
    { id: "branches", label: "Branch", value: String(branches.length) },
    { id: "requests", label: "Requests", value: String(requests.length) },
    { id: "services", label: "Services", value: String(salonServices.filter((s) => inScope(s.branchIds)).length) },
    { id: "workers", label: "Workers", value: String(workerProfiles.filter((w) => inScope(w.branchIds)).length) },
  ];

  return (
    <DashboardView
      stats={stats}
      leaderboard={<BranchesLeaderboard branches={branchesByEarnings(branches)} />}
      services={mostRequestedServices}
      requests={requests.filter((r) => r.status === "new")}
      basePath="/main"
    />
  );
}

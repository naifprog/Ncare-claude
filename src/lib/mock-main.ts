/**
 * Mock data for the "Main Salon UI" (multi-branch owner, design screens 26–47).
 */
import {
  buildRequestDetails,
  completedRequests,
  incompleteRequests,
  newRequests,
  pendingRequests,
} from "@/lib/mock-data";
import type { RequestStatus, SalonRequest } from "@/types";

export interface Branch {
  id: string;
  num: number;
  name: string;
  /**
   * Users managing the branch. A branch may have zero, one or several managers;
   * each manager is a regular user (see `src/lib/access/directory.ts`).
   */
  managerIds: string[];
  region: string;
  earnings: number;
  earningsTrend: "up" | "down";
  address: string;
  /** Branches created recently have no activity yet (design screen 30). */
  isNew?: boolean;
  monthlyEarnings: { month: string; amount: string; trend: "up" | "down" }[];
}

const MONTHLY: Branch["monthlyEarnings"] = [
  { month: "Dec 2022", amount: "260,000", trend: "up" },
  { month: "Nov 2022", amount: "250,540", trend: "up" },
  { month: "Oct 2022", amount: "250,000", trend: "up" },
  { month: "Sep 2022", amount: "220,530", trend: "down" },
  { month: "Aug 2022", amount: "230,410", trend: "up" },
  { month: "Jul 2022", amount: "230,000", trend: "up" },
  { month: "Jun 2022", amount: "250,540", trend: "up" },
  { month: "May 2022", amount: "240,000", trend: "up" },
];

/** Manager assignments: branch 1 has two managers, the new branch 6 has none yet. */
const BRANCH_MANAGERS: string[][] = [
  ["staff-ahmed-salama", "demo-manager"],
  ["demo-manager"],
  ["staff-ahmed-salama"],
  ["staff-ahmed-salim"],
  ["staff-ahmed-salama"],
  [],
];
const EARNINGS = [1440, 1380, 1210, 990, 870, 0];
const REGIONS = ["Riyadh", "Riyadh", "Jeddah", "Riyadh", "Dammam", "Riyadh"];

export const branches: Branch[] = Array.from({ length: 6 }, (_, i) => ({
  id: `branch-${i + 1}`,
  num: 741 + i,
  name: `Bryan Salon branch ${i + 1}`,
  managerIds: BRANCH_MANAGERS[i],
  region: REGIONS[i],
  earnings: EARNINGS[i],
  earningsTrend: i === 3 ? "down" : "up",
  address: "3297 Anas Bin Malek - Al Malqa, Riyadh, Saudi Arabia.",
  isNew: i === 5,
  monthlyEarnings: i === 5 ? [] : MONTHLY,
}));

export function getBranch(id: string) {
  return branches.find((b) => b.id === id);
}

/** Leaderboard rows of design 26 ("Branches sort by most earnings"). */
export function branchesByEarnings(list: Branch[]) {
  return [...list].filter((b) => !b.isNew).sort((a, b) => b.earnings - a.earnings);
}

// ---------------------------------------------------------------------------
// Requests per branch (designs 32–36). Every active branch gets the sample
// requests of the design; the freshly created branch 6 has none yet.
// ---------------------------------------------------------------------------

function forBranch(rows: SalonRequest[], branch: Branch): SalonRequest[] {
  return rows.map((r) => ({ ...r, id: `${branch.id}-${r.id}`, branchId: branch.id, branch: branch.name }));
}

const ACTIVE_BRANCHES = branches.filter((b) => !b.isNew);
const byStatus = (rows: SalonRequest[]) => ACTIVE_BRANCHES.flatMap((b) => forBranch(rows, b));

export const mainRequests: Record<RequestStatus, SalonRequest[]> = {
  new: byStatus(newRequests),
  pending: byStatus(pendingRequests),
  completed: byStatus(completedRequests),
  incomplete: byStatus(incompleteRequests),
};

export function getMainRequestDetails(id: string) {
  const request = Object.values(mainRequests)
    .flat()
    .find((r) => r.id === id);
  return request ? buildRequestDetails(request) : undefined;
}

/** Category list of the "All Categories" screen (design 42). */
export const categoryRows = [
  { id: "cat-1", num: 451, name: "Hair" },
  { id: "cat-2", num: 451, name: "Chin" },
  { id: "cat-3", num: 451, name: "Hair" },
  { id: "cat-4", num: 451, name: "Hair" },
  { id: "cat-5", num: 451, name: "Chin" },
  { id: "cat-6", num: 451, name: "Hair" },
  { id: "cat-7", num: 451, name: "Chin" },
];

export interface PositionRow {
  id: string;
  num: number;
  name: string;
  /** Default permission preset of users holding this position. */
  presetId?: string;
}

/** Position list of the "All position" screens (designs 45, 77). */
export const positionRows: PositionRow[] = [
  { id: "pos-0", num: 450, name: "Hairdresser" },
  { id: "pos-1", num: 451, name: "Branch Manager", presetId: "branch-manager" },
  { id: "pos-2", num: 452, name: "Receptionist", presetId: "receptionist" },
  { id: "pos-3", num: 453, name: "Accountant", presetId: "accountant" },
  { id: "pos-4", num: 454, name: "Operations Manager", presetId: "operations-manager" },
  { id: "pos-5", num: 455, name: "Barber" },
  { id: "pos-6", num: 456, name: "Makeup artist" },
];

export const regions = ["Riyadh", "Jeddah", "Dammam", "Makkah", "Madinah"];

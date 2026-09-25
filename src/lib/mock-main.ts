/**
 * Mock data for the "Main Salon UI" (multi-branch owner, design screens 26–47).
 */
import {
  completedRequests,
  incompleteRequests,
  newRequests,
  pendingRequests,
} from "@/lib/mock-data";
import type { RequestStatus, SalonRequest, StatItem } from "@/types";

export interface Branch {
  id: string;
  num: number;
  name: string;
  manager: string;
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

export const branches: Branch[] = Array.from({ length: 6 }, (_, i) => ({
  id: `branch-${i + 1}`,
  num: 741 + i,
  name: `Bryan Salon branch ${i + 1}`,
  manager: "Ahmed Salama",
  region: "Riyadh",
  earnings: 1440,
  earningsTrend: "up",
  address: "3297 Anas Bin Malek - Al Malqa, Riyadh, Saudi Arabia.",
  isNew: i === 5,
  monthlyEarnings: i === 5 ? [] : MONTHLY,
}));

export function getBranch(id: string) {
  return branches.find((b) => b.id === id);
}

export const mainDashboardStats: StatItem[] = [
  { id: "branches", label: "Branch", value: "6" },
  { id: "requests", label: "Requests", value: "241" },
  { id: "services", label: "Services", value: "45" },
  { id: "workers", label: "Workers", value: "26" },
];

/** Leaderboard rows of design 26 ("Branches sort by most earnings"). */
export const topBranches = branches.slice(0, 4).map((b) => ({ ...b, manager: "Ahmed Salim" }));

function withBranch(rows: SalonRequest[]): SalonRequest[] {
  return rows.map((r, i) => ({ ...r, branch: `Bryan salon branch ${(i % 5) + 1}` }));
}

export const mainRequests: Record<RequestStatus, SalonRequest[]> = {
  new: withBranch(newRequests),
  pending: withBranch(pendingRequests),
  completed: withBranch(completedRequests),
  incomplete: withBranch(incompleteRequests),
};

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

/** Position list of the "All position" screens (designs 45, 77). */
export const positionRows = [
  { id: "pos-0", num: 450, name: "Hairdresser" },
  ...Array.from({ length: 6 }, (_, i) => ({ id: `pos-${i + 1}`, num: 451 + i, name: `position${i + 1}` })),
];

export interface PowerGroup {
  title: string;
  powers: { key: string; label: string }[];
}

/** Permission groups of "Powers of …" (designs 44, 46, 75). */
export const powerGroups: PowerGroup[] = [
  {
    title: "Requests",
    powers: [
      { key: "request.add", label: "Add new request" },
      { key: "request.delete", label: "Delete request" },
      { key: "request.edit", label: "Edit request" },
      { key: "request.accept", label: "Accept request" },
    ],
  },
  {
    title: "Workers",
    powers: [
      { key: "worker.add", label: "Add new worker" },
      { key: "worker.delete", label: "Delete worker" },
      { key: "worker.edit", label: "Edit worker" },
    ],
  },
  {
    title: "Services",
    powers: [
      { key: "service.add", label: "Add new service" },
      { key: "service.delete", label: "Delete service" },
      { key: "service.edit", label: "Edit service" },
    ],
  },
  {
    title: "Salon profile",
    powers: [
      { key: "profile.name", label: "Edit salon name" },
      { key: "profile.images", label: "Edit salon images" },
      { key: "profile.location", label: "Edit salon location" },
      { key: "profile.hours", label: "Edit time and days of work" },
    ],
  },
];

export const regions = ["Riyadh", "Jeddah", "Dammam", "Makkah", "Madinah"];

/** Branch selector labels (designs 32–40). */
export const BRANCH_TABS = Array.from({ length: 6 }, (_, i) => `Bryan salon branch ${i + 1}`);

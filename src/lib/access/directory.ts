/**
 * User directory of the demo: the design's sample users, the demo sign-in accounts
 * and a few staff members referenced as branch managers. A future backend will
 * serve the same shapes (`AdminUser`, `Branch.managerIds`, `AdminUser.branchIds`).
 */
import { ACCOUNT_TYPE_DEFS, getAccountType, sampleUsers, type AdminUser } from "@/lib/mock-admin";
import { branches, positionRows, type Branch } from "@/lib/mock-main";
import type { DashboardContext } from "@/lib/access/permissions";

/**
 * DEMO ONLY — shared password of the demo accounts below. These accounts exist so the
 * frontend can be reviewed without a backend; this is not authentication.
 */
export const DEMO_PASSWORD = "ncare123";

export interface DirectoryUser extends AdminUser {
  /** Dashboard the user signs into; defaults to the account type's context. */
  context?: DashboardContext;
}

/** Accounts that can sign in on the demo login screens (see README). */
export const DEMO_ACCOUNTS: DirectoryUser[] = [
  {
    id: "demo-salon",
    num: 750,
    username: "salon",
    name: "Bryan Salon",
    joinDate: "15 May 2022",
    accountType: "Salon",
    context: "salon",
  },
  {
    id: "demo-owner",
    num: 751,
    username: "owner",
    name: "Bryan Salon",
    joinDate: "15 May 2022",
    accountType: "Salon",
    context: "main",
    presetId: "owner",
    branchIds: "all",
  },
  {
    id: "demo-admin",
    num: 752,
    username: "admin",
    name: "Ahmed Alwaly",
    tag: "Admin",
    joinDate: "01 Jan 2022",
    accountType: "Admin",
  },
  {
    id: "demo-manager",
    num: 753,
    username: "manager",
    name: "Sara Khalid",
    tag: "Branch Manager",
    joinDate: "02 Jun 2022",
    accountType: "Branch",
    positionId: "pos-1",
    branchIds: ["branch-1", "branch-2"],
  },
  {
    id: "demo-accountant",
    num: 754,
    username: "accountant",
    name: "Omar Nasser",
    tag: "Accountant",
    joinDate: "10 Jul 2022",
    accountType: "Accountant",
    positionId: "pos-3",
  },
  {
    id: "demo-reception",
    num: 755,
    username: "reception",
    name: "Lina Saeed",
    tag: "Receptionist",
    joinDate: "21 Aug 2022",
    accountType: "Staff",
    positionId: "pos-2",
  },
];

/** Branch staff without a demo sign-in (managers of several branches). */
const STAFF: DirectoryUser[] = [
  {
    id: "staff-ahmed-salama",
    num: 756,
    name: "Ahmed Salama",
    joinDate: "15 May 2022",
    accountType: "Branch",
    positionId: "pos-1",
    branchIds: ["branch-1", "branch-3", "branch-5"],
  },
  {
    id: "staff-ahmed-salim",
    num: 757,
    name: "Ahmed Salim",
    joinDate: "03 Mar 2022",
    accountType: "Branch",
    positionId: "pos-1",
    branchIds: ["branch-4"],
  },
];

/** Every user of the platform (Super Admin → Users). */
export const directoryUsers: DirectoryUser[] = [...sampleUsers, ...DEMO_ACCOUNTS, ...STAFF];

export function getDirectoryUser(id: string) {
  return directoryUsers.find((u) => u.id === id);
}

export function contextOf(user: DirectoryUser): DashboardContext | null {
  return user.context ?? getAccountType(user.accountType)?.context ?? null;
}

export function findDemoAccount(username: string) {
  const name = username.trim().toLowerCase();
  return DEMO_ACCOUNTS.find((u) => u.username === name);
}

export function positionOf(user: DirectoryUser) {
  return positionRows.find((p) => p.id === user.positionId);
}

export function accountTypeOf(user: DirectoryUser) {
  return getAccountType(user.accountType) ?? ACCOUNT_TYPE_DEFS[0];
}

// ---------------------------------------------------------------------------
// Branch ↔ user relations (a branch may have zero, one or many managers)
// ---------------------------------------------------------------------------

export function branchManagers(branch: Branch) {
  return branch.managerIds.map(getDirectoryUser).filter((u): u is DirectoryUser => !!u);
}

/** "Manager name" cell: one name, "first +n" for several managers, "—" when none. */
export function branchManagerLabel(branch: Branch) {
  const names = branchManagers(branch).map((u) => u.name);
  if (names.length === 0) return "—";
  return names.length === 1 ? names[0] : `${names[0]} +${names.length - 1}`;
}

export function branchName(id: string) {
  return branches.find((b) => b.id === id)?.name ?? id;
}

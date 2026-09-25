/**
 * Pure access-resolution helpers (no React). The same rules can later run on the
 * backend; in this phase they only drive what the frontend shows.
 */
import {
  accountTypeOf,
  contextOf,
  getDirectoryUser,
  positionOf,
  type DirectoryUser,
} from "@/lib/access/directory";
import {
  BRANCH_SCOPED_PERMISSIONS,
  getPreset,
  type DashboardContext,
  type Permission,
} from "@/lib/access/permissions";
import { branches } from "@/lib/mock-main";
import { NAV, ROLE_HOME, type NavItem } from "@/lib/roles";

/** Session-only edits made in the powers / user screens (never persisted). */
export interface AccessOverrides {
  users: Record<string, { permissions?: Permission[]; branchIds?: string[] | "all"; positionId?: string }>;
  /** "Branches powers": what delegated staff may do inside a branch. */
  branches: Record<string, Permission[]>;
  positions: Record<string, Permission[]>;
  accountTypes: Record<string, Permission[]>;
}

export const EMPTY_OVERRIDES: AccessOverrides = { users: {}, branches: {}, positions: {}, accountTypes: {} };

export interface ResolvedUser {
  id: string;
  name: string;
  tag?: string;
  accountType: string;
  positionId?: string;
  context: DashboardContext;
  permissions: ReadonlySet<Permission>;
  /** "all" = every branch of the salon (owner); otherwise the assigned branch ids. */
  branchIds: string[] | "all";
}

export function positionPermissions(positionId: string | undefined, overrides: AccessOverrides) {
  if (!positionId) return undefined;
  const position = positionOf({ positionId } as DirectoryUser);
  return overrides.positions[positionId] ?? getPreset(position?.presetId)?.permissions;
}

export function accountTypePermissions(accountType: string, overrides: AccessOverrides) {
  const type = accountTypeOf({ accountType } as DirectoryUser);
  return overrides.accountTypes[type.name] ?? getPreset(type.presetId)?.permissions ?? [];
}

/**
 * Effective permissions of a user: individual permissions win, then the user's own
 * preset, the position's preset, and finally the account type's preset.
 */
export function userPermissions(user: DirectoryUser, overrides: AccessOverrides): Permission[] {
  const own = overrides.users[user.id];
  const positionId = own?.positionId ?? user.positionId;
  return (
    own?.permissions ??
    user.permissions ??
    getPreset(user.presetId)?.permissions ??
    positionPermissions(positionId, overrides) ??
    accountTypePermissions(user.accountType, overrides)
  );
}

export function userBranchIds(user: DirectoryUser, overrides: AccessOverrides): string[] | "all" {
  return overrides.users[user.id]?.branchIds ?? user.branchIds ?? "all";
}

export function resolveUser(id: string, overrides: AccessOverrides): ResolvedUser | null {
  const user = getDirectoryUser(id);
  const context = user ? contextOf(user) : null;
  if (!user || !context) return null;
  return {
    id: user.id,
    name: user.name,
    tag: user.tag,
    accountType: user.accountType,
    positionId: overrides.users[user.id]?.positionId ?? user.positionId,
    context,
    permissions: new Set(userPermissions(user, overrides)),
    branchIds: userBranchIds(user, overrides),
  };
}

export function branchPowers(branchId: string, overrides: AccessOverrides): Permission[] {
  return overrides.branches[branchId] ?? BRANCH_SCOPED_PERMISSIONS;
}

export function canAccessBranch(user: ResolvedUser, branchId: string) {
  return user.branchIds === "all" || user.branchIds.includes(branchId);
}

export function accessibleBranches(user: ResolvedUser) {
  return branches.filter((b) => canAccessBranch(user, b.id));
}

/**
 * Permission check. With a `branchId`, users limited to specific branches must also
 * be assigned to that branch, and the branch's powers must allow the action.
 * Owners with access to all branches are not limited by branch powers.
 */
export function hasPermission(
  user: ResolvedUser,
  permission: Permission,
  overrides: AccessOverrides,
  branchId?: string,
) {
  if (!user.permissions.has(permission)) return false;
  if (!branchId || user.branchIds === "all") return true;
  if (!canAccessBranch(user, branchId)) return false;
  return !BRANCH_SCOPED_PERMISSIONS.includes(permission) || branchPowers(branchId, overrides).includes(permission);
}

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

export function contextOfPath(pathname: string): DashboardContext | null {
  if (pathname === "/login" || pathname === "/admin/login") return null;
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return "admin";
  if (pathname === "/main" || pathname.startsWith("/main/")) return "main";
  return "salon";
}

export function loginPathFor(context: DashboardContext) {
  return context === "admin" ? "/admin/login" : "/login";
}

/** `*` matches one path segment (an id). First matching rule wins; `null` = any signed-in user. */
type Rule = [pattern: string, permission: Permission | null];

const crud = (base: string, area: "requests" | "workers" | "services"): Rule[] => [
  [`${base}/add`, `${area}.add`],
  [`${base}/*/edit`, `${area}.edit`],
  [`${base}/*`, `${area}.view`],
  [base, `${area}.view`],
];

const RULES: Record<DashboardContext, Rule[]> = {
  salon: [
    ["/", "dashboard.view"],
    ...crud("/requests", "requests"),
    ...crud("/workers", "workers"),
    ...crud("/services", "services"),
    ["/settings/password", null],
    ["/settings", "settings.view"],
  ],
  main: [
    ["/main", "dashboard.view"],
    ["/main/branches/add", "branches.add"],
    ["/main/branches/*/edit", "branches.edit"],
    ["/main/branches/*", "branches.view"],
    ["/main/branches", "branches.view"],
    ...crud("/main/requests", "requests"),
    ...crud("/main/workers", "workers"),
    ["/main/services/categories", "services.categories"],
    ...crud("/main/services", "services"),
    ["/main/powers/positions/*", "powers.manage"],
    ["/main/powers/positions", "powers.view"],
    ["/main/powers/*", "branches.powers"],
    ["/main/powers", "branches.powers"],
    ["/main/settings/password", null],
    ["/main/settings", null],
  ],
  admin: [
    ["/admin", "dashboard.view"],
    ["/admin/users/add", "users.add"],
    ["/admin/users/*/edit", "users.edit"],
    ["/admin/users/*/password", "users.password"],
    ["/admin/users/*", "users.view"],
    ["/admin/users", "users.view"],
    ["/admin/salons/branches", "branches.view"],
    ...crud("/admin/salons/requests", "requests"),
    ...crud("/admin/salons/services", "services"),
    ...crud("/admin/salons/workers", "workers"),
    ["/admin/salons", "salons.view"],
    ["/admin/accounting/bills", "accounting.bills"],
    ["/admin/accounting/wallet", "accounting.wallet"],
    ["/admin/accounting/vat", "accounting.vat"],
    ["/admin/accounting/discount-codes/add", "accounting.discountCodes"],
    ["/admin/accounting/discount-codes/*/edit", "accounting.discountCodes"],
    ["/admin/accounting/discount-codes", "accounting.discountCodes"],
    ["/admin/accounting", "accounting.view"],
    ["/admin/ads/add", "ads.manage"],
    ["/admin/ads", "ads.view"],
    ["/admin/reports", "reports.view"],
    ["/admin/powers/add", "powers.manage"],
    ["/admin/powers", "powers.view"],
    ["/admin/messages/new", "messages.send"],
    ["/admin/messages", "messages.view"],
    ["/admin/notifications", "notifications.view"],
    ["/admin/settings/password", null],
    ["/admin/settings/account-types", "settings.view"],
    ["/admin/settings/positions", "settings.view"],
    ["/admin/settings", "settings.view"],
  ],
};

function matches(pattern: string, path: string) {
  const a = pattern.split("/").filter(Boolean);
  const b = path.split("/").filter(Boolean);
  return a.length === b.length && a.every((seg, i) => seg === "*" || seg === b[i]);
}

/** Permission required by a dashboard path (`undefined` when no rule applies). */
export function permissionForPath(pathname: string): Permission | null | undefined {
  const context = contextOfPath(pathname);
  if (!context) return null;
  const path = pathname.split(/[?#]/)[0].replace(/\/$/, "") || "/";
  return RULES[context].find(([pattern]) => matches(pattern, path))?.[1];
}

export function canAccessPath(user: ResolvedUser, href: string) {
  const path = href.split(/[?#]/)[0];
  if (contextOfPath(path) !== user.context) return false;
  const permission = permissionForPath(path);
  return permission == null || user.permissions.has(permission);
}

/** Navigation of the user's dashboard with inaccessible sections and links removed. */
export function navFor(user: ResolvedUser): NavItem[] {
  return NAV[user.context].flatMap((item) => {
    const children = item.children?.filter((c) => canAccessPath(user, c.href));
    const own = canAccessPath(user, item.href);
    if (!own && !children?.length) return [];
    return [{ ...item, href: own ? item.href : children![0].href, children: children?.length ? children : undefined }];
  });
}

/** Landing page after sign-in: the dashboard, or the first page the user may open. */
export function homeFor(user: ResolvedUser) {
  const home = ROLE_HOME[user.context];
  if (canAccessPath(user, home)) return home;
  const first = navFor(user)[0];
  return first?.children?.[0]?.href ?? first?.href ?? `${home === "/" ? "" : home}/settings/password`;
}

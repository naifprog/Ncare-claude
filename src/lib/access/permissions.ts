/**
 * Permission catalog of the Ncare dashboard (frontend / demo model).
 *
 * Permissions are plain string keys so a future backend can store them as-is
 * (e.g. a `user_permissions` table) and enforce the same checks server-side.
 * Nothing here is a security boundary: the frontend only hides what the
 * current demo user may not use.
 */
import type { Role } from "@/lib/roles";

/** Dashboard context = which dashboard (route prefix) a user works in. */
export type DashboardContext = Role;

export const PERMISSION_GROUPS = [
  {
    id: "dashboard",
    title: "Dashboard",
    contexts: ["salon", "main", "admin"],
    permissions: [{ key: "dashboard.view", label: "View dashboard" }],
  },
  {
    id: "requests",
    title: "Requests",
    contexts: ["salon", "main", "admin"],
    // The first four are the toggles drawn in the design (44, 46, 75).
    permissions: [
      { key: "requests.add", label: "Add new request" },
      { key: "requests.delete", label: "Delete request" },
      { key: "requests.edit", label: "Edit request" },
      { key: "requests.accept", label: "Accept request" },
      { key: "requests.view", label: "View requests" },
      { key: "requests.print", label: "Print request bill" },
    ],
  },
  {
    id: "workers",
    title: "Workers",
    contexts: ["salon", "main", "admin"],
    permissions: [
      { key: "workers.add", label: "Add new worker" },
      { key: "workers.delete", label: "Delete worker" },
      { key: "workers.edit", label: "Edit worker" },
      { key: "workers.view", label: "View workers" },
      { key: "workers.documents", label: "Manage worker documents" },
    ],
  },
  {
    id: "services",
    title: "Services",
    contexts: ["salon", "main", "admin"],
    permissions: [
      { key: "services.add", label: "Add new service" },
      { key: "services.delete", label: "Delete service" },
      { key: "services.edit", label: "Edit service" },
      { key: "services.view", label: "View services" },
      { key: "services.categories", label: "Manage service categories" },
    ],
  },
  {
    id: "profile",
    title: "Salon profile",
    contexts: ["salon", "main"],
    permissions: [
      { key: "settings.profileName", label: "Edit salon name" },
      { key: "settings.profileImages", label: "Edit salon images" },
      { key: "settings.profileLocation", label: "Edit salon location" },
      { key: "settings.profileHours", label: "Edit time and days of work" },
      { key: "settings.view", label: "View salon profile" },
    ],
  },
  {
    id: "branches",
    title: "Branches",
    contexts: ["main", "admin"],
    permissions: [
      { key: "branches.view", label: "View branches" },
      { key: "branches.add", label: "Add new branch" },
      { key: "branches.edit", label: "Edit branch" },
      { key: "branches.delete", label: "Delete branch" },
      { key: "branches.users", label: "Manage branch users" },
      { key: "branches.managers", label: "Manage branch managers" },
      { key: "branches.powers", label: "Manage branch powers" },
    ],
  },
  {
    id: "salons",
    title: "Salons",
    contexts: ["admin"],
    permissions: [
      { key: "salons.view", label: "View salons" },
      { key: "salons.manage", label: "Add / edit / delete salons" },
    ],
  },
  {
    id: "users",
    title: "Users",
    contexts: ["admin"],
    permissions: [
      { key: "users.view", label: "View users" },
      { key: "users.add", label: "Add new user" },
      { key: "users.edit", label: "Edit user" },
      { key: "users.delete", label: "Delete user" },
      { key: "users.deactivate", label: "Deactivate user" },
      { key: "users.password", label: "Change user password" },
      { key: "users.assignAccountType", label: "Assign account type" },
      { key: "users.assignPosition", label: "Assign position" },
      { key: "users.assignPermissions", label: "Assign permissions" },
      { key: "users.assignBranches", label: "Assign branch access" },
    ],
  },
  {
    id: "accounting",
    title: "Accounting",
    contexts: ["admin"],
    permissions: [
      { key: "accounting.view", label: "View accounting summary" },
      { key: "accounting.bills", label: "View bills" },
      { key: "accounting.billsExport", label: "Download / print bills" },
      { key: "accounting.wallet", label: "Wallet access" },
      { key: "accounting.vat", label: "VAT access" },
      { key: "accounting.discountCodes", label: "Discount codes" },
    ],
  },
  {
    id: "reports",
    title: "Reports",
    contexts: ["admin"],
    permissions: [
      { key: "reports.view", label: "View reports" },
      { key: "reports.export", label: "Export / download reports" },
    ],
  },
  {
    id: "messages",
    title: "Messages",
    contexts: ["salon", "main", "admin"],
    permissions: [
      { key: "messages.view", label: "View messages" },
      { key: "messages.send", label: "Send messages" },
    ],
  },
  {
    id: "notifications",
    title: "Notifications",
    contexts: ["salon", "main", "admin"],
    permissions: [
      { key: "notifications.view", label: "View notifications" },
      { key: "notifications.send", label: "Create / send notifications" },
    ],
  },
  {
    id: "ads",
    title: "Ads",
    contexts: ["admin"],
    permissions: [
      { key: "ads.view", label: "View ads" },
      { key: "ads.manage", label: "Manage ads" },
    ],
  },
  {
    id: "settings",
    title: "Settings",
    contexts: ["admin"],
    permissions: [
      { key: "settings.view", label: "View settings" },
      { key: "settings.edit", label: "Edit account types & positions" },
    ],
  },
  {
    id: "powers",
    title: "Powers",
    contexts: ["main", "admin"],
    permissions: [
      { key: "powers.view", label: "View powers" },
      { key: "powers.manage", label: "Manage powers" },
    ],
  },
] as const satisfies readonly {
  id: string;
  title: string;
  contexts: readonly DashboardContext[];
  permissions: readonly { key: string; label: string }[];
}[];

export type Permission = (typeof PERMISSION_GROUPS)[number]["permissions"][number]["key"];

export interface PowerGroup {
  title: string;
  powers: { key: Permission; label: string }[];
}

export const ALL_PERMISSIONS: Permission[] = [
  ...new Set(PERMISSION_GROUPS.flatMap((g) => g.permissions.map((p) => p.key))),
];

/**
 * The toggles drawn in the design's powers screens (designs 44, 46, 75). These are also
 * the permissions a branch can limit ("Branches powers"): a branch cap only restricts
 * users whose access is limited to specific branches, never the owner.
 */
export const BRANCH_SCOPED_PERMISSIONS: Permission[] = [
  "requests.add",
  "requests.delete",
  "requests.edit",
  "requests.accept",
  "workers.add",
  "workers.delete",
  "workers.edit",
  "services.add",
  "services.delete",
  "services.edit",
  "settings.profileName",
  "settings.profileImages",
  "settings.profileLocation",
  "settings.profileHours",
];

/**
 * Permission groups offered by a powers editor for a dashboard context.
 * `designOnly` keeps just the design's toggles (branch powers, designs 44, 46).
 */
export function powerGroupsFor(context: DashboardContext, { designOnly = false } = {}): PowerGroup[] {
  return PERMISSION_GROUPS.filter(
    (g) =>
      (g.contexts as readonly DashboardContext[]).includes(context) &&
      // Settings exists twice (salon profile vs. admin settings); keep one per context.
      !(g.id === "settings" && context !== "admin") &&
      !(g.id === "profile" && context === "admin"),
  )
    .map((g) => ({
      title: g.title,
      powers: g.permissions
        .filter((p) => !designOnly || BRANCH_SCOPED_PERMISSIONS.includes(p.key))
        .map((p) => ({ key: p.key, label: p.label })),
    }))
    .filter((g) => g.powers.length > 0);
}

// ---------------------------------------------------------------------------
// Presets: reusable permission bundles (a "role"). Account types and positions
// point at a preset; users get a copy they can then fine-tune individually.
// ---------------------------------------------------------------------------

export interface PermissionPreset {
  id: string;
  name: string;
  context: DashboardContext;
  permissions: Permission[];
}

const allOf = (...groupIds: string[]): Permission[] =>
  PERMISSION_GROUPS.filter((g) => groupIds.includes(g.id)).flatMap((g) => g.permissions.map((p) => p.key));

const COMMS: Permission[] = ["messages.view", "messages.send", "notifications.view"];

export const PERMISSION_PRESETS: PermissionPreset[] = [
  {
    id: "salon-manager",
    name: "Salon manager",
    context: "salon",
    permissions: ["dashboard.view", ...allOf("requests", "workers", "services", "profile"), ...COMMS],
  },
  {
    id: "owner",
    name: "Salon owner (all branches)",
    context: "main",
    permissions: [
      "dashboard.view",
      ...allOf("requests", "workers", "services", "profile", "branches", "powers"),
      ...COMMS,
    ],
  },
  {
    id: "branch-manager",
    name: "Branch manager",
    context: "main",
    permissions: [
      "dashboard.view",
      ...allOf("requests", "workers"),
      "services.view",
      "services.add",
      "services.edit",
      "branches.view",
      "settings.view",
      "settings.profileHours",
      ...COMMS,
    ],
  },
  {
    id: "operations-manager",
    name: "Operations manager",
    context: "main",
    permissions: [
      "dashboard.view",
      ...allOf("requests", "workers", "services"),
      "branches.view",
      "branches.edit",
      "settings.view",
      "settings.profileHours",
      ...COMMS,
    ],
  },
  {
    id: "receptionist",
    name: "Receptionist",
    context: "salon",
    permissions: [
      "dashboard.view",
      "requests.view",
      "requests.add",
      "requests.accept",
      "requests.print",
      "workers.view",
      "services.view",
      ...COMMS,
    ],
  },
  {
    id: "super-admin",
    name: "Super admin",
    context: "admin",
    permissions: ALL_PERMISSIONS.filter((p) => !p.startsWith("settings.profile")),
  },
  {
    id: "accountant",
    name: "Accountant",
    context: "admin",
    permissions: ["dashboard.view", ...allOf("accounting", "reports"), ...COMMS],
  },
  {
    id: "data-entry",
    name: "Data entry",
    context: "admin",
    permissions: [
      "dashboard.view",
      "users.view",
      "users.add",
      "users.edit",
      "salons.view",
      "branches.view",
      "requests.view",
      "requests.add",
      "requests.edit",
      "services.view",
      "services.add",
      "services.edit",
      "workers.view",
      "workers.add",
      "workers.edit",
      "workers.documents",
      ...COMMS,
    ],
  },
  {
    id: "marketer",
    name: "Marketer",
    context: "admin",
    permissions: ["dashboard.view", ...allOf("ads"), "reports.view", ...COMMS, "notifications.send"],
  },
];

export function getPreset(id: string | undefined) {
  return PERMISSION_PRESETS.find((p) => p.id === id);
}

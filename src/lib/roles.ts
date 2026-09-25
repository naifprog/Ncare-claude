/**
 * The three dashboards of the design file ("Sub Salon UI", "Main Salon UI",
 * "Super Admin"). Each role lives under its own route prefix.
 */
export type Role = "salon" | "main" | "admin";

export type NavIconName =
  | "dashboard"
  | "requests"
  | "workers"
  | "services"
  | "settings"
  | "branches"
  | "powers"
  | "users"
  | "salons"
  | "wallet"
  | "ads"
  | "reports";

export interface NavItem {
  label: string;
  href: string;
  icon: NavIconName;
  children?: { label: string; href: string }[];
}

export const ROLE_HOME: Record<Role, string> = {
  salon: "/",
  main: "/main",
  admin: "/admin",
};

export const ROLE_LOGIN: Record<Role, string> = {
  salon: "/login",
  main: "/login?next=/main",
  admin: "/admin/login",
};

export const ROLE_USER: Record<Role, { name: string; tag?: string }> = {
  salon: { name: "Bryan Salon" },
  main: { name: "Bryan Salon" },
  admin: { name: "Ahmed Alwaly", tag: "Admin" },
};

export const NAV: Record<Role, NavItem[]> = {
  // Sub Salon UI (design screens 1–24)
  salon: [
    { label: "Dashboard", href: "/", icon: "dashboard" },
    {
      label: "Requests",
      href: "/requests",
      icon: "requests",
      children: [
        { label: "All requests", href: "/requests" },
        { label: "Add request", href: "/requests/add" },
      ],
    },
    {
      label: "Workers",
      href: "/workers",
      icon: "workers",
      children: [
        { label: "All workers", href: "/workers" },
        { label: "Add worker", href: "/workers/add" },
      ],
    },
    {
      label: "Services",
      href: "/services",
      icon: "services",
      children: [
        { label: "All services", href: "/services" },
        { label: "Add service", href: "/services/add" },
      ],
    },
    {
      label: "Salon Settings",
      href: "/settings",
      icon: "settings",
      children: [
        { label: "Profile salon", href: "/settings" },
        { label: "Change password", href: "/settings/password" },
      ],
    },
  ],

  // Main Salon UI — multi-branch owner (design screens 26–47)
  main: [
    { label: "Dashboard", href: "/main", icon: "dashboard" },
    {
      label: "Branches",
      href: "/main/branches",
      icon: "branches",
      children: [
        { label: "All Branches", href: "/main/branches" },
        { label: "Add Branch", href: "/main/branches/add" },
      ],
    },
    {
      label: "Requests",
      href: "/main/requests",
      icon: "requests",
      children: [
        { label: "All requests", href: "/main/requests" },
        { label: "Add request", href: "/main/requests/add" },
      ],
    },
    {
      label: "Workers",
      href: "/main/workers",
      icon: "workers",
      children: [
        { label: "All workers", href: "/main/workers" },
        { label: "Add worker", href: "/main/workers/add" },
      ],
    },
    {
      label: "Services",
      href: "/main/services",
      icon: "services",
      children: [
        { label: "All services", href: "/main/services" },
        { label: "Add service", href: "/main/services/add" },
        { label: "All Categories", href: "/main/services/categories" },
      ],
    },
    {
      label: "Powers",
      href: "/main/powers",
      icon: "powers",
      children: [
        { label: "Branches powers", href: "/main/powers" },
        { label: "All position", href: "/main/powers/positions" },
      ],
    },
    {
      label: "Settings",
      href: "/main/settings",
      icon: "settings",
      children: [{ label: "Change password", href: "/main/settings/password" }],
    },
  ],

  // Super Admin (design screens 49–91)
  admin: [
    { label: "Dashboard", href: "/admin", icon: "dashboard" },
    {
      label: "Users",
      href: "/admin/users",
      icon: "users",
      children: [
        { label: "All Users", href: "/admin/users" },
        { label: "Add User", href: "/admin/users/add" },
      ],
    },
    {
      label: "Salons",
      href: "/admin/salons",
      icon: "salons",
      children: [
        { label: "All Salons", href: "/admin/salons" },
        { label: "Branches", href: "/admin/salons/branches" },
        { label: "Services", href: "/admin/salons/services" },
        { label: "Workers", href: "/admin/salons/workers" },
        { label: "Requests", href: "/admin/salons/requests" },
      ],
    },
    {
      label: "Accounting",
      href: "/admin/accounting",
      icon: "wallet",
      children: [
        { label: "Summary", href: "/admin/accounting" },
        { label: "Wallet", href: "/admin/accounting/wallet" },
        { label: "Bills", href: "/admin/accounting/bills" },
        { label: "VAT", href: "/admin/accounting/vat" },
        { label: "Discount codes", href: "/admin/accounting/discount-codes" },
      ],
    },
    {
      label: "Ads",
      href: "/admin/ads",
      icon: "ads",
      children: [
        { label: "All Ads", href: "/admin/ads" },
        { label: "Add Ad", href: "/admin/ads/add" },
      ],
    },
    { label: "Reports", href: "/admin/reports", icon: "reports" },
    {
      label: "Powers",
      href: "/admin/powers",
      icon: "powers",
      children: [
        { label: "All Powers", href: "/admin/powers" },
        { label: "Add power", href: "/admin/powers/add" },
      ],
    },
    {
      label: "Settings",
      href: "/admin/settings",
      icon: "settings",
      children: [
        { label: "Accounts type", href: "/admin/settings/account-types" },
        { label: "Positions", href: "/admin/settings/positions" },
        { label: "Change password", href: "/admin/settings/password" },
      ],
    },
  ],
};

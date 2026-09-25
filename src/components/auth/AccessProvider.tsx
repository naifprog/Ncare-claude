"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useMemo } from "react";
import {
  accessibleBranches,
  canAccessBranch,
  canAccessPath,
  hasPermission,
  homeFor,
  loginPathFor,
  navFor,
  resolveUser,
  type AccessOverrides,
  type ResolvedUser,
} from "@/lib/access/access";
import type { DashboardContext, Permission } from "@/lib/access/permissions";
import { dismissToast, isSignedOutByUser, useAccessOverrides, useSessionUserId, useToasts } from "@/lib/demo-state";
import type { Branch } from "@/lib/mock-main";

export interface Access {
  user: ResolvedUser;
  overrides: AccessOverrides;
  /** Frontend-only check: hides UI, it does not secure anything. */
  can: (permission: Permission, branchId?: string) => boolean;
  canAccessPath: (href: string) => boolean;
  canAccessBranch: (branchId: string) => boolean;
  /** Branches the user may see (all of the salon's for owners). */
  branches: Branch[];
  home: string;
}

const AccessContext = createContext<Access | null>(null);

export function useAccess(): Access {
  const access = useContext(AccessContext);
  if (!access) throw new Error("useAccess must be used inside <AccessBoundary>");
  return access;
}

/**
 * Wraps every dashboard page: resolves the demo session, sends visitors without a
 * session to the login screen and users of another dashboard context to their own
 * home. Demo behaviour only — real authorization will live on the backend.
 */
export function AccessBoundary({ context, children }: { context: DashboardContext; children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const userId = useSessionUserId();
  const overrides = useAccessOverrides();

  const access = useMemo<Access | null>(() => {
    const user = userId ? resolveUser(userId, overrides) : null;
    if (!user) return null;
    return {
      user,
      overrides,
      can: (permission, branchId) => hasPermission(user, permission, overrides, branchId),
      canAccessPath: (href) => canAccessPath(user, href),
      canAccessBranch: (branchId) => canAccessBranch(user, branchId),
      branches: accessibleBranches(user),
      home: homeFor(user),
    };
  }, [userId, overrides]);

  const redirect =
    userId === undefined
      ? null
      : !access
        ? isSignedOutByUser()
          ? loginPathFor(context)
          : `${loginPathFor(context)}?next=${encodeURIComponent(pathname)}`
        : access.user.context !== context
          ? access.home
          : null;

  useEffect(() => {
    if (redirect) router.replace(redirect);
  }, [redirect, router]);

  if (!access || redirect) return <div className="min-h-screen bg-page" aria-busy="true" />;

  return (
    <AccessContext.Provider value={access}>
      {children}
      <Toaster />
    </AccessContext.Provider>
  );
}

/** Shows the page only when the user's permissions include it (direct URL visits included). */
export function RouteGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { canAccessPath } = useAccess();
  return canAccessPath(pathname) ? children : <NoAccess />;
}

/** Branch-scoped record (multi-branch owner): visible when one of its branches is assigned to the user. */
export function BranchScope({ branchIds, children }: { branchIds: string[] | undefined; children: React.ReactNode }) {
  const { user, canAccessBranch } = useAccess();
  const visible = user.branchIds === "all" || !branchIds || branchIds.some(canAccessBranch);
  return visible ? children : <NoAccess message="This record belongs to a branch you are not assigned to." />;
}

export function NoAccess({ message = "Your account does not have permission to open this page." }: { message?: string }) {
  const { home } = useAccess();
  return (
    <section className="flex min-h-[320px] flex-col items-center justify-center gap-4 rounded-card bg-card px-6 py-16 text-center shadow-card">
      <h2 className="text-[22px] text-ink">No access</h2>
      <p className="max-w-[420px] text-sm text-ink-muted">{message}</p>
      <Link
        href={home}
        className="inline-flex h-[50px] items-center justify-center rounded-pill bg-brand px-10 text-[15px] font-bold text-white shadow-card"
      >
        Go to my dashboard
      </Link>
    </section>
  );
}

/** Nav items / actions helper: the navigation of the current user. */
export function useNav() {
  const { user } = useAccess();
  return useMemo(() => navFor(user), [user]);
}

function Toaster() {
  const toasts = useToasts();
  if (toasts.length === 0) return null;
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-[70] flex flex-col items-center gap-2 px-4" aria-live="polite">
      {toasts.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => dismissToast(t.id)}
          className="pointer-events-auto max-w-[520px] rounded-[5px] bg-ink px-5 py-3 text-left text-sm text-white shadow-card-lg"
        >
          {t.message}
        </button>
      ))}
    </div>
  );
}

export interface BranchChoice {
  value: string;
  label: string;
}

/**
 * Branch field options of a form: a fixed list (super admin), or "accessible" for the
 * multi-branch owner's branches the user is assigned to.
 */
export function useBranchOptions(branches: BranchChoice[] | "accessible" | undefined): BranchChoice[] | undefined {
  const { branches: mine } = useAccess();
  if (branches !== "accessible") return branches;
  return mine.map((b) => ({ value: b.id, label: b.name }));
}

/** Keeps a preselected branch only when it is one of the offered options. */
export function pickBranch(options: BranchChoice[], value: string | undefined) {
  return options.some((o) => o.value === value) ? value : undefined;
}

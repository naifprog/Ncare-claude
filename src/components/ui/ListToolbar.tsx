"use client";

import Link from "next/link";
import { useAccess } from "@/components/auth/AccessProvider";

/**
 * Search pill + 175×50 "New …" button above the Workers / Services tables (design 15, 19).
 * The button is left out when the user may not open its target.
 */
export function ListToolbar({
  query,
  onQueryChange,
  actionLabel,
  actionHref,
  middle,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  actionLabel: string;
  actionHref?: string;
  /** Extra control between search and the button (e.g. "All Salons", design 65). */
  middle?: React.ReactNode;
}) {
  const { canAccessPath } = useAccess();
  const showAction = !!actionHref && canAccessPath(actionHref);
  return (
    <div className="flex flex-col gap-[22px] sm:flex-row sm:items-center">
      <input
        type="search"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="Search .."
        aria-label="Search"
        className="h-[50px] min-w-0 shrink-0 rounded-pill sm:flex-1 bg-page px-[30px] text-sm text-ink placeholder:text-[#aeaeae] focus:outline focus:outline-brand"
      />
      {middle}
      {showAction && (
      <Link
        href={actionHref}
        className="inline-flex h-[50px] shrink-0 items-center justify-center rounded-pill bg-brand text-[15px] font-bold text-white shadow-card transition-colors hover:bg-brand/90 sm:w-[175px]"
      >
        {actionLabel}
      </Link>
      )}
    </div>
  );
}

/** Full-height white list card shared by the Workers and Services lists. */
export function ListCard({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex flex-col rounded-card bg-card px-4 pb-[7px] pt-5 shadow-card sm:px-[30px] xl:min-h-[calc(100vh-151px)]">
      {children}
    </section>
  );
}

/** Plain wrapper used when a list is embedded in another card. */
export function EmbeddedFrame({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col">{children}</div>;
}

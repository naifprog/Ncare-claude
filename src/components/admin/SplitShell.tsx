"use client";

import { useState } from "react";
import { AccessBoundary, RouteGuard } from "@/components/auth/AccessProvider";
import { Sidebar } from "@/components/layout/Sidebar";
import { Icon } from "@/components/ui/Icon";

/**
 * Full-screen two-column layout of the admin messages / notifications pages (designs 82–86):
 * no header or fixed sidebar; the orange menu button opens the navigation drawer.
 */
export function SplitShell({
  title,
  action,
  list,
  children,
}: {
  title: React.ReactNode;
  action?: React.ReactNode;
  list: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <AccessBoundary context="admin">
      <RouteGuard>
        <SplitLayout title={title} action={action} list={list}>
          {children}
        </SplitLayout>
      </RouteGuard>
    </AccessBoundary>
  );
}

function SplitLayout({
  title,
  action,
  list,
  children,
}: {
  title: React.ReactNode;
  action?: React.ReactNode;
  list: React.ReactNode;
  children: React.ReactNode;
}) {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col bg-page lg:h-screen lg:flex-row">
      <aside className="flex min-h-0 flex-col bg-card px-5 pt-5 lg:w-[470px] lg:shrink-0">
        <div className="flex h-[50px] shrink-0 items-center gap-5">
          <button
            type="button"
            onClick={() => setNavOpen(true)}
            aria-label="Open menu"
            className="flex h-10 w-10 items-center justify-center rounded-[5px] bg-brand-orange text-white"
          >
            <Icon name="menu" size={22} />
          </button>
          <h1 className="flex-1 text-base text-ink">{title}</h1>
          {action}
        </div>
        <div className="mt-2.5 flex min-h-0 flex-1 flex-col">{list}</div>
      </aside>

      <main className="min-h-0 min-w-0 flex-1 p-5 lg:pl-[30px]">{children}</main>

      {navOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setNavOpen(false)} />
          <div className="absolute inset-y-0 left-0 flex w-[300px] flex-col bg-page shadow-card-lg">
            <div className="flex justify-end px-4 pt-4">
              <button type="button" aria-label="Close menu" onClick={() => setNavOpen(false)} className="text-ink-muted">
                ✕
              </button>
            </div>
            <div className="min-h-0 flex-1">
              <Sidebar role="admin" onNavigate={() => setNavOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

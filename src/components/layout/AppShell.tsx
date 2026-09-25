"use client";

import { useState } from "react";
import { AccessBoundary, RouteGuard } from "@/components/auth/AccessProvider";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import type { Role } from "@/lib/roles";

export function AppShell({
  title,
  role = "salon",
  children,
}: {
  title: string;
  role?: Role;
  children: React.ReactNode;
}) {
  return (
    <AccessBoundary context={role}>
      <ShellLayout title={title} role={role}>
        <RouteGuard>{children}</RouteGuard>
      </ShellLayout>
    </AccessBoundary>
  );
}

function ShellLayout({ title, role, children }: { title: string; role: Role; children: React.ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="mx-auto flex min-h-screen max-w-[1600px] bg-page">
      {/* Desktop sidebar */}
      <aside className="hidden w-[300px] shrink-0 lg:block desk:w-[345px]">
        <div className="sticky top-0 h-screen">
          <Sidebar role={role} />
        </div>
      </aside>

      {/* Mobile sidebar drawer */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileNavOpen(false)} />
          <div className="absolute inset-y-0 left-0 flex w-[300px] flex-col bg-page shadow-card-lg">
            <div className="flex justify-end px-4 pt-4">
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setMobileNavOpen(false)}
                className="text-ink-muted"
              >
                ✕
              </button>
            </div>
            <div className="min-h-0 flex-1">
              <Sidebar role={role} onNavigate={() => setMobileNavOpen(false)} />
            </div>
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col gap-2.5 px-4 py-4 sm:px-5 sm:py-5 lg:pl-0 lg:pr-[30px]">
        <Header title={title} role={role} onMenuClick={() => setMobileNavOpen(true)} />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}

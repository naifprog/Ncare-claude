"use client";

import { useState } from "react";
import { RequestsTable } from "@/components/requests/RequestsTable";
import { RequestsToolbar } from "@/components/requests/RequestsToolbar";
import { cn } from "@/lib/utils";
import type { RequestStatus, SalonRequest } from "@/types";

const TABS: { status: RequestStatus; label: string; activeClass: string }[] = [
  { status: "new", label: "New Requests", activeClass: "bg-brand text-white" },
  { status: "pending", label: "Pending requests", activeClass: "bg-brand-orange text-white" },
  { status: "completed", label: "Completed requests", activeClass: "bg-positive text-white" },
  { status: "incomplete", label: "Incomplete requests", activeClass: "bg-negative text-white" },
];

export function RequestsView({
  data,
}: {
  data: Record<RequestStatus, SalonRequest[]>;
}) {
  const [activeTab, setActiveTab] = useState<RequestStatus>("new");

  return (
    <div className="space-y-5">
      <RequestsToolbar />

      <div className="flex flex-wrap gap-2 sm:gap-4">
        {TABS.map((tab) => (
          <button
            key={tab.status}
            type="button"
            onClick={() => setActiveTab(tab.status)}
            className={cn(
              "rounded-pill px-4 py-2 text-sm font-semibold transition-colors",
              activeTab === tab.status ? tab.activeClass : "text-ink-muted hover:bg-card",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <RequestsTable rows={data[activeTab]} status={activeTab} />
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { useAccess } from "@/components/auth/AccessProvider";
import { RequestsTable } from "@/components/requests/RequestsTable";
import { RequestsToolbar } from "@/components/requests/RequestsToolbar";
import { cn, toInputDate } from "@/lib/utils";
import type { RequestPriority, RequestStatus, SalonRequest } from "@/types";

const TABS: { status: RequestStatus; label: string; activeClass: string }[] = [
  { status: "new", label: "New Requests", activeClass: "bg-info" },
  { status: "pending", label: "Pending requests", activeClass: "bg-brand-orange" },
  { status: "completed", label: "Completed requests", activeClass: "bg-positive" },
  { status: "incomplete", label: "Incomplete requests", activeClass: "bg-[#b0b0b0]" },
];

export function RequestsView({
  data,
}: {
  data: Record<RequestStatus, SalonRequest[]>;
}) {
  const { can } = useAccess();
  const [activeTab, setActiveTab] = useState<RequestStatus>("new");
  const [query, setQuery] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [service, setService] = useState<string | null>(null);
  const [priority, setPriority] = useState<RequestPriority | null>(null);

  const suggestions = useMemo(
    () =>
      Object.values(data)
        .flat()
        .flatMap((r) => [r.workerName, r.service, String(r.num), r.priority]),
    [data],
  );

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data[activeTab].filter((r) => {
      const iso = toInputDate(r.date); // ISO strings compare chronologically
      return (
        (!q ||
          r.workerName.toLowerCase().includes(q) ||
          String(r.num).includes(q) ||
          r.service.toLowerCase().includes(q) ||
          r.priority.toLowerCase().includes(q)) &&
        (!from || iso >= from) &&
        (!to || iso <= to) &&
        (!service || r.service === service) &&
        (!priority || r.priority === priority)
      );
    });
  }, [data, activeTab, query, from, to, service, priority]);

  return (
    <section className="rounded-card bg-card px-4 pb-[7px] pt-5 shadow-card sm:px-[30px]">
      <RequestsToolbar
        query={query}
        onQueryChange={setQuery}
        from={from}
        to={to}
        onFromChange={setFrom}
        onToChange={setTo}
        suggestions={suggestions}
        addHref={can("requests.add") ? "/requests/add" : undefined}
      />

      <div role="tablist" className="mt-2.5 grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-6">
        {TABS.map((tab) => (
          <button
            key={tab.status}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.status}
            onClick={() => setActiveTab(tab.status)}
            className={cn(
              "h-[50px] rounded-l-[25px] rounded-r-[5px] text-sm text-ink transition-colors",
              activeTab === tab.status ? cn("text-[15px] font-bold text-white", tab.activeClass) : "hover:bg-page",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <RequestsTable
        key={activeTab}
        rows={rows}
        status={activeTab}
        serviceFilter={service}
        onServiceFilter={setService}
        priorityFilter={priority}
        onPriorityFilter={(v) => setPriority(v as RequestPriority | null)}
      />
    </section>
  );
}

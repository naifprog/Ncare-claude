"use client";

import { useMemo, useState } from "react";
import { BranchTabs, StatusDropdown } from "@/components/main/BranchTabs";
import { RequestsTable } from "@/components/requests/RequestsTable";
import { RequestsToolbar } from "@/components/requests/RequestsToolbar";
import { BRANCH_TABS } from "@/lib/mock-main";
import { toInputDate } from "@/lib/utils";
import type { RequestPriority, RequestStatus, SalonRequest } from "@/types";

const STATUS_OPTIONS: { value: RequestStatus; label: string; className: string }[] = [
  { value: "new", label: "New Requests", className: "bg-brand" },
  { value: "pending", label: "Pending Requests", className: "bg-brand-orange" },
  { value: "completed", label: "Completed Requests", className: "bg-positive" },
  { value: "incomplete", label: "Incompleted Requests", className: "bg-[#b0b0b0]" },
];

/** Requests of the multi-branch owner (designs 32, 34, 35, 36): status dropdown + branch tabs. */
export function MainRequestsView({ data }: { data: Record<RequestStatus, SalonRequest[]> }) {
  const [status, setStatus] = useState<RequestStatus>("new");
  const [branch, setBranch] = useState(BRANCH_TABS[1]);
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
    // Demo data: every branch shows the same sample requests.
    return data[status]
      .map((r) => ({ ...r, branch }))
      .filter((r) => {
        const iso = toInputDate(r.date);
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
  }, [data, status, branch, query, from, to, service, priority]);

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
        addHref="/main/requests/add"
        variant="main"
      />

      <div className="mt-2.5 flex flex-col gap-2.5 sm:flex-row sm:gap-[23px]">
        <StatusDropdown options={STATUS_OPTIONS} value={status} onChange={setStatus} />
        <BranchTabs branches={BRANCH_TABS} value={branch} onChange={setBranch} className="flex-1" />
      </div>

      <RequestsTable
        key={`${status}-${branch}`}
        rows={rows}
        status={status}
        serviceFilter={service}
        onServiceFilter={setService}
        priorityFilter={priority}
        onPriorityFilter={(v) => setPriority(v as RequestPriority | null)}
        basePath="/main/requests"
      />
    </section>
  );
}

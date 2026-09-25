"use client";

import Link from "next/link";
import { useState } from "react";
import { useAccess } from "@/components/auth/AccessProvider";
import { PhotoAvatar } from "@/components/ui/Avatar";
import { PriorityBadge } from "@/components/ui/Badge";
import { OutlineIconButton, outlineIconButtonClass } from "@/components/ui/Button";
import { ExportMenu } from "@/components/ui/ExportMenu";
import { HeaderFilter } from "@/components/ui/HeaderFilter";
import { Icon } from "@/components/ui/Icon";
import { Pagination, usePagination } from "@/components/ui/Pagination";
import { removeRecord, toast, useRemovedIds } from "@/lib/demo-state";
import { requestServiceFilters } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import type { RequestStatus, SalonRequest } from "@/types";

/** Column widths measured from the design (table is 1004px wide at 1440). */
const COLUMNS = ["w-[73px]", "w-[193px]", "w-[167px]", "w-[164px]", "w-[201px]", ""];

function RowOptions({
  row,
  status,
  onDelete,
  basePath,
}: {
  row: SalonRequest;
  status: RequestStatus;
  onDelete: () => void;
  basePath: string;
}) {
  const [resolution, setResolution] = useState<"accepted" | "rejected" | null>(null);
  const { can } = useAccess();
  const branchId = row.branchId;
  const resolve = (value: "accepted" | "rejected") => {
    setResolution(value);
    toast(`Request ${row.num} ${value}. Demo only: the status is not saved.`);
  };

  const view = (
    <Link
      href={`${basePath}/${row.id}`}
      aria-label={`View request ${row.num}`}
      className={outlineIconButtonClass("orange")}
    >
      <Icon name="eye" size={18} />
    </Link>
  );

  if (status === "new" && can("requests.accept", branchId)) {
    return (
      <div className="flex items-center gap-2.5">
        {view}
        <button
          type="button"
          disabled={resolution !== null}
          onClick={() => resolve("rejected")}
          className="h-[30px] w-[75px] rounded-[3px] bg-negative text-sm text-white shadow-card transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          {resolution === "rejected" ? "Rejected" : "Reject"}
        </button>
        <button
          type="button"
          disabled={resolution !== null}
          onClick={() => resolve("accepted")}
          className="h-[30px] w-[74px] rounded-[3px] bg-positive text-sm text-white shadow-card transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          {resolution === "accepted" ? "Accepted" : "Accept"}
        </button>
      </div>
    );
  }

  if (status === "pending") {
    return (
      <div className="flex items-center gap-2.5">
        {view}
        {can("requests.edit", branchId) && (
          <Link
            href={`${basePath}/${row.id}/edit`}
            aria-label={`Edit request ${row.num}`}
            className={outlineIconButtonClass("brand")}
          >
            <Icon name="edit" size={18} />
          </Link>
        )}
        {can("requests.delete", branchId) && (
          <OutlineIconButton tone="negative" aria-label={`Delete request ${row.num}`} onClick={onDelete}>
            <Icon name="trash" size={18} />
          </OutlineIconButton>
        )}
      </div>
    );
  }

  return <div className="flex items-center">{view}</div>;
}

export function RequestsTable({
  rows,
  status,
  serviceFilter,
  onServiceFilter,
  priorityFilter,
  onPriorityFilter,
  basePath = "/requests",
  exportName,
}: {
  rows: SalonRequest[];
  status: RequestStatus;
  serviceFilter: string | null;
  onServiceFilter: (value: string | null) => void;
  priorityFilter: string | null;
  onPriorityFilter: (value: string | null) => void;
  basePath?: string;
  /** Adds the orange export button to the Options header (super admin, designs 60, 68). */
  exportName?: string;
}) {
  const removed = useRemovedIds();
  const visible = rows.filter((r) => !removed.has(r.id));
  const { pageRows, pagination } = usePagination(visible);

  return (
    <div className="mt-2.5">
      <div className="overflow-x-auto thin-scrollbar">
        <table className="w-full min-w-[1004px] table-fixed border-collapse text-left text-sm text-ink">
          <colgroup>
            {COLUMNS.map((w, i) => (
              <col key={i} className={w} />
            ))}
          </colgroup>
          <thead>
            <tr className="h-[50px] bg-page font-normal">
              <th className="pl-2.5 font-normal">Num</th>
              <th className="font-normal">Worker Name</th>
              <th className="font-normal">
                <HeaderFilter
                  label="Services"
                  options={requestServiceFilters}
                  value={serviceFilter}
                  onChange={onServiceFilter}
                />
              </th>
              <th className="font-normal">
                <HeaderFilter
                  label="Request type"
                  options={["Normal", "Special"]}
                  value={priorityFilter}
                  onChange={onPriorityFilter}
                />
              </th>
              <th className="font-normal">Date&amp;Time</th>
              <th className="font-normal">
                {exportName ? (
                  <span className="flex items-center justify-between pr-5">
                    Options
                    <ExportMenu
                      fileName={exportName}
                      rows={visible.map((r) => ({ Num: r.num, Worker: r.workerName, Service: r.service, Type: r.priority, Date: `${r.time}, ${r.date}` }))}
                    />
                  </span>
                ) : (
                  "Options"
                )}
              </th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((row) => (
              <tr key={row.id} className="h-[70px] border-b border-[#f2f2f2]">
                <td className="pl-2.5">{row.num}</td>
                <td>
                  <span className="flex items-center gap-2.5">
                    <PhotoAvatar />
                    <span className="truncate">{row.workerName}</span>
                  </span>
                </td>
                <td>
                  <span className="inline-flex h-[30px] w-[86px] items-center justify-center rounded-[3px] bg-page">
                    {row.service}
                  </span>
                </td>
                <td>
                  <PriorityBadge priority={row.priority} />
                </td>
                <td className="whitespace-nowrap">
                  {row.time}, {row.date}
                </td>
                <td>
                  <RowOptions
                    row={row}
                    status={status}
                    basePath={basePath}
                    onDelete={() => {
                      removeRecord(row.id);
                      toast(`Request ${row.num} deleted. Demo only: it returns after a reload.`);
                    }}
                  />
                </td>
              </tr>
            ))}
            {visible.length === 0 && (
              <tr>
                <td colSpan={6} className={cn("py-10 text-center text-ink-muted")}>
                  No requests match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination className="mt-[7px]" {...pagination} />
    </div>
  );
}

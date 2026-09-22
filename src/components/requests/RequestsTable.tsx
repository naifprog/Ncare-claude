"use client";

import { useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Button, IconButton } from "@/components/ui/Button";
import { PriorityBadge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { Pagination } from "@/components/ui/Pagination";
import { cn } from "@/lib/utils";
import type { RequestStatus, SalonRequest } from "@/types";

function RowOptions({ status, disabled }: { status: RequestStatus; disabled?: boolean }) {
  const [resolution, setResolution] = useState<"accepted" | "rejected" | null>(null);
  const rowDisabled = disabled || resolution !== null;

  if (status === "new") {
    return (
      <div className="flex items-center justify-end gap-2">
        <IconButton tone="brand" aria-label="Quick action" disabled={rowDisabled}>
          <Icon name="bolt" size={16} />
        </IconButton>
        <Button
          variant="reject"
          className="px-3 py-1.5 text-xs"
          disabled={rowDisabled}
          onClick={() => setResolution("rejected")}
        >
          {resolution === "rejected" ? "Rejected" : "Reject"}
        </Button>
        <Button
          variant="accept"
          className="px-3 py-1.5 text-xs"
          disabled={rowDisabled}
          onClick={() => setResolution("accepted")}
        >
          {resolution === "accepted" ? "Accepted" : "Accept"}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <IconButton tone="brand" aria-label="Quick action" disabled={disabled}>
        <Icon name="bolt" size={16} />
      </IconButton>
      <IconButton tone="info" aria-label="Edit" disabled={disabled}>
        <Icon name="edit" size={16} />
      </IconButton>
      <IconButton tone="negative" aria-label="Delete" disabled={disabled}>
        <Icon name="trash" size={16} />
      </IconButton>
    </div>
  );
}

export function RequestsTable({ rows, status }: { rows: SalonRequest[]; status: RequestStatus }) {
  return (
    <div className="overflow-hidden rounded-card bg-card shadow-card-sm">
      <div className="overflow-x-auto thin-scrollbar">
        <table className="w-full min-w-[760px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs font-semibold text-ink-muted">
              <th className="px-5 py-3">Num</th>
              <th className="px-5 py-3">Worker Name</th>
              <th className="px-5 py-3">
                <span className="inline-flex items-center gap-1">
                  Services <Icon name="chevronDown" size={10} />
                </span>
              </th>
              <th className="px-5 py-3">
                <span className="inline-flex items-center gap-1">
                  Request type <Icon name="chevronDown" size={10} />
                </span>
              </th>
              <th className="px-5 py-3">Date&amp;Time</th>
              <th className="px-5 py-3 text-right">Options</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                className={cn(
                  "border-b border-border last:border-0",
                  row.disabled && "opacity-40",
                )}
              >
                <td className="px-5 py-4 font-semibold text-ink">{row.num}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <Avatar seed={row.avatarSeed} size={28} />
                    <span className="font-medium text-ink">{row.workerName}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-ink">{row.service}</td>
                <td className="px-5 py-4">
                  <PriorityBadge priority={row.priority} />
                </td>
                <td className="px-5 py-4 whitespace-nowrap text-ink-muted">
                  {row.time}, {row.date}
                </td>
                <td className="px-5 py-4">
                  <RowOptions status={status} disabled={row.disabled} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination />
    </div>
  );
}

"use client";

import { useState } from "react";
import { useAccess } from "@/components/auth/AccessProvider";
import { PhotoAvatar } from "@/components/ui/Avatar";
import { PriorityBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { toast } from "@/lib/demo-state";
import { cn } from "@/lib/utils";
import type { SalonRequest } from "@/types";

export function RequestCard({ request }: { request: SalonRequest }) {
  const [resolution, setResolution] = useState<"accepted" | "rejected" | null>(null);
  const isResolved = resolution !== null;
  const { can } = useAccess();
  const resolve = (value: "accepted" | "rejected") => {
    setResolution(value);
    toast(`Request ${request.num} ${value}. Demo only: the status is not saved.`);
  };

  return (
    <li className={cn("rounded-[5px] bg-page p-5 text-sm text-ink", isResolved && "opacity-40")}>
      <div className="flex h-[30px] items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-[11px]">
          <PhotoAvatar />
          <span className="truncate">{request.workerName}</span>
        </div>
        <PriorityBadge priority={request.priority} />
      </div>
      <p className="mt-2.5 leading-[30px]">Services: {request.service}</p>
      {request.branch ? <p className="leading-[30px]">Branch: {request.branch}</p> : null}
      <p className="leading-[30px]">
        Date&amp;Time: {request.time}, {request.date}
      </p>
      {can("requests.accept", request.branchId) && (
      <div className="mt-2.5 flex gap-2.5">
        <Button
          variant="reject"
          className="h-10 flex-1 py-0 shadow-card"
          disabled={isResolved}
          onClick={() => resolve("rejected")}
        >
          {resolution === "rejected" ? "Rejected" : "Reject"}
        </Button>
        <Button
          variant="accept"
          className="h-10 flex-1 py-0 shadow-card"
          disabled={isResolved}
          onClick={() => resolve("accepted")}
        >
          {resolution === "accepted" ? "Accepted" : "Accept"}
        </Button>
      </div>
      )}
    </li>
  );
}

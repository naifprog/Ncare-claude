"use client";

import { useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { PriorityBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { SalonRequest } from "@/types";

export function RequestCard({ request }: { request: SalonRequest }) {
  const [resolution, setResolution] = useState<"accepted" | "rejected" | null>(null);
  const isDisabled = request.disabled || resolution !== null;

  return (
    <li className={cn("space-y-3 py-4 first:pt-0 last:pb-0", isDisabled && "opacity-40")}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Avatar seed={request.avatarSeed} size={30} />
          <span className="text-sm font-semibold text-ink">{request.workerName}</span>
        </div>
        <PriorityBadge priority={request.priority} />
      </div>
      <div className="space-y-1 text-xs text-ink-muted">
        <p>Services: {request.service}</p>
        <p>
          Date&amp;Time: {request.time}, {request.date}
        </p>
      </div>
      <div className="flex gap-3">
        <Button
          variant="reject"
          className="flex-1"
          disabled={isDisabled}
          onClick={() => setResolution("rejected")}
        >
          {resolution === "rejected" ? "Rejected" : "Reject"}
        </Button>
        <Button
          variant="accept"
          className="flex-1"
          disabled={isDisabled}
          onClick={() => setResolution("accepted")}
        >
          {resolution === "accepted" ? "Accepted" : "Accept"}
        </Button>
      </div>
    </li>
  );
}

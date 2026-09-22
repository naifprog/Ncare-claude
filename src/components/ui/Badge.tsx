import { cn } from "@/lib/utils";
import type { RequestPriority } from "@/types";

const PRIORITY_STYLES: Record<RequestPriority, string> = {
  Normal: "bg-tint-teal text-positive",
  Special: "bg-tint-navy text-white",
};

export function PriorityBadge({ priority, className }: { priority: RequestPriority; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-pill px-3 py-1 text-xs font-bold",
        PRIORITY_STYLES[priority],
        className,
      )}
    >
      {priority}
    </span>
  );
}

export function Tag({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-pill bg-tint-yellow px-3 py-1 text-xs font-bold text-ink",
        className,
      )}
    >
      {children}
    </span>
  );
}

import { cn } from "@/lib/utils";
import type { RequestPriority } from "@/types";

const PRIORITY_STYLES: Record<RequestPriority, string> = {
  Normal: "bg-tint-teal text-brand",
  Special: "bg-tint-navy text-white",
};

export function PriorityBadge({ priority, className }: { priority: RequestPriority; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-[30px] w-[84px] shrink-0 items-center justify-center rounded-[3px] text-sm",
        PRIORITY_STYLES[priority],
        className,
      )}
    >
      {priority}
    </span>
  );
}

/** Square-cornered yellow chip used for positions and service categories in tables. */
export function TableTag({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-[30px] min-w-[105px] items-center justify-center rounded-[3px] bg-tint-yellow px-3 text-sm text-ink",
        className,
      )}
    >
      {children}
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

import { cn } from "@/lib/utils";

const STYLES: Record<string, string> = {
  Admin: "bg-tint-yellow text-brand-orange",
  "Data entry": "bg-tint-yellow text-brand-orange",
  "Data Entry": "bg-tint-yellow text-brand-orange",
  Marketer: "bg-tint-yellow text-brand-orange",
  Salon: "bg-tint-teal text-brand",
  Branch: "bg-tint-teal text-brand",
  Worker: "bg-tint-teal text-brand",
  Customer: "bg-[#f2f2f2] text-ink",
};

/** 100×30 account-type chip of the admin tables (designs 51, 74, 87). */
export function AccountTypeBadge({ type, className }: { type: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-[30px] w-[100px] items-center justify-center rounded-[3px] text-sm",
        STYLES[type] ?? "bg-page text-ink",
        className,
      )}
    >
      {type}
    </span>
  );
}

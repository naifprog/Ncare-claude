import { PalestineFlag } from "@/components/ui/DesignIcons";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

/** Flag + nationality on a #fcfcfc chip (the design only shows the Palestinian flag). */
export function NationalityChip({ flag, name, className }: { flag: string; name: string; className?: string }) {
  return (
    <span
      className={cn("inline-flex h-[30px] items-center gap-2.5 rounded-[3px] bg-page px-2.5 text-sm text-ink", className)}
    >
      {name === "Palestinian" ? <PalestineFlag /> : <span className="text-base leading-none">{flag}</span>}
      {name}
    </span>
  );
}

export function EarningsValue({
  amount,
  trend,
  className,
}: {
  amount: number;
  trend: "up" | "down";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-sm",
        trend === "up" ? "text-positive" : "text-negative",
        className,
      )}
    >
      <Icon name={trend === "up" ? "arrowUpLine" : "arrowDownLine"} size={14} />
      <span>
        <span className="font-bold">{amount}</span> <span className="text-[11px]">SAR</span>
      </span>
    </span>
  );
}

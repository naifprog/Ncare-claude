import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

/** 45×30 "→" button closing a list row (flat left, rounded right). */
export function rowArrowClass(tone: "orange" | "info", className?: string) {
  return cn(
    "inline-flex h-[30px] w-[45px] shrink-0 items-center justify-center rounded-l-[5px] rounded-r-[15px] text-white shadow-card transition-opacity hover:opacity-90",
    tone === "orange" ? "bg-brand-orange" : "bg-info",
    className,
  );
}

export function RowArrowIcon() {
  return <Icon name="arrowRightLine" size={20} />;
}

export function RowArrowButton({
  tone,
  label,
  className,
}: {
  tone: "orange" | "info";
  label: string;
  className?: string;
}) {
  return (
    <button type="button" aria-label={label} className={rowArrowClass(tone, className)}>
      <RowArrowIcon />
    </button>
  );
}

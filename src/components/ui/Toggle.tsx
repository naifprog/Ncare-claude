"use client";

import { cn } from "@/lib/utils";

/** 40×34 orange capsule switch with an 18px knob (SalonStatus frame, designs 44, 75). */
export function Toggle({
  checked,
  onChange,
  label,
  disabled,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  /** Read-only (e.g. the user lacks the permission to change it). */
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-[34px] w-10 shrink-0 rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-60",
        checked ? "bg-brand-orange" : "bg-[#d6d6d6]",
      )}
    >
      <span
        className={cn(
          "absolute top-2 h-[18px] w-[18px] rounded-full bg-page transition-all",
          checked ? "right-[7px]" : "left-[7px]",
        )}
      />
    </button>
  );
}

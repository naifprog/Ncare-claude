"use client";

import { useState } from "react";
import { CaretDownIcon } from "@/components/ui/DesignIcons";
import { cn } from "@/lib/utils";

/**
 * Horizontal branch selector (designs 32–40): #fcfcfc pill strip, active branch
 * as a 169×50 info-blue pill; scrolls sideways when the branches overflow.
 */
export function BranchTabs({
  branches,
  value,
  onChange,
  className,
}: {
  branches: { id: string; name: string }[];
  /** Selected branch id. */
  value: string;
  onChange: (branchId: string) => void;
  className?: string;
}) {
  if (branches.length === 0) {
    return (
      <div className={cn("flex h-[50px] items-center rounded-pill bg-page px-[30px] text-sm text-ink-muted", className)}>
        No branches assigned to your account.
      </div>
    );
  }
  return (
    <div
      role="tablist"
      aria-label="Branches"
      className={cn("flex h-[50px] min-w-0 items-center gap-2 overflow-x-auto rounded-pill bg-page no-scrollbar", className)}
    >
      {branches.map((b) => (
        <button
          key={b.id}
          type="button"
          role="tab"
          aria-selected={b.id === value}
          onClick={() => onChange(b.id)}
          className={cn(
            "h-[50px] w-[169px] shrink-0 whitespace-nowrap rounded-pill px-3 text-sm",
            b.id === value ? "bg-info font-bold text-white" : "text-ink",
          )}
        >
          {b.name}
        </button>
      ))}
    </div>
  );
}

/** Status pill-dropdown in front of the branch tabs (designs 32, 34–36; list = frame 3040574). */
export function StatusDropdown<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string; className: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  const [open, setOpen] = useState(false);
  const current = options.find((o) => o.value === value) ?? options[0];

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex h-[50px] w-[169px] items-center justify-between gap-2 rounded-pill pl-[25px] pr-6 text-sm font-bold text-white",
          current.className,
        )}
      >
        <span className="truncate">{current.label}</span>
        <CaretDownIcon className={cn("shrink-0 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <ul role="listbox" className="absolute left-0 top-[58px] z-50 w-[185px] rounded-[5px] bg-card p-2 shadow-card">
            {options.map((o) => (
              <li key={o.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={o.value === value}
                  onClick={() => {
                    onChange(o.value);
                    setOpen(false);
                  }}
                  className={cn(
                    "h-[37px] w-full rounded-[3px] text-center text-sm text-ink hover:bg-page",
                    o.value === value && "bg-page",
                  )}
                >
                  {o.label}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

/**
 * Selected branch of a branch-tab list: defaults to the second tab as drawn in the
 * design (designs 32, 37, 40), or the first when only one branch is available.
 */
export function useBranchTab(branches: { id: string }[]) {
  const [selected, setSelected] = useState<string | null>(null);
  const valid = branches.some((b) => b.id === selected);
  const branchId = valid ? selected! : (branches[1] ?? branches[0])?.id ?? "";
  return [branchId, setSelected] as const;
}

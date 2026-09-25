"use client";

import { useState } from "react";
import { CaretDownIcon } from "@/components/ui/DesignIcons";
import { cn } from "@/lib/utils";

/**
 * Table column header with a dropdown list (design frames 30355 / 30356 / 30357:
 * white 5px card, 41px centered rows with inset separators). Selecting the
 * active option again clears the filter.
 */
export function HeaderFilter({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string | null;
  onChange: (value: string | null) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={cn("inline-flex items-center gap-2.5", value && "text-brand")}
      >
        {value ?? label}
        <CaretDownIcon className={cn("transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <ul
            role="listbox"
            className="absolute left-0 top-8 z-50 min-w-[110px] rounded-[5px] bg-card px-2.5 py-1 font-normal text-ink shadow-card"
          >
            {options.map((option) => (
              <li key={option} className="border-b border-[#f2f2f2] last:border-0">
                <button
                  type="button"
                  role="option"
                  aria-selected={value === option}
                  onClick={() => {
                    onChange(value === option ? null : option);
                    setOpen(false);
                  }}
                  className={cn(
                    "h-[41px] w-full whitespace-nowrap px-2 text-center text-sm hover:text-brand",
                    value === option && "font-bold text-brand",
                  )}
                >
                  {option}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { CaretDownIcon } from "@/components/ui/DesignIcons";
import { cn } from "@/lib/utils";

/**
 * Filter pill with a searchable list (designs 65–68; lists = frames 3040577–3040579).
 * `allLabel` is shown when nothing is selected ("All Salons", "All Branches" …).
 */
export function SearchSelect({
  allLabel,
  options,
  value,
  onChange,
  searchable = true,
  className,
}: {
  allLabel: string;
  options: string[];
  value: string | null;
  onChange: (value: string | null) => void;
  searchable?: boolean;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const list = [...new Set(options)].filter((o) => o.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex h-[50px] w-full items-center justify-between rounded-pill bg-page pl-[30px] pr-10 text-left text-base text-ink"
      >
        <span className="truncate">{value ?? allLabel}</span>
        <CaretDownIcon className={cn("shrink-0 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-[58px] z-50 w-full min-w-[250px] rounded-[5px] bg-card p-2.5 shadow-card">
            {searchable && (
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search .."
                aria-label={`Search ${allLabel.toLowerCase()}`}
                className="mb-1 h-10 w-full rounded-[5px] bg-page px-4 text-sm text-ink placeholder:text-[#aeaeae] focus:outline-none"
              />
            )}
            <ul role="listbox" className="max-h-[300px] overflow-y-auto thin-scrollbar">
              <li className="border-b border-[#f2f2f2]">
                <button
                  type="button"
                  role="option"
                  aria-selected={value === null}
                  onClick={() => {
                    onChange(null);
                    setOpen(false);
                  }}
                  className={cn("h-[30px] w-full px-4 text-left text-sm text-ink hover:text-brand", value === null && "font-bold text-brand")}
                >
                  {allLabel}
                </button>
              </li>
              {list.map((o) => (
                <li key={o} className="border-b border-[#f2f2f2] last:border-0">
                  <button
                    type="button"
                    role="option"
                    aria-selected={value === o}
                    onClick={() => {
                      onChange(o);
                      setOpen(false);
                    }}
                    className={cn("h-[30px] w-full px-4 text-left text-sm text-ink hover:text-brand", value === o && "font-bold text-brand")}
                  >
                    {o}
                  </button>
                </li>
              ))}
              {list.length === 0 && <li className="px-4 py-2 text-sm text-ink-muted">No results</li>}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

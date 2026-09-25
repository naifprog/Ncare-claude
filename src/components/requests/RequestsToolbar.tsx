"use client";

import Link from "next/link";
import { useState } from "react";
import { CalendarPopover, formatDisplayDate } from "@/components/ui/Calendar";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

export function RequestsToolbar({
  query,
  onQueryChange,
  from,
  to,
  onFromChange,
  onToChange,
  addHref,
  variant = "salon",
  hideAction,
  suggestions = [],
}: {
  query: string;
  onQueryChange: (value: string) => void;
  from: string;
  to: string;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
  /** Target of "New request"; the button is hidden without it (no permission). */
  addHref?: string;
  /** "main": grey in-pill calendar icons and an orange "New request" (designs 32–36). */
  variant?: "salon" | "main";
  /** Search + dates only (bills toolbar, design 79). */
  hideAction?: boolean;
  /** Values offered under the search box while typing (design frame 30354). */
  suggestions?: string[];
}) {
  return (
    <div className="flex flex-col gap-[17px] lg:flex-row lg:items-center">
      <SearchWithSuggestions query={query} onQueryChange={onQueryChange} suggestions={suggestions} />
      <div className="flex gap-[17px]">
        <DateRangeField label="From" value={from} onChange={onFromChange} subtle={variant === "main"} />
        <DateRangeField label="To" value={to} onChange={onToChange} subtle={variant === "main"} />
      </div>
      {!hideAction && addHref && (
      <Link
        href={addHref}
        className={cn(
          "inline-flex h-[50px] shrink-0 items-center justify-center rounded-pill px-10 text-[15px] font-bold text-white shadow-card transition-opacity hover:opacity-90 lg:w-[175px] lg:px-0",
          variant === "main" ? "bg-brand-orange" : "bg-brand",
        )}
      >
        New request
      </Link>
      )}
    </div>
  );
}

/** 149×50 pill: label (or the chosen date) + orange 60×50 calendar trigger. */
function DateRangeField({
  label,
  value,
  onChange,
  subtle,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  /** Grey calendar glyph inside the pill instead of the orange button. */
  subtle?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <div className="flex h-[50px] w-[149px] items-center rounded-pill bg-page">
        <button
          type="button"
          onClick={() => (value ? onChange("") : setOpen(true))}
          title={value ? "Clear date" : undefined}
          className={cn("flex-1 pl-[30px] text-left", value ? "text-xs text-ink" : "text-sm text-[#aeaeae]")}
        >
          {value ? formatDisplayDate(value) : label}
        </button>
        <button
          type="button"
          aria-label={`Choose ${label.toLowerCase()} date`}
          onClick={() => setOpen((o) => !o)}
          className={cn(
            "flex h-[50px] w-[60px] items-center justify-center rounded-pill transition-opacity hover:opacity-90",
            subtle ? "text-[#aeaeae]" : "bg-brand-orange text-white",
          )}
        >
          <Icon name="calendarBold" size={20} />
        </button>
      </div>
      {open && (
        <CalendarPopover
          value={value}
          onSelect={onChange}
          onClose={() => setOpen(false)}
          className="right-0 top-[58px]"
        />
      )}
    </div>
  );
}

/** Search pill with the design's suggestion list (frame 30354: names, services, numbers, types). */
function SearchWithSuggestions({
  query,
  onQueryChange,
  suggestions,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  suggestions: string[];
}) {
  const [focused, setFocused] = useState(false);
  const q = query.trim().toLowerCase();
  const matches = q
    ? [...new Set(suggestions)].filter((s) => s.toLowerCase().includes(q) && s.toLowerCase() !== q).slice(0, 8)
    : [];

  return (
    <div className="relative min-w-0 flex-1">
      <input
        type="search"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 150)}
        placeholder="Search .."
        aria-label="Search requests"
        aria-autocomplete="list"
        className="h-[50px] w-full rounded-pill bg-page px-[30px] text-sm text-ink placeholder:text-[#aeaeae] focus:outline focus:outline-brand"
      />
      {focused && matches.length > 0 && (
        <ul role="listbox" className="absolute inset-x-0 top-[58px] z-50 rounded-[5px] bg-card px-5 py-2 shadow-card">
          {matches.map((m) => (
            <li key={m} className="border-b border-[#f2f2f2] last:border-0">
              <button
                type="button"
                role="option"
                aria-selected={false}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onQueryChange(m);
                  setFocused(false);
                }}
                className="h-[30px] w-full text-left text-sm text-ink hover:text-brand"
              >
                {m}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
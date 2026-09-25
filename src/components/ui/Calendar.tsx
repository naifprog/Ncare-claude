"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** "yyyy-mm-dd" ⇄ Date helpers (local time, no timezone drift). */
export function parseIsoDate(value: string | undefined | null) {
  if (!value) return null;
  const [y, m, d] = value.split("-").map(Number);
  return y && m && d ? new Date(y, m - 1, d) : null;
}
export function toIsoDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
export function formatDisplayDate(value: string) {
  const date = parseIsoDate(value);
  return date ? `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}` : "";
}

/** Month calendar popover (design frame 3052: 321×346, #fcfcfc, Monday-first). */
export function CalendarPopover({
  value,
  onSelect,
  onClose,
  className,
}: {
  value: string;
  onSelect: (iso: string) => void;
  onClose: () => void;
  className?: string;
}) {
  const selected = parseIsoDate(value);
  const [view, setView] = useState(() => {
    const base = selected ?? new Date();
    return { year: base.getFullYear(), month: base.getMonth() };
  });

  const first = new Date(view.year, view.month, 1);
  const leading = (first.getDay() + 6) % 7; // Monday-first offset
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array.from({ length: leading }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const step = (delta: number) =>
    setView(({ year, month }) => {
      const d = new Date(year, month + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div
        role="dialog"
        aria-label="Choose date"
        className={cn(
          "absolute z-50 w-[321px] rounded-[5px] bg-page px-[18px] pb-4 pt-6 text-ink shadow-card",
          className,
        )}
      >
        <div className="flex items-center justify-between px-10">
          <button type="button" aria-label="Previous month" onClick={() => step(-1)} className="p-1">
            <Icon name="chevronLeftBold" size={14} />
          </button>
          <span className="text-[15px] font-bold">
            {MONTHS[view.month]}, {view.year}
          </span>
          <button type="button" aria-label="Next month" onClick={() => step(1)} className="p-1">
            <Icon name="chevronRightBold" size={14} />
          </button>
        </div>

        <div className="mt-5 grid grid-cols-7 text-center">
          {WEEKDAYS.map((d) => (
            <span key={d} className="pb-5 text-sm font-bold">
              {d}
            </span>
          ))}
          {cells.map((day, i) =>
            day === null ? (
              <span key={`blank-${i}`} />
            ) : (
              <button
                key={day}
                type="button"
                onClick={() => {
                  onSelect(toIsoDate(new Date(view.year, view.month, day)));
                  onClose();
                }}
                className={cn(
                  "mx-auto flex h-[45px] w-9 items-center justify-center rounded-[5px] text-xs hover:bg-border",
                  selected &&
                    selected.getFullYear() === view.year &&
                    selected.getMonth() === view.month &&
                    selected.getDate() === day &&
                    "bg-brand font-bold text-white hover:bg-brand",
                )}
              >
                {String(day).padStart(2, "0")}
              </button>
            ),
          )}
        </div>
      </div>
    </>
  );
}

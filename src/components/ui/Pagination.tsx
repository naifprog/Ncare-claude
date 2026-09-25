"use client";

import { useState } from "react";
import { CaretDownIcon } from "@/components/ui/DesignIcons";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

/** Table footer from the design: 40px #fcfcfc bar — rows per page · pages · go to page. */
export function Pagination({
  pageCount = 12,
  className,
  compact,
  defaultRows = 10,
}: {
  pageCount?: number;
  className?: string;
  /** Narrow variant (accounting summary, design 69): 1 2 ••• n-1 n, tighter spacing. */
  compact?: boolean;
  defaultRows?: number;
}) {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRows);
  const [goTo, setGoTo] = useState("");

  const visiblePages: (number | "gap")[] = compact
    ? [1, 2, "gap", pageCount - 1, pageCount]
    : [1, 2, 3, "gap", pageCount - 2, pageCount - 1, pageCount];
  const cell = compact ? "w-9" : "w-9 sm:w-[55px]";

  const jump = () => {
    const n = Number(goTo);
    if (Number.isInteger(n) && n >= 1 && n <= pageCount) setPage(n);
    setGoTo("");
  };

  return (
    <div
      className={cn(
        "flex min-h-10 flex-wrap items-center justify-between gap-y-2 rounded-[3px] bg-page px-3 py-2 text-sm sm:px-6",
        compact ? "gap-x-3 text-xs" : "gap-x-6",
        className,
      )}
    >
      <label className="flex items-center gap-[18px] text-ink-muted">
        Rows per page
        <span className="relative inline-flex items-center">
          <select
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(Number(e.target.value))}
            className="appearance-none bg-transparent pr-6 text-ink focus:outline-none"
          >
            {[...new Set([defaultRows, 10, 25, 50])].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <CaretDownIcon className="pointer-events-none absolute right-0 text-ink" />
        </span>
      </label>

      <div className="flex items-center text-ink">
        {visiblePages.map((p, i) =>
          p === "gap" ? (
            <span key={`gap-${i}`} className={cn(cell, "text-center font-bold tracking-widest")} aria-hidden="true">
              •••
            </span>
          ) : (
            <button
              key={p}
              type="button"
              aria-current={page === p ? "page" : undefined}
              onClick={() => setPage(p)}
              className={cn(cell, "text-center", page === p && "text-info")}
            >
              {p}
            </button>
          ),
        )}
      </div>

      <div className={cn("flex items-center text-ink-muted", compact ? "gap-3" : "gap-8")}>
        <label className={cn("flex items-center", compact ? "gap-3" : "gap-8")}>
          Go to page
          <input
            value={goTo}
            onChange={(e) => setGoTo(e.target.value.replace(/\D/g, ""))}
            onKeyDown={(e) => e.key === "Enter" && jump()}
            inputMode="numeric"
            aria-label="Page number"
            className="w-8 border-b border-ink-muted bg-transparent text-center text-ink focus:outline-none"
          />
        </label>
        <button
          type="button"
          aria-label="Next page"
          onClick={() => (goTo ? jump() : setPage((p) => Math.min(pageCount, p + 1)))}
          className="text-ink"
        >
          <Icon name="chevronRight" size={20} />
        </button>
      </div>
    </div>
  );
}

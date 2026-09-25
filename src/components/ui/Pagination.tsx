"use client";

import { useState } from "react";
import { CaretDownIcon } from "@/components/ui/DesignIcons";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

export interface PaginationState {
  page: number;
  pageCount: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
}

/**
 * Client-side paging of an in-memory list. Returns the rows of the current page and
 * the props of <Pagination>. The page is clamped when filters shrink the list.
 */
export function usePagination<T>(rows: T[], defaultRows = 10): { pageRows: T[]; pagination: PaginationState } {
  const [requestedPage, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRows);
  const pageCount = Math.max(1, Math.ceil(rows.length / rowsPerPage));
  const page = Math.min(requestedPage, pageCount);

  return {
    pageRows: rows.slice((page - 1) * rowsPerPage, page * rowsPerPage),
    pagination: {
      page,
      pageCount,
      rowsPerPage,
      onPageChange: setPage,
      onRowsPerPageChange: (n) => {
        setRowsPerPage(n);
        setPage(1);
      },
    },
  };
}

/** Page buttons: all pages when few, otherwise the design's "1 2 3 ••• n-2 n-1 n" (compact: "1 2 ••• n-1 n"). */
function pageList(pageCount: number, compact?: boolean): (number | "gap")[] {
  const edge = compact ? 2 : 3;
  if (pageCount <= edge * 2 + 1) return Array.from({ length: pageCount }, (_, i) => i + 1);
  const head = Array.from({ length: edge }, (_, i) => i + 1);
  const tail = Array.from({ length: edge }, (_, i) => pageCount - edge + 1 + i);
  return [...head, "gap", ...tail];
}

/** Table footer from the design: 40px #fcfcfc bar — rows per page · pages · go to page. */
export function Pagination({
  page,
  pageCount,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  className,
  compact,
  defaultRows = 10,
}: Partial<PaginationState> & {
  className?: string;
  /** Narrow variant (accounting summary, design 69): tighter spacing. */
  compact?: boolean;
  defaultRows?: number;
}) {
  const [goTo, setGoTo] = useState("");
  const count = pageCount ?? 1;
  const current = page ?? 1;
  const perPage = rowsPerPage ?? defaultRows;
  const cell = compact ? "w-9" : "w-9 sm:w-[55px]";

  const go = (n: number) => onPageChange?.(Math.min(count, Math.max(1, n)));
  const jump = () => {
    const n = Number(goTo);
    if (Number.isInteger(n) && n >= 1 && n <= count) go(n);
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
            value={perPage}
            onChange={(e) => onRowsPerPageChange?.(Number(e.target.value))}
            className="appearance-none bg-transparent pr-6 text-ink focus:outline-none"
          >
            {[...new Set([defaultRows, 10, 25, 50])].sort((a, b) => a - b).map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <CaretDownIcon className="pointer-events-none absolute right-0 text-ink" />
        </span>
      </label>

      <div className="flex items-center text-ink">
        {pageList(count, compact).map((p, i) =>
          p === "gap" ? (
            <span key={`gap-${i}`} className={cn(cell, "text-center font-bold tracking-widest")} aria-hidden="true">
              •••
            </span>
          ) : (
            <button
              key={p}
              type="button"
              aria-label={`Page ${p}`}
              aria-current={current === p ? "page" : undefined}
              onClick={() => go(p)}
              className={cn(cell, "text-center", current === p && "text-info")}
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
          disabled={!goTo && current >= count}
          onClick={() => (goTo ? jump() : go(current + 1))}
          className="text-ink disabled:opacity-30"
        >
          <Icon name="chevronRight" size={20} />
        </button>
      </div>
    </div>
  );
}

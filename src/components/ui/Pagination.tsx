"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

export function Pagination({ pageCount = 12 }: { pageCount?: number }) {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const visiblePages = [1, 2, 3, "…", pageCount - 2, pageCount - 1, pageCount];

  return (
    <div className="flex flex-col items-center justify-between gap-4 border-t border-border px-5 py-4 sm:flex-row">
      <label className="flex items-center gap-2 text-xs text-ink-muted">
        Rows per page:
        <select
          value={rowsPerPage}
          onChange={(e) => setRowsPerPage(Number(e.target.value))}
          className="rounded border border-border bg-card px-2 py-1 text-xs font-semibold text-ink"
        >
          {[10, 25, 50].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </label>

      <div className="flex items-center gap-1 text-xs">
        {visiblePages.map((p, i) =>
          p === "…" ? (
            <span key={`ellipsis-${i}`} className="px-2 text-ink-muted">
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => setPage(p as number)}
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded font-semibold",
                page === p ? "bg-brand text-white" : "text-ink-muted hover:bg-page",
              )}
            >
              {p}
            </button>
          ),
        )}
        <button
          type="button"
          onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
          className="ml-1 flex h-7 w-7 items-center justify-center rounded text-ink-muted hover:bg-page"
          aria-label="Next page"
        >
          <Icon name="chevronRight" size={14} />
        </button>
      </div>
    </div>
  );
}

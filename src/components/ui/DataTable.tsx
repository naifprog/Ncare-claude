"use client";

import Link from "next/link";
import { useAccess } from "@/components/auth/AccessProvider";
import { OutlineIconButton, outlineIconButtonClass } from "@/components/ui/Button";
import { FlashIcon, ImportIcon, PrinterIcon } from "@/components/ui/DesignIcons";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

export interface Column<T> {
  key: string;
  header: React.ReactNode;
  /** Tailwind width class for the <col> (design-measured), e.g. "w-[130px]". */
  width?: string;
  className?: string;
  render: (row: T, index: number) => React.ReactNode;
}

/**
 * Table in the design's list style (designs 5, 15, 19, 27, 51 …): 50px #fcfcfc header row,
 * 70px rows with #f2f2f2 separators, 14px text.
 */
export function DataTable<T>({
  columns,
  rows,
  rowKey,
  minWidth = 1004,
  firstColumnPadding = "pl-[30px]",
  rowHeight = "h-[70px]",
  emptyText = "Nothing to show.",
}: {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  minWidth?: number;
  firstColumnPadding?: string;
  rowHeight?: string;
  emptyText?: string;
}) {
  return (
    <div className="overflow-x-auto thin-scrollbar">
      <table
        className="w-full table-fixed border-collapse text-left text-sm text-ink"
        style={{ minWidth }}
      >
        <colgroup>
          {columns.map((c) => (
            <col key={c.key} className={c.width} />
          ))}
        </colgroup>
        <thead>
          <tr className="h-[50px] bg-page">
            {columns.map((c, i) => (
              <th key={c.key} className={cn("font-normal", i === 0 && firstColumnPadding, c.className)}>
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, r) => (
            <tr key={rowKey(row)} className={cn(rowHeight, "border-b border-[#f2f2f2]")}>
              {columns.map((c, i) => (
                <td key={c.key} className={cn(i === 0 && firstColumnPadding, c.className)}>
                  {c.render(row, r)}
                </td>
              ))}
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="py-10 text-center text-ink-muted">
                {emptyText}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Row action buttons used across the design's tables. Links the signed-in user may
 * not open are left out; callers pass callbacks only when the action is permitted.
 */
export function RowActions({
  label,
  powersHref,
  viewHref,
  onView,
  editHref,
  onEdit,
  onDelete,
  onDownload,
  onPrint,
}: {
  label: string;
  powersHref?: string;
  viewHref?: string;
  onView?: () => void;
  editHref?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onDownload?: () => void;
  onPrint?: () => void;
}) {
  const { canAccessPath } = useAccess();
  const allowed = (href?: string) => (href && canAccessPath(href) ? href : undefined);
  powersHref = allowed(powersHref);
  viewHref = allowed(viewHref);
  editHref = allowed(editHref);
  return (
    <div className="flex items-center gap-2.5">
      {powersHref && (
        <Link
          href={powersHref}
          aria-label={`Powers of ${label}`}
          className="inline-flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[5px] bg-info text-white shadow-card"
        >
          <FlashIcon size={20} strokeWidth={1.5} />
        </Link>
      )}
      {viewHref && (
        <Link href={viewHref} aria-label={`View ${label}`} className={outlineIconButtonClass("orange")}>
          <Icon name="eye" size={18} />
        </Link>
      )}
      {onView && (
        <OutlineIconButton tone="orange" aria-label={`View ${label}`} onClick={onView}>
          <Icon name="eye" size={18} />
        </OutlineIconButton>
      )}
      {editHref && (
        <Link href={editHref} aria-label={`Edit ${label}`} className={outlineIconButtonClass("brand")}>
          <Icon name="edit" size={18} />
        </Link>
      )}
      {onEdit && (
        <OutlineIconButton tone="brand" aria-label={`Edit ${label}`} onClick={onEdit}>
          <Icon name="edit" size={18} />
        </OutlineIconButton>
      )}
      {onPrint && (
        <OutlineIconButton tone="info" aria-label={`Print ${label}`} onClick={onPrint}>
          <PrinterIcon size={18} />
        </OutlineIconButton>
      )}
      {onDownload && (
        <OutlineIconButton tone="purple" aria-label={`Download ${label}`} onClick={onDownload}>
          <ImportIcon size={20} />
        </OutlineIconButton>
      )}
      {onDelete && (
        <OutlineIconButton tone="negative" aria-label={`Delete ${label}`} onClick={onDelete}>
          <Icon name="trash" size={18} />
        </OutlineIconButton>
      )}
    </div>
  );
}

/** "Earning(per month)" header with the green sort arrows (designs 15, 27, 37 …). */
export function EarningHeader({ onSort }: { onSort?: () => void }) {
  return (
    <button type="button" onClick={onSort} className="inline-flex items-center gap-1" aria-label="Sort by earnings">
      <Icon name="sort" size={14} className="text-positive" />
      Earning<span className="text-[10px]">(per month)</span>
    </button>
  );
}

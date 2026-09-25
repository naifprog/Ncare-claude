"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PhotoAvatar } from "@/components/ui/Avatar";
import { TableTag } from "@/components/ui/Badge";
import { OutlineIconButton, outlineIconButtonClass } from "@/components/ui/Button";
import { useAccess } from "@/components/auth/AccessProvider";
import { BranchTabs, useBranchTab } from "@/components/main/BranchTabs";
import { HeaderFilter } from "@/components/ui/HeaderFilter";
import { Icon } from "@/components/ui/Icon";
import { EmbeddedFrame, ListCard, ListToolbar } from "@/components/ui/ListToolbar";
import { ExportMenu } from "@/components/ui/ExportMenu";
import { Pagination, usePagination } from "@/components/ui/Pagination";
import { removeRecord, toast, useRemovedIds } from "@/lib/demo-state";
import { EarningsValue, NationalityChip } from "@/components/workers/WorkerBits";
import { nationalities, positions } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import type { WorkerProfile } from "@/types";

/** Column widths measured from design screen 15 (table 1004px wide at 1440). */
const COLUMNS = ["w-[202px]", "w-[146px]", "w-[192px]", "w-[157px]", "w-[171px]", ""];

export function WorkersView({
  initialWorkers,
  basePath = "/workers",
  branchScoped,
  actionLabel = "New worker",
  actionHref,
  filters,
  rowFilter,
  exportName,
  embedded,
}: {
  initialWorkers: WorkerProfile[];
  basePath?: string;
  /** Multi-branch owner: branch selector (the user's branches) under the toolbar (designs 37, 38). */
  branchScoped?: boolean;
  actionLabel?: string;
  /** Overrides the "New …" link target (defaults to `${basePath}/add`). */
  actionHref?: string;
  /** Filter row under the toolbar (super admin: salon / branch selects, designs 66, 67). */
  filters?: React.ReactNode;
  /** Extra row filter (super admin salon / branch selects). */
  rowFilter?: (row: WorkerProfile) => boolean;
  /** Adds the orange export button to the Options header. */
  exportName?: string;
  /** Table + pagination only, for use inside another card (salon user tabs, designs 61, 62). */
  embedded?: boolean;
}) {
  const { branches, can } = useAccess();
  const removed = useRemovedIds();
  const [branch, setBranch] = useBranchTab(branches);
  const scope = branchScoped ? branch : undefined;
  const [query, setQuery] = useState("");
  const [nationality, setNationality] = useState<string | null>(null);
  const [position, setPosition] = useState<string | null>(null);
  const [sortDesc, setSortDesc] = useState<boolean | null>(null);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = initialWorkers.filter(
      (w) =>
        !removed.has(w.id) &&
        (!branchScoped || !!w.branchIds?.includes(branch)) &&
        (!rowFilter || rowFilter(w)) &&
        (!q || w.name.toLowerCase().includes(q) || w.idNumber.includes(q)) &&
        (!nationality || w.nationality === nationality) &&
        (!position || w.role === position),
    );
    if (sortDesc === null) return filtered;
    return [...filtered].sort((a, b) => (sortDesc ? b.earnings - a.earnings : a.earnings - b.earnings));
  }, [initialWorkers, removed, branchScoped, branch, rowFilter, query, nationality, position, sortDesc]);
  const { pageRows, pagination } = usePagination(visible);

  const Frame = embedded ? EmbeddedFrame : ListCard;

  return (
    <Frame>
      {!embedded && (
      <ListToolbar
        query={query}
        onQueryChange={setQuery}
        actionLabel={actionLabel}
        actionHref={
          can("workers.add", scope) ? (actionHref ?? `${basePath}/add${scope ? `?branch=${scope}` : ""}`) : undefined
        }
      />
      )}

      {filters ? <div className="mt-2.5">{filters}</div> : null}

      {branchScoped ? (
        <BranchTabs branches={branches} value={branch} onChange={setBranch} className="mt-2.5" />
      ) : null}

      <div className={cn(branchScoped || filters ? "mt-2.5" : embedded ? "mt-0" : "mt-5", "overflow-x-auto thin-scrollbar")}>
        <table className="w-full min-w-[1004px] table-fixed border-collapse text-left text-sm text-ink">
          <colgroup>
            {COLUMNS.map((w, i) => (
              <col key={i} className={w} />
            ))}
          </colgroup>
          <thead>
            <tr className="h-[50px] bg-page">
              <th className="pl-5 font-normal">User Name</th>
              <th className="font-normal">IdNumber</th>
              <th className="font-normal">
                <HeaderFilter
                  label="Nationality"
                  options={nationalities.map((n) => n.name)}
                  value={nationality}
                  onChange={setNationality}
                />
              </th>
              <th className="font-normal">
                <HeaderFilter label="Position" options={positions} value={position} onChange={setPosition} />
              </th>
              <th className="font-normal">
                <button
                  type="button"
                  onClick={() => setSortDesc((s) => (s === null ? true : !s))}
                  className="inline-flex items-center gap-1"
                  aria-label="Sort by earnings"
                >
                  <Icon name="sort" size={14} className="text-positive" />
                  Earning<span className="text-[10px]">(per month)</span>
                </button>
              </th>
              <th className="font-normal">
                {exportName ? (
                  <span className="flex items-center justify-between pr-5">
                    Options
                    <ExportMenu
                      fileName={exportName}
                      rows={visible.map((w) => ({ Name: w.name, "Id number": w.idNumber, Nationality: w.nationality, Position: w.role, Earning: w.earnings }))}
                    />
                  </span>
                ) : (
                  "Options"
                )}
              </th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((worker, i) => (
              <tr key={worker.id} className="h-[70px] border-b border-[#f2f2f2]">
                <td className="pl-5">
                  <Link href={`${basePath}/${worker.id}`} className="flex items-center gap-2.5 hover:underline">
                    <PhotoAvatar tint={i} status={worker.status} />
                    <span className="truncate">{worker.name}</span>
                  </Link>
                </td>
                <td>{worker.idNumber}</td>
                <td>
                  <NationalityChip flag={worker.nationalityFlag} name={worker.nationality} />
                </td>
                <td>
                  <TableTag>{worker.role}</TableTag>
                </td>
                <td className="pl-4">
                  <EarningsValue amount={worker.earnings} trend={worker.earningsTrend} />
                </td>
                <td>
                  <div className="flex items-center gap-2.5">
                    <Link
                      href={`${basePath}/${worker.id}`}
                      aria-label={`View ${worker.name}`}
                      className={outlineIconButtonClass("orange")}
                    >
                      <Icon name="eye" size={18} />
                    </Link>
                    {can("workers.edit", scope) && (
                      <Link
                        href={`${basePath}/${worker.id}/edit`}
                        aria-label={`Edit ${worker.name}`}
                        className={outlineIconButtonClass("brand")}
                      >
                        <Icon name="edit" size={18} />
                      </Link>
                    )}
                    {can("workers.delete", scope) && (
                      <OutlineIconButton
                        tone="negative"
                        aria-label={`Delete ${worker.name}`}
                        onClick={() => {
                          removeRecord(worker.id);
                          toast(`${worker.name} deleted. Demo only: the worker returns after a reload.`);
                        }}
                      >
                        <Icon name="trash" size={18} />
                      </OutlineIconButton>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {visible.length === 0 && (
              <tr>
                <td colSpan={6} className="py-10 text-center text-ink-muted">
                  No workers match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination className="mt-auto" {...pagination} />
    </Frame>
  );
}

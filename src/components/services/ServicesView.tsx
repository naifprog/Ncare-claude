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
import { serviceCategories } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import type { SalonService, WorkerProfile } from "@/types";

/** Column widths measured from design screen 19 (table 1004px wide at 1440). */
const COLUMNS = ["w-[149px]", "w-[166px]", "w-[194px]", "w-[164px]", "w-[135px]", ""];

/** One worker → avatar + name; several → overlapping avatar stack (design 19, 21). */
export function ServiceWorkers({ workers }: { workers: WorkerProfile[] }) {
  if (workers.length === 1) {
    return (
      <span className="flex items-center gap-2.5">
        <PhotoAvatar status={workers[0].status} />
        <span className="truncate">{workers[0].name}</span>
      </span>
    );
  }
  return (
    <span className="flex -space-x-2.5">
      {workers.map((w, i) => (
        <PhotoAvatar key={w.id} tint={i} status={w.status} />
      ))}
    </span>
  );
}

export function PriceValue({ amount, className }: { amount: number; className?: string }) {
  return (
    <span className={cn("text-brand", className)}>
      <span className="font-bold">{amount}</span> <span className="text-[0.72em]">SAR</span>
    </span>
  );
}

export function ServicesView({
  initialServices,
  workers,
  basePath = "/services",
  branchScoped,
  actionLabel = "New service",
  actionHref,
  filters,
  rowFilter,
  exportName,
  embedded,
}: {
  initialServices: SalonService[];
  workers: WorkerProfile[];
  basePath?: string;
  /** Multi-branch owner: branch selector (the user's branches) under the toolbar (design 40). */
  branchScoped?: boolean;
  actionLabel?: string;
  /** Overrides the "New …" link target (defaults to `${basePath}/add`). */
  actionHref?: string;
  /** Filter row under the toolbar (super admin: salon / branch selects, designs 66, 67). */
  filters?: React.ReactNode;
  /** Extra row filter (super admin salon / branch selects). */
  rowFilter?: (row: SalonService) => boolean;
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
  const [category, setCategory] = useState<string | null>(null);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return initialServices.filter(
      (s) =>
        !removed.has(s.id) &&
        (!branchScoped || !!s.branchIds?.includes(branch)) &&
        (!rowFilter || rowFilter(s)) &&
        (!q || s.name.toLowerCase().includes(q)) &&
        (!category || s.category === category),
    );
  }, [initialServices, removed, branchScoped, branch, rowFilter, query, category]);
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
          can("services.add", scope) ? (actionHref ?? `${basePath}/add${scope ? `?branch=${scope}` : ""}`) : undefined
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
              <th className="pl-[29px] font-normal">Num</th>
              <th className="font-normal">Service Name</th>
              <th className="font-normal">Workers</th>
              <th className="font-normal">
                <HeaderFilter label="Category" options={serviceCategories} value={category} onChange={setCategory} />
              </th>
              <th className="font-normal">Price</th>
              <th className="font-normal">
                {exportName ? (
                  <span className="flex items-center justify-between pr-5">
                    Options
                    <ExportMenu
                      fileName={exportName}
                      rows={visible.map((s) => ({ Num: s.num, Service: s.name, Category: s.category, Price: s.price }))}
                    />
                  </span>
                ) : (
                  "Options"
                )}
              </th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((service) => (
              <tr key={service.id} className="h-[70px] border-b border-[#f2f2f2]">
                <td className="pl-[29px]">{service.num}</td>
                <td>
                  <Link href={`${basePath}/${service.id}`} className="hover:underline">
                    {service.name}
                  </Link>
                </td>
                <td>
                  <ServiceWorkers workers={workers.filter((w) => service.workerIds.includes(w.id))} />
                </td>
                <td>
                  <TableTag className="min-w-[84px]">{service.category}</TableTag>
                </td>
                <td>
                  <PriceValue amount={service.price} />
                </td>
                <td>
                  <div className="flex items-center gap-2.5">
                    <Link
                      href={`${basePath}/${service.id}`}
                      aria-label={`View ${service.name}`}
                      className={outlineIconButtonClass("orange")}
                    >
                      <Icon name="eye" size={18} />
                    </Link>
                    {can("services.edit", scope) && (
                      <Link
                        href={`${basePath}/${service.id}/edit`}
                        aria-label={`Edit ${service.name}`}
                        className={outlineIconButtonClass("brand")}
                      >
                        <Icon name="edit" size={18} />
                      </Link>
                    )}
                    {can("services.delete", scope) && (
                      <OutlineIconButton
                        tone="negative"
                        aria-label={`Delete ${service.name}`}
                        onClick={() => {
                          removeRecord(service.id);
                          toast(`Service ${service.num} deleted. Demo only: it returns after a reload.`);
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
                  No services match your search.
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

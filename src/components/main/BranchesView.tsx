"use client";

import { useMemo, useState } from "react";
import { useAccess } from "@/components/auth/AccessProvider";
import { DataTable, EarningHeader, RowActions, type Column } from "@/components/ui/DataTable";
import { HeaderFilter } from "@/components/ui/HeaderFilter";
import { ListCard, ListToolbar } from "@/components/ui/ListToolbar";
import { Pagination, usePagination } from "@/components/ui/Pagination";
import { EarningsValue } from "@/components/workers/WorkerBits";
import { branchManagerLabel, branchManagers } from "@/lib/access/directory";
import { removeRecord, toast, useRemovedIds } from "@/lib/demo-state";
import { regions, type Branch } from "@/lib/mock-main";

/** All Branches (Main Salon UI, design 27): only the branches the user is assigned to. */
export function BranchesView({ initial }: { initial: Branch[] }) {
  const { can, canAccessBranch } = useAccess();
  const removed = useRemovedIds();
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState<string | null>(null);
  const [sortDesc, setSortDesc] = useState<boolean | null>(null);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = initial.filter(
      (b) =>
        canAccessBranch(b.id) &&
        !removed.has(b.id) &&
        (!q || b.name.toLowerCase().includes(q) || branchManagers(b).some((m) => m.name.toLowerCase().includes(q))) &&
        (!region || b.region === region),
    );
    if (sortDesc === null) return list;
    return [...list].sort((a, b) => (sortDesc ? b.earnings - a.earnings : a.earnings - b.earnings));
  }, [initial, canAccessBranch, removed, query, region, sortDesc]);
  const { pageRows, pagination } = usePagination(visible);

  const columns: Column<Branch>[] = [
    { key: "num", header: "Num", width: "w-[130px]", render: (b) => b.num },
    {
      key: "name",
      header: "Branch name",
      width: "w-[210px]",
      render: (b) => <span className="inline-flex h-[30px] items-center rounded-[3px] bg-page px-2">{b.name}</span>,
    },
    {
      key: "manager",
      header: "Manager name",
      width: "w-[165px]",
      render: (b) => (
        <span title={branchManagers(b).map((m) => m.name).join(", ") || "No manager assigned"}>{branchManagerLabel(b)}</span>
      ),
    },
    {
      key: "region",
      header: <HeaderFilter label="Region" options={regions} value={region} onChange={setRegion} />,
      width: "w-[140px]",
      render: (b) => b.region,
    },
    {
      key: "earning",
      header: <EarningHeader onSort={() => setSortDesc((s) => (s === null ? true : !s))} />,
      width: "w-[180px]",
      render: (b) => <EarningsValue amount={b.earnings} trend={b.earningsTrend} />,
    },
    {
      key: "options",
      header: "Options",
      render: (b) => (
        <RowActions
          label={b.name}
          powersHref={`/main/powers/${b.id}`}
          viewHref={`/main/branches/${b.id}`}
          editHref={`/main/branches/${b.id}/edit`}
          onDelete={
            can("branches.delete")
              ? () => {
                  removeRecord(b.id);
                  toast(`${b.name} deleted. Demo only: it returns after a reload.`);
                }
              : undefined
          }
        />
      ),
    },
  ];

  return (
    <ListCard>
      <ListToolbar query={query} onQueryChange={setQuery} actionLabel="New branch" actionHref="/main/branches/add" />
      <div className="mt-5">
        <DataTable columns={columns} rows={pageRows} rowKey={(b) => b.id} emptyText="No branches match your search." />
      </div>
      <Pagination className="mt-auto" {...pagination} />
    </ListCard>
  );
}

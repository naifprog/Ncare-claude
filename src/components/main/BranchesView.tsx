"use client";

import { useMemo, useState } from "react";
import { DataTable, EarningHeader, RowActions, type Column } from "@/components/ui/DataTable";
import { HeaderFilter } from "@/components/ui/HeaderFilter";
import { ListCard, ListToolbar } from "@/components/ui/ListToolbar";
import { Pagination } from "@/components/ui/Pagination";
import { EarningsValue } from "@/components/workers/WorkerBits";
import { regions, type Branch } from "@/lib/mock-main";

/** All Branches (Main Salon UI, design 27). */
export function BranchesView({ initial }: { initial: Branch[] }) {
  const [rows, setRows] = useState(initial);
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState<string | null>(null);
  const [sortDesc, setSortDesc] = useState<boolean | null>(null);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = rows.filter(
      (b) =>
        (!q || b.name.toLowerCase().includes(q) || b.manager.toLowerCase().includes(q)) &&
        (!region || b.region === region),
    );
    if (sortDesc === null) return list;
    return [...list].sort((a, b) => (sortDesc ? b.earnings - a.earnings : a.earnings - b.earnings));
  }, [rows, query, region, sortDesc]);

  const columns: Column<Branch>[] = [
    { key: "num", header: "Num", width: "w-[130px]", render: (b) => b.num },
    {
      key: "name",
      header: "Branch name",
      width: "w-[210px]",
      render: (b) => <span className="inline-flex h-[30px] items-center rounded-[3px] bg-page px-2">{b.name}</span>,
    },
    { key: "manager", header: "Manager name", width: "w-[165px]", render: (b) => b.manager },
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
          onDelete={() => setRows((r) => r.filter((x) => x.id !== b.id))}
        />
      ),
    },
  ];

  return (
    <ListCard>
      <ListToolbar query={query} onQueryChange={setQuery} actionLabel="New branch" actionHref="/main/branches/add" />
      <div className="mt-5">
        <DataTable columns={columns} rows={visible} rowKey={(b) => b.id} emptyText="No branches match your search." />
      </div>
      <Pagination className="mt-auto" />
    </ListCard>
  );
}

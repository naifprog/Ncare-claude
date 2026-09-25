"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useAccess } from "@/components/auth/AccessProvider";
import { DataTable } from "@/components/ui/DataTable";
import { ListCard, ListToolbar } from "@/components/ui/ListToolbar";
import { Pagination, usePagination } from "@/components/ui/Pagination";
import type { Branch } from "@/lib/mock-main";

/** Branches powers (design 43): each branch links to its permission editor. */
export function BranchPowersView({ branches }: { branches: Branch[] }) {
  const { canAccessBranch } = useAccess();
  const [query, setQuery] = useState("");
  const rows = useMemo(
    () => branches.filter((b) => canAccessBranch(b.id) && b.name.toLowerCase().includes(query.trim().toLowerCase())),
    [branches, canAccessBranch, query],
  );
  const { pageRows, pagination } = usePagination(rows);

  return (
    <ListCard>
      <ListToolbar query={query} onQueryChange={setQuery} actionLabel="New branch" actionHref="/main/branches/add" />
      <div className="mt-5">
        <DataTable
          columns={[
            { key: "num", header: "Num", width: "w-[180px]", render: (b) => b.num },
            {
              key: "name",
              header: "Branch name",
              width: "w-[621px]",
              render: (b) => <span className="inline-flex h-[30px] items-center rounded-[3px] bg-page px-1.5">{b.name}</span>,
            },
            {
              key: "powers",
              header: "Powers",
              render: (b) => (
                <Link
                  href={`/main/powers/${b.id}`}
                  className="inline-flex h-10 w-[124px] items-center justify-center rounded-[5px] bg-info text-[15px] font-bold text-white shadow-card"
                >
                  Edit powers
                </Link>
              ),
            },
          ]}
          rows={pageRows}
          rowKey={(b) => b.id}
          emptyText="No branches match your search."
        />
      </div>
      <Pagination className="mt-auto" {...pagination} />
    </ListCard>
  );
}
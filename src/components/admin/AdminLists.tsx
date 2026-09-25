"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { useAccess } from "@/components/auth/AccessProvider";
import { AccountTypeBadge } from "@/components/admin/AccountTypeBadge";
import { RequestsTable } from "@/components/requests/RequestsTable";
import { DataTable, EarningHeader, RowActions, type Column } from "@/components/ui/DataTable";
import { ExportMenu } from "@/components/ui/ExportMenu";
import { HeaderFilter } from "@/components/ui/HeaderFilter";
import { ListCard, ListToolbar } from "@/components/ui/ListToolbar";
import { Pagination, usePagination } from "@/components/ui/Pagination";
import { SearchSelect } from "@/components/ui/SearchSelect";
import { ServicesView } from "@/components/services/ServicesView";
import { EarningsValue } from "@/components/workers/WorkerBits";
import { WorkersView } from "@/components/workers/WorkersView";
import { directoryUsers } from "@/lib/access/directory";
import { removeRecord, toast, useRemovedIds } from "@/lib/demo-state";
import {
  ACCOUNT_TYPES,
  BRANCH_FILTERS,
  SALON_FILTERS,
  TYPES_WITH_POWERS,
  adminBranches,
  salonBranchOf,
  type AdminBranch,
  type AdminSalon,
  type AdminUser,
} from "@/lib/mock-admin";
import { regions } from "@/lib/mock-main";
import type { RequestPriority, RequestStatus, SalonRequest, SalonService, WorkerProfile } from "@/types";

function OptionsHeader({ name, rows }: { name: string; rows: Record<string, string | number>[] }) {
  return (
    <span className="flex items-center justify-between pr-5">
      Options <ExportMenu fileName={name} rows={rows} />
    </span>
  );
}

function deleteRecord(id: string, label: string) {
  removeRecord(id);
  toast(`${label} deleted. Demo only: it returns after a reload.`);
}

/** Directory account behind a salon row (profile / edit / powers links). */
function salonUserId(salon: AdminSalon) {
  return directoryUsers.find((u) => u.accountType === "Salon" && u.name === salon.name)?.id ?? "user-2";
}

/** Blank 30px slot keeping action columns aligned when a row has no "powers" button (design 51). */
function PowersSpacer() {
  return <span className="inline-block h-[30px] w-[30px]" aria-hidden="true" />;
}

// ---------------------------------------------------------------------------
// Users (designs 51, 52)
// ---------------------------------------------------------------------------

export function UsersView({ initial }: { initial: AdminUser[] }) {
  const { can } = useAccess();
  const removed = useRemovedIds();
  const [query, setQuery] = useState("");
  const [type, setType] = useState<string | null>(null);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return initial.filter(
      (u) =>
        !removed.has(u.id) &&
        (!q || u.name.toLowerCase().includes(q) || u.username?.includes(q)) &&
        (!type || u.accountType === type),
    );
  }, [initial, removed, query, type]);
  const { pageRows, pagination } = usePagination(visible);

  const columns: Column<AdminUser>[] = [
    { key: "num", header: "Num", width: "w-[160px]", render: (u) => u.num },
    { key: "name", header: "User name", width: "w-[194px]", render: (u) => u.name },
    { key: "join", header: "Join Date", width: "w-[183px]", render: (u) => u.joinDate },
    {
      key: "type",
      header: <HeaderFilter label="Account type" options={[...ACCOUNT_TYPES]} value={type} onChange={setType} />,
      width: "w-[250px]",
      render: (u) => <AccountTypeBadge type={u.accountType} />,
    },
    {
      key: "options",
      header: (
        <OptionsHeader
          name="users"
          rows={visible.map((u) => ({ Num: u.num, Name: u.name, "Join date": u.joinDate, Type: u.accountType }))}
        />
      ),
      render: (u) => (
        <div className="flex items-center gap-2.5">
          {TYPES_WITH_POWERS.includes(u.accountType) && can("powers.manage") ? null : <PowersSpacer />}
          <RowActions
            label={u.name}
            powersHref={TYPES_WITH_POWERS.includes(u.accountType) ? `/admin/powers/add?user=${u.id}` : undefined}
            viewHref={`/admin/users/${u.id}`}
            editHref={`/admin/users/${u.id}/edit`}
            onDelete={can("users.delete") ? () => deleteRecord(u.id, u.name) : undefined}
          />
        </div>
      ),
    },
  ];

  return (
    <ListCard>
      <ListToolbar query={query} onQueryChange={setQuery} actionLabel="New User" actionHref="/admin/users/add" />
      <div className="mt-5">
        <DataTable columns={columns} rows={pageRows} rowKey={(u) => u.id} emptyText="No users match your filters." />
      </div>
      <Pagination className="mt-auto" {...pagination} />
    </ListCard>
  );
}

// ---------------------------------------------------------------------------
// Salons (design 64)
// ---------------------------------------------------------------------------

export function SalonsView({ initial }: { initial: AdminSalon[] }) {
  const { can } = useAccess();
  const removed = useRemovedIds();
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState<string | null>(null);

  const visible = initial.filter(
    (s) =>
      !removed.has(s.id) &&
      (!query.trim() || s.name.toLowerCase().includes(query.trim().toLowerCase()) || s.manager.toLowerCase().includes(query.trim().toLowerCase())) &&
      (!region || s.region === region),
  );
  const { pageRows, pagination } = usePagination(visible);

  const columns: Column<AdminSalon>[] = [
    { key: "num", header: "Num", width: "w-[103px]", render: (s) => s.num },
    {
      key: "name",
      header: "Salon name",
      width: "w-[144px]",
      render: (s) => <span className="inline-flex h-[30px] items-center rounded-[3px] bg-page px-1.5">{s.name}</span>,
    },
    { key: "manager", header: "Manager name", width: "w-[154px]", render: (s) => s.manager },
    { key: "branches", header: "Branch Num", width: "w-[136px]", render: (s) => s.branchCount },
    {
      key: "region",
      header: <HeaderFilter label="Region" options={regions} value={region} onChange={setRegion} />,
      width: "w-[131px]",
      render: (s) => s.region,
    },
    { key: "earning", header: <EarningHeader />, width: "w-[167px]", render: (s) => <EarningsValue amount={s.earnings} trend="up" /> },
    {
      key: "options",
      header: <OptionsHeader name="salons" rows={visible.map((s) => ({ Num: s.num, Salon: s.name, Manager: s.manager }))} />,
      render: (s) => (
        <RowActions
          label={s.name}
          powersHref={`/admin/powers/add?user=${salonUserId(s)}`}
          viewHref={`/admin/users/${salonUserId(s)}`}
          editHref={can("salons.manage") ? `/admin/users/${salonUserId(s)}/edit` : undefined}
          onDelete={can("salons.manage") ? () => deleteRecord(s.id, s.name) : undefined}
        />
      ),
    },
  ];

  return (
    <ListCard>
      <ListToolbar
        query={query}
        onQueryChange={setQuery}
        actionLabel="New Salon"
        actionHref={can("salons.manage") ? "/admin/users/add?type=Salon" : undefined}
      />
      <div className="mt-5">
        <DataTable columns={columns} rows={pageRows} rowKey={(s) => s.id} emptyText="No salons match your search." />
      </div>
      <Pagination className="mt-auto" {...pagination} />
    </ListCard>
  );
}

// ---------------------------------------------------------------------------
// Branches of all salons (design 65)
// ---------------------------------------------------------------------------

export function AdminBranchesView() {
  const { can } = useAccess();
  const removed = useRemovedIds();
  const [query, setQuery] = useState("");
  const [salon, setSalon] = useState<string | null>(null);
  const [region, setRegion] = useState<string | null>(null);

  const visible = adminBranches.filter(
    (b) =>
      !removed.has(b.id) &&
      (!query.trim() || b.name.toLowerCase().includes(query.trim().toLowerCase())) &&
      (!salon || b.salon === salon) &&
      (!region || b.region === region),
  );
  const { pageRows, pagination } = usePagination(visible);

  const columns: Column<AdminBranch>[] = [
    { key: "num", header: "Num", width: "w-[130px]", render: (b) => b.num },
    { key: "salon", header: "Salon", width: "w-[151px]", render: (b) => b.salon },
    { key: "name", header: "Branch name", width: "w-[210px]", render: (b) => b.name },
    {
      key: "region",
      header: <HeaderFilter label="Region" options={regions} value={region} onChange={setRegion} />,
      width: "w-[134px]",
      render: (b) => b.region,
    },
    { key: "earning", header: <EarningHeader />, width: "w-[200px]", render: (b) => <EarningsValue amount={b.earnings} trend="up" /> },
    {
      key: "options",
      header: <OptionsHeader name="branches" rows={visible.map((b) => ({ Num: b.num, Salon: b.salon, Branch: b.name }))} />,
      render: (b) => (
        <RowActions
          label={b.name}
          powersHref="/admin/powers/add?user=user-3"
          viewHref="/admin/users/user-3"
          editHref={can("branches.edit") ? "/admin/users/user-3/edit" : undefined}
          onDelete={can("branches.delete") ? () => deleteRecord(b.id, b.name) : undefined}
        />
      ),
    },
  ];

  return (
    <ListCard>
      <ListToolbar
        query={query}
        onQueryChange={setQuery}
        actionLabel="New Branch"
        actionHref={can("branches.add") ? "/admin/users/add?type=Branch" : undefined}
        middle={
          <SearchSelect
            allLabel="All Salons"
            options={SALON_FILTERS}
            value={salon}
            onChange={setSalon}
            className="w-full sm:w-[340px]"
          />
        }
      />
      <div className="mt-5">
        <DataTable columns={columns} rows={pageRows} rowKey={(b) => b.id} emptyText="No branches match your filters." />
      </div>
      <Pagination className="mt-auto" {...pagination} />
    </ListCard>
  );
}

// ---------------------------------------------------------------------------
// Services / workers of all salons (designs 66, 67)
// ---------------------------------------------------------------------------

/** "All Salons" / "All Branches" selects (designs 66–68); the branch list follows the chosen salon. */
function useSalonBranchFilter() {
  const [salon, setSalon] = useState<string | null>(null);
  const [branch, setBranch] = useState<string | null>(null);
  const branchOptions = salon ? adminBranches.filter((b) => b.salon === salon).map((b) => b.name) : BRANCH_FILTERS;
  const matches = useCallback(
    (recordId: string) => {
      const of = salonBranchOf(recordId);
      return (!salon || of.salon === salon) && (!branch || of.branch === branch);
    },
    [salon, branch],
  );
  const filters = (
    <div className="grid gap-2.5 sm:grid-cols-2 sm:gap-5">
      <SearchSelect
        allLabel="All Salons"
        options={SALON_FILTERS}
        value={salon}
        onChange={(v) => {
          setSalon(v);
          setBranch(null);
        }}
      />
      <SearchSelect allLabel="All Branches" options={branchOptions} value={branch} onChange={setBranch} />
    </div>
  );
  return { filters, matches, salon, branch };
}

export function AdminServicesView({ services, workers }: { services: SalonService[]; workers: WorkerProfile[] }) {
  const { filters, matches } = useSalonBranchFilter();
  const rowFilter = useCallback((s: SalonService) => matches(s.id), [matches]);
  return (
    <ServicesView
      initialServices={services}
      workers={workers}
      basePath="/admin/salons/services"
      actionLabel="New Service"
      filters={filters}
      rowFilter={rowFilter}
      exportName="services"
    />
  );
}

export function AdminWorkersView({ workers }: { workers: WorkerProfile[] }) {
  const { filters, matches } = useSalonBranchFilter();
  const rowFilter = useCallback((w: WorkerProfile) => matches(w.id), [matches]);
  return (
    <WorkersView
      initialWorkers={workers}
      basePath="/admin/salons/workers"
      actionLabel="New Worker"
      actionHref="/admin/users/add?type=Worker"
      filters={filters}
      rowFilter={rowFilter}
      exportName="workers"
    />
  );
}

// ---------------------------------------------------------------------------
// Requests of all salons (design 68)
// ---------------------------------------------------------------------------

const STATUS_LABELS: Record<RequestStatus, string> = {
  new: "New Requests",
  pending: "Pending Requests",
  completed: "Completed Requests",
  incomplete: "Incompleted Requests",
};

export function AdminRequestsView({ data }: { data: Record<RequestStatus, SalonRequest[]> }) {
  const { can } = useAccess();
  const [status, setStatus] = useState<RequestStatus>("new");
  const { filters, matches } = useSalonBranchFilter();
  const [query, setQuery] = useState("");
  const [service, setService] = useState<string | null>(null);
  const [priority, setPriority] = useState<RequestPriority | null>(null);

  const rows = data[status].filter(
    (r) =>
      matches(r.id) &&
      (!query.trim() || r.workerName.toLowerCase().includes(query.trim().toLowerCase()) || String(r.num).includes(query)) &&
      (!service || r.service === service) &&
      (!priority || r.priority === priority),
  );
  const statusEntries = Object.entries(STATUS_LABELS) as [RequestStatus, string][];

  return (
    <ListCard>
      <div className="flex flex-col gap-[22px] sm:flex-row sm:items-center">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search .."
          aria-label="Search requests"
          className="h-[50px] min-w-0 shrink-0 rounded-pill sm:flex-1 bg-page px-[30px] text-sm text-ink placeholder:text-[#aeaeae] focus:outline focus:outline-brand"
        />
        {can("requests.add") && (
          <Link
            href="/admin/salons/requests/add"
            className="inline-flex h-[50px] shrink-0 items-center justify-center rounded-pill bg-brand text-[15px] font-bold text-white shadow-card sm:w-[175px]"
          >
            New Request
          </Link>
        )}
      </div>
      <div className="mt-2.5 grid gap-2.5 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] sm:gap-5">
        {filters}
        <SearchSelect
          allLabel="New Requests"
          searchable={false}
          options={statusEntries.slice(1).map(([, label]) => label)}
          value={status === "new" ? null : STATUS_LABELS[status]}
          onChange={(label) => setStatus(statusEntries.find(([, l]) => l === label)?.[0] ?? "new")}
        />
      </div>
      <RequestsTable
        key={status}
        rows={rows}
        status={status}
        serviceFilter={service}
        onServiceFilter={setService}
        priorityFilter={priority}
        onPriorityFilter={(v) => setPriority(v as RequestPriority | null)}
        basePath="/admin/salons/requests"
        exportName="requests"
      />
    </ListCard>
  );
}

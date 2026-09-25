"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AccountTypeBadge } from "@/components/admin/AccountTypeBadge";
import { RequestsTable } from "@/components/requests/RequestsTable";
import { DataTable, EarningHeader, RowActions, type Column } from "@/components/ui/DataTable";
import { ExportMenu } from "@/components/ui/ExportMenu";
import { HeaderFilter } from "@/components/ui/HeaderFilter";
import { ListCard, ListToolbar } from "@/components/ui/ListToolbar";
import { Pagination } from "@/components/ui/Pagination";
import { SearchSelect } from "@/components/ui/SearchSelect";
import { ServicesView } from "@/components/services/ServicesView";
import { EarningsValue } from "@/components/workers/WorkerBits";
import { WorkersView } from "@/components/workers/WorkersView";
import {
  ACCOUNT_TYPES,
  BRANCH_FILTERS,
  SALON_FILTERS,
  TYPES_WITH_POWERS,
  adminBranches,
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

/** Blank 30px slot keeping action columns aligned when a row has no "powers" button (design 51). */
function PowersSpacer() {
  return <span className="inline-block h-[30px] w-[30px]" aria-hidden="true" />;
}

// ---------------------------------------------------------------------------
// Users (designs 51, 52)
// ---------------------------------------------------------------------------

export function UsersView({ initial }: { initial: AdminUser[] }) {
  const [rows, setRows] = useState(initial);
  const [query, setQuery] = useState("");
  const [type, setType] = useState<string | null>(null);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((u) => (!q || u.name.toLowerCase().includes(q)) && (!type || u.accountType === type));
  }, [rows, query, type]);

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
          {TYPES_WITH_POWERS.includes(u.accountType) ? null : <PowersSpacer />}
          <RowActions
            label={u.name}
            powersHref={TYPES_WITH_POWERS.includes(u.accountType) ? `/admin/powers/add?user=${u.id}` : undefined}
            viewHref={`/admin/users/${u.id}`}
            editHref={`/admin/users/${u.id}/edit`}
            onDelete={() => setRows((r) => r.filter((x) => x.id !== u.id))}
          />
        </div>
      ),
    },
  ];

  return (
    <ListCard>
      <ListToolbar query={query} onQueryChange={setQuery} actionLabel="New User" actionHref="/admin/users/add" />
      <div className="mt-5">
        <DataTable columns={columns} rows={visible} rowKey={(u) => u.id} emptyText="No users match your filters." />
      </div>
      <Pagination className="mt-auto" />
    </ListCard>
  );
}

// ---------------------------------------------------------------------------
// Salons (design 64)
// ---------------------------------------------------------------------------

export function SalonsView({ initial }: { initial: AdminSalon[] }) {
  const [rows, setRows] = useState(initial);
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState<string | null>(null);

  const visible = rows.filter(
    (s) =>
      (!query.trim() || s.name.toLowerCase().includes(query.trim().toLowerCase())) && (!region || s.region === region),
  );

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
          powersHref={`/admin/powers/add?salon=${s.id}`}
          viewHref="/admin/users/user-2"
          editHref="/admin/users/user-2/edit"
          onDelete={() => setRows((r) => r.filter((x) => x.id !== s.id))}
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
        actionHref="/admin/users/add?type=Salon"
      />
      <div className="mt-5">
        <DataTable columns={columns} rows={visible} rowKey={(s) => s.id} emptyText="No salons match your search." />
      </div>
      <Pagination className="mt-auto" />
    </ListCard>
  );
}

// ---------------------------------------------------------------------------
// Branches of all salons (design 65)
// ---------------------------------------------------------------------------

type AdminBranch = (typeof adminBranches)[number];

export function AdminBranchesView() {
  const [rows, setRows] = useState(adminBranches);
  const [query, setQuery] = useState("");
  const [salon, setSalon] = useState<string | null>(null);
  const [region, setRegion] = useState<string | null>(null);

  const visible = rows.filter(
    (b) =>
      (!query.trim() || b.name.toLowerCase().includes(query.trim().toLowerCase())) && (!region || b.region === region),
  );

  const columns: Column<AdminBranch>[] = [
    { key: "num", header: "Num", width: "w-[130px]", render: (b) => b.num },
    { key: "salon", header: "Salon", width: "w-[151px]", render: (b) => salon ?? b.salon },
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
          powersHref={`/admin/powers/add?branch=${b.id}`}
          viewHref="/admin/users/user-3"
          editHref="/admin/users/user-3/edit"
          onDelete={() => setRows((r) => r.filter((x) => x.id !== b.id))}
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
        actionHref="/admin/users/add?type=Branch"
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
        <DataTable columns={columns} rows={visible} rowKey={(b) => b.id} emptyText="No branches match your search." />
      </div>
      <Pagination className="mt-auto" />
    </ListCard>
  );
}

// ---------------------------------------------------------------------------
// Services / workers of all salons (designs 66, 67)
// ---------------------------------------------------------------------------

function SalonBranchFilters() {
  const [salon, setSalon] = useState<string | null>(null);
  const [branch, setBranch] = useState<string | null>(null);
  return (
    <div className="grid gap-2.5 sm:grid-cols-2 sm:gap-5">
      <SearchSelect allLabel="All Salons" options={SALON_FILTERS} value={salon} onChange={setSalon} />
      <SearchSelect allLabel="All Branches" options={BRANCH_FILTERS} value={branch} onChange={setBranch} />
    </div>
  );
}

export function AdminServicesView({ services, workers }: { services: SalonService[]; workers: WorkerProfile[] }) {
  return (
    <ServicesView
      initialServices={services}
      workers={workers}
      basePath="/admin/salons/services"
      actionLabel="New Service"
      filters={<SalonBranchFilters />}
      exportName="services"
    />
  );
}

export function AdminWorkersView({ workers }: { workers: WorkerProfile[] }) {
  return (
    <WorkersView
      initialWorkers={workers}
      basePath="/admin/salons/workers"
      actionLabel="New Worker"
      actionHref="/admin/users/add?type=Worker"
      filters={<SalonBranchFilters />}
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
  const [status, setStatus] = useState<RequestStatus>("new");
  const [salon, setSalon] = useState<string | null>(null);
  const [branch, setBranch] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [service, setService] = useState<string | null>(null);
  const [priority, setPriority] = useState<RequestPriority | null>(null);

  const rows = data[status].filter(
    (r) =>
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
          className="h-[50px] min-w-0 flex-1 rounded-pill bg-page px-[30px] text-sm text-ink placeholder:text-[#aeaeae] focus:outline focus:outline-brand"
        />
        <Link
          href="/admin/salons/requests/add"
          className="inline-flex h-[50px] shrink-0 items-center justify-center rounded-pill bg-brand text-[15px] font-bold text-white shadow-card sm:w-[175px]"
        >
          New Request
        </Link>
      </div>
      <div className="mt-2.5 grid gap-2.5 sm:grid-cols-3 sm:gap-5">
        <SearchSelect allLabel="All Salons" options={SALON_FILTERS} value={salon} onChange={setSalon} />
        <SearchSelect allLabel="All Branches" options={BRANCH_FILTERS} value={branch} onChange={setBranch} />
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

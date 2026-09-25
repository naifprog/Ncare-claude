"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { RequestsTable } from "@/components/requests/RequestsTable";
import { ServicesView } from "@/components/services/ServicesView";
import { DataTable, EarningHeader, RowActions } from "@/components/ui/DataTable";
import { PersonBoldIcon, SmsBoldIcon, VerifyBadgeIcon } from "@/components/ui/DesignIcons";
import { ExportMenu } from "@/components/ui/ExportMenu";
import { Pagination } from "@/components/ui/Pagination";
import { PowersEditor } from "@/components/ui/PowersEditor";
import { DocumentsSection } from "@/components/workers/DocumentsSection";
import { EarningsValue, NationalityChip } from "@/components/workers/WorkerBits";
import { WorkersView } from "@/components/workers/WorkersView";
import { salonUserBranches, type AdminUser } from "@/lib/mock-admin";
import { newRequests, salonServices, workerProfiles } from "@/lib/mock-data";
import { powerGroups } from "@/lib/mock-main";
import { cn } from "@/lib/utils";
import type { RequestPriority, WorkerDocument } from "@/types";

const ACTION = "flex h-[50px] items-center justify-center rounded-[5px] text-lg font-bold text-white shadow-card";

const DOCUMENTS: WorkerDocument[] = [
  { id: "doc-1", name: "Employment contract", fileName: "contract.pdf", fileType: "PDF" },
  { id: "doc-2", name: "Passport", fileName: "pass-port.pdf", fileType: "PDF" },
];

const TABS = ["Branches", "Requests", "Services", "Workers", "Documents", "Powers"] as const;
type Tab = (typeof TABS)[number];

const ADD_LINKS: Partial<Record<Tab, { label: string; href: string }>> = {
  Branches: { label: "Add new branch", href: "/admin/users/add?type=Branch" },
  Requests: { label: "Add new request", href: "/admin/salons/requests/add" },
  Services: { label: "Add new service", href: "/admin/salons/services/add" },
  Workers: { label: "Add new worker", href: "/admin/users/add?type=Worker" },
};

/** Admin user profile: worker (design 57), customer & other accounts (58), salon with tabs (59–63). */
export function UserProfileView({ user }: { user: AdminUser }) {
  const router = useRouter();
  const kind = user.accountType === "Salon" ? "salon" : user.accountType === "Worker" ? "worker" : "person";

  return (
    <section className="flex flex-col gap-5 rounded-card bg-card px-4 pb-[30px] pt-[30px] shadow-card sm:px-[30px] xl:min-h-[calc(100vh-151px)]">
      <div className="grid gap-[21px] xl:grid-cols-[minmax(0,1fr)_221px]">
        {/* Identity */}
        <div className="flex flex-col gap-[30px] rounded-[5px] bg-page p-5 sm:flex-row sm:items-center">
          {kind === "worker" ? (
            <div className="relative flex h-[140px] w-[140px] shrink-0 items-center justify-center rounded-[15px] border border-brand bg-tint-teal">
              <Image src="/images/avatar-memoji.png" alt="" width={104} height={104} />
              <VerifyBadgeIcon size={26} className="absolute -right-3 bottom-6 text-brand" />
            </div>
          ) : kind === "salon" ? (
            <Image src="/images/salon-user-logo.png" alt="" width={139} height={138} className="shrink-0 rounded-[15px]" />
          ) : (
            <div className="flex h-[140px] w-[140px] shrink-0 items-center justify-center rounded-[15px] bg-card text-info">
              <PersonBoldIcon size={60} />
            </div>
          )}

          <div className="grid flex-1 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-6 gap-y-3 text-lg text-ink sm:grid-cols-[minmax(0,300px)_119px]">
            <p className="truncate text-xl font-bold">
              {kind === "salon" ? "Mairan Salon" : "Hani hamdy"}
              {kind === "worker" ? <span className="font-normal">(Hairdresser)</span> : null}
            </p>
            <span />
            {kind === "person" ? (
              <p>Join on 15/5/2022</p>
            ) : (
              <p>{kind === "salon" ? "Ahmed Salem" : "Marina Salon"}</p>
            )}
            <NationalityChip flag="🇵🇸" name="Palestinian" className="w-[119px] justify-center bg-card px-1 text-xs" />
            {kind === "person" ? <p>474141412</p> : <p>Join on 15 May 2022</p>}
            {kind === "person" ? (
              <span />
            ) : (
              <span className="inline-flex h-[30px] w-[119px] items-center justify-center rounded-[3px] bg-card text-xs">4741414152</span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-[14px]">
          <Link
            href="/admin/messages"
            className="flex h-[50px] items-center justify-center gap-4 rounded-[5px] border border-info bg-card text-lg text-info shadow-card"
          >
            <SmsBoldIcon size={22} />
            Send message
          </Link>
          <div className="grid grid-cols-2 gap-5">
            <Link href={`/admin/users/${user.id}/edit`} className={cn(ACTION, "bg-info")}>
              Edit
            </Link>
            <button type="button" onClick={() => router.push("/admin/users")} className={cn(ACTION, "bg-negative")}>
              Delete
            </button>
          </div>
          <Link href={`/admin/users/${user.id}/password`} className={cn(ACTION, "bg-brand-orange")}>
            Update password
          </Link>
        </div>
      </div>

      {kind === "worker" && (
        <div className="flex h-[50px] items-center justify-between rounded-[5px] bg-page pl-10 pr-10 text-lg">
          <span className="text-positive">Earning(per month)</span>
          <EarningsValue amount={1440} trend="up" className="text-xl" />
        </div>
      )}

      {kind === "salon" ? <SalonTabs /> : <DocumentsSection initial={DOCUMENTS} />}
    </section>
  );
}

function SalonTabs() {
  const [tab, setTab] = useState<Tab>("Branches");
  const [branches, setBranches] = useState(salonUserBranches);
  const [service, setService] = useState<string | null>(null);
  const [priority, setPriority] = useState<RequestPriority | null>(null);
  const add = ADD_LINKS[tab];

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[#f2f2f2] pb-1">
        <div role="tablist" className="flex flex-wrap gap-x-[30px] gap-y-2">
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={t === tab}
              onClick={() => setTab(t)}
              className={cn("text-xl", t === tab ? "text-ink underline underline-offset-4" : "text-[#aeaeae] hover:text-ink")}
            >
              {t}
            </button>
          ))}
        </div>
        {add && (
          <Link href={add.href} className="text-xl text-brand underline underline-offset-4">
            {add.label}
          </Link>
        )}
      </div>

      <div className="mt-5 flex flex-1 flex-col">
        {tab === "Branches" && (
          <>
            <DataTable
              columns={[
                { key: "num", header: "Num", width: "w-[130px]", render: (b) => b.num },
                {
                  key: "name",
                  header: "Branch name",
                  width: "w-[210px]",
                  render: (b) => <span className="inline-flex h-[30px] items-center rounded-[3px] bg-page px-1.5">{b.name}</span>,
                },
                { key: "manager", header: "Manager name", width: "w-[165px]", render: (b) => b.manager },
                { key: "region", header: "Region", width: "w-[140px]", render: (b) => b.region },
                { key: "earning", header: <EarningHeader />, width: "w-[180px]", render: (b) => <EarningsValue amount={b.earnings} trend="up" /> },
                {
                  key: "options",
                  header: (
                    <span className="flex items-center justify-between pr-5">
                      Options
                      <ExportMenu fileName="branches" rows={branches.map((b) => ({ Num: b.num, Branch: b.name, Manager: b.manager }))} />
                    </span>
                  ),
                  render: (b) => (
                    <RowActions
                      label={b.name}
                      powersHref={`/admin/powers/add?branch=${b.id}`}
                      viewHref="/admin/users/user-3"
                      editHref="/admin/users/user-3/edit"
                      onDelete={() => setBranches((r) => r.filter((x) => x.id !== b.id))}
                    />
                  ),
                },
              ]}
              rows={branches}
              rowKey={(b) => b.id}
            />
            <Pagination className="mt-auto" />
          </>
        )}
        {tab === "Requests" && (
          <RequestsTable
            rows={newRequests.filter((r) => (!service || r.service === service) && (!priority || r.priority === priority))}
            status="new"
            serviceFilter={service}
            onServiceFilter={setService}
            priorityFilter={priority}
            onPriorityFilter={(v) => setPriority(v as RequestPriority | null)}
            basePath="/admin/salons/requests"
            exportName="requests"
          />
        )}
        {tab === "Services" && (
          <ServicesView
            initialServices={salonServices}
            workers={workerProfiles}
            basePath="/admin/salons/services"
            exportName="services"
            embedded
          />
        )}
        {tab === "Workers" && (
          <WorkersView initialWorkers={workerProfiles} basePath="/admin/salons/workers" exportName="workers" embedded />
        )}
        {tab === "Documents" && <DocumentsSection initial={DOCUMENTS} />}
        {tab === "Powers" && <PowersEditor groups={powerGroups} />}
      </div>
    </div>
  );
}

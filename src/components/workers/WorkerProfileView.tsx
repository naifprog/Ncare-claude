"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAccess } from "@/components/auth/AccessProvider";
import { Icon } from "@/components/ui/Icon";
import { DocumentsSection } from "@/components/workers/DocumentsSection";
import { EarningsValue, NationalityChip } from "@/components/workers/WorkerBits";
import { removeRecord, toast } from "@/lib/demo-state";
import { cn } from "@/lib/utils";
import type { WorkerProfile } from "@/types";

/** 101×50 / 221×50 action buttons of the right column (design screens 17, 18). */
const ACTION = "flex h-[50px] items-center justify-center rounded-[5px] text-lg font-bold text-white shadow-card";

/** Worker profile (design screens 17 & 18 — the latter is the "Add document" state). */
export function WorkerProfileView({
  worker,
  basePath = "/workers",
  branchIds,
}: {
  worker: WorkerProfile;
  basePath?: string;
  /** Branches of the worker (multi-branch owner): actions follow those branches' powers. */
  branchIds?: string[];
}) {
  const router = useRouter();
  const { can, canAccessBranch } = useAccess();
  const scope = branchIds?.find(canAccessBranch);
  const canEdit = can("workers.edit", scope);
  const canDelete = can("workers.delete", scope);
  return (
    <section className="flex flex-col gap-[25px] rounded-card bg-card px-4 pb-[30px] pt-[30px] shadow-card sm:px-[30px] xl:min-h-[calc(100vh-151px)]">
      <div className="grid gap-[21px] xl:grid-cols-[minmax(0,1fr)_221px]">
        {/* Identity */}
        <div className="flex flex-col gap-8 rounded-[5px] bg-page p-5 sm:flex-row sm:items-center">
          <div className="flex h-40 w-40 shrink-0 items-center justify-center rounded-[15px] bg-tint-teal">
            <Image src="/images/avatar-memoji.png" alt="" width={120} height={120} />
          </div>
          <div className="grid flex-1 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-6 gap-y-3 text-lg text-ink sm:grid-cols-[minmax(0,288px)_119px]">
            <p className="truncate text-xl font-bold">{worker.name}</p>
            <div>
              {worker.type === "Special" ? (
                <span className="inline-flex h-10 w-[119px] items-center justify-center gap-1.5 rounded-pill border border-brand text-lg font-bold text-brand">
                  <Icon name="verified" size={20} />
                  Special
                </span>
              ) : null}
            </div>
            <p>{worker.role}</p>
            <NationalityChip
              flag={worker.nationalityFlag}
              name={worker.nationality}
              className="w-[119px] justify-center bg-card px-1 text-xs"
            />
            <p>Join on {worker.joinDate}</p>
            <span className="inline-flex h-[30px] w-[119px] items-center justify-center rounded-[3px] bg-card text-xs">
              {worker.idNumber}
            </span>
          </div>
        </div>

        {/* Actions + earnings */}
        <div className="flex flex-col gap-5">
          {(canEdit || canDelete) && (
            <div className="grid grid-cols-2 gap-5">
              {canEdit && (
                <Link href={`${basePath}/${worker.id}/edit`} className={cn(ACTION, "bg-info")}>
                  Edit
                </Link>
              )}
              {canDelete && (
                <button
                  type="button"
                  onClick={() => {
                    removeRecord(worker.id);
                    toast(`${worker.name} deleted. Demo only: the worker returns after a reload.`);
                    router.push(basePath);
                  }}
                  className={cn(ACTION, "bg-negative", !canEdit && "col-start-2")}
                >
                  Delete
                </button>
              )}
            </div>
          )}
          <div className="flex flex-1 flex-col items-center justify-center gap-5 rounded-[5px] bg-page py-6 text-center">
            <p className="text-lg text-positive">Earning(per month)</p>
            <EarningsValue amount={worker.earnings} trend={worker.earningsTrend} className="text-xl" />
          </div>
        </div>
      </div>

      <DocumentsSection initial={worker.documents} canManage={can("workers.documents", scope)} />
    </section>
  );
}

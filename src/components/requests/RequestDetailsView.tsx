"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PhotoAvatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/utils";
import type { RequestDetails, RequestStatus } from "@/types";

const STATUS_LABELS: Record<Exclude<RequestStatus, "new">, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-brand-orange" },
  completed: { label: "Completed", className: "bg-positive" },
  incomplete: { label: "Incompleted", className: "bg-[#b0b0b0]" },
};

/** 221×50 action button of the right column (design screens 10–14). */
const ACTION = "flex h-[50px] items-center justify-center rounded-[5px] text-lg font-bold text-white shadow-card";

/** Request details (design screens 10–14: new / special / pending / completed / incomplete). */
export function RequestDetailsView({ request, basePath = "/requests" }: { request: RequestDetails; basePath?: string }) {
  const router = useRouter();
  const [status, setStatus] = useState<RequestStatus>(request.status);
  const total = request.lines.reduce((sum, line) => sum + line.price, 0);

  return (
    <section className="rounded-card bg-card px-4 pb-10 pt-[27px] shadow-card sm:px-[30px] xl:min-h-[calc(100vh-130px)]">
      <h2 className="pl-5 text-[22px] leading-[26px] text-ink">Request details</h2>

      <div className="mt-[17px] grid gap-[21px] xl:grid-cols-[minmax(0,1fr)_221px]">
        {/* Services & workers */}
        <div className="min-w-0 rounded-[5px] bg-page px-5 pb-[30px] pt-5 text-lg text-ink">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span
              className={cn(
                "inline-flex h-10 w-[138px] items-center justify-center rounded-[5px] text-base",
                request.priority === "Special" ? "bg-brand font-bold text-white" : "bg-tint-teal text-brand",
              )}
            >
              {request.priority}
            </span>
            <span>
              {request.time}, {request.date}
            </span>
          </div>

          <p className="mt-5 leading-5">Services and Workers</p>

          <div className="overflow-x-auto thin-scrollbar">
            <ul className="mt-5 min-w-[640px] space-y-5">
              {request.lines.map((line) => (
                <li key={line.id} className="flex h-[60px] items-center rounded-[5px] bg-card pl-5">
                  <span className="flex h-10 w-[121px] shrink-0 items-center justify-center rounded-[5px] bg-page">
                    {line.service}
                  </span>
                  <span className="ml-[21px] flex h-10 w-[121px] shrink-0 items-center justify-center rounded-[5px] bg-page font-bold text-brand-orange">
                    {line.category}
                  </span>
                  <span className="ml-[21px] flex min-w-0 flex-1 items-center gap-5">
                    <PhotoAvatar size={40} />
                    <span className="truncate">{line.workerName}</span>
                  </span>
                  <span className="w-[124px] shrink-0 font-bold text-brand">{line.price} SAR</span>
                </li>
              ))}

              <li className="flex h-[60px] items-center rounded-[5px] bg-card pl-[37px] pr-5">
                <span className="w-[315px] shrink-0 text-xl">Total price: {total} SAR</span>
                <span className="w-[212px] shrink-0">
                  {request.paymentMethod === "VISA" ? (
                    // Visa wordmark cut from the design reference (public/images/visa.png).
                    <Image src="/images/visa.png" alt="Paid with Visa" width={58} height={22} />
                  ) : (
                    <span className="text-lg font-bold">{request.paymentMethod}</span>
                  )}
                </span>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="h-11 w-[140px] rounded-[5px] bg-info text-lg font-bold text-white shadow-card transition-opacity hover:opacity-90"
                >
                  Print bill
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Status actions + user info */}
        <div className="space-y-5">
          {status === "new" ? (
            <div className="space-y-5">
              <button type="button" onClick={() => setStatus("pending")} className={cn(ACTION, "w-full bg-positive")}>
                Accept
              </button>
              <button
                type="button"
                onClick={() => setStatus("incomplete")}
                className={cn(ACTION, "w-full bg-negative")}
              >
                Reject
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              <div role="status" className={cn(ACTION, "shadow-none", STATUS_LABELS[status].className)}>
                {STATUS_LABELS[status].label}
              </div>
              {status === "pending" && (
                <div className="grid grid-cols-2 gap-[21px]">
                  <Link href={`${basePath}/${request.id}/edit`} className={cn(ACTION, "bg-info")}>
                    Edit
                  </Link>
                  <button type="button" onClick={() => router.push(basePath)} className={cn(ACTION, "bg-negative")}>
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="space-y-5 rounded-[5px] bg-page px-5 pb-[30px] pt-[29px] text-center text-lg text-ink">
            <p className="leading-5">User information&apos;s</p>
            <div className="flex h-[50px] items-center gap-5 rounded-[5px] bg-card px-2.5">
              <PhotoAvatar size={40} />
              <span className="truncate">{request.customer.name}</span>
            </div>
            <p className="flex min-h-[50px] items-center justify-center rounded-[5px] bg-card px-2.5">
              {request.customer.phone}
            </p>
            {request.customer.address ? (
              <p className="rounded-[5px] bg-card px-2.5 py-2.5 text-justify leading-[23px]">
                {request.customer.address}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RowArrowIcon, rowArrowClass } from "@/components/dashboard/RowArrowButton";
import { PhotoAvatar } from "@/components/ui/Avatar";
import { Icon } from "@/components/ui/Icon";
import { PriceValue } from "@/components/services/ServicesView";
import { cn } from "@/lib/utils";
import type { SalonService, WorkerProfile } from "@/types";

/** 221×50 action buttons of the right column. */
const ACTION = "flex h-[50px] items-center justify-center rounded-[5px] text-lg font-bold text-white shadow-card";

/** Service details (design screen 21). */
export function ServiceDetailsView({
  service,
  workers,
  basePath = "/services",
  workersPath = "/workers",
}: {
  service: SalonService;
  workers: WorkerProfile[];
  basePath?: string;
  workersPath?: string;
}) {
  const router = useRouter();

  return (
    <section className="grid grid-cols-[minmax(0,1fr)] gap-[21px] rounded-card bg-card px-4 pb-[30px] pt-[29px] shadow-card sm:px-[30px] xl:min-h-[calc(100vh-151px)] xl:grid-cols-[minmax(0,1fr)_221px] xl:content-start">
      <div className="flex min-w-0 flex-col gap-5 rounded-[5px] bg-page p-5 lg:flex-row">
        <div className="relative aspect-[352/312] w-full shrink-0 self-start overflow-hidden rounded-[15px] bg-tint-teal lg:w-[300px] xl:w-[352px]">
          {service.imageUrl ? (
            <Image src={service.imageUrl} alt={service.name} fill sizes="352px" className="object-cover" />
          ) : (
            <span className="flex h-full items-center justify-center text-brand">
              <Icon name="galleryAdd" size={48} />
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1 pr-2.5 pt-[23px] text-ink">
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-xl font-bold leading-6">{service.name}</h2>
            <PriceValue amount={service.price} className="text-lg" />
          </div>
          <p className="mt-3 text-base">{service.category}</p>
          <p className="mt-4 text-sm">Worker:</p>
          <ul className="mt-2.5 space-y-2.5">
            {workers.map((worker, i) => (
              <li key={worker.id} className="flex h-[50px] items-center gap-4 rounded-[5px] bg-card px-2.5">
                <PhotoAvatar size={40} tint={i} status={worker.status} />
                <span className="flex-1 truncate text-lg">{worker.name}</span>
                <Link href={`${workersPath}/${worker.id}`} aria-label={`View ${worker.name}`} className={rowArrowClass("orange")}>
                  <RowArrowIcon />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <Link href={`${basePath}/${service.id}/edit`} className={cn(ACTION, "bg-info")}>
          Edit
        </Link>
        <button type="button" onClick={() => router.push(basePath)} className={cn(ACTION, "bg-negative")}>
          Delete
        </button>
      </div>
    </section>
  );
}

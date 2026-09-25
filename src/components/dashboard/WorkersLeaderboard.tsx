"use client";

import { useAccess } from "@/components/auth/AccessProvider";
import { RowArrowButton } from "@/components/dashboard/RowArrowButton";
import { PhotoAvatar } from "@/components/ui/Avatar";
import { PalestineFlag } from "@/components/ui/DesignIcons";
import { Icon } from "@/components/ui/Icon";
import type { Worker } from "@/types";

export function WorkersLeaderboard({ workers, basePath = "/workers" }: { workers: Worker[]; basePath?: string }) {
  const { canAccessPath } = useAccess();
  return (
    <section className="mx-5 flex flex-col pt-5">
      <h2 className="pl-[30px] text-[15px] font-bold leading-5 text-ink">Workers sort by most earnings</h2>

      {/* Fixed-height list: the last row fades out and the list scrolls for more (as in the design). */}
      <div className="fade-workers mt-5 h-[264px] overflow-auto px-5 no-scrollbar">
        <ul className="min-w-[600px] space-y-2.5 pb-[90px]">
          {workers.map((worker, index) => (
            <li
              key={worker.id}
              className="flex h-[50px] items-center rounded-[5px] bg-page pl-[19px] pr-[19px] text-sm text-ink"
            >
              <span className="w-[31px] shrink-0 font-bold">{index + 1}.</span>
              <span className="flex min-w-0 flex-[143_1_0] items-center gap-3 pr-2">
                <PhotoAvatar />
                <span className="truncate">{worker.name}</span>
              </span>
              <span className="flex min-w-0 flex-[130_1_0] items-center gap-2.5">
                <PalestineFlag />
                <span className="truncate">{worker.nationality}</span>
              </span>
              <span className="flex h-[30px] w-[105px] shrink-0 items-center justify-center rounded-[3px] bg-tint-yellow">
                {worker.role}
              </span>
              <span className="ml-[21px] flex h-[30px] w-[100px] shrink-0 items-center justify-center gap-1.5 rounded-[3px] bg-card text-positive">
                <Icon name="arrowUpLine" size={14} />
                <span>
                  <span className="font-bold">{worker.earnings}</span>{" "}
                  <span className="text-[11px]">{worker.currency}</span>
                </span>
              </span>
              <RowArrowButton
                tone="orange"
                label={`View ${worker.name}`}
                href={canAccessPath(`${basePath}/${worker.id}`) ? `${basePath}/${worker.id}` : undefined}
                className="ml-[31px]"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

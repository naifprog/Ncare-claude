"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { useAccess } from "@/components/auth/AccessProvider";
import { RatingsSection, WorkTimeSection } from "@/components/settings/SalonProfileView";
import { ArrowDownIcon } from "@/components/ui/DesignIcons";
import { Icon } from "@/components/ui/Icon";
import { branchManagers } from "@/lib/access/directory";
import { salonProfile } from "@/lib/mock-data";
import type { Branch } from "@/lib/mock-main";
import { cn } from "@/lib/utils";

/** Branch profile (Main Salon UI): with activity (design 31) or freshly created (design 30). */
export function BranchProfileView({ branch }: { branch: Branch }) {
  const isNew = !!branch.isNew;
  const { can } = useAccess();
  const managers = branchManagers(branch);
  const listRef = useRef<HTMLUListElement>(null);
  const [atEnd, setAtEnd] = useState(false);

  return (
    <section className="flex flex-col rounded-card bg-card px-4 pt-[30px] shadow-card sm:px-[30px] xl:h-[calc(100vh-151px)] xl:min-h-[760px]">
      <div className="grid gap-[31px] md:grid-cols-[302px_minmax(0,1fr)]">
        {/* Monthly earnings */}
        <div className="relative flex h-[351px] flex-col rounded-[5px] bg-page px-5 pt-5 text-ink">
          <p className="text-lg leading-6">
            Earning<span className="text-sm">(per month)</span>
          </p>
          {isNew ? (
            <p className="mt-8 text-base">No earnings yet</p>
          ) : (
            <>
              <ul
                ref={listRef}
                onScroll={(e) => {
                  const el = e.currentTarget;
                  setAtEnd(el.scrollTop + el.clientHeight >= el.scrollHeight - 4);
                }}
                className="fade-workers mt-2 flex-1 space-y-[11px] overflow-y-auto pb-20 no-scrollbar"
              >
                {branch.monthlyEarnings.map((m) => (
                  <li key={m.month} className="flex items-center justify-between">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 text-lg",
                        m.trend === "up" ? "text-positive" : "text-negative",
                      )}
                    >
                      <Icon name={m.trend === "up" ? "arrowUpLine" : "arrowDownLine"} size={18} />
                      <span className="font-bold">{m.amount}</span>
                      <span className="text-sm">SAR</span>
                    </span>
                    <span className="text-base">{m.month}</span>
                  </li>
                ))}
              </ul>
              {!atEnd && (
                <button
                  type="button"
                  aria-label="Show more months"
                  onClick={() => listRef.current?.scrollBy({ top: 70, behavior: "smooth" })}
                  className="absolute bottom-[26px] left-1/2 flex h-[50px] w-[50px] -translate-x-1/2 items-center justify-center rounded-full bg-brand text-white shadow-card"
                >
                  <ArrowDownIcon size={24} />
                </button>
              )}
            </>
          )}
        </div>

        {/* Cover + identity card */}
        <div className="relative min-h-[260px] overflow-hidden rounded-[5px] bg-tint-teal md:h-[351px]">
          {!isNew && (
            <Image src="/images/salon-cover.jpg" alt={`${branch.name} cover`} fill sizes="673px" className="object-cover" />
          )}
          {can("branches.edit") && (
            <Link
              href={`/main/branches/${branch.id}/edit`}
              aria-label={`Edit ${branch.name}`}
              className="absolute right-5 top-5 flex h-[50px] w-[50px] items-center justify-center rounded-full bg-info text-white shadow-card"
            >
              <Icon name="editBold" size={22} />
            </Link>
          )}
          <div className="absolute inset-x-5 bottom-5 flex h-[90px] items-center gap-5 rounded-[5px] bg-white/80 px-2.5">
            <Image src="/images/salon-logo.png" alt="" width={70} height={70} className="h-[70px] w-[70px] rounded-[10px] object-cover" />
            <div className="min-w-0">
              <p className="truncate text-xl font-bold text-ink">{branch.name}</p>
              <p className="truncate text-base text-ink">{branch.address}</p>
              <p className="truncate text-sm text-ink-muted">
                {managers.length === 0
                  ? "No manager assigned yet"
                  : `${managers.length === 1 ? "Manager" : "Managers"}: ${managers.map((m) => m.name).join(", ")}`}
              </p>
            </div>
          </div>
        </div>
      </div>

      <WorkTimeSection
        editing={false}
        workDays={isNew ? [] : salonProfile.workDays}
        onToggleDay={() => {}}
        openFrom={isNew ? "" : salonProfile.openFrom}
        openTo={isNew ? "" : salonProfile.openTo}
        onFromChange={() => {}}
        onToChange={() => {}}
      />

      <RatingsSection
        ratingCount={isNew ? 0 : salonProfile.ratingCount}
        reviews={isNew ? [] : salonProfile.reviews}
      />
    </section>
  );
}

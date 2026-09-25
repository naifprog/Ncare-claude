"use client";

import { useAccess } from "@/components/auth/AccessProvider";
import { RowArrowButton } from "@/components/dashboard/RowArrowButton";
import { Icon } from "@/components/ui/Icon";
import { branchManagerLabel } from "@/lib/access/directory";
import type { Branch } from "@/lib/mock-main";

/** "Branches sort by most earnings" (Main Salon dashboard, design 26). */
export function BranchesLeaderboard({ branches }: { branches: Branch[] }) {
  const { canAccessPath } = useAccess();
  return (
    <section className="mx-5 flex flex-col pt-5">
      <h2 className="pl-[30px] text-[15px] font-bold leading-5 text-ink">Branches sort by most earnings</h2>

      <div className="fade-workers mt-5 h-[264px] overflow-auto px-5 no-scrollbar">
        <ul className="min-w-[600px] space-y-2.5 pb-[90px]">
          {branches.length === 0 && <li className="py-6 text-center text-sm text-ink-muted">No branch activity yet.</li>}
          {branches.map((branch, index) => (
            <li
              key={branch.id}
              className="flex h-[50px] items-center rounded-[5px] bg-page pl-[19px] pr-[19px] text-sm text-ink"
            >
              <span className="w-[31px] shrink-0 font-bold">{index + 1}.</span>
              <span className="min-w-0 flex-[178_1_0] truncate pr-2">{branch.name}</span>
              <span className="min-w-0 flex-[127_1_0] truncate pr-2">{branchManagerLabel(branch)}</span>
              <span className="flex h-[30px] w-[64px] shrink-0 items-center justify-center rounded-[3px] bg-tint-teal">
                {branch.region}
              </span>
              <span className="ml-[29px] flex h-[30px] w-[100px] shrink-0 items-center justify-center gap-1.5 rounded-[3px] bg-card text-positive">
                <Icon name="arrowUpLine" size={14} />
                <span>
                  <span className="font-bold">{branch.earnings}</span> <span className="text-[11px]">SAR</span>
                </span>
              </span>
              <RowArrowButton
                tone="orange"
                label={`View ${branch.name}`}
                href={canAccessPath(`/main/branches/${branch.id}`) ? `/main/branches/${branch.id}` : undefined}
                className="ml-[31px]"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ComponentType } from "react";
import {
  BarcodeIcon,
  CalendarTickIcon,
  CaretDownIcon,
  Flag2Icon,
  FlashIcon,
  Profile2UserIcon,
  Setting2Icon,
  ThreeSquareIcon,
} from "@/components/ui/DesignIcons";
import { useNav } from "@/components/auth/AccessProvider";
import { Icon } from "@/components/ui/Icon";
import { loginPathFor } from "@/lib/access/access";
import { signOut } from "@/lib/demo-state";
import { ROLE_HOME, type NavIconName, type Role } from "@/lib/roles";
import { cn } from "@/lib/utils";

function DashboardIcon({ size }: { size?: number }) {
  return <Icon name="dashboard" size={size} />;
}
function SalonsIcon({ size }: { size?: number }) {
  return <Icon name="shop" size={size} />;
}
function WalletIcon({ size }: { size?: number }) {
  return <Icon name="wallet" size={size} />;
}
function ReportsIcon({ size }: { size?: number }) {
  return <Icon name="reports" size={size} />;
}

/** Design assets where the repo has them (vuesax/*), otherwise the closest Solar icon. */
const NAV_ICONS: Record<NavIconName, ComponentType<{ size?: number }>> = {
  dashboard: DashboardIcon,
  requests: CalendarTickIcon,
  workers: Profile2UserIcon,
  users: Profile2UserIcon,
  services: BarcodeIcon,
  settings: Setting2Icon,
  branches: ThreeSquareIcon,
  powers: FlashIcon,
  ads: Flag2Icon,
  salons: SalonsIcon,
  wallet: WalletIcon,
  reports: ReportsIcon,
};
/** Nav pill shape from the design: 5px radius on the left, fully rounded on the right. */
const PILL = "rounded-l-[5px] rounded-r-[25px]";

export function Sidebar({ onNavigate, role = "salon" }: { onNavigate?: () => void; role?: Role }) {
  const pathname = usePathname();
  const router = useRouter();
  // Only the sections the signed-in user may open (see src/lib/access).
  const items = useNav();
  const home = ROLE_HOME[role];
  // Open the submenu of the section being viewed; everything is collapsed on the dashboard.
  const [expanded, setExpanded] = useState<string | null>(
    () =>
      items.find((item) => item.children && item.href !== home && pathname.startsWith(item.href))?.label ??
      null,
  );

  return (
    <div className="flex h-full flex-col bg-page">
      <div className="pl-[62px] pt-[58px] pb-[58px]">
        <Link href={home} onClick={onNavigate} aria-label="Ncare dashboard">
          <Image src="/images/ncare-logo.png" alt="Ncare" width={221} height={58} priority />
        </Link>
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto pl-[30px] pr-[40px] thin-scrollbar">
        {items.map((item) => {
          const isActive = item.href === home ? pathname === home : pathname.startsWith(item.href);
          const isExpanded = expanded === item.label;
          const ItemIcon = NAV_ICONS[item.icon];

          const header = (
            <div
              className={cn(
                "flex h-[50px] items-center pl-4 pr-6 text-[15px]",
                // Open groups: the header flows into the submenu card below it.
                isExpanded && item.children ? "rounded-l-[5px] rounded-tr-[25px] rounded-br-none" : PILL,
                isActive ? "bg-brand-orange font-bold text-white" : "bg-card text-ink",
                isActive && !isExpanded && "shadow-card",
              )}
            >
              <Link href={item.href} onClick={onNavigate} className="flex h-full flex-1 items-center gap-[15px]">
                <ItemIcon size={20} />
                {item.label}
              </Link>
              {item.children ? (
                <button
                  type="button"
                  aria-label={`Toggle ${item.label} submenu`}
                  aria-expanded={isExpanded}
                  onClick={() => setExpanded(isExpanded ? null : item.label)}
                  className="flex h-full items-center pl-2"
                >
                  <CaretDownIcon className={cn("transition-transform", isExpanded && "rotate-180")} />
                </button>
              ) : null}
            </div>
          );

          if (!item.children || !isExpanded) return <div key={item.label}>{header}</div>;

          return (
            <div key={item.label} className={cn("overflow-hidden bg-card shadow-card", PILL)}>
              {header}
              <div className="px-5 pb-4 pt-2">
                {item.children.map((child) => {
                  const childActive = pathname === child.href;
                  return (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={onNavigate}
                      className={cn(
                        "flex h-[50px] items-center border-b border-border px-5 text-[15px] text-ink last:border-0",
                        childActive && "rounded-[5px] bg-page",
                      )}
                    >
                      {child.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      <div className="pb-[50px] pl-10 pr-[40px] pt-5">
        <button
          type="button"
          onClick={() => {
            onNavigate?.();
            signOut();
            router.replace(loginPathFor(role));
          }}
          className={cn(
            "flex h-[50px] w-full items-center gap-[17px] bg-tint-rose pl-4 text-[15px] text-negative transition-opacity hover:opacity-90",
            PILL,
          )}
        >
          <Icon name="logout" size={18} />
          Log out
        </button>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Icon, type IconName } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: IconName;
  children?: { label: string; href: string }[];
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/", icon: "dashboard" },
  {
    label: "Requests",
    href: "/requests",
    icon: "requests",
    children: [
      { label: "All requests", href: "/requests" },
      { label: "Add request", href: "/requests/add" },
    ],
  },
  { label: "Workers", href: "/workers", icon: "workers" },
  { label: "Services", href: "/services", icon: "services" },
  { label: "Salon Settings", href: "/settings", icon: "settings" },
];

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<string | null>("Requests");

  return (
    <div className="flex h-full flex-col bg-card">
      <div className="flex items-center gap-2 px-7 py-8">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-lg font-black text-white">
          N
        </span>
        <span className="text-2xl font-black tracking-tight text-brand">
          CARE
        </span>
      </div>

      <nav className="flex-1 space-y-1.5 overflow-y-auto px-4 thin-scrollbar">
        {NAV_ITEMS.map((item) => {
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const isExpanded = expanded === item.label;

          return (
            <div key={item.label}>
              <div
                className={cn(
                  "flex items-center gap-3 rounded-card px-4 py-3 text-sm font-semibold transition-colors",
                  isActive ? "bg-brand-orange text-white" : "text-ink-muted hover:bg-page",
                )}
              >
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  className="flex flex-1 items-center gap-3"
                >
                  <Icon name={item.icon} size={20} />
                  {item.label}
                </Link>
                {item.children ? (
                  <button
                    type="button"
                    aria-label={`Toggle ${item.label} submenu`}
                    onClick={() => setExpanded(isExpanded ? null : item.label)}
                    className="rounded p-1"
                  >
                    <Icon
                      name="chevronDown"
                      size={14}
                      className={cn("transition-transform", isExpanded && "rotate-180")}
                    />
                  </button>
                ) : null}
              </div>

              {item.children && isExpanded ? (
                <div className="ml-11 mt-1 space-y-1 border-l border-border pl-3">
                  {item.children.map((child) => {
                    const childActive = pathname === child.href;
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={onNavigate}
                        className={cn(
                          "block rounded px-2 py-1.5 text-sm",
                          childActive
                            ? "font-bold text-brand-orange"
                            : "text-ink-muted hover:text-ink",
                        )}
                      >
                        {child.label}
                      </Link>
                    );
                  })}
                </div>
              ) : null}
            </div>
          );
        })}
      </nav>

      <div className="px-4 pb-8 pt-4">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-card bg-tint-rose px-4 py-3 text-sm font-semibold text-negative transition-opacity hover:opacity-90"
        >
          <Icon name="logout" size={20} />
          Log out
        </button>
      </div>
    </div>
  );
}

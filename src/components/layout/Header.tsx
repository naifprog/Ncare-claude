"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useAccess } from "@/components/auth/AccessProvider";
import { ChatPanel } from "@/components/layout/ChatPanel";
import { Avatar } from "@/components/ui/Avatar";
import { CaretDownIcon, SmsBoldIcon } from "@/components/ui/DesignIcons";
import { Icon } from "@/components/ui/Icon";
import { Toggle } from "@/components/ui/Toggle";
import { cn } from "@/lib/utils";
import { messages, notifications, salonStatus } from "@/lib/mock-data";
import type { Role } from "@/lib/roles";
import type { MessageItem } from "@/types";

function useOutsidePanel() {
  const [open, setOpen] = useState<"notifications" | "messages" | "user" | null>(null);
  const toggle = (panel: "notifications" | "messages" | "user") =>
    setOpen((current) => (current === panel ? null : panel));
  return { open, toggle, close: () => setOpen(null) };
}

export function Header({
  title,
  role = "salon",
  onMenuClick,
}: {
  title: string;
  role?: Role;
  onMenuClick?: () => void;
}) {
  const isAdmin = role === "admin";
  const { user, can } = useAccess();
  const { open, toggle, close } = useOutsidePanel();
  const [chatWith, setChatWith] = useState<MessageItem | null>(null);
  const closeAll = () => {
    close();
    setChatWith(null);
  };
  const unreadNotifications = notifications.filter((n) => n.unread).length;
  const unreadMessages = messages.filter((m) => m.unread > 0).length;

  return (
    <header className="relative flex h-20 shrink-0 items-center justify-between gap-4 rounded-card bg-card pl-4 pr-[15px] shadow-card sm:pl-[30px]">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="inline-flex h-9 w-9 items-center justify-center rounded-card text-ink lg:hidden"
          aria-label="Open menu"
        >
          <Icon name="menu" size={22} />
        </button>
        <h1 className="text-[22px] font-normal text-ink">{title}</h1>
      </div>

      {/* Popovers are anchored to the header card's right edge, 75px down (designs 2–4). */}
      <div className="flex items-center gap-[5px]">
        {can("notifications.view") && (
        <button
          type="button"
          onClick={() => toggle("notifications")}
          className="relative inline-flex h-[50px] w-[50px] items-center justify-center rounded-[5px] bg-page text-info"
          aria-label="Notifications"
          aria-expanded={open === "notifications"}
        >
          <Icon name="bell" size={24} />
          {unreadNotifications > 0 && <CountBadge count={unreadNotifications} />}
        </button>
        )}

        {can("messages.view") && (
        <button
          type="button"
          onClick={() => {
            setChatWith(null);
            toggle("messages");
          }}
          className="relative inline-flex h-[50px] w-[50px] items-center justify-center rounded-[5px] bg-page text-info"
          aria-label="Messages"
          aria-expanded={open === "messages"}
        >
          <SmsBoldIcon size={24} />
          {unreadMessages > 0 && <CountBadge count={unreadMessages} />}
        </button>
        )}

        {role === "salon" ? (
          <button
            type="button"
            onClick={() => toggle("user")}
            aria-expanded={open === "user"}
            className="flex h-[50px] items-center gap-4 rounded-[5px] bg-page px-5 sm:w-[169px]"
          >
            <Image src="/images/salon-mark.png" alt="" width={20} height={24} />
            <span className="hidden flex-1 truncate whitespace-nowrap text-left text-xs text-ink sm:inline">{user.name}</span>
            <CaretDownIcon
              className={cn("hidden text-ink transition-transform sm:inline", open === "user" && "rotate-180")}
            />
          </button>
        ) : (
          // Main Salon / Super Admin: plain name tile (designs 26, 49).
          <div className="hidden h-[50px] items-center gap-[30px] whitespace-nowrap rounded-[5px] bg-page px-[22px] text-sm text-ink sm:flex sm:min-w-[145px] sm:justify-center">
            <span className={cn(isAdmin && "text-base")}>{user.name}</span>
            {user.tag ? (
              <span className="rounded-[3px] bg-tint-yellow px-2.5 py-1 text-sm text-brand-orange">{user.tag}</span>
            ) : null}
          </div>
        )}
      </div>

      {open === "notifications" && (
        <Panel
          onClose={closeAll}
          title="Notifications"
          headerAction={isAdmin ? <Link href="/admin/notifications" onClick={closeAll}>All</Link> : undefined}
        >
          <ul className="max-h-[560px] space-y-[15px] overflow-y-auto px-5 pb-5 thin-scrollbar">
            {notifications.map((n) => (
              <li key={n.id} className="flex h-[52px] items-center gap-[15px] rounded-full bg-page pl-1 pr-5">
                <span className="flex h-[47px] w-[47px] shrink-0 items-center justify-center rounded-full bg-card">
                  <span className="flex h-[39px] w-[39px] items-center justify-center rounded-full bg-brand text-white">
                    <Icon name="bell" size={16} />
                  </span>
                </span>
                <p className="flex-1 text-xs leading-[15px] text-ink">{n.message}</p>
                <span className="shrink-0 text-[8px] text-ink-muted">{n.time}</span>
              </li>
            ))}
          </ul>
          {isAdmin && can("notifications.send") && (
            // Super Admin: create notifications from here (design 84).
            <div className="flex justify-center pb-[18px]">
              <Link
                href="/admin/notifications"
                onClick={closeAll}
                className="flex h-10 w-[175px] items-center justify-center rounded-pill bg-brand-orange text-base font-bold text-white shadow-card"
              >
                Add Notification
              </Link>
            </div>
          )}
        </Panel>
      )}

      {open === "messages" && chatWith && (
        <Panel onClose={closeAll}>
          <ChatPanel contact={chatWith} onBack={() => setChatWith(null)} canSend={can("messages.send")} />
        </Panel>
      )}

      {open === "messages" && !chatWith && (
        <Panel
          onClose={closeAll}
          title="Messages"
          headerAction={
            isAdmin && can("messages.send") ? (
              <Link href="/admin/messages/new" onClick={closeAll}>
                New message
              </Link>
            ) : undefined
          }
        >
          <ul className="max-h-[560px] space-y-[11px] overflow-y-auto px-5 pb-5 thin-scrollbar">
            {messages.map((m) => (
              <li key={m.id}>
                <button
                  type="button"
                  onClick={() => setChatWith(m)}
                  className="flex h-[83px] w-full items-center gap-4 rounded-[5px] bg-page pl-3.5 pr-4 text-left transition-colors hover:bg-border"
                >
                {m.avatarUrl ? (
                  <Image src={m.avatarUrl} alt="" width={56} height={56} className="shrink-0 rounded-full" />
                ) : (
                  <Avatar seed={m.avatarSeed} size={56} />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-base text-ink">{m.name}</p>
                  <p className="mt-1 truncate text-[13px] text-ink-muted">{m.preview}</p>
                </div>
                <div className="flex flex-col items-end gap-3 self-start pt-3.5 text-xs text-ink-muted">
                  <span>{m.time}</span>
                  {m.unread > 0 && (
                    <span className="mr-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-negative text-[10px] font-bold text-white">
                      {m.unread}
                    </span>
                  )}
                </div>
                </button>
              </li>
            ))}
          </ul>
          {isAdmin && (
            // Super Admin: floating link to the full messages page (design 81).
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex h-[110px] items-end justify-center rounded-b-[5px] bg-gradient-to-t from-white via-white/80 to-transparent pb-[30px]">
              <Link
                href="/admin/messages"
                onClick={closeAll}
                className="pointer-events-auto flex h-10 w-[175px] items-center justify-center rounded-pill bg-brand text-base font-bold text-white shadow-card"
              >
                All messages
              </Link>
            </div>
          )}
        </Panel>
      )}

      {open === "user" && (
        <Panel onClose={closeAll}>
          <SalonStatusPanel canToggle={can("settings.profileHours")} />
        </Panel>
      )}
    </header>
  );
}

/** User menu content: salon open/closed switch and today's profit (SalonStatus frame, design 4). */
function SalonStatusPanel({ canToggle }: { canToggle: boolean }) {
  const [isOpen, setIsOpen] = useState(salonStatus.open);
  const rows = [
    { label: "The daily profit:", value: salonStatus.dailyProfit },
    { label: "From normal requests:", value: salonStatus.fromNormalRequests },
    { label: "From special requests:", value: salonStatus.fromSpecialRequests },
  ];

  return (
    <div className="p-[17px] text-sm text-ink">
      <div className="flex h-[50px] items-center justify-between rounded-[5px] bg-page pl-[27px] pr-[35px]">
        <span>Salon status: {isOpen ? "Open" : "Closed"}</span>
        <Toggle checked={isOpen} onChange={setIsOpen} label="Salon open" disabled={!canToggle} />
      </div>
      <dl className="space-y-[13px] px-[27px] pb-2.5 pt-7">
        {rows.map((r) => (
          <div key={r.label} className="flex justify-between gap-4">
            <dt>{r.label}</dt>
            <dd className="font-bold text-positive">{r.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
/** Red unread counter pinned to the top-right of the bell / messages glyph. */
function CountBadge({ count }: { count: number }) {
  return (
    <span className="absolute left-[27px] top-[7px] flex h-[15px] min-w-[15px] items-center justify-center rounded-full bg-negative px-1 text-[10px] font-bold leading-none text-white">
      {count}
    </span>
  );
}

function Panel({
  title,
  headerAction,
  children,
  onClose,
}: {
  title?: string;
  headerAction?: React.ReactNode;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-0 top-[75px] z-50 w-[calc(100vw-32px)] max-w-[375px] rounded-[5px] bg-card shadow-card">
        {title ? (
          <div className="flex items-center justify-between px-[30px] pb-8 pt-3.5">
            <span className="text-base text-ink">{title}</span>
            {headerAction && <span className="text-[13px] font-bold text-ink underline">{headerAction}</span>}
          </div>
        ) : null}
        {children}
      </div>
    </>
  );
}
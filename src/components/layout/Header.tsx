"use client";

import { useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import { currentUser, messages, notifications } from "@/lib/mock-data";

function useOutsidePanel() {
  const [open, setOpen] = useState<"notifications" | "messages" | "user" | null>(null);
  const toggle = (panel: "notifications" | "messages" | "user") =>
    setOpen((current) => (current === panel ? null : panel));
  return { open, toggle, close: () => setOpen(null) };
}

export function Header({ title, onMenuClick }: { title: string; onMenuClick?: () => void }) {
  const { open, toggle, close } = useOutsidePanel();
  const unreadNotifications = notifications.length;
  const unreadMessages = messages.filter((m) => m.unread > 0).length;

  return (
    <header className="relative flex items-center justify-between gap-4 border-b border-border bg-card px-5 py-5 sm:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="inline-flex h-9 w-9 items-center justify-center rounded-card text-ink lg:hidden"
          aria-label="Open menu"
        >
          <Icon name="menu" size={22} />
        </button>
        <h1 className="text-lg font-bold text-ink sm:text-xl">{title}</h1>
      </div>

      <div className="flex items-center gap-3 sm:gap-5">
        <div className="relative">
          <button
            type="button"
            onClick={() => toggle("notifications")}
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-tint-teal text-brand"
            aria-label="Notifications"
          >
            <Icon name="bell" size={18} />
            {unreadNotifications > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-negative text-[10px] font-bold text-white">
                {unreadNotifications}
              </span>
            )}
          </button>
          {open === "notifications" && (
            <Panel onClose={close} title="Notifications" widthClass="w-80">
              <ul className="max-h-96 divide-y divide-border overflow-y-auto thin-scrollbar">
                {notifications.map((n) => (
                  <li key={n.id} className="flex gap-3 px-4 py-3 text-xs">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-white">
                      <Icon name="bell" size={12} />
                    </span>
                    <div>
                      <p className="text-ink">{n.message}</p>
                      <p className="mt-1 text-ink-muted">{n.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </Panel>
          )}
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => toggle("messages")}
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-tint-teal text-brand"
            aria-label="Messages"
          >
            <Icon name="chat" size={18} />
            {unreadMessages > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-info text-[10px] font-bold text-white">
                {unreadMessages}
              </span>
            )}
          </button>
          {open === "messages" && (
            <Panel onClose={close} title="Messages" widthClass="w-80" headerAction="All">
              <ul className="max-h-96 divide-y divide-border overflow-y-auto thin-scrollbar">
                {messages.map((m) => (
                  <li key={m.id} className="flex items-center gap-3 px-4 py-3">
                    <Avatar seed={m.avatarSeed} size={34} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-ink">{m.name}</p>
                      <p className="truncate text-xs text-ink-muted">{m.preview}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 text-[10px] text-ink-muted">
                      <span>{m.time}</span>
                      {m.unread > 0 && (
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-negative text-white">
                          {m.unread}
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </Panel>
          )}
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => toggle("user")}
            className="flex items-center gap-2"
          >
            <Avatar seed={currentUser.name} size={34} />
            <span className="hidden text-sm font-semibold text-ink sm:inline">{currentUser.name}</span>
            <Icon
              name="chevronDown"
              size={12}
              className={cn("hidden text-ink-muted transition-transform sm:inline", open === "user" && "rotate-180")}
            />
          </button>
          {open === "user" && (
            <Panel onClose={close} title={currentUser.name} widthClass="w-48">
              <div className="px-4 py-3 text-sm text-ink-muted">{currentUser.role}</div>
            </Panel>
          )}
        </div>
      </div>
    </header>
  );
}

function Panel({
  title,
  headerAction,
  widthClass,
  children,
  onClose,
}: {
  title: string;
  headerAction?: string;
  widthClass: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div
        className={cn(
          "absolute right-0 top-12 z-50 rounded-card bg-card shadow-card",
          widthClass,
        )}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <span className="text-sm font-bold text-ink">{title}</span>
          {headerAction && (
            <span className="text-xs font-semibold text-brand">{headerAction}</span>
          )}
        </div>
        {children}
      </div>
    </>
  );
}

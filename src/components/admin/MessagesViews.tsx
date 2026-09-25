"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { SplitShell } from "@/components/admin/SplitShell";
import { useAccess } from "@/components/auth/AccessProvider";
import { ChatPanel } from "@/components/layout/ChatPanel";
import { Avatar } from "@/components/ui/Avatar";
import { adminChatThread } from "@/lib/mock-admin";
import { messages } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import type { MessageItem } from "@/types";

/** Conversation list of the messages page: the popover's six contacts, listed twice as in the design. */
const CONVERSATIONS: MessageItem[] = [...messages, ...messages.slice(0, 4)].map((m, i) => ({ ...m, id: `${m.id}-${i}` }));

function ConversationList({ selectedId, onSelect }: { selectedId?: string; onSelect: (m: MessageItem) => void }) {
  const [query, setQuery] = useState("");
  const list = useMemo(
    () => CONVERSATIONS.filter((m) => m.name.toLowerCase().includes(query.trim().toLowerCase())),
    [query],
  );

  return (
    <>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search .."
        aria-label="Search conversations"
        className="h-10 w-full shrink-0 rounded-[5px] bg-page px-5 text-xs text-ink placeholder:text-[#aeaeae] focus:outline focus:outline-brand"
      />
      <ul className="mt-2.5 min-h-0 flex-1 space-y-2.5 overflow-y-auto pb-5 thin-scrollbar">
        {list.map((m) => (
          <li key={m.id}>
            <button
              type="button"
              onClick={() => onSelect(m)}
              className={cn(
                "flex h-[84px] w-full items-center gap-4 rounded-[5px] bg-page pl-3.5 pr-4 text-left transition-colors hover:bg-border",
                selectedId === m.id && "ring-1 ring-info",
              )}
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
        {list.length === 0 && <li className="py-6 text-center text-sm text-ink-muted">No conversations found.</li>}
      </ul>
    </>
  );
}

function NewMessageLink() {
  const { can } = useAccess();
  if (!can("messages.send")) return null;
  return (
    <Link
      href="/admin/messages/new"
      className="flex h-10 w-[160px] items-center justify-center rounded-pill bg-info text-sm font-bold text-white shadow-card"
    >
      New message
    </Link>
  );
}

/** Full-height conversation; read-only for users without "Send messages". */
function PageChat(props: Omit<React.ComponentProps<typeof ChatPanel>, "variant" | "canSend">) {
  const { can } = useAccess();
  return <ChatPanel {...props} variant="page" canSend={can("messages.send")} />;
}

/** Messages page (design 82). */
export function MessagesPage() {
  const [selected, setSelected] = useState<MessageItem>(CONVERSATIONS[0]);

  return (
    <SplitShell
      title="Messages(1442)"
      action={<NewMessageLink />}
      list={<ConversationList selectedId={selected.id} onSelect={setSelected} />}
    >
      <PageChat key={selected.id} contact={selected} initialThread={adminChatThread} />
    </SplitShell>
  );
}

/** New message (design 83): pick a recipient, then write. */
export function NewMessagePage() {
  const [recipient, setRecipient] = useState<MessageItem | null>(null);
  const [query, setQuery] = useState("");
  const matches = CONVERSATIONS.filter(
    (m, i, all) =>
      query.trim() &&
      m.name.toLowerCase().includes(query.trim().toLowerCase()) &&
      all.findIndex((x) => x.name === m.name) === i,
  );

  return (
    <SplitShell title="New message" list={<ConversationList onSelect={setRecipient} />}>
      {recipient ? (
        <PageChat key={recipient.id} contact={recipient} initialThread={[]} />
      ) : (
        <div className="flex h-full flex-col gap-5">
          <div className="relative">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Username ...."
              aria-label="Search username"
              className="h-[70px] w-full rounded-[25px] bg-card px-[30px] text-lg text-ink shadow-card placeholder:text-[#aeaeae] focus:outline focus:outline-brand"
            />
            {matches.length > 0 && (
              <ul className="absolute inset-x-0 top-[78px] z-10 rounded-[5px] bg-card p-2 shadow-card">
                {matches.map((m) => (
                  <li key={m.id}>
                    <button
                      type="button"
                      onClick={() => setRecipient(m)}
                      className="flex w-full items-center gap-3 rounded-[5px] px-3 py-2 text-left text-sm text-ink hover:bg-page"
                    >
                      {m.avatarUrl ? <Image src={m.avatarUrl} alt="" width={32} height={32} className="rounded-full" /> : null}
                      {m.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="flex-1 rounded-[5px]" />
          {/* Composer is shown (disabled) until a recipient is picked, as in the design. */}
          <div className="flex h-[66px] items-center gap-1.5 rounded-[25px] bg-card px-[29px] shadow-card">
            <input
              disabled
              placeholder="Message"
              aria-label="Message"
              className="h-10 flex-1 rounded-full bg-page px-[30px] text-sm placeholder:text-[#aeaeae]"
            />
          </div>
        </div>
      )}
    </SplitShell>
  );
}

"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { RowArrowIcon, rowArrowClass } from "@/components/dashboard/RowArrowButton";
import { Avatar } from "@/components/ui/Avatar";
import { GalleryBoldIcon, SendBoldIcon } from "@/components/ui/DesignIcons";
import { chatThread, type ChatMessage } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import type { MessageItem } from "@/types";

/** Round avatar shown next to incoming bubbles (the salon's "MENS STYLE" mark in the design). */
function IncomingAvatar() {
  return (
    <Image
      src="/images/chat-salon-avatar.png"
      alt=""
      width={44}
      height={44}
      className="shrink-0 self-end rounded-full"
    />
  );
}

/**
 * Single conversation, shown inside the Messages popover ("One message" frame /
 * design frame 30309). Messages sent here are kept in local state only.
 */
export function ChatPanel({
  contact,
  onBack,
  variant = "popover",
  initialThread = chatThread,
  canSend = true,
}: {
  contact: MessageItem;
  onBack?: () => void;
  /** "page": full-height column of the admin messages screen (designs 82, 83). */
  variant?: "popover" | "page";
  initialThread?: ChatMessage[];
  /** Without the "send messages" permission the composer is read-only. */
  canSend?: boolean;
}) {
  const isPage = variant === "page";
  const [thread, setThread] = useState<ChatMessage[]>(initialThread);
  const [draft, setDraft] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const objectUrls = useRef<string[]>([]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [thread]);

  useEffect(() => {
    const urls = objectUrls.current;
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, []);

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setThread((t) => [...t, { id: `local-${Date.now()}`, from: "me", kind: "text", text }]);
    setDraft("");
  };

  const sendImage = (file: File) => {
    const url = URL.createObjectURL(file);
    objectUrls.current.push(url);
    setThread((t) => [...t, { id: `local-${Date.now()}`, from: "me", kind: "image", imageUrl: url, title: file.name }]);
  };

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-[5px]",
        isPage ? "h-full gap-5" : "h-[645px] max-h-[calc(100vh-120px)]",
      )}
    >
      {/* Contact header */}
      <div
        className={cn(
          "flex h-[70px] shrink-0 items-center gap-5 pl-[29px] pr-5",
          isPage ? "rounded-[25px] bg-card shadow-card" : "bg-page",
        )}
      >
        {contact.avatarUrl ? (
          <Image src={contact.avatarUrl} alt="" width={50} height={50} className="rounded-full" />
        ) : (
          <Avatar seed={contact.avatarSeed} size={50} />
        )}
        <span className="flex-1 truncate text-base text-ink">{contact.name}</span>
        {onBack && (
          <button type="button" onClick={onBack} aria-label="Back to messages" className={rowArrowClass("orange", "shadow-none")}>
            <RowArrowIcon />
          </button>
        )}
      </div>

      {/* Thread */}
      <div
        ref={listRef}
        className={cn(
          "flex-1 space-y-2 overflow-y-auto px-9 py-[18px] thin-scrollbar",
          // On the full page the conversation sits at the bottom, above the composer (design 82).
          isPage ? "flex flex-col bg-page" : "bg-card",
        )}
      >
        {isPage && <div className="mt-auto" aria-hidden="true" />}
        {thread.map((m) => {
          if (m.kind === "time") {
            return (
              <p key={m.id} className="py-3 text-center text-xs italic text-ink-muted">
                {m.text}
              </p>
            );
          }
          const mine = m.from === "me";
          return (
            <div key={m.id} className={cn("flex items-end gap-[9px]", mine ? "justify-end" : "justify-start")}>
              {!mine && !isPage && <IncomingAvatar />}
              {m.kind === "image" ? (
                <div className={cn("overflow-hidden rounded-[25px]", isPage ? "w-full max-w-[570px] bg-card" : "w-[251px] bg-page")}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- static asset or local object URL */}
                  <img src={m.imageUrl} alt={m.title ?? ""} className={cn("w-full object-cover", isPage ? "h-[150px]" : "h-[151px]")} />
                  {m.title || m.subtitle ? (
                    <div className="px-4 pb-4 pt-3">
                      {m.title && <p className="truncate text-sm text-ink">{m.title}</p>}
                      {m.subtitle && <p className="mt-1 text-xs text-ink-muted">{m.subtitle}</p>}
                    </div>
                  ) : null}
                </div>
              ) : (
                <p
                  className={cn(
                    "rounded-[22px] px-4 py-3 text-sm leading-5",
                    isPage ? "max-w-[580px] text-justify" : "max-w-[250px]",
                    mine ? "bg-brand text-white" : isPage ? "bg-card text-ink" : "bg-page text-ink",
                  )}
                >
                  {m.text}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Composer */}
      <form
        className={cn(
          "flex h-[66px] shrink-0 items-center gap-1.5 pl-[29px] pr-[29px]",
          isPage ? "rounded-[25px] bg-card shadow-card" : "bg-page",
        )}
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
      >
        <fieldset disabled={!canSend} className="flex h-10 min-w-0 flex-1 items-center overflow-hidden rounded-full bg-card disabled:opacity-60">
          <label className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-l-full bg-info text-white">
            <GalleryBoldIcon size={20} />
            <span className="sr-only">Send an image</span>
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) sendImage(file);
                e.target.value = "";
              }}
            />
          </label>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={canSend ? "Message" : "You can read but not send messages"}
            aria-label="Message"
            className="h-full min-w-0 flex-1 bg-transparent px-[30px] text-sm text-ink placeholder:text-[#aeaeae] focus:outline-none"
          />
        </fieldset>
        <button
          type="submit"
          disabled={!canSend}
          aria-label="Send"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-info text-white transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          <SendBoldIcon size={22} />
        </button>
      </form>
    </div>
  );
}

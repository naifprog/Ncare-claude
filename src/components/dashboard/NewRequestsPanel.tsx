"use client";

import { useRef, useState } from "react";
import { RequestCard } from "@/components/dashboard/RequestCard";
import { ArrowDownIcon } from "@/components/ui/DesignIcons";
import type { SalonRequest } from "@/types";

/** Card pitch in the list: 190px card + 10px gap. */
const SCROLL_STEP = 200;

export function NewRequestsPanel({ requests }: { requests: SalonRequest[] }) {
  const listRef = useRef<HTMLDivElement>(null);
  const [atEnd, setAtEnd] = useState(false);

  const updateAtEnd = () => {
    const el = listRef.current;
    if (el) setAtEnd(el.scrollTop + el.clientHeight >= el.scrollHeight - 4);
  };

  return (
    <section className="relative flex min-h-0 flex-col border-t border-divider pt-5 xl:border-l xl:border-t-0">
      <h2 className="pl-[30px] text-[15px] font-bold leading-5 text-ink">New requests</h2>

      <div
        ref={listRef}
        onScroll={updateAtEnd}
        className="fade-requests mt-5 max-h-[640px] min-h-0 flex-1 overflow-y-auto px-5 no-scrollbar xl:max-h-none"
      >
        <ul className="space-y-2.5 pb-[90px]">
          {requests.map((request) => (
            <RequestCard key={request.id} request={request} />
          ))}
        </ul>
      </div>

      {!atEnd && (
        <button
          type="button"
          aria-label="Show more requests"
          onClick={() => {
            const card = listRef.current?.querySelector("li");
            listRef.current?.scrollBy({ top: card ? card.offsetHeight + 10 : SCROLL_STEP, behavior: "smooth" });
          }}
          className="absolute bottom-[50px] left-1/2 flex h-[50px] w-[50px] -translate-x-1/2 items-center justify-center rounded-full bg-brand text-white shadow-card transition-opacity hover:opacity-90"
        >
          <ArrowDownIcon size={24} />
        </button>
      )}
    </section>
  );
}

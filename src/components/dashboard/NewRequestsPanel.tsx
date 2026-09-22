import { RequestCard } from "@/components/dashboard/RequestCard";
import { SectionCard } from "@/components/ui/SectionCard";
import type { SalonRequest } from "@/types";

export function NewRequestsPanel({ requests }: { requests: SalonRequest[] }) {
  return (
    <SectionCard
      title="New requests"
      action={
        <a href="/requests" className="text-xs font-semibold text-brand hover:underline">
          All
        </a>
      }
      bodyClassName="max-h-[820px] overflow-y-auto thin-scrollbar"
    >
      <ul className="divide-y divide-border">
        {requests.map((request) => (
          <RequestCard key={request.id} request={request} />
        ))}
      </ul>
    </SectionCard>
  );
}

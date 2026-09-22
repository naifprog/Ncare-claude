import { AppShell } from "@/components/layout/AppShell";
import { RequestsView } from "@/components/requests/RequestsView";
import {
  completedRequests,
  incompleteRequests,
  newRequests,
  pendingRequests,
} from "@/lib/mock-data";

export default function RequestsPage() {
  return (
    <AppShell title="Requests">
      <RequestsView
        data={{
          new: newRequests,
          pending: pendingRequests,
          completed: completedRequests,
          incomplete: incompleteRequests,
        }}
      />
    </AppShell>
  );
}

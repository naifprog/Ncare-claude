import { AppShell } from "@/components/layout/AppShell";
import { AdminRequestsView } from "@/components/admin/AdminLists";
import { completedRequests, incompleteRequests, newRequests, pendingRequests } from "@/lib/mock-data";

/** Requests of all salons (design 68). */
export default function AdminRequestsPage() {
  return (
    <AppShell title="Requests" role="admin">
      <AdminRequestsView
        data={{ new: newRequests, pending: pendingRequests, completed: completedRequests, incomplete: incompleteRequests }}
      />
    </AppShell>
  );
}
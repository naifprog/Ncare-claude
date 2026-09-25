import { AppShell } from "@/components/layout/AppShell";
import { MainRequestsView } from "@/components/main/MainRequestsView";
import { mainRequests } from "@/lib/mock-main";

export default function MainRequestsPage() {
  return (
    <AppShell title="Requests" role="main">
      <MainRequestsView data={mainRequests} />
    </AppShell>
  );
}

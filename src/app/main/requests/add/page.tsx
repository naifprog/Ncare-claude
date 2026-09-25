import { AppShell } from "@/components/layout/AppShell";
import { BRANCH_TABS } from "@/lib/mock-main";
import { RequestForm } from "@/components/requests/RequestForm";

/** Add request with branch (design 33). */
export default function MainAddRequestPage() {
  return (
    <AppShell title="Requests" role="main">
      <RequestForm basePath="/main/requests" branches={BRANCH_TABS} />
    </AppShell>
  );
}

import { AppShell } from "@/components/layout/AppShell";
import { WorkersView } from "@/components/workers/WorkersView";
import { workerProfiles } from "@/lib/mock-data";
import { BRANCH_TABS } from "@/lib/mock-main";

/** Workers per branch (designs 37, 38). */
export default function MainWorkersPage() {
  return (
    <AppShell title="Workers" role="main">
      <WorkersView initialWorkers={workerProfiles} basePath="/main/workers" branches={BRANCH_TABS} actionLabel="New Worker" />
    </AppShell>
  );
}
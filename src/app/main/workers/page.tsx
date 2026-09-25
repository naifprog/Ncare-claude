import { AppShell } from "@/components/layout/AppShell";
import { WorkersView } from "@/components/workers/WorkersView";
import { workerProfiles } from "@/lib/mock-data";

/** Workers per branch (designs 37, 38). */
export default function MainWorkersPage() {
  return (
    <AppShell title="Workers" role="main">
      <WorkersView initialWorkers={workerProfiles} basePath="/main/workers" branchScoped actionLabel="New Worker" />
    </AppShell>
  );
}

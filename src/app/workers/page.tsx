import { AppShell } from "@/components/layout/AppShell";
import { WorkersView } from "@/components/workers/WorkersView";
import { workerProfiles } from "@/lib/mock-data";

export default function WorkersPage() {
  return (
    <AppShell title="Workers">
      <WorkersView initialWorkers={workerProfiles} />
    </AppShell>
  );
}

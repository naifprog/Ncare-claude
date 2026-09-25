import { AppShell } from "@/components/layout/AppShell";
import { WorkerForm } from "@/components/workers/WorkerForm";
import { BRANCH_TABS } from "@/lib/mock-main";

/** Add worker with branch (design 39). */
export default function MainAddWorkerPage() {
  return (
    <AppShell title="Workers" role="main">
      <WorkerForm basePath="/main/workers" branches={BRANCH_TABS} />
    </AppShell>
  );
}
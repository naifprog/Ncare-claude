import { AppShell } from "@/components/layout/AppShell";
import { WorkerForm } from "@/components/workers/WorkerForm";

export default function AddWorkerPage() {
  return (
    <AppShell title="Workers">
      <WorkerForm />
    </AppShell>
  );
}

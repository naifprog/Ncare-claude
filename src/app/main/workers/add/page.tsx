import { AppShell } from "@/components/layout/AppShell";
import { WorkerForm } from "@/components/workers/WorkerForm";

/** Add worker with branch (design 39); `?branch=` preselects the branch tab it came from. */
export default async function MainAddWorkerPage({ searchParams }: { searchParams: Promise<{ branch?: string }> }) {
  const { branch } = await searchParams;
  return (
    <AppShell title="Workers" role="main">
      <WorkerForm basePath="/main/workers" branches="accessible" defaultBranch={branch} />
    </AppShell>
  );
}

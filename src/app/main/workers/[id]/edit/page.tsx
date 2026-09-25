import { notFound } from "next/navigation";
import { BranchScope } from "@/components/auth/AccessProvider";
import { AppShell } from "@/components/layout/AppShell";
import { WorkerForm } from "@/components/workers/WorkerForm";
import { getWorkerProfile, workerProfiles } from "@/lib/mock-data";

export function generateStaticParams() {
  return workerProfiles.map((w) => ({ id: w.id }));
}

export default async function MainEditWorkerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const worker = getWorkerProfile(id);
  if (!worker) notFound();

  return (
    <AppShell title="Workers" role="main">
      <BranchScope branchIds={worker.branchIds}>
        <WorkerForm worker={worker} basePath="/main/workers" branches="accessible" />
      </BranchScope>
    </AppShell>
  );
}

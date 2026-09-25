import { notFound } from "next/navigation";
import { BranchScope } from "@/components/auth/AccessProvider";
import { AppShell } from "@/components/layout/AppShell";
import { WorkerProfileView } from "@/components/workers/WorkerProfileView";
import { getWorkerProfile, workerProfiles } from "@/lib/mock-data";

export function generateStaticParams() {
  return workerProfiles.map((w) => ({ id: w.id }));
}

export default async function MainWorkerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const worker = getWorkerProfile(id);
  if (!worker) notFound();

  return (
    <AppShell title="Workers" role="main">
      <BranchScope branchIds={worker.branchIds}>
        <WorkerProfileView worker={worker} basePath="/main/workers" branchIds={worker.branchIds} />
      </BranchScope>
    </AppShell>
  );
}

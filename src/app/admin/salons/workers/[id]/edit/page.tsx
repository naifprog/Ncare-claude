import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { WorkerForm } from "@/components/workers/WorkerForm";
import { BRANCH_CHOICES, salonBranchOf } from "@/lib/mock-admin";
import { getWorkerProfile, workerProfiles } from "@/lib/mock-data";

export function generateStaticParams() {
  return workerProfiles.map((w) => ({ id: w.id }));
}

export default async function AdminEditWorkerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const worker = getWorkerProfile(id);
  if (!worker) notFound();

  return (
    <AppShell title="Workers" role="admin">
      <WorkerForm
        worker={worker}
        basePath="/admin/salons/workers"
        branches={BRANCH_CHOICES}
        defaultBranch={salonBranchOf(worker.id).branch}
      />
    </AppShell>
  );
}
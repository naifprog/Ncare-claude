import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { WorkerForm } from "@/components/workers/WorkerForm";
import { getWorkerProfile, workerProfiles } from "@/lib/mock-data";
import { BRANCH_TABS } from "@/lib/mock-main";

export function generateStaticParams() {
  return workerProfiles.map((w) => ({ id: w.id }));
}

export default async function MainEditWorkerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const worker = getWorkerProfile(id);
  if (!worker) notFound();

  return (
    <AppShell title="Workers" role="main">
      <WorkerForm worker={worker} basePath="/main/workers" branches={BRANCH_TABS} />
    </AppShell>
  );
}
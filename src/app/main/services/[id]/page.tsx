import { notFound } from "next/navigation";
import { BranchScope } from "@/components/auth/AccessProvider";
import { AppShell } from "@/components/layout/AppShell";
import { ServiceDetailsView } from "@/components/services/ServiceDetailsView";
import { getSalonService, salonServices, workerProfiles } from "@/lib/mock-data";

export function generateStaticParams() {
  return salonServices.map((s) => ({ id: s.id }));
}

export default async function MainServiceDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const service = getSalonService(id);
  if (!service) notFound();

  return (
    <AppShell title="Services" role="main">
      <BranchScope branchIds={service.branchIds}>
        <ServiceDetailsView
          service={service}
          workers={workerProfiles.filter((w) => service.workerIds.includes(w.id))}
          basePath="/main/services"
          workersPath="/main/workers"
          branchIds={service.branchIds}
        />
      </BranchScope>
    </AppShell>
  );
}

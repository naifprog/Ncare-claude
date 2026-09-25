import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { ServiceDetailsView } from "@/components/services/ServiceDetailsView";
import { getSalonService, salonServices, workerProfiles } from "@/lib/mock-data";

export function generateStaticParams() {
  return salonServices.map((s) => ({ id: s.id }));
}

export default async function AdminServiceDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const service = getSalonService(id);
  if (!service) notFound();

  return (
    <AppShell title="Services" role="admin">
      <ServiceDetailsView
        service={service}
        workers={workerProfiles.filter((w) => service.workerIds.includes(w.id))}
        basePath="/admin/salons/services"
        workersPath="/admin/salons/workers"
      />
    </AppShell>
  );
}
import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { ServiceForm } from "@/components/services/ServiceForm";
import { BRANCH_CHOICES, salonBranchOf } from "@/lib/mock-admin";
import { getSalonService, salonServices } from "@/lib/mock-data";

export function generateStaticParams() {
  return salonServices.map((s) => ({ id: s.id }));
}

export default async function AdminEditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const service = getSalonService(id);
  if (!service) notFound();

  return (
    <AppShell title="Services" role="admin">
      <ServiceForm
        service={service}
        basePath="/admin/salons/services"
        branches={BRANCH_CHOICES}
        defaultBranch={salonBranchOf(service.id).branch}
      />
    </AppShell>
  );
}
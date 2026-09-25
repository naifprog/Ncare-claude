import { notFound } from "next/navigation";
import { BranchScope } from "@/components/auth/AccessProvider";
import { AppShell } from "@/components/layout/AppShell";
import { ServiceForm } from "@/components/services/ServiceForm";
import { getSalonService, salonServices } from "@/lib/mock-data";

export function generateStaticParams() {
  return salonServices.map((s) => ({ id: s.id }));
}

export default async function MainEditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const service = getSalonService(id);
  if (!service) notFound();

  return (
    <AppShell title="Services" role="main">
      <BranchScope branchIds={service.branchIds}>
        <ServiceForm service={service} basePath="/main/services" branches="accessible" />
      </BranchScope>
    </AppShell>
  );
}

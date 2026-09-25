import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { ServiceForm } from "@/components/services/ServiceForm";
import { getSalonService, salonServices } from "@/lib/mock-data";
import { BRANCH_TABS } from "@/lib/mock-main";

export function generateStaticParams() {
  return salonServices.map((s) => ({ id: s.id }));
}

export default async function MainEditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const service = getSalonService(id);
  if (!service) notFound();

  return (
    <AppShell title="Services" role="main">
      <ServiceForm service={service} basePath="/main/services" branches={BRANCH_TABS} />
    </AppShell>
  );
}
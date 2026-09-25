import { AppShell } from "@/components/layout/AppShell";
import { ServiceForm } from "@/components/services/ServiceForm";
import { BRANCH_FILTERS } from "@/lib/mock-admin";

export default function AdminAddServicePage() {
  return (
    <AppShell title="Services" role="admin">
      <ServiceForm basePath="/admin/salons/services" branches={BRANCH_FILTERS} />
    </AppShell>
  );
}
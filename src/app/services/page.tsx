import { AppShell } from "@/components/layout/AppShell";
import { ServicesView } from "@/components/services/ServicesView";
import { salonServices, workerProfiles } from "@/lib/mock-data";

export default function ServicesPage() {
  return (
    <AppShell title="Services">
      <ServicesView initialServices={salonServices} workers={workerProfiles} />
    </AppShell>
  );
}

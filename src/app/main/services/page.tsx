import { AppShell } from "@/components/layout/AppShell";
import { ServicesView } from "@/components/services/ServicesView";
import { salonServices, workerProfiles } from "@/lib/mock-data";
import { BRANCH_TABS } from "@/lib/mock-main";

/** Services per branch (design 40). */
export default function MainServicesPage() {
  return (
    <AppShell title="Services" role="main">
      <ServicesView
        initialServices={salonServices}
        workers={workerProfiles}
        basePath="/main/services"
        branches={BRANCH_TABS}
        actionLabel="New Service"
      />
    </AppShell>
  );
}
import { AppShell } from "@/components/layout/AppShell";
import { AdminServicesView } from "@/components/admin/AdminLists";
import { salonServices, workerProfiles } from "@/lib/mock-data";

/** Services of all salons (design 66). */
export default function AdminServicesPage() {
  return (
    <AppShell title="Services" role="admin">
      <AdminServicesView services={salonServices} workers={workerProfiles} />
    </AppShell>
  );
}
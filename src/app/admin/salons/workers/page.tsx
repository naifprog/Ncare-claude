import { AppShell } from "@/components/layout/AppShell";
import { AdminWorkersView } from "@/components/admin/AdminLists";
import { workerProfiles } from "@/lib/mock-data";

/** Workers of all salons (design 67). */
export default function AdminWorkersPage() {
  return (
    <AppShell title="Workers" role="admin">
      <AdminWorkersView workers={workerProfiles} />
    </AppShell>
  );
}
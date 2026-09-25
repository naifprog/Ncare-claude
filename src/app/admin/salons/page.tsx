import { AppShell } from "@/components/layout/AppShell";
import { SalonsView } from "@/components/admin/AdminLists";
import { adminSalons } from "@/lib/mock-admin";

/** All Salons (design 64). */
export default function AdminSalonsPage() {
  return (
    <AppShell title="Salons" role="admin">
      <SalonsView initial={adminSalons} />
    </AppShell>
  );
}
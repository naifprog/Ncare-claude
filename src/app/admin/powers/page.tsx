import { AppShell } from "@/components/layout/AppShell";
import { AdminPowersView } from "@/components/admin/PowersViews";

/** All Powers (design 74). */
export default function AdminPowersPage() {
  return (
    <AppShell title="Powers" role="admin">
      <AdminPowersView />
    </AppShell>
  );
}
import { AppShell } from "@/components/layout/AppShell";
import { AdminPowersView } from "@/components/admin/AdminMiscViews";

/** All Powers (design 74). */
export default function AdminPowersPage() {
  return (
    <AppShell title="Powers" role="admin">
      <AdminPowersView />
    </AppShell>
  );
}
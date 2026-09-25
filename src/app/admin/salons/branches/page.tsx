import { AppShell } from "@/components/layout/AppShell";
import { AdminBranchesView } from "@/components/admin/AdminLists";

/** Branches of all salons (design 65). */
export default function AdminBranchesPage() {
  return (
    <AppShell title="Branches" role="admin">
      <AdminBranchesView />
    </AppShell>
  );
}
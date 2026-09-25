import { AppShell } from "@/components/layout/AppShell";
import { UsersView } from "@/components/admin/AdminLists";
import { adminUsers } from "@/lib/mock-admin";

/** All Users (designs 51, 52 — the latter with the Customer filter). */
export default function AdminUsersPage() {
  return (
    <AppShell title="Users" role="admin">
      <UsersView initial={adminUsers} />
    </AppShell>
  );
}
import { AppShell } from "@/components/layout/AppShell";
import { UsersView } from "@/components/admin/AdminLists";
import { directoryUsers } from "@/lib/access/directory";

/** All Users (designs 51, 52 — the latter with the Customer filter). */
export default function AdminUsersPage() {
  return (
    <AppShell title="Users" role="admin">
      <UsersView initial={directoryUsers} />
    </AppShell>
  );
}
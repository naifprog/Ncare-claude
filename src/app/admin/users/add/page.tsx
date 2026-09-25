import { AppShell } from "@/components/layout/AppShell";
import { UserForm } from "@/components/admin/UserForm";

/** Add User (designs 53–56); `?type=Salon|Branch|Worker` preselects the account type. */
export default async function AdminAddUserPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const { type } = await searchParams;
  return (
    <AppShell title="Users" role="admin">
      <UserForm key={type ?? "none"} initialType={type} />
    </AppShell>
  );
}
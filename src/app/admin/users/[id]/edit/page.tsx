import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { UserForm } from "@/components/admin/UserForm";
import { adminUsers, getAdminUser } from "@/lib/mock-admin";

export function generateStaticParams() {
  return adminUsers.map((u) => ({ id: u.id }));
}

export default async function AdminEditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = getAdminUser(id);
  if (!user) notFound();

  return (
    <AppShell title="Users" role="admin">
      <UserForm user={user} />
    </AppShell>
  );
}
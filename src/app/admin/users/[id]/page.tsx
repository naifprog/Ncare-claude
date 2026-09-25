import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { UserProfileView } from "@/components/admin/UserProfileView";
import { adminUsers, getAdminUser } from "@/lib/mock-admin";

export function generateStaticParams() {
  return adminUsers.map((u) => ({ id: u.id }));
}

/** User profile (designs 57–63). */
export default async function AdminUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = getAdminUser(id);
  if (!user) notFound();

  return (
    <AppShell title="Users" role="admin">
      <UserProfileView user={user} />
    </AppShell>
  );
}
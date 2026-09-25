import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { UserProfileView } from "@/components/admin/UserProfileView";
import { directoryUsers, getDirectoryUser } from "@/lib/access/directory";

export function generateStaticParams() {
  return directoryUsers.map((u) => ({ id: u.id }));
}

/** User profile (designs 57–63). */
export default async function AdminUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = getDirectoryUser(id);
  if (!user) notFound();

  return (
    <AppShell title="Users" role="admin">
      <UserProfileView user={user} />
    </AppShell>
  );
}
import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { ChangePasswordForm } from "@/components/settings/ChangePasswordForm";
import { adminUsers, getAdminUser } from "@/lib/mock-admin";

export function generateStaticParams() {
  return adminUsers.map((u) => ({ id: u.id }));
}

/** "Update password" from a user profile (designs 57–59). */
export default async function AdminUserPasswordPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!getAdminUser(id)) notFound();

  return (
    <AppShell title="Users" role="admin">
      <ChangePasswordForm requireCurrent={false} title="Update password" />
    </AppShell>
  );
}
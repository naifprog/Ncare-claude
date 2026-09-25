import { AppShell } from "@/components/layout/AppShell";
import { ChangePasswordForm } from "@/components/settings/ChangePasswordForm";

/** Change password (design 78). */
export default function AdminChangePasswordPage() {
  return (
    <AppShell title="Settings" role="admin">
      <ChangePasswordForm />
    </AppShell>
  );
}
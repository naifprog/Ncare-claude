import { AppShell } from "@/components/layout/AppShell";
import { ChangePasswordForm } from "@/components/settings/ChangePasswordForm";

/** Change password (design 47). */
export default function MainChangePasswordPage() {
  return (
    <AppShell title="Settings" role="main">
      <ChangePasswordForm />
    </AppShell>
  );
}
import { AppShell } from "@/components/layout/AppShell";
import { ChangePasswordForm } from "@/components/settings/ChangePasswordForm";

export default function ChangePasswordPage() {
  return (
    <AppShell title="Salon Settings">
      <ChangePasswordForm />
    </AppShell>
  );
}

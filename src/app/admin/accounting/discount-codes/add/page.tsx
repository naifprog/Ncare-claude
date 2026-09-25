import { AppShell } from "@/components/layout/AppShell";
import { CodeForm } from "@/components/admin/AccountingViews";

/** Add Code (design 91). */
export default function AddCodePage() {
  return (
    <AppShell title="Accounting" role="admin">
      <CodeForm />
    </AppShell>
  );
}
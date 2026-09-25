import { AppShell } from "@/components/layout/AppShell";
import { VatForm } from "@/components/admin/AccountingViews";

/** Update VAT (design 89). */
export default function VatPage() {
  return (
    <AppShell title="Accounting" role="admin">
      <VatForm />
    </AppShell>
  );
}
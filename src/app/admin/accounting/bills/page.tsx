import { AppShell } from "@/components/layout/AppShell";
import { BillsView } from "@/components/admin/AccountingViews";

/** Bills (designs 79, 80, 88). */
export default function BillsPage() {
  return (
    <AppShell title="Accounting" role="admin">
      <BillsView />
    </AppShell>
  );
}
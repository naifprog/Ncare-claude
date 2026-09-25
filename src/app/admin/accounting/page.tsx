import { AppShell } from "@/components/layout/AppShell";
import { AccountingSummaryView } from "@/components/admin/AccountingViews";

/** Accounting summary (design 69). */
export default function AccountingSummaryPage() {
  return (
    <AppShell title="Accounting" role="admin">
      <AccountingSummaryView />
    </AppShell>
  );
}
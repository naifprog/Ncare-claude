import { AppShell } from "@/components/layout/AppShell";
import { ReportsView } from "@/components/admin/AdminMiscViews";

/** Reports (design 73). */
export default function ReportsPage() {
  return (
    <AppShell title="Reports" role="admin">
      <ReportsView />
    </AppShell>
  );
}
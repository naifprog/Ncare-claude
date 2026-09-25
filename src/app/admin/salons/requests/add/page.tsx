import { AppShell } from "@/components/layout/AppShell";
import { RequestForm } from "@/components/requests/RequestForm";
import { BRANCH_CHOICES } from "@/lib/mock-admin";

export default function AdminAddRequestPage() {
  return (
    <AppShell title="Requests" role="admin">
      <RequestForm basePath="/admin/salons/requests" branches={BRANCH_CHOICES} />
    </AppShell>
  );
}
import { AppShell } from "@/components/layout/AppShell";
import { RequestForm } from "@/components/requests/RequestForm";

export default function AddRequestPage() {
  return (
    <AppShell title="Requests">
      <RequestForm />
    </AppShell>
  );
}

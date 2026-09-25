import { AppShell } from "@/components/layout/AppShell";
import { ServiceForm } from "@/components/services/ServiceForm";

export default function AddServicePage() {
  return (
    <AppShell title="Services">
      <ServiceForm />
    </AppShell>
  );
}

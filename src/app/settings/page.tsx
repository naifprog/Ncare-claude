import { AppShell } from "@/components/layout/AppShell";
import { SalonProfileView } from "@/components/settings/SalonProfileView";
import { salonProfile } from "@/lib/mock-data";

export default function SalonSettingsPage() {
  return (
    <AppShell title="Salon Settings">
      <SalonProfileView profile={salonProfile} />
    </AppShell>
  );
}

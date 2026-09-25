import { AppShell } from "@/components/layout/AppShell";
import { MainDashboard } from "@/components/main/MainDashboard";

/** Main Salon UI dashboard (design 26). */
export default function MainDashboardPage() {
  return (
    <AppShell title="Dashboard" role="main">
      <MainDashboard />
    </AppShell>
  );
}

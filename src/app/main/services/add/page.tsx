import { AppShell } from "@/components/layout/AppShell";
import { ServiceForm } from "@/components/services/ServiceForm";
import { BRANCH_TABS } from "@/lib/mock-main";

/** Add service with branch (design 41). */
export default function MainAddServicePage() {
  return (
    <AppShell title="Services" role="main">
      <ServiceForm basePath="/main/services" branches={BRANCH_TABS} />
    </AppShell>
  );
}
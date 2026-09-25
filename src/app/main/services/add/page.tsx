import { AppShell } from "@/components/layout/AppShell";
import { ServiceForm } from "@/components/services/ServiceForm";

/** Add service with branch (design 41); `?branch=` preselects the branch tab it came from. */
export default async function MainAddServicePage({ searchParams }: { searchParams: Promise<{ branch?: string }> }) {
  const { branch } = await searchParams;
  return (
    <AppShell title="Services" role="main">
      <ServiceForm basePath="/main/services" branches="accessible" defaultBranch={branch} />
    </AppShell>
  );
}

import { AppShell } from "@/components/layout/AppShell";
import { RequestForm } from "@/components/requests/RequestForm";

/** Add request with branch (design 33); `?branch=` preselects the branch tab it came from. */
export default async function MainAddRequestPage({ searchParams }: { searchParams: Promise<{ branch?: string }> }) {
  const { branch } = await searchParams;
  return (
    <AppShell title="Requests" role="main">
      <RequestForm basePath="/main/requests" branches="accessible" defaultBranch={branch} />
    </AppShell>
  );
}

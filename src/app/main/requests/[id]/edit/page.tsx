import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { BRANCH_TABS } from "@/lib/mock-main";
import { RequestForm } from "@/components/requests/RequestForm";
import { getRequestDetails } from "@/lib/mock-data";

export default async function MainEditRequestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const request = getRequestDetails(id);
  if (!request) notFound();

  return (
    <AppShell title="Requests" role="main">
      <RequestForm request={{ ...request, branch: BRANCH_TABS[0] }} basePath="/main/requests" branches={BRANCH_TABS} />
    </AppShell>
  );
}

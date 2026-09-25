import { notFound } from "next/navigation";
import { BranchScope } from "@/components/auth/AccessProvider";
import { AppShell } from "@/components/layout/AppShell";
import { RequestForm } from "@/components/requests/RequestForm";
import { getMainRequestDetails } from "@/lib/mock-main";

export default async function MainEditRequestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const request = getMainRequestDetails(id);
  if (!request) notFound();

  return (
    <AppShell title="Requests" role="main">
      <BranchScope branchIds={request.branchId ? [request.branchId] : undefined}>
        <RequestForm request={request} basePath="/main/requests" branches="accessible" />
      </BranchScope>
    </AppShell>
  );
}

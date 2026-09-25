import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { RequestForm } from "@/components/requests/RequestForm";
import { BRANCH_CHOICES, salonBranchOf } from "@/lib/mock-admin";
import { getRequestDetails } from "@/lib/mock-data";

export default async function AdminEditRequestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const request = getRequestDetails(id);
  if (!request) notFound();

  return (
    <AppShell title="Requests" role="admin">
      <RequestForm
        request={request}
        basePath="/admin/salons/requests"
        branches={BRANCH_CHOICES}
        defaultBranch={salonBranchOf(request.id).branch}
      />
    </AppShell>
  );
}
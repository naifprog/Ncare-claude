import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { RequestForm } from "@/components/requests/RequestForm";
import { getRequestDetails } from "@/lib/mock-data";

export default async function EditRequestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const request = getRequestDetails(id);
  if (!request) notFound();

  return (
    <AppShell title="Requests">
      <RequestForm request={request} />
    </AppShell>
  );
}

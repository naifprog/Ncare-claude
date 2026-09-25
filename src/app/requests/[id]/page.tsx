import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { RequestDetailsView } from "@/components/requests/RequestDetailsView";
import { getRequestDetails } from "@/lib/mock-data";

export default async function RequestDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const request = getRequestDetails(id);
  if (!request) notFound();

  return (
    <AppShell title="Requests">
      <RequestDetailsView request={request} />
    </AppShell>
  );
}

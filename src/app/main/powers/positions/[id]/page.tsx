import { notFound } from "next/navigation";
import { PositionPowersEditor } from "@/components/admin/PowersViews";
import { AppShell } from "@/components/layout/AppShell";
import { positionRows } from "@/lib/mock-main";

export function generateStaticParams() {
  return positionRows.map((p) => ({ id: p.id }));
}

/** Default powers of a position (e.g. Branch Manager, Receptionist), same layout as design 44. */
export default async function PositionPowersPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!positionRows.some((p) => p.id === id)) notFound();

  return (
    <AppShell title="Powers" role="main">
      <PositionPowersEditor positionId={id} />
    </AppShell>
  );
}

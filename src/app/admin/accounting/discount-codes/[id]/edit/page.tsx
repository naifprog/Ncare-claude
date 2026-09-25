import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { CodeForm } from "@/components/admin/AccountingViews";
import { discountCodes } from "@/lib/mock-admin";

export function generateStaticParams() {
  return discountCodes.map((c) => ({ id: c.id }));
}

export default async function EditCodePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const code = discountCodes.find((c) => c.id === id);
  if (!code) notFound();

  return (
    <AppShell title="Accounting" role="admin">
      <CodeForm code={code} />
    </AppShell>
  );
}
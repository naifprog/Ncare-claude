import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { BranchProfileView } from "@/components/main/BranchProfileView";
import { branches, getBranch } from "@/lib/mock-main";

export function generateStaticParams() {
  return branches.map((b) => ({ id: b.id }));
}

export default async function BranchProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const branch = getBranch(id);
  if (!branch) notFound();

  return (
    <AppShell title="Branches" role="main">
      <BranchProfileView branch={branch} />
    </AppShell>
  );
}

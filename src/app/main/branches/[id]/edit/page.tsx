import { notFound } from "next/navigation";
import { BranchScope } from "@/components/auth/AccessProvider";
import { AppShell } from "@/components/layout/AppShell";
import { BranchForm } from "@/components/main/BranchForm";
import { branches, getBranch } from "@/lib/mock-main";

export function generateStaticParams() {
  return branches.map((b) => ({ id: b.id }));
}

export default async function EditBranchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const branch = getBranch(id);
  if (!branch) notFound();

  return (
    <AppShell title="Branches" role="main">
      <BranchScope branchIds={[branch.id]}>
        <BranchForm branch={branch} />
      </BranchScope>
    </AppShell>
  );
}

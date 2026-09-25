import { notFound } from "next/navigation";
import { BranchPowersEditor } from "@/components/admin/PowersViews";
import { BranchScope } from "@/components/auth/AccessProvider";
import { AppShell } from "@/components/layout/AppShell";
import { branches, getBranch } from "@/lib/mock-main";

export function generateStaticParams() {
  return branches.map((b) => ({ id: b.id }));
}

/** Powers of a branch (designs 44, 46). */
export default async function BranchPowersPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const branch = getBranch(id);
  if (!branch) notFound();

  return (
    <AppShell title="Powers" role="main">
      <BranchScope branchIds={[branch.id]}>
        <BranchPowersEditor branchId={branch.id} branchName={branch.name} />
      </BranchScope>
    </AppShell>
  );
}

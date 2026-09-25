import { AppShell } from "@/components/layout/AppShell";
import { BranchesView } from "@/components/main/BranchesView";
import { branches } from "@/lib/mock-main";

export default function BranchesPage() {
  return (
    <AppShell title="Branches" role="main">
      <BranchesView initial={branches} />
    </AppShell>
  );
}

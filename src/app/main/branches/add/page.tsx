import { AppShell } from "@/components/layout/AppShell";
import { BranchForm } from "@/components/main/BranchForm";

export default function AddBranchPage() {
  return (
    <AppShell title="Branches" role="main">
      <BranchForm />
    </AppShell>
  );
}

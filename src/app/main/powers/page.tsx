import { AppShell } from "@/components/layout/AppShell";
import { BranchPowersView } from "@/components/main/BranchPowersView";
import { branches } from "@/lib/mock-main";

export default function MainPowersPage() {
  return (
    <AppShell title="Powers" role="main">
      <BranchPowersView branches={branches} />
    </AppShell>
  );
}
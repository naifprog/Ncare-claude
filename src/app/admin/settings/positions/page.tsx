import { AppShell } from "@/components/layout/AppShell";
import { NameListManager } from "@/components/ui/NameListManager";
import { positionRows } from "@/lib/mock-main";

/** Positions (design 77). */
export default function AdminPositionsPage() {
  return (
    <AppShell title="Settings" role="admin">
      <NameListManager
        addLabel="Add position"
        placeholder="Enter position name"
        nameHeader="Position Name"
        initial={positionRows}
        exportName="positions"
      />
    </AppShell>
  );
}
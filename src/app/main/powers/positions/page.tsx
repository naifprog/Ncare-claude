import { AppShell } from "@/components/layout/AppShell";
import { NameListManager } from "@/components/ui/NameListManager";
import { positionRows } from "@/lib/mock-main";

/** All position (design 45). */
export default function MainPositionsPage() {
  return (
    <AppShell title="Powers" role="main">
      <NameListManager
        addLabel="Add position"
        placeholder="Enter position name"
        nameHeader="Position Name"
        initial={positionRows}
      />
    </AppShell>
  );
}
import { Suspense } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { AddPowerView } from "@/components/admin/PowersViews";

/** Add / edit power (design 75). */
export default function AddPowerPage() {
  return (
    <AppShell title="Powers" role="admin">
      <Suspense>
        <AddPowerView />
      </Suspense>
    </AppShell>
  );
}
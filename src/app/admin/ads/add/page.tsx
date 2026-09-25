import { AppShell } from "@/components/layout/AppShell";
import { AdForm } from "@/components/admin/AdminMiscViews";

/** Add Ad (design 72). */
export default function AddAdPage() {
  return (
    <AppShell title="Ads" role="admin">
      <AdForm />
    </AppShell>
  );
}
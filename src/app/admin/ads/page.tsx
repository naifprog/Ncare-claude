import { AppShell } from "@/components/layout/AppShell";
import { AdsView } from "@/components/admin/AdminMiscViews";

/** All Ads (design 70). */
export default function AdsPage() {
  return (
    <AppShell title="Ads" role="admin">
      <AdsView />
    </AppShell>
  );
}
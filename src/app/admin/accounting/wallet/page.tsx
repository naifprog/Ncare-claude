import { AppShell } from "@/components/layout/AppShell";
import { WalletView } from "@/components/admin/AccountingViews";

/** Wallet (design 87). */
export default function WalletPage() {
  return (
    <AppShell title="Accounting" role="admin">
      <WalletView />
    </AppShell>
  );
}
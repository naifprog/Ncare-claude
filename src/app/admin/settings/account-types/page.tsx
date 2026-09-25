import { AppShell } from "@/components/layout/AppShell";
import { NameListManager } from "@/components/ui/NameListManager";
import { accountTypeRows } from "@/lib/mock-admin";

/** Accounts type (design 76). */
export default function AdminAccountTypesPage() {
  return (
    <AppShell title="Settings" role="admin">
      <NameListManager
        addLabel="Add Account type"
        placeholder="Enter account name"
        nameHeader="Account type"
        initial={accountTypeRows}
        powersHref="/admin/powers/add?accountType={name}"
        editPermission="settings.edit"
        exportName="account-types"
      />
    </AppShell>
  );
}
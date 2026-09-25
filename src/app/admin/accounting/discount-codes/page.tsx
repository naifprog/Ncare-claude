import { AppShell } from "@/components/layout/AppShell";
import { DiscountCodesView } from "@/components/admin/AccountingViews";
import { discountCodes } from "@/lib/mock-admin";

/** Discount codes (design 90). */
export default function DiscountCodesPage() {
  return (
    <AppShell title="Accounting" role="admin">
      <DiscountCodesView initial={discountCodes} />
    </AppShell>
  );
}
import { AppShell } from "@/components/layout/AppShell";
import { BillTable } from "@/components/admin/BillTable";
import { SubscriptionsChart, YearlyEntriesChart } from "@/components/admin/Charts";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { adminStats, bills, subscriptionsChart, yearlyEntriesChart } from "@/lib/mock-admin";

/** Super Admin dashboard (design 49; popovers 81, 84). */
export default function AdminDashboardPage() {
  return (
    <AppShell title="Dashboard" role="admin">
      <section className="rounded-card bg-card pb-5 pt-5 shadow-card">
        <div className="overflow-x-auto px-5 no-scrollbar">
          <StatsGrid stats={adminStats} className="sm:w-max sm:gap-2.5 sm:pl-0" />
        </div>

        <div className="mt-[30px] grid gap-5 px-4 sm:px-[30px] lg:grid-cols-2">
          <SubscriptionsChart data={subscriptionsChart} />
          <YearlyEntriesChart data={yearlyEntriesChart} />
        </div>

        <hr className="mx-4 mt-[30px] border-divider sm:mx-[30px]" />
        <h2 className="px-[60px] pt-[22px] text-[15px] font-bold text-ink">Latest Subscriptions</h2>
        <div className="mt-[26px] px-4 sm:px-[30px]">
          <BillTable rows={bills.slice(0, 3)} kind="latest" />
        </div>
      </section>
    </AppShell>
  );
}

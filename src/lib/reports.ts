/**
 * Report contents generated from the mock data (Super Admin → Reports, design 73).
 * The mock records carry no history, so the period only labels the report.
 */
import type { ExportRow } from "@/lib/export";
import { adminBranches, adminSalons, bills, salonBranchOf, type ReportDef } from "@/lib/mock-admin";
import { completedRequests, incompleteRequests, newRequests, pendingRequests } from "@/lib/mock-data";

export function reportRows(report: ReportDef): ExportRow[] {
  switch (report.kind) {
    case "Salons":
      return adminSalons.map((s) => ({
        Num: s.num,
        Salon: s.name,
        Manager: s.manager,
        Branches: s.branchCount,
        Region: s.region,
        "Earning (SAR)": s.earnings,
      }));
    case "Branches":
      return adminBranches.map((b) => ({ Num: b.num, Salon: b.salon, Branch: b.name, Region: b.region, "Earning (SAR)": b.earnings }));
    case "Requests":
      return [...newRequests, ...pendingRequests, ...completedRequests, ...incompleteRequests].map((r) => ({
        Num: r.num,
        Status: r.status,
        Worker: r.workerName,
        Service: r.service,
        Type: r.priority,
        Date: `${r.time}, ${r.date}`,
        Salon: salonBranchOf(r.id).salon,
        Branch: salonBranchOf(r.id).branch,
      }));
    case "Accounting":
      return bills.map((b) => ({
        Num: b.num,
        Salon: b.salon,
        Source: b.source,
        Date: b.date,
        Payment: b.paymentMethod,
        Status: b.status,
        "Amount (SAR)": b.earning,
      }));
  }
}

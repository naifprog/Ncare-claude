"use client";

import { useMemo, useState } from "react";
import { useAccess } from "@/components/auth/AccessProvider";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { ImportIcon, PrinterIcon } from "@/components/ui/DesignIcons";
import { ListCard } from "@/components/ui/ListToolbar";
import { Pagination, usePagination } from "@/components/ui/Pagination";
import { SearchSelect } from "@/components/ui/SearchSelect";
import { toast } from "@/lib/demo-state";
import { downloadCsv, printRows } from "@/lib/export";
import { REPORT_FILTERS, REPORT_MONTHS, reports, type ReportDef } from "@/lib/mock-admin";
import { reportRows } from "@/lib/reports";

const YEARS = [...new Set(reports.map((r) => r.year))];

/**
 * Reports (design 73). Each report is generated from the mock data when opened:
 * CSV reports download a real .csv file; PDF reports open the browser print dialog,
 * where "Save as PDF" produces the PDF.
 */
export function ReportsView() {
  const { can } = useAccess();
  const [kind, setKind] = useState<string | null>(null);
  const [year, setYear] = useState<string | null>(null);
  const [month, setMonth] = useState<string | null>(null);

  const visible = useMemo(
    () => reports.filter((r) => (!kind || r.kind === kind) && (!year || r.year === year) && (!month || r.month === month)),
    [kind, year, month],
  );
  const { pageRows, pagination } = usePagination(visible);

  const open = (r: ReportDef) => {
    const rows = reportRows(r);
    const fileName = r.name.toLowerCase().replace(/\s+/g, "-");
    if (r.format === "CSV") {
      downloadCsv(fileName, rows);
      toast(`${r.name} downloaded as CSV (${rows.length} rows, generated from demo data).`);
    } else {
      printRows(r.name, rows, `${r.kind} · ${r.month} ${r.year} · ${rows.length} rows · demo data`);
    }
  };

  const columns: Column<ReportDef>[] = [
    { key: "num", header: "Num", width: "w-[130px]", render: (r) => r.num },
    { key: "name", header: "Report name", width: "w-[389px]", render: (r) => r.name },
    { key: "format", header: "Format", width: "w-[160px]", render: (r) => (r.format === "PDF" ? "Pdf" : "Csv") },
    {
      key: "options",
      header: "Options",
      render: (r) =>
        can("reports.export") ? (
          <button
            type="button"
            onClick={() => open(r)}
            title={r.format === "PDF" ? "Opens the print dialog: choose “Save as PDF”" : "Downloads a .csv file"}
            className="inline-flex h-6 items-center gap-1 rounded-[3px] border border-[#7e1bff] px-2 text-xs text-[#7e1bff]"
          >
            {r.format === "PDF" ? <PrinterIcon size={14} /> : <ImportIcon size={14} />}
            {r.format === "PDF" ? "Print / PDF" : "Download"}
          </button>
        ) : (
          <span className="text-xs text-ink-muted">View only</span>
        ),
    },
  ];

  return (
    <ListCard>
      <div className="grid gap-2.5 sm:grid-cols-3 sm:gap-5">
        <SearchSelect allLabel={REPORT_FILTERS[0]} searchable={false} options={REPORT_FILTERS.slice(1)} value={kind} onChange={setKind} />
        <SearchSelect allLabel="Select Year" searchable={false} options={YEARS} value={year} onChange={setYear} />
        <SearchSelect allLabel="Select Month" searchable={false} options={REPORT_MONTHS} value={month} onChange={setMonth} />
      </div>
      <div className="mt-5">
        <DataTable columns={columns} rows={pageRows} rowKey={(r) => r.id} emptyText="No reports for this period." />
      </div>
      <Pagination className="mt-auto" {...pagination} />
    </ListCard>
  );
}

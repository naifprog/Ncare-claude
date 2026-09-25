"use client";

import { useState } from "react";
import { useAccess } from "@/components/auth/AccessProvider";
import { ExportIcon } from "@/components/ui/DesignIcons";
import { downloadCsv, downloadFile, htmlDocument, htmlTable, printRows, type ExportRow } from "@/lib/export";

type Format = "print" | "word" | "csv";

/**
 * Orange export button in table headers + format list (design frame 3040581: Pdf / Word / Excel).
 * No document libraries are installed, so each option says what it really produces:
 * "Print / PDF" opens the print dialog (Save as PDF), "Word (HTML)" downloads an HTML
 * table with a .doc extension that Word opens, "Excel (CSV)" downloads a real CSV file.
 * Hidden for users without the "Export / download reports" permission.
 */
export function ExportMenu({ fileName, rows, title }: { fileName: string; rows: ExportRow[]; title?: string }) {
  const [open, setOpen] = useState(false);
  const { can } = useAccess();
  if (!can("reports.export")) return null;

  const heading = title ?? fileName.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase());
  const run = (format: Format) => {
    setOpen(false);
    if (format === "csv") downloadCsv(fileName, rows);
    else if (format === "word") downloadFile(`${fileName}.doc`, "application/msword", htmlDocument(heading, htmlTable(rows)));
    else printRows(heading, rows, `${rows.length} rows`);
  };

  const options: { format: Format; label: string; hint: string }[] = [
    { format: "print", label: "Print / PDF", hint: "Opens the print dialog — choose “Save as PDF”" },
    { format: "word", label: "Word (HTML)", hint: "HTML table saved as .doc; opens in Word" },
    { format: "csv", label: "Excel (CSV)", hint: "Comma-separated file; opens in Excel" },
  ];

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        aria-label="Export"
        aria-haspopup="menu"
        aria-expanded={open}
        disabled={rows.length === 0}
        title={rows.length === 0 ? "Nothing to export" : undefined}
        onClick={() => setOpen((o) => !o)}
        className="flex h-[30px] w-[30px] items-center justify-center rounded-[5px] bg-brand-orange text-white shadow-card disabled:opacity-40"
      >
        <ExportIcon size={20} />
      </button>
      {open && (
        <>
          <span className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <span role="menu" className="absolute right-0 top-9 z-50 w-[130px] rounded-[5px] bg-card py-1 shadow-card">
            {options.map((o) => (
              <button
                key={o.format}
                type="button"
                role="menuitem"
                title={o.hint}
                onClick={() => run(o.format)}
                className="block h-[41px] w-full text-center text-sm font-normal text-ink hover:text-brand"
              >
                {o.label}
              </button>
            ))}
          </span>
        </>
      )}
    </span>
  );
}

"use client";

import { useState } from "react";
import { ExportIcon } from "@/components/ui/DesignIcons";

type Row = Record<string, string | number>;

function toHtmlTable(rows: Row[]) {
  const headers = Object.keys(rows[0] ?? {});
  const esc = (v: unknown) => String(v).replace(/&/g, "&amp;").replace(/</g, "&lt;");
  return `<table border="1" cellspacing="0" cellpadding="6"><thead><tr>${headers
    .map((h) => `<th>${esc(h)}</th>`)
    .join("")}</tr></thead><tbody>${rows
    .map((r) => `<tr>${headers.map((h) => `<td>${esc(r[h])}</td>`).join("")}</tr>`)
    .join("")}</tbody></table>`;
}

function download(name: string, type: string, content: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Orange export button in table headers + format list (design frame 3040581: Pdf / Word / Excel).
 * No document libraries are installed, so: Excel → CSV, Word → HTML-based .doc, Pdf → print dialog.
 */
export function ExportMenu({ fileName, rows }: { fileName: string; rows: Row[] }) {
  const [open, setOpen] = useState(false);

  const run = (format: "Pdf" | "Word" | "Excel") => {
    setOpen(false);
    if (format === "Excel") {
      const headers = Object.keys(rows[0] ?? {});
      const csv = [headers, ...rows.map((r) => headers.map((h) => r[h]))]
        .map((line) => line.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
        .join("\n");
      download(`${fileName}.csv`, "text/csv", csv);
    } else if (format === "Word") {
      download(`${fileName}.doc`, "application/msword", `<html><body>${toHtmlTable(rows)}</body></html>`);
    } else {
      const w = window.open("", "_blank", "width=900,height=700");
      if (!w) return;
      w.document.write(`<html><head><title>${fileName}</title></head><body>${toHtmlTable(rows)}</body></html>`);
      w.document.close();
      w.print();
    }
  };

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        aria-label="Export"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex h-[30px] w-[30px] items-center justify-center rounded-[5px] bg-brand-orange text-white shadow-card"
      >
        <ExportIcon size={20} />
      </button>
      {open && (
        <>
          <span className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <span role="menu" className="absolute right-0 top-9 z-50 w-[110px] rounded-[5px] bg-card py-1 shadow-card">
            {(["Pdf", "Word", "Excel"] as const).map((f) => (
              <button
                key={f}
                type="button"
                role="menuitem"
                onClick={() => run(f)}
                className="block h-[41px] w-full text-center text-sm font-normal text-ink hover:text-brand"
              >
                {f}
              </button>
            ))}
          </span>
        </>
      )}
    </span>
  );
}

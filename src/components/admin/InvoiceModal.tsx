"use client";

import Image from "next/image";
import { useAccess } from "@/components/auth/AccessProvider";
import { billHtml, billLines, billTotals } from "@/lib/bills";
import { downloadFile, printHtml } from "@/lib/export";
import type { Bill } from "@/lib/mock-admin";

/**
 * Bill preview (design frame 3040745) opened from the "view" action of bill tables.
 * The bill is generated from the row's data; print opens the browser dialog (Save as
 * PDF) and download saves the same bill as an .html document.
 */
export function InvoiceModal({ bill, onClose }: { bill: Bill; onClose: () => void }) {
  const { can } = useAccess();
  const line = billLines(bill)[0];
  const { subtotal, vat, total } = billTotals(bill);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={`Bill ${bill.num}`}>
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative max-h-full w-full max-w-[521px] overflow-auto rounded-[5px] bg-card shadow-card thin-scrollbar">
        <div className="space-y-5 p-6 text-sm text-ink">
          <div className="flex items-start justify-between gap-4">
            <Image src="/images/ncare-logo.png" alt="Ncare" width={110} height={29} />
            <div className="text-right">
              <p className="text-lg font-bold text-brand">BILL #{bill.num}</p>
              <p className="text-xs text-ink-muted">{bill.date}</p>
            </div>
          </div>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-1 rounded-[5px] bg-page p-4 text-xs">
            <dt className="text-ink-muted">Salon</dt>
            <dd>{bill.salon}</dd>
            <dt className="text-ink-muted">Billed to</dt>
            <dd>{bill.username}</dd>
            <dt className="text-ink-muted">Payment method</dt>
            <dd>{bill.paymentMethod}</dd>
            <dt className="text-ink-muted">Status</dt>
            <dd>{bill.status}</dd>
          </dl>
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="bg-page">
                <th className="p-2 font-normal">Item</th>
                <th className="p-2 font-normal">Date</th>
                <th className="p-2 text-right font-normal">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[#f2f2f2]">
                <td className="p-2">{line.Item}</td>
                <td className="p-2">{line.Date}</td>
                <td className="p-2 text-right">{subtotal.toFixed(2)} SAR</td>
              </tr>
            </tbody>
          </table>
          <dl className="ml-auto grid w-56 grid-cols-2 gap-y-1 text-xs">
            <dt>Subtotal</dt>
            <dd className="text-right">{subtotal.toFixed(2)} SAR</dd>
            <dt>VAT (15%)</dt>
            <dd className="text-right">{vat.toFixed(2)} SAR</dd>
            <dt className="font-bold">Total</dt>
            <dd className="text-right font-bold text-positive">{total.toFixed(2)} SAR</dd>
          </dl>
        </div>
        <div className="flex justify-end gap-2.5 border-t border-border p-3">
          {can("accounting.billsExport") && (
            <>
              <button
                type="button"
                onClick={() => printHtml(billHtml(bill))}
                title="Opens the print dialog: choose “Save as PDF” for a PDF"
                className="h-10 rounded-[5px] bg-info px-5 text-sm font-bold text-white"
              >
                Print / PDF
              </button>
              <button
                type="button"
                onClick={() => downloadBill(bill)}
                className="h-10 rounded-[5px] bg-[#7e1bff] px-5 text-sm font-bold text-white"
              >
                Download (.html)
              </button>
            </>
          )}
          <button type="button" onClick={onClose} className="h-10 rounded-[5px] bg-page px-5 text-sm font-bold text-ink">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/** Saves the bill as a standalone HTML document (download action of bill tables). */
export function downloadBill(bill: Bill) {
  downloadFile(`bill-${bill.num}.html`, "text/html;charset=utf-8", billHtml(bill));
}

/** Prints the bill on its own (print action of bill tables, design 79). */
export function printBill(bill: Bill) {
  printHtml(billHtml(bill));
}

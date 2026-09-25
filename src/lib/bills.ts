/**
 * Printable bill documents generated from the mock data (replaces the sample invoice
 * image). They are plain HTML: printed via the browser dialog or saved as .html.
 */
import { htmlDocument, htmlTable } from "@/lib/export";
import type { Bill } from "@/lib/mock-admin";
import type { RequestDetails } from "@/types";

const VAT_RATE = 0.15;

function totals(subtotal: number) {
  const vat = Math.round(subtotal * VAT_RATE * 100) / 100;
  return { subtotal, vat, total: subtotal + vat };
}

export function billLines(bill: Bill) {
  return [
    {
      Item: bill.source === "subscription" ? "Ncare subscription" : bill.service,
      Salon: bill.salon,
      Date: bill.date,
      "Payment method": bill.paymentMethod,
      "Amount (SAR)": bill.source === "subscription" ? bill.earning : bill.price,
    },
  ];
}

export function billTotals(bill: Bill) {
  return totals(bill.source === "subscription" ? bill.earning : bill.price);
}

function totalsTable({ subtotal, vat, total }: ReturnType<typeof totals>) {
  return `<table class="totals" style="margin-top:16px;width:auto;margin-left:auto"><tbody>
    <tr><td>Subtotal</td><td>${subtotal.toFixed(2)} SAR</td></tr>
    <tr><td>VAT (${VAT_RATE * 100}%)</td><td>${vat.toFixed(2)} SAR</td></tr>
    <tr><td>Total</td><td>${total.toFixed(2)} SAR</td></tr>
  </tbody></table>`;
}

export function billHtml(bill: Bill) {
  return htmlDocument(
    `Bill #${bill.num}`,
    htmlTable(billLines(bill)) + totalsTable(billTotals(bill)),
    `${bill.salon} · ${bill.username} · ${bill.date} · ${bill.status}`,
  );
}

export function requestBillHtml(request: RequestDetails) {
  const rows = request.lines.map((l) => ({
    Service: l.service,
    Category: l.category,
    Worker: l.workerName,
    "Price (SAR)": l.price,
  }));
  const subtotal = request.lines.reduce((sum, l) => sum + l.price, 0);
  return htmlDocument(
    `Request #${request.num} bill`,
    htmlTable(rows) + totalsTable(totals(subtotal)),
    `${request.customer.name} · ${request.customer.phone} · ${request.time}, ${request.date} · ${request.paymentMethod}${
      request.branch ? ` · ${request.branch}` : ""
    }`,
  );
}

"use client";

import Image from "next/image";

/** Bill preview (design frame 3040745) opened from the "view" action of bill tables. */
export function InvoiceModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Bill preview">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative max-h-full overflow-auto rounded-[5px] bg-card shadow-card thin-scrollbar">
        <Image src="/images/invoice-sample.png" alt="Bill" width={521} height={636} />
        <div className="flex justify-end gap-2.5 border-t border-border p-3">
          <a
            href="/images/invoice-sample.png"
            download="bill.png"
            className="flex h-10 items-center rounded-[5px] bg-[#7e1bff] px-5 text-sm font-bold text-white"
          >
            Download
          </a>
          <button type="button" onClick={onClose} className="h-10 rounded-[5px] bg-page px-5 text-sm font-bold text-ink">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/** Triggers a download of the sample bill (download action of bill tables). */
export function downloadBill(name = "bill") {
  const a = document.createElement("a");
  a.href = "/images/invoice-sample.png";
  a.download = `${name}.png`;
  a.click();
}

/** Prints the bill on its own (print action of bill tables, design 79). */
export function printBill() {
  const w = window.open("", "_blank", "width=620,height=760");
  if (!w) return;
  w.document.write(
    `<html><head><title>Bill</title></head><body style="margin:0"><img src="${window.location.origin}/images/invoice-sample.png" onload="window.print()" /></body></html>`,
  );
  w.document.close();
}
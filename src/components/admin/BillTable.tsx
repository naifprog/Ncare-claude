"use client";

import { useState } from "react";
import { InvoiceModal, downloadBill, printBill } from "@/components/admin/InvoiceModal";
import { useAccess } from "@/components/auth/AccessProvider";
import { DataTable, RowActions, type Column } from "@/components/ui/DataTable";
import { ExportMenu } from "@/components/ui/ExportMenu";
import { HeaderFilter } from "@/components/ui/HeaderFilter";
import { Pagination, usePagination } from "@/components/ui/Pagination";
import { requestServiceFilters } from "@/lib/mock-data";
import type { Bill } from "@/lib/mock-admin";

export function Earning({ value }: { value: number }) {
  return (
    <span className="text-positive">
      <span className="font-bold">{value}</span> <span className="text-[10px] font-bold">SAR</span>
    </span>
  );
}

export type BillKind = "subscriptions" | "requests" | "latest" | "all";

/**
 * Bills table (designs 49, 79, 80, 88). "requests" bills show service / status / price columns;
 * the others show the subscription columns. View opens the bill, download saves it.
 */
export function BillTable({
  rows,
  kind,
  withExport,
  printable,
  paginate,
}: {
  rows: Bill[];
  kind: BillKind;
  withExport?: boolean;
  /** Adds the blue printer action (bills pages, designs 79, 80, 88). */
  printable?: boolean;
  /** Adds the pagination footer (bills page). */
  paginate?: boolean;
}) {
  const { can } = useAccess();
  const canExport = can("accounting.billsExport");
  const [preview, setPreview] = useState<Bill | null>(null);
  const [serviceF, setServiceF] = useState<string | null>(null);
  const [statusF, setStatusF] = useState<string | null>(null);
  const visible = rows.filter((b) => (!serviceF || b.service === serviceF) && (!statusF || b.status === statusF));
  const { pageRows, pagination } = usePagination(visible);

  const actions = (b: Bill) => (
    <RowActions
      label={`bill ${b.num}`}
      onView={() => setPreview(b)}
      onPrint={printable && canExport ? () => printBill(b) : undefined}
      onDownload={canExport ? () => downloadBill(b) : undefined}
    />
  );
  const optionsHeader = withExport ? (
    <span className="flex items-center justify-between pr-5">
      Option{" "}
      <ExportMenu
        fileName="bills"
        rows={visible.map((b) => ({ Num: b.num, Name: b.salon, Date: b.date, Payment: b.paymentMethod, Earning: b.earning }))}
      />
    </span>
  ) : (
    "Option"
  );

  const columns: Column<Bill>[] =
    kind === "requests"
      ? [
          { key: "num", header: "Num", width: "w-[103px]", render: (b) => b.num },
          { key: "salon", header: "Salon name", width: "w-[140px]", render: (b) => b.salon },
          {
            key: "service",
            header: <HeaderFilter label="Services" options={requestServiceFilters} value={serviceF} onChange={setServiceF} />,
            width: "w-[125px]",
            render: (b) => b.service,
          },
          {
            key: "status",
            header: (
              <HeaderFilter label="Request status" options={["Complete", "Incomplete"]} value={statusF} onChange={setStatusF} />
            ),
            width: "w-[140px]",
            render: (b) => (
              <span
                className={
                  b.status === "Complete"
                    ? "inline-flex h-[30px] w-[84px] items-center justify-center rounded-[3px] bg-tint-teal text-positive"
                    : "inline-flex h-[30px] w-[84px] items-center justify-center rounded-[3px] bg-tint-rose text-negative"
                }
              >
                {b.status}
              </span>
            ),
          },
          { key: "date", header: "Date", width: "w-[125px]", render: (b) => b.requestDate },
          { key: "price", header: "Price", width: "w-[115px]", render: (b) => <Earning value={b.price} /> },
          { key: "options", header: optionsHeader, render: actions },
        ]
      : [
          { key: "num", header: "Num", width: "w-[90px]", render: (b) => b.num },
          {
            key: "name",
            header: kind === "all" ? "Username" : "Salon name",
            width: kind === "all" ? "w-[150px]" : "w-[134px]",
            render: (b) => (kind === "all" ? b.username : b.salon),
          },
          ...(kind === "all"
            ? []
            : [{ key: "manager", header: "Manager name", width: "w-[167px]", render: (b: Bill) => b.manager }]),
          { key: "date", header: "Date", width: "w-[136px]", render: (b) => b.date },
          { key: "payment", header: "Payment Method", width: "w-[163px]", render: (b) => b.paymentMethod },
          { key: "earning", header: "Earning", width: "w-[117px]", render: (b) => <Earning value={b.earning} /> },
          { key: "options", header: optionsHeader, render: actions },
        ];

  return (
    <>
      <DataTable columns={columns} rows={paginate ? pageRows : visible} rowKey={(b) => b.id} emptyText="No bills match the filters." />
      {paginate && <Pagination className="mt-[7px]" {...pagination} />}
      {preview && <InvoiceModal bill={preview} onClose={() => setPreview(null)} />}
    </>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { AccountTypeBadge } from "@/components/admin/AccountTypeBadge";
import { BillTable, Earning } from "@/components/admin/BillTable";
import { YearlyEntriesChart } from "@/components/admin/Charts";
import { RequestsToolbar } from "@/components/requests/RequestsToolbar";
import { DataTable, RowActions, type Column } from "@/components/ui/DataTable";
import { CaretDownIcon, PercentIcon } from "@/components/ui/DesignIcons";
import { ExportMenu } from "@/components/ui/ExportMenu";
import {
  DateInput,
  DropdownSelect,
  FormCard,
  FormField,
  FormFields,
  FormGrid,
  SubmitButton,
  TextInput,
} from "@/components/ui/Form";
import { HeaderFilter } from "@/components/ui/HeaderFilter";
import { ListCard, ListToolbar } from "@/components/ui/ListToolbar";
import { Pagination } from "@/components/ui/Pagination";
import { SearchSelect } from "@/components/ui/SearchSelect";
import {
  bills,
  monthlyEntries,
  walletRows,
  yearlyEntriesChart,
  type DiscountCode,
} from "@/lib/mock-admin";
import { cn, toInputDate } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Summary (design 69)
// ---------------------------------------------------------------------------

export function AccountingSummaryView() {
  const [year, setYear] = useState("2022");
  const [yearOpen, setYearOpen] = useState(false);

  return (
    <section className="grid overflow-hidden rounded-card bg-card shadow-card xl:grid-cols-[minmax(0,1fr)_341px]">
      <div className="min-w-0 px-5 pb-5 pt-10">
        <YearlyEntriesChart data={yearlyEntriesChart} subscriptionsColor="#27a7de" className="h-[280px] pt-6" />
        <h2 className="mt-[30px] text-lg text-ink">last Entries</h2>
        <div className="mt-[30px]">
          <DataTable
            columns={[
              { key: "num", header: "Num", width: "w-[130px]", render: (b) => b.num },
              { key: "salon", header: "Salon name", width: "w-[143px]", render: (b) => b.salon },
              { key: "date", header: "Date", width: "w-[146px]", render: (b) => b.date },
              { key: "payment", header: "Payment Method", width: "w-[173px]", render: (b) => b.paymentMethod },
              { key: "earning", header: "Earning", render: (b) => <Earning value={b.earning} /> },
            ]}
            rows={bills.slice(0, 6)}
            rowKey={(b) => b.id}
            minWidth={680}
            rowHeight="h-[60px]"
          />
        </div>
        <Pagination className="mt-[7px]" pageCount={11} compact defaultRows={7} />
      </div>

      <aside className="border-t border-divider px-5 pb-5 pt-10 xl:border-l xl:border-t-0">
        <div className="flex items-center justify-between">
          <h2 className="text-lg text-ink">Yearly Entries</h2>
          <div className="relative">
            <button
              type="button"
              aria-haspopup="listbox"
              aria-expanded={yearOpen}
              onClick={() => setYearOpen((o) => !o)}
              className="flex h-[30px] w-[95px] items-center justify-between rounded-[3px] bg-brand px-4 text-sm font-bold text-white"
            >
              {year}
              <CaretDownIcon className={cn("transition-transform", yearOpen && "rotate-180")} />
            </button>
            {yearOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setYearOpen(false)} />
                <ul role="listbox" className="absolute right-0 top-9 z-50 w-[95px] rounded-[5px] bg-card py-1 shadow-card">
                  {["2023", "2022", "2021"].map((y) => (
                    <li key={y}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={y === year}
                        onClick={() => {
                          setYear(y);
                          setYearOpen(false);
                        }}
                        className={cn("h-8 w-full text-sm text-ink hover:text-brand", y === year && "font-bold text-brand")}
                      >
                        {y}
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
        <div className="mt-4 flex h-[68px] items-center justify-center rounded-[5px] bg-brand-orange text-white shadow-card">
          <span className="text-[28px] font-bold">24,400</span>
          <span className="mt-2 text-base font-bold">SAR</span>
        </div>
        <ul className="mt-5 grid grid-cols-2 gap-5">
          {monthlyEntries.map((m) => (
            <li key={m.month} className="h-[98px] rounded-[5px] bg-page px-4 pt-5 shadow-card">
              <p className="text-sm text-ink">{m.month}</p>
              <p className="mt-2 text-brand-orange">
                <span className="text-2xl font-bold">{m.amount}</span>
                <span className="text-sm">SAR</span>
              </p>
            </li>
          ))}
        </ul>
      </aside>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Wallet (design 87) + "Add to wallet" dialog (frame 3040582)
// ---------------------------------------------------------------------------

type WalletRow = (typeof walletRows)[number];

function AmountDialog({ onSave, onClose }: { onSave: (amount: number) => void; onClose: () => void }) {
  const [amount, setAmount] = useState("");
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Add to wallet">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <form
        className="relative w-full max-w-[338px] rounded-[5px] bg-card px-5 pb-5 pt-6 shadow-card"
        onSubmit={(e) => {
          e.preventDefault();
          const n = Number(amount);
          if (n > 0) onSave(n);
        }}
      >
        <label htmlFor="wallet-amount" className="block pl-2.5 text-base text-ink">
          Amount
        </label>
        <input
          id="wallet-amount"
          autoFocus
          type="number"
          min={1}
          required
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter Amount .."
          className="mt-4 h-10 w-full rounded-[5px] bg-page px-4 text-sm text-ink placeholder:text-[#aeaeae] focus:outline focus:outline-brand"
        />
        <div className="mt-5 flex justify-end">
          <button type="submit" className="h-10 w-[70px] rounded-[5px] bg-brand text-sm font-bold text-white shadow-card">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

export function WalletView() {
  const router = useRouter();
  const [rows, setRows] = useState(walletRows);
  const [query, setQuery] = useState("");
  const [type, setType] = useState<string | null>(null);
  const [adding, setAdding] = useState<WalletRow | null>(null);

  const visible = rows.filter(
    (r) => (!query.trim() || r.name.toLowerCase().includes(query.trim().toLowerCase())) && (!type || r.accountType === type),
  );

  const columns: Column<WalletRow>[] = [
    { key: "num", header: "Num", width: "w-[160px]", render: (r) => r.num },
    { key: "name", header: "User name", width: "w-[194px]", render: (r) => r.name },
    { key: "wallet", header: "Wallet", width: "w-[148px]", render: (r) => <Earning value={r.balance} /> },
    {
      key: "type",
      header: <HeaderFilter label="Account type" options={["Salon", "Branch", "Worker", "Customer"]} value={type} onChange={setType} />,
      width: "w-[239px]",
      render: (r) => <AccountTypeBadge type={r.accountType} />,
    },
    {
      key: "options",
      header: (
        <span className="flex items-center justify-between pr-5">
          Options <ExportMenu fileName="wallets" rows={visible.map((r) => ({ Num: r.num, User: r.name, Wallet: r.balance, Type: r.accountType }))} />
        </span>
      ),
      render: (r) => (
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setAdding(r)}
            className="h-[30px] w-[124px] rounded-[3px] bg-info text-[15px] font-bold text-white shadow-card"
          >
            Add to wallet
          </button>
          <RowActions label={r.name} onView={() => router.push("/admin/users/user-2")} />
        </div>
      ),
    },
  ];

  return (
    <ListCard>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search .."
        aria-label="Search wallets"
        className="h-[50px] w-full rounded-pill bg-page px-[30px] text-sm text-ink placeholder:text-[#aeaeae] focus:outline focus:outline-brand"
      />
      <div className="mt-5">
        <DataTable columns={columns} rows={visible} rowKey={(r) => r.id} emptyText="No wallets match your filters." />
      </div>
      <Pagination className="mt-auto" />
      {adding && (
        <AmountDialog
          onClose={() => setAdding(null)}
          onSave={(amount) => {
            setRows((list) => list.map((r) => (r.id === adding.id ? { ...r, balance: r.balance + amount } : r)));
            setAdding(null);
          }}
        />
      )}
    </ListCard>
  );
}

// ---------------------------------------------------------------------------
// Bills (designs 79, 80, 88) — bill type list = frame 3040580
// ---------------------------------------------------------------------------

const BILL_TYPES = ["Last Bills", "Bills from subscriptions", "Bills from requests"] as const;

export function BillsView() {
  const [query, setQuery] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [billType, setBillType] = useState<(typeof BILL_TYPES)[number]>("Last Bills");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return bills.filter((b) => {
      const iso = toInputDate(b.requestDate.replace(/\s/g, ""));
      return (
        (!q || b.username.toLowerCase().includes(q) || b.salon.toLowerCase().includes(q)) &&
        (!from || iso >= from) &&
        (!to || iso <= to)
      );
    });
  }, [query, from, to]);

  const kind = billType === "Bills from requests" ? "requests" : billType === "Bills from subscriptions" ? "subscriptions" : "all";

  return (
    <ListCard>
      <div className="flex flex-col gap-[17px] xl:flex-row xl:items-center">
        <div className="min-w-0 flex-1">
          <RequestsToolbarShim query={query} onQuery={setQuery} from={from} to={to} onFrom={setFrom} onTo={setTo} />
        </div>
        <SearchSelect
          allLabel="Last Bills"
          searchable={false}
          options={BILL_TYPES.slice(1)}
          value={billType === "Last Bills" ? null : billType}
          onChange={(v) => setBillType((v as (typeof BILL_TYPES)[number]) ?? "Last Bills")}
          className="w-full xl:w-[311px]"
        />
      </div>
      <div className="mt-5">
        <BillTable key={kind} rows={rows} kind={kind} withExport printable />
      </div>
      <Pagination className="mt-auto" />
    </ListCard>
  );
}

/** Search + From/To without the "New request" button (bills toolbar, design 79). */
function RequestsToolbarShim({
  query,
  onQuery,
  from,
  to,
  onFrom,
  onTo,
}: {
  query: string;
  onQuery: (v: string) => void;
  from: string;
  to: string;
  onFrom: (v: string) => void;
  onTo: (v: string) => void;
}) {
  return (
    <RequestsToolbar
      query={query}
      onQueryChange={onQuery}
      from={from}
      to={to}
      onFromChange={onFrom}
      onToChange={onTo}
      variant="main"
      hideAction
    />
  );
}

// ---------------------------------------------------------------------------
// VAT (design 89)
// ---------------------------------------------------------------------------

export function VatForm() {
  const [saved, setSaved] = useState(false);
  return (
    <FormCard title="Update VAT">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSaved(true);
        }}
      >
        <FormFields>
          <FormField label="Value" htmlFor="vat-value">
            <div className="relative max-w-[587px]">
              <TextInput id="vat-value" name="vat" type="number" min={0} max={100} step="0.1" defaultValue={15} required className="pr-20" />
              <span className="absolute right-0 top-0 flex h-[50px] w-[50px] items-center justify-center rounded-full bg-brand-orange text-white" aria-hidden="true">
                <PercentIcon size={34} />
              </span>
            </div>
          </FormField>
        </FormFields>
        <div className="flex items-center gap-4">
          <SubmitButton>Save</SubmitButton>
          {saved && (
            <p role="status" className="mt-[31px] text-sm font-semibold text-positive">
              VAT updated.
            </p>
          )}
        </div>
      </form>
    </FormCard>
  );
}

// ---------------------------------------------------------------------------
// Discount codes (designs 90, 91)
// ---------------------------------------------------------------------------

export function DiscountCodesView({ initial }: { initial: DiscountCode[] }) {
  const [rows, setRows] = useState(initial);
  const [query, setQuery] = useState("");
  const [type, setType] = useState<string | null>(null);

  const visible = rows.filter(
    (c) => (!query.trim() || c.name.toLowerCase().includes(query.trim().toLowerCase())) && (!type || c.type === type),
  );

  const columns: Column<DiscountCode>[] = [
    { key: "name", header: "Code name", width: "w-[141px]", render: (c) => c.name },
    { key: "value", header: "Value", width: "w-[88px]", render: (c) => <span className="text-brand-orange">{c.value}</span> },
    {
      key: "type",
      header: <HeaderFilter label="Code Type" options={["Referral", "Discount"]} value={type} onChange={setType} />,
      width: "w-[137px]",
      render: (c) => (
        <span
          className={cn(
            "inline-flex h-[30px] w-[84px] items-center justify-center rounded-[3px] text-sm",
            c.type === "Referral" ? "bg-tint-teal text-brand" : "bg-tint-yellow text-brand-orange",
          )}
        >
          {c.type}
        </span>
      ),
    },
    { key: "user", header: "Username", width: "w-[130px]", render: (c) => c.username },
    { key: "start", header: "Start Date", width: "w-[143px]", render: (c) => c.start },
    { key: "end", header: "End Date", width: "w-[139px]", render: (c) => c.end },
    {
      key: "options",
      header: (
        <span className="flex items-center justify-between pr-5">
          Option <ExportMenu fileName="discount-codes" rows={visible.map((c) => ({ Code: c.name, Value: c.value, Type: c.type, Start: c.start, End: c.end }))} />
        </span>
      ),
      render: (c) => (
        <RowActions
          label={c.name}
          editHref={`/admin/accounting/discount-codes/${c.id}/edit`}
          onDelete={() => setRows((r) => r.filter((x) => x.id !== c.id))}
        />
      ),
    },
  ];

  return (
    <ListCard>
      <ListToolbar query={query} onQueryChange={setQuery} actionLabel="New Code" actionHref="/admin/accounting/discount-codes/add" />
      <div className="mt-5">
        <DataTable columns={columns} rows={visible} rowKey={(c) => c.id} emptyText="No codes match your filters." />
      </div>
      <Pagination className="mt-auto" />
    </ListCard>
  );
}

export function CodeForm({ code }: { code?: DiscountCode }) {
  const router = useRouter();
  const toIso = (d: string) => {
    const t = new Date(d);
    return Number.isNaN(t.getTime()) ? undefined : toInputDate(`${t.getDate()}/${t.getMonth() + 1}/${t.getFullYear()}`);
  };

  return (
    <FormCard title={code ? "Edit Code" : "Add Code"}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          router.push("/admin/accounting/discount-codes");
        }}
      >
        <FormGrid loose>
          <FormField label="Name" htmlFor="code-name">
            <TextInput id="code-name" name="name" placeholder="Enter name" required defaultValue={code?.name} />
          </FormField>
          <FormField label="Value" htmlFor="code-value">
            <TextInput id="code-value" name="value" placeholder="Enter Value" required defaultValue={code?.value} />
          </FormField>
          <FormField label="Code type" htmlFor="code-type">
            <DropdownSelect
              id="code-type"
              name="type"
              placeholder="Select Type"
              required
              defaultValue={code?.type}
              options={[
                { value: "Referral", label: "Referral" },
                { value: "Discount", label: "Discount" },
              ]}
            />
          </FormField>
          <FormField label="Start date" htmlFor="code-start">
            <DateInput id="code-start" name="start" required defaultValue={code ? toIso(code.start) : undefined} />
          </FormField>
          <FormField label="End date" htmlFor="code-end">
            <DateInput id="code-end" name="end" required defaultValue={code ? toIso(code.end) : undefined} />
          </FormField>
        </FormGrid>
        <SubmitButton>Save</SubmitButton>
      </form>
    </FormCard>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { AccountTypeBadge } from "@/components/admin/AccountTypeBadge";
import { OutlineIconButton } from "@/components/ui/Button";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { ImportIcon } from "@/components/ui/DesignIcons";
import { ExportMenu } from "@/components/ui/ExportMenu";
import { DateInput, DropdownSelect, FileInput, FormCard, FormField, FormGrid, SubmitButton, TextInput } from "@/components/ui/Form";
import { HeaderFilter } from "@/components/ui/HeaderFilter";
import { Icon } from "@/components/ui/Icon";
import { ListCard, ListToolbar } from "@/components/ui/ListToolbar";
import { Pagination } from "@/components/ui/Pagination";
import { PowersEditor } from "@/components/ui/PowersEditor";
import { SearchSelect } from "@/components/ui/SearchSelect";
import { ACCOUNT_TYPES, REPORT_FILTERS, adminPowers, adminUsers, ads, reports } from "@/lib/mock-admin";
import { powerGroups } from "@/lib/mock-main";

// ---------------------------------------------------------------------------
// Ads (designs 70, 72)
// ---------------------------------------------------------------------------

type Ad = (typeof ads)[number];

export function AdsView() {
  const [items, setItems] = useState<Ad[]>(ads);
  const [preview, setPreview] = useState<Ad | null>(null);

  return (
    <section className="rounded-card bg-card px-4 pb-[30px] pt-5 shadow-card sm:px-[30px] xl:min-h-[calc(100vh-151px)]">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-[22px] text-ink">All ads</h2>
        <Link
          href="/admin/ads/add"
          className="inline-flex h-[50px] w-[175px] items-center justify-center rounded-pill bg-brand text-[15px] font-bold text-white shadow-card"
        >
          New Ad
        </Link>
      </div>

      <ul className="mt-5 grid gap-5 lg:grid-cols-2">
        {items.map((ad) => (
          <li key={ad.id}>
            <div className="relative aspect-[492/250] overflow-hidden rounded-t-[5px]">
              <Image src={ad.image} alt="Advertisement" fill sizes="(min-width: 1024px) 492px, 100vw" className="object-cover" />
            </div>
            <div className="flex h-[60px] items-center gap-2.5 rounded-b-[5px] bg-page px-5 text-sm text-ink">
              <span className="inline-flex h-[30px] items-center rounded-[3px] bg-tint-teal px-2.5 text-brand">{ad.duration}</span>
              <span className="inline-flex h-[30px] items-center rounded-[3px] bg-card px-2.5">
                From {ad.from} To {ad.to}
              </span>
              <span className="flex-1" />
              <OutlineIconButton tone="negative" aria-label="Delete ad" onClick={() => setItems((l) => l.filter((x) => x.id !== ad.id))}>
                <Icon name="trash" size={18} />
              </OutlineIconButton>
              <button
                type="button"
                onClick={() => setPreview(ad)}
                className="h-[30px] w-[86px] rounded-[3px] bg-brand text-sm font-bold text-white shadow-card"
              >
                Preview
              </button>
            </div>
          </li>
        ))}
        {items.length === 0 && <li className="py-10 text-center text-sm text-ink-muted lg:col-span-2">No ads yet.</li>}
      </ul>

      {preview && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Ad preview">
          <div className="absolute inset-0 bg-black/60" onClick={() => setPreview(null)} />
          <div className="relative w-full max-w-[900px] overflow-hidden rounded-[5px] bg-card shadow-card">
            <div className="relative aspect-[492/250]">
              <Image src={preview.image} alt="Advertisement" fill sizes="900px" className="object-cover" />
            </div>
            <div className="flex items-center justify-between px-5 py-3 text-sm text-ink">
              <span>
                {preview.duration} · From {preview.from} To {preview.to}
              </span>
              <button type="button" onClick={() => setPreview(null)} className="h-9 rounded-[5px] bg-page px-5 font-bold">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export function AdForm() {
  const router = useRouter();
  const [image, setImage] = useState<File | null>(null);
  return (
    <FormCard title="Add Ad">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          router.push("/admin/ads");
        }}
      >
        <FormGrid>
          <FormField label="Image" htmlFor="ad-image">
            <FileInput id="ad-image" accept="image/*" placeholder="Upload  image" fileName={image?.name} onFileChange={setImage} compact />
          </FormField>
          <FormField label="Duration" htmlFor="ad-duration">
            <TextInput id="ad-duration" name="duration" placeholder="Enter duration" required />
          </FormField>
          <FormField label="From" htmlFor="ad-from">
            <DateInput id="ad-from" name="from" required />
          </FormField>
          <FormField label="To" htmlFor="ad-to">
            <DateInput id="ad-to" name="to" required />
          </FormField>
        </FormGrid>
        <SubmitButton>Save</SubmitButton>
      </form>
    </FormCard>
  );
}

// ---------------------------------------------------------------------------
// Reports (design 73)
// ---------------------------------------------------------------------------

type Report = (typeof reports)[number];

export function ReportsView() {
  const [kind, setKind] = useState<string | null>(null);
  const [year, setYear] = useState<string | null>(null);
  const [month, setMonth] = useState<string | null>(null);

  const download = (r: Report) => {
    // No report generator exists yet: download a plain-text placeholder named after the report.
    const url = URL.createObjectURL(new Blob([`Report ${r.name}\n`], { type: "text/plain" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `${r.name}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const columns: Column<Report>[] = [
    { key: "num", header: "Num", width: "w-[130px]", render: (r) => r.num },
    { key: "name", header: "Report name", width: "w-[389px]", render: (r) => r.name },
    { key: "format", header: "Format", width: "w-[160px]", render: (r) => r.format },
    {
      key: "options",
      header: "Options",
      render: (r) => (
        <button
          type="button"
          onClick={() => download(r)}
          className="inline-flex h-6 items-center gap-1 rounded-[3px] border border-[#7e1bff] px-2 text-xs text-[#7e1bff]"
        >
          <ImportIcon size={14} /> Download
        </button>
      ),
    },
  ];

  return (
    <ListCard>
      <div className="grid gap-2.5 sm:grid-cols-3 sm:gap-5">
        <SearchSelect allLabel={REPORT_FILTERS[0]} searchable={false} options={REPORT_FILTERS.slice(1)} value={kind} onChange={setKind} />
        <SearchSelect allLabel="Select Year" searchable={false} options={["2023", "2022", "2021"]} value={year} onChange={setYear} />
        <SearchSelect
          allLabel="Select Month"
          searchable={false}
          options={["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]}
          value={month}
          onChange={setMonth}
        />
      </div>
      <div className="mt-5">
        <DataTable columns={columns} rows={reports} rowKey={(r) => r.id} />
      </div>
      <Pagination className="mt-auto" />
    </ListCard>
  );
}

// ---------------------------------------------------------------------------
// Powers (designs 74, 75)
// ---------------------------------------------------------------------------

type PowerRow = (typeof adminPowers)[number];

export function AdminPowersView() {
  const [rows, setRows] = useState(adminPowers);
  const [query, setQuery] = useState("");
  const [type, setType] = useState<string | null>(null);

  const visible = rows.filter(
    (r) => (!query.trim() || r.name.toLowerCase().includes(query.trim().toLowerCase())) && (!type || r.accountType === type),
  );

  const columns: Column<PowerRow>[] = [
    { key: "num", header: "Num", width: "w-[160px]", render: (r) => r.num },
    {
      key: "type",
      header: <HeaderFilter label="Account type" options={ACCOUNT_TYPES.filter((t) => t !== "Customer" && t !== "Worker")} value={type} onChange={setType} />,
      width: "w-[195px]",
      render: (r) => <AccountTypeBadge type={r.accountType} />,
    },
    { key: "name", header: "Name", width: "w-[480px]", render: (r) => r.name },
    {
      key: "options",
      header: (
        <span className="flex items-center justify-between pr-5">
          Options <ExportMenu fileName="powers" rows={visible.map((r) => ({ Num: r.num, Type: r.accountType, Name: r.name }))} />
        </span>
      ),
      render: (r) => (
        <div className="flex items-center gap-2.5">
          <Link
            href={`/admin/powers/add?power=${r.id}`}
            className="inline-flex h-[30px] w-[124px] items-center justify-center rounded-[3px] bg-info text-[15px] font-bold text-white shadow-card"
          >
            Edit powers
          </Link>
          <OutlineIconButton tone="negative" aria-label={`Delete ${r.name}`} onClick={() => setRows((l) => l.filter((x) => x.id !== r.id))}>
            <Icon name="trash" size={18} />
          </OutlineIconButton>
        </div>
      ),
    },
  ];

  return (
    <ListCard>
      <ListToolbar query={query} onQueryChange={setQuery} actionLabel="New Power" actionHref="/admin/powers/add" />
      <div className="mt-5">
        <DataTable columns={columns} rows={visible} rowKey={(r) => r.id} emptyText="No powers match your filters." />
      </div>
      <Pagination className="mt-auto" />
    </ListCard>
  );
}

/** Add Power (design 75): account type + name, then the permission groups. */
export function AddPowerView() {
  const router = useRouter();
  const params = useSearchParams();
  const existing = adminPowers.find((p) => p.id === params.get("power"));

  return (
    <FormCard title={existing ? "Edit Power" : "Add Power"}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          router.push("/admin/powers");
        }}
      >
        <FormGrid>
          <FormField label="Account Type" htmlFor="power-type">
            <DropdownSelect
              id="power-type"
              name="accountType"
              placeholder="Select Account type"
              required
              defaultValue={existing?.accountType}
              options={ACCOUNT_TYPES.filter((t) => t !== "Customer").map((t) => ({ value: t, label: t }))}
            />
          </FormField>
          <FormField label="Name" htmlFor="power-name">
            <DropdownSelect
              id="power-name"
              name="name"
              placeholder="Select Name"
              required
              defaultValue={existing?.name}
              options={[...new Set([...adminUsers.map((u) => u.name), ...adminPowers.map((p) => p.name)])].map((n) => ({ value: n, label: n }))}
            />
          </FormField>
        </FormGrid>
        <div className="mt-5">
          <PowersEditor groups={powerGroups} />
        </div>
        <SubmitButton>Save</SubmitButton>
      </form>
    </FormCard>
  );
}

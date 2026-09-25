"use client";

import { useState } from "react";
import { DataTable, RowActions } from "@/components/ui/DataTable";
import { ExportMenu } from "@/components/ui/ExportMenu";
import { ListCard } from "@/components/ui/ListToolbar";
import { Pagination } from "@/components/ui/Pagination";

export interface NamedRow {
  id: string;
  num: number;
  name: string;
}

/**
 * "Add X [name] Save" bar + table of names with edit/delete (designs 42, 45, 76, 77).
 * Editing loads the row into the bar; Save then updates it instead of adding.
 */
export function NameListManager({
  addLabel,
  placeholder,
  nameHeader,
  initial,
  powersHref,
  exportName,
}: {
  addLabel: string;
  placeholder: string;
  nameHeader: string;
  initial: NamedRow[];
  /** Adds the blue "powers" action linking here (account types, design 76). */
  powersHref?: string;
  /** Adds the orange export button in the Options header (admin tables). */
  exportName?: string;
}) {
  const [rows, setRows] = useState(initial);
  const [draft, setDraft] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const save = () => {
    const name = draft.trim();
    if (!name) return;
    if (editingId) {
      setRows((r) => r.map((x) => (x.id === editingId ? { ...x, name } : x)));
    } else {
      setRows((r) => [...r, { id: `new-${Date.now()}`, num: (r.at(-1)?.num ?? 450) + 1, name }]);
    }
    setDraft("");
    setEditingId(null);
  };

  return (
    <ListCard>
      <form
        className="flex h-auto flex-col gap-3 rounded-[25px] bg-page p-2.5 sm:h-[60px] sm:flex-row sm:items-center sm:gap-0 sm:py-0 sm:pl-10 sm:pr-[5px]"
        onSubmit={(e) => {
          e.preventDefault();
          save();
        }}
      >
        <label htmlFor="name-list-input" className="shrink-0 text-base text-ink sm:w-[125px]">
          {editingId ? "Edit" : addLabel}
        </label>
        <input
          id="name-list-input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={placeholder}
          required
          className="h-[50px] min-w-0 flex-1 rounded-pill bg-card px-[30px] text-sm text-ink placeholder:text-[#aeaeae] focus:outline focus:outline-brand"
        />
        <button
          type="submit"
          className="h-[50px] w-full shrink-0 rounded-l-[5px] rounded-r-pill bg-brand text-[15px] font-bold text-white shadow-card sm:w-[124px]"
        >
          Save
        </button>
      </form>

      <div className="mt-5">
        <DataTable
          columns={[
            { key: "num", header: "Num", width: "w-[230px]", render: (r) => r.num },
            { key: "name", header: nameHeader, width: "w-[548px]", render: (r) => r.name },
            {
              key: "options",
              header: exportName ? (
                <span className="flex items-center justify-between pr-5">
                  Options <ExportMenu fileName={exportName} rows={rows.map((r) => ({ Num: r.num, [nameHeader]: r.name }))} />
                </span>
              ) : (
                "Options"
              ),
              render: (r) => (
                <RowActions
                  label={r.name}
                  powersHref={powersHref}
                  onEdit={() => {
                    setEditingId(r.id);
                    setDraft(r.name);
                  }}
                  onDelete={() => setRows((list) => list.filter((x) => x.id !== r.id))}
                />
              ),
            },
          ]}
          rows={rows}
          rowKey={(r) => r.id}
        />
      </div>
      <Pagination className="mt-auto" />
    </ListCard>
  );
}

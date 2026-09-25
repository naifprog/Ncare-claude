"use client";

import { useState } from "react";
import { useAccess } from "@/components/auth/AccessProvider";
import { DataTable, RowActions } from "@/components/ui/DataTable";
import { ExportMenu } from "@/components/ui/ExportMenu";
import { ListCard } from "@/components/ui/ListToolbar";
import { Pagination, usePagination } from "@/components/ui/Pagination";
import type { Permission } from "@/lib/access/permissions";
import { DEMO_NOTE, toast } from "@/lib/demo-state";

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
  editPermission,
}: {
  addLabel: string;
  placeholder: string;
  nameHeader: string;
  initial: NamedRow[];
  /**
   * Adds the blue "powers" action (account types, design 76). Template: `{id}` and
   * `{name}` are replaced with the row's values.
   */
  powersHref?: string;
  /** Adds the orange export button in the Options header (admin tables). */
  exportName?: string;
  /** Permission needed to add / edit / delete rows (the list stays visible without it). */
  editPermission: Permission;
}) {
  const { can } = useAccess();
  const canEdit = can(editPermission);
  const [rows, setRows] = useState(initial);
  const { pageRows, pagination } = usePagination(rows);
  const [draft, setDraft] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const save = () => {
    const name = draft.trim();
    if (!name) return;
    if (editingId) {
      setRows((r) => r.map((x) => (x.id === editingId ? { ...x, name } : x)));
      toast(`“${name}” updated. ${DEMO_NOTE}`);
    } else {
      setRows((r) => [...r, { id: `new-${Date.now()}`, num: (r.at(-1)?.num ?? 450) + 1, name }]);
      toast(`“${name}” added. ${DEMO_NOTE}`);
    }
    setDraft("");
    setEditingId(null);
  };

  return (
    <ListCard>
      {canEdit && (
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
          className="h-[50px] min-w-0 shrink-0 rounded-pill sm:flex-1 bg-card px-[30px] text-sm text-ink placeholder:text-[#aeaeae] focus:outline focus:outline-brand"
        />
        <button
          type="submit"
          className="h-[50px] w-full shrink-0 rounded-l-[5px] rounded-r-pill bg-brand text-[15px] font-bold text-white shadow-card sm:w-[124px]"
        >
          Save
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setDraft("");
            }}
            className="h-[50px] shrink-0 px-4 text-sm text-ink-muted underline"
          >
            Cancel
          </button>
        )}
      </form>
      )}

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
                  powersHref={powersHref?.replace("{id}", r.id).replace("{name}", encodeURIComponent(r.name))}
                  onEdit={
                    canEdit
                      ? () => {
                          setEditingId(r.id);
                          setDraft(r.name);
                        }
                      : undefined
                  }
                  onDelete={
                    canEdit
                      ? () => {
                          setRows((list) => list.filter((x) => x.id !== r.id));
                          toast(`“${r.name}” deleted. ${DEMO_NOTE}`);
                        }
                      : undefined
                  }
                />
              ),
            },
          ]}
          rows={pageRows}
          rowKey={(r) => r.id}
        />
      </div>
      <Pagination className="mt-auto" {...pagination} />
    </ListCard>
  );
}

"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { AccountTypeBadge } from "@/components/admin/AccountTypeBadge";
import { useAccess } from "@/components/auth/AccessProvider";
import { OutlineIconButton } from "@/components/ui/Button";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { ExportMenu } from "@/components/ui/ExportMenu";
import { DropdownSelect, FormCard, FormField, FormGrid, SubmitButton } from "@/components/ui/Form";
import { HeaderFilter } from "@/components/ui/HeaderFilter";
import { Icon } from "@/components/ui/Icon";
import { ListCard, ListToolbar } from "@/components/ui/ListToolbar";
import { Pagination, usePagination } from "@/components/ui/Pagination";
import { PowersEditor } from "@/components/ui/PowersEditor";
import { accountTypePermissions, positionPermissions, userPermissions, type AccessOverrides } from "@/lib/access/access";
import { contextOf, directoryUsers, getDirectoryUser, type DirectoryUser } from "@/lib/access/directory";
import {
  PERMISSION_PRESETS,
  getPreset,
  powerGroupsFor,
  type DashboardContext,
  type Permission,
} from "@/lib/access/permissions";
import { DEMO_NOTE, toast, updateAccessOverrides } from "@/lib/demo-state";
import { ACCOUNT_TYPE_DEFS, TYPES_WITH_POWERS, getAccountType } from "@/lib/mock-admin";
import { positionRows } from "@/lib/mock-main";

// ---------------------------------------------------------------------------
// All Powers (design 74): accounts that carry editable powers
// ---------------------------------------------------------------------------

export function AdminPowersView() {
  const { can } = useAccess();
  const [query, setQuery] = useState("");
  const [type, setType] = useState<string | null>(null);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return directoryUsers.filter(
      (u) =>
        TYPES_WITH_POWERS.includes(u.accountType) &&
        (!q || u.name.toLowerCase().includes(q)) &&
        (!type || u.accountType === type),
    );
  }, [query, type]);
  const { pageRows, pagination } = usePagination(visible);

  const columns: Column<DirectoryUser>[] = [
    { key: "num", header: "Num", width: "w-[160px]", render: (r) => r.num },
    {
      key: "type",
      header: <HeaderFilter label="Account type" options={TYPES_WITH_POWERS} value={type} onChange={setType} />,
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
      render: (r) =>
        can("powers.manage") ? (
          <div className="flex items-center gap-2.5">
            <Link
              href={`/admin/powers/add?user=${r.id}`}
              className="inline-flex h-[30px] w-[124px] items-center justify-center rounded-[3px] bg-info text-[15px] font-bold text-white shadow-card"
            >
              Edit powers
            </Link>
            <OutlineIconButton
              tone="negative"
              aria-label={`Reset powers of ${r.name}`}
              title="Reset to the account type's default powers"
              onClick={() => {
                updateAccessOverrides((o) => {
                  const users = { ...o.users };
                  if (users[r.id]) users[r.id] = { ...users[r.id], permissions: undefined };
                  return { ...o, users };
                });
                toast(`${r.name} now uses the default powers of their position / account type. ${DEMO_NOTE}`);
              }}
            >
              <Icon name="trash" size={18} />
            </OutlineIconButton>
          </div>
        ) : null,
    },
  ];

  return (
    <ListCard>
      <ListToolbar query={query} onQueryChange={setQuery} actionLabel="New Power" actionHref="/admin/powers/add" />
      <div className="mt-5">
        <DataTable columns={columns} rows={pageRows} rowKey={(r) => r.id} emptyText="No powers match your filters." />
      </div>
      <Pagination className="mt-auto" {...pagination} />
    </ListCard>
  );
}

// ---------------------------------------------------------------------------
// Add / edit power (design 75)
// ---------------------------------------------------------------------------

/** Who a powers form edits: one user, every account of a type (its default), or a position preset. */
type Subject =
  | { kind: "user"; id: string; label: string; context: DashboardContext }
  | { kind: "accountType"; id: string; label: string; context: DashboardContext }
  | { kind: "position"; id: string; label: string; context: DashboardContext };

function currentPermissions(subject: Subject, overrides: AccessOverrides): Permission[] {
  if (subject.kind === "user") return userPermissions(getDirectoryUser(subject.id)!, overrides);
  if (subject.kind === "accountType") return accountTypePermissions(subject.id, overrides);
  return positionPermissions(subject.id, overrides) ?? [];
}

function saveSubject(subject: Subject, permissions: Permission[]) {
  updateAccessOverrides((o) => {
    if (subject.kind === "user") return { ...o, users: { ...o.users, [subject.id]: { ...o.users[subject.id], permissions } } };
    if (subject.kind === "accountType") return { ...o, accountTypes: { ...o.accountTypes, [subject.id]: permissions } };
    return { ...o, positions: { ...o.positions, [subject.id]: permissions } };
  });
}

const POWER_TYPES = ACCOUNT_TYPE_DEFS.filter((t) => t.context);

function userSubject(user: DirectoryUser): Subject | null {
  const context = contextOf(user);
  return context ? { kind: "user", id: user.id, label: user.name, context } : null;
}

/**
 * Add Power (design 75): pick an account type and a name (one account, or all accounts
 * of the type = the type's default powers), optionally start from a preset, then toggle.
 * `?user=`, `?accountType=` and `?position=` open the form for that subject.
 */
export function AddPowerView() {
  const params = useSearchParams();
  const positionId = params.get("position");
  const presetUser = getDirectoryUser(params.get("user") ?? "");
  const initialType = presetUser?.accountType ?? getAccountType(params.get("accountType") ?? undefined)?.name ?? "";

  if (positionId) {
    const position = positionRows.find((p) => p.id === positionId);
    if (position) return <PositionPowersForm positionId={position.id} />;
  }
  return <AccountPowersForm initialType={initialType} initialUser={presetUser} />;
}

function AccountPowersForm({ initialType, initialUser }: { initialType: string; initialUser?: DirectoryUser }) {
  const [type, setType] = useState(initialType);
  const [subject, setSubject] = useState<Subject | null>(() => {
    if (initialUser) return userSubject(initialUser);
    const def = getAccountType(initialType);
    return def?.context ? { kind: "accountType", id: def.name, label: `All ${def.name} accounts`, context: def.context } : null;
  });
  const typeDef = getAccountType(type);
  const nameOptions = typeDef?.context
    ? [
        { value: `type:${typeDef.name}`, label: `All ${typeDef.name} accounts (default)` },
        ...directoryUsers.filter((u) => u.accountType === typeDef.name).map((u) => ({ value: `user:${u.id}`, label: u.name })),
      ]
    : [];
  const subjectValue = subject ? (subject.kind === "user" ? `user:${subject.id}` : `type:${subject.id}`) : undefined;

  return (
    <PowersForm
      key={subjectValue ?? "none"}
      title={initialUser ? "Edit Power" : "Add Power"}
      subject={subject}
      context={typeDef?.context ?? undefined}
      fields={[
        <FormField key="type" label="Account Type" htmlFor="power-type">
          <DropdownSelect
            id="power-type"
            name="accountType"
            placeholder="Select Account type"
            required
            defaultValue={type || undefined}
            onChange={(value) => {
              setType(value);
              const def = getAccountType(value);
              setSubject(def?.context ? { kind: "accountType", id: def.name, label: `All ${def.name} accounts`, context: def.context } : null);
            }}
            options={POWER_TYPES.map((t) => ({ value: t.name, label: t.name }))}
          />
        </FormField>,
        <FormField key="name" label="Name" htmlFor="power-name">
          <DropdownSelect
            key={type}
            id="power-name"
            name="name"
            placeholder="Select Name"
            required
            defaultValue={subjectValue}
            onChange={(value) => {
              const [kind, id] = value.split(":");
              if (kind === "user") setSubject(userSubject(getDirectoryUser(id)!));
              else if (typeDef?.context) setSubject({ kind: "accountType", id, label: `All ${id} accounts`, context: typeDef.context });
            }}
            options={nameOptions}
          />
        </FormField>,
      ]}
    />
  );
}

function PositionPowersForm({ positionId }: { positionId: string }) {
  const position = positionRows.find((p) => p.id === positionId)!;
  const context = getPreset(position.presetId)?.context ?? "salon";
  const subject: Subject = { kind: "position", id: position.id, label: `${position.name} position`, context };
  return (
    <PowersForm
      title={`Powers of ${position.name}`}
      subject={subject}
      context={context}
      fields={[
        <FormField key="position" label="Position" htmlFor="power-position">
          <p id="power-position" className="flex h-[50px] items-center rounded-pill bg-page px-[30px] text-sm text-ink">
            {position.name}
          </p>
        </FormField>,
      ]}
    />
  );
}

/** Shared body: subject fields, "Start from preset" and the permission groups. */
function PowersForm({
  title,
  subject,
  context,
  fields,
}: {
  title: string;
  subject: Subject | null;
  context?: DashboardContext;
  fields: React.ReactNode[];
}) {
  const router = useRouter();
  const { overrides, can } = useAccess();
  const [value, setValue] = useState<Permission[]>(() => (subject ? currentPermissions(subject, overrides) : []));
  const [presetKey, setPresetKey] = useState(0);
  // Without a chosen account type the form shows the design's groups (design 75).
  const groups = context ? powerGroupsFor(context) : powerGroupsFor("salon", { designOnly: true });
  const presets = PERMISSION_PRESETS.filter((p) => !context || p.context === context);

  return (
    <FormCard title={title}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!subject) return;
          saveSubject(subject, value);
          toast(`Powers of ${subject.label} saved for this session. ${DEMO_NOTE}`);
          router.push("/admin/powers");
        }}
      >
        <FormGrid>
          {fields}
          <FormField label="Start from preset" htmlFor="power-preset">
            <DropdownSelect
              key={presetKey}
              id="power-preset"
              name="preset"
              placeholder="Select preset (optional)"
              onChange={(id) => {
                const preset = getPreset(id);
                if (preset) setValue(preset.permissions);
              }}
              options={presets.map((p) => ({ value: p.id, label: p.name }))}
            />
          </FormField>
        </FormGrid>
        <div className="mt-5">
          <PowersEditor
            groups={groups}
            value={value}
            onChange={(v) => {
              setValue(v);
              setPresetKey((k) => k + 1);
            }}
            readOnly={!can("powers.manage")}
          />
        </div>
        <SubmitButton>Save</SubmitButton>
      </form>
    </FormCard>
  );
}

// ---------------------------------------------------------------------------
// Multi-branch owner: powers of a branch (designs 44, 46) and of a position
// ---------------------------------------------------------------------------

/** Branch powers apply immediately to the branch's delegated staff (session only). */
export function BranchPowersEditor({ branchId, branchName }: { branchId: string; branchName: string }) {
  const { overrides, can } = useAccess();
  const value = overrides.branches[branchId];
  return (
    <PowersPage label={branchName}>
      <PowersEditor
        groups={powerGroupsFor("main", { designOnly: true })}
        value={value ?? powerGroupsFor("main", { designOnly: true }).flatMap((g) => g.powers.map((p) => p.key))}
        onChange={(v) => updateAccessOverrides((o) => ({ ...o, branches: { ...o.branches, [branchId]: v } }))}
        readOnly={!can("branches.powers")}
      />
    </PowersPage>
  );
}

/** Position presets (e.g. Branch Manager, Receptionist) used as default powers of their holders. */
export function PositionPowersEditor({ positionId }: { positionId: string }) {
  const { overrides, can } = useAccess();
  const position = positionRows.find((p) => p.id === positionId)!;
  const context = getPreset(position.presetId)?.context ?? "main";
  return (
    <PowersPage label={position.name}>
      <PowersEditor
        groups={powerGroupsFor(context === "admin" ? "main" : context)}
        value={positionPermissions(position.id, overrides) ?? []}
        onChange={(v) => updateAccessOverrides((o) => ({ ...o, positions: { ...o.positions, [position.id]: v } }))}
        readOnly={!can("powers.manage")}
      />
    </PowersPage>
  );
}

function PowersPage({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="rounded-card bg-card px-4 pb-[30px] pt-[27px] shadow-card sm:px-[30px] xl:min-h-[calc(100vh-130px)]">
      <div className="flex flex-wrap items-center gap-4 pl-5">
        <h2 className="text-[22px] leading-[26px] text-ink">Powers of</h2>
        <span className="inline-flex h-10 items-center rounded-[5px] bg-page px-5 text-base text-ink">{label}</span>
      </div>
      <p className="mt-3 pl-5 text-xs text-ink-muted">Changes apply right away for this demo session and are not saved.</p>
      <div className="mt-2">{children}</div>
    </section>
  );
}

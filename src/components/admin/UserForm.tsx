"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAccess } from "@/components/auth/AccessProvider";
import { PASSWORD_HINT, USERNAME_HINT } from "@/components/main/BranchForm";
import {
  DateInput,
  DropdownSelect,
  FileInput,
  FormCard,
  FormField,
  FormGrid,
  MultiSelect,
  SegmentedToggle,
  SubmitButton,
  TextInput,
} from "@/components/ui/Form";
import type { DirectoryUser } from "@/lib/access/directory";
import { PERMISSION_PRESETS, getPreset } from "@/lib/access/permissions";
import { DEMO_NOTE, toast, updateAccessOverrides } from "@/lib/demo-state";
import { ACCOUNT_TYPES, BRANCH_FILTERS, SALON_FILTERS, getAccountType } from "@/lib/mock-admin";
import { nationalities, positions } from "@/lib/mock-data";
import { branches as salonBranches, positionRows, regions } from "@/lib/mock-main";
import type { RequestPriority } from "@/types";

const TYPES = ["Normal", "Special"] as const satisfies readonly RequestPriority[];
const opts = (list: readonly string[]) => [...new Set(list)].map((v) => ({ value: v, label: v }));

/**
 * Add / edit user (Super Admin). The fields follow the selected account type:
 * generic (design 53), Salon (54), Branch (55) and Worker (56). Accounts that sign
 * into a dashboard also get access fields (position, permission preset, branch
 * access), each shown only with the matching "assign …" permission.
 */
export function UserForm({ user, initialType }: { user?: DirectoryUser; initialType?: string }) {
  const router = useRouter();
  const { can, overrides } = useAccess();
  const [type, setType] = useState<string>(user?.accountType ?? getAccountType(initialType)?.name ?? "");
  const [image, setImage] = useState<File | null>(null);
  const [workerType, setWorkerType] = useState<RequestPriority>("Normal");

  const typeDef = getAccountType(type);
  const own = user ? overrides.users[user.id] : undefined;
  const currentBranches = own?.branchIds ?? user?.branchIds;
  const accessField = {
    accessPosition: can("users.assignPosition") ? (
      <FormField key="accessPosition" label="Position" htmlFor="user-access-position">
        <DropdownSelect
          id="user-access-position"
          name="positionId"
          placeholder="Select Position"
          defaultValue={own?.positionId ?? user?.positionId}
          options={positionRows.map((p) => ({ value: p.id, label: p.name }))}
        />
      </FormField>
    ) : null,
    preset: can("users.assignPermissions") ? (
      <FormField key="preset" label="Permission preset" htmlFor="user-preset">
        <DropdownSelect
          id="user-preset"
          name="presetId"
          placeholder="Default of position / account type"
          options={PERMISSION_PRESETS.filter((p) => p.context === typeDef?.context || (typeDef?.context !== "admin" && p.context !== "admin")).map((p) => ({
            value: p.id,
            label: p.name,
          }))}
        />
      </FormField>
    ) : null,
    branchAccess: can("users.assignBranches") ? (
      <FormField key="branchAccess" label="Branch access" htmlFor="user-branch-access">
        <MultiSelect
          id="user-branch-access"
          name="branchIds"
          placeholder="Select branches"
          allOption="All branches"
          defaultValue={currentBranches === "all" ? ["all"] : (currentBranches ?? [])}
          options={salonBranches.map((b) => ({ value: b.id, label: b.name }))}
        />
      </FormField>
    ) : null,
  };

  // Mock users only carry name / type / join date: on edit, empty fields keep their current values.
  const field = {
    name: (
      <FormField key="name" label="Name" htmlFor="user-name">
        <TextInput id="user-name" name="name" placeholder="Enter name" required defaultValue={user?.name} />
      </FormField>
    ),
    type: (
      <FormField key="type" label="Account type" htmlFor="user-type">
        <DropdownSelect
          id="user-type"
          name="accountType"
          placeholder="Select account type"
          required
          defaultValue={type || undefined}
          onChange={setType}
          options={opts(user && !can("users.assignAccountType") ? [user.accountType] : ACCOUNT_TYPES)}
        />
      </FormField>
    ),
    idNumber: (
      <FormField key="id" label="Id number" htmlFor="user-id">
        <TextInput id="user-id" name="idNumber" placeholder="Enter id number" inputMode="numeric" required={!user} />
      </FormField>
    ),
    username: (
      <FormField key="username" label="User name" hint={USERNAME_HINT} htmlFor="user-username">
        <TextInput id="user-username" name="username" placeholder="Enter User name" pattern="[A-Za-z_]+" title="Letters and _ only" required={!user} />
      </FormField>
    ),
    password: (
      <FormField key="password" label="Password" hint={PASSWORD_HINT} htmlFor="user-password">
        <TextInput id="user-password" name="password" type="password" autoComplete="new-password" placeholder="Enter password" required={!user} />
      </FormField>
    ),
    nationality: (
      <FormField key="nationality" label="Nationality" htmlFor="user-nationality">
        <DropdownSelect id="user-nationality" name="nationality" placeholder="Select nationality" required={!user} options={opts(nationalities.map((n) => n.name))} />
      </FormField>
    ),
    manager: (
      <FormField key="manager" label="Manager name" htmlFor="user-manager">
        <TextInput id="user-manager" name="manager" placeholder="Enter manager name" required={!user} />
      </FormField>
    ),
    region: (
      <FormField key="region" label="Region" htmlFor="user-region">
        <DropdownSelect id="user-region" name="region" placeholder="Select region" required={!user} options={opts(regions)} />
      </FormField>
    ),
    location: (
      <FormField key="location" label="Location" htmlFor="user-location">
        <TextInput id="user-location" name="location" placeholder="Enter location" required={!user} />
      </FormField>
    ),
    joining: (
      <FormField key="joining" label="Date of joining" htmlFor="user-joining">
        <DateInput id="user-joining" name="joinDate" required={!user} />
      </FormField>
    ),
    image: (
      <FormField key="image" label="Image" htmlFor="user-image">
        <FileInput id="user-image" accept="image/*" placeholder="Upload  image" fileName={image?.name} onFileChange={setImage} compact />
      </FormField>
    ),
    salon: (
      <FormField key="salon" label="Salon" htmlFor="user-salon">
        <DropdownSelect id="user-salon" name="salon" placeholder="Select Salon" required={!user} options={opts(SALON_FILTERS)} />
      </FormField>
    ),
    branch: (
      <FormField key="branch" label="Branch" htmlFor="user-branch">
        <DropdownSelect id="user-branch" name="branch" placeholder="Select branch" required={!user} options={opts(BRANCH_FILTERS)} />
      </FormField>
    ),
    position: (
      <FormField key="position" label="Position" htmlFor="user-position">
        <DropdownSelect id="user-position" name="position" placeholder="Select Position" required={!user} options={opts(positions)} />
      </FormField>
    ),
    workerType: (
      <FormField key="workerType" label="Worker type">
        <SegmentedToggle options={TYPES} value={workerType} onChange={setWorkerType} />
        <input type="hidden" name="workerType" value={workerType} />
      </FormField>
    ),
  };

  const layout: Record<string, React.ReactNode[]> = {
    Salon: [field.name, field.type, field.manager, field.username, field.region, field.password, field.location, field.joining, field.image],
    Branch: [
      field.name,
      field.type,
      field.salon,
      field.username,
      field.manager,
      field.password,
      field.region,
      field.location,
      field.joining,
      field.image,
      accessField.accessPosition,
      accessField.preset,
      accessField.branchAccess,
    ],
    Worker: [field.name, field.type, field.idNumber, field.username, field.nationality, field.password, field.salon, field.branch, field.position, field.joining, field.image, field.workerType],
    Customer: [field.name, field.type, field.idNumber, field.username, field.nationality, field.password],
  };
  // Other dashboard accounts (Admin, Data entry, Marketer, custom types …): generic fields + access.
  const fields = (layout[type] ?? [
    field.name,
    field.type,
    field.idNumber,
    field.username,
    field.nationality,
    field.password,
    ...(typeDef?.context ? [accessField.accessPosition, accessField.preset] : []),
  ]).filter(Boolean);

  return (
    <FormCard title={user ? "Edit User" : "Add User"}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const data = new FormData(e.currentTarget);
          if (user) {
            // Access changes of existing accounts apply to this demo session (e.g. sign in as them).
            const preset = getPreset(String(data.get("presetId") ?? ""));
            const branchValue = data.get("branchIds");
            const positionId = String(data.get("positionId") ?? "") || undefined;
            updateAccessOverrides((o) => ({
              ...o,
              users: {
                ...o.users,
                [user.id]: {
                  ...o.users[user.id],
                  ...(positionId ? { positionId } : {}),
                  ...(preset ? { permissions: preset.permissions } : {}),
                  ...(branchValue !== null
                    ? { branchIds: branchValue === "all" ? "all" : String(branchValue).split(",").filter(Boolean) }
                    : {}),
                },
              },
            }));
          }
          toast(`${user ? `${user.name} updated` : "User added"}. ${DEMO_NOTE}`);
          router.push(user ? `/admin/users/${user.id}` : "/admin/users");
        }}
      >
        <FormGrid>{fields}</FormGrid>
        <SubmitButton className="mt-[31px]">Save</SubmitButton>
      </form>
    </FormCard>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PASSWORD_HINT, USERNAME_HINT } from "@/components/main/BranchForm";
import {
  DateInput,
  DropdownSelect,
  FileInput,
  FormCard,
  FormField,
  FormGrid,
  SegmentedToggle,
  SubmitButton,
  TextInput,
} from "@/components/ui/Form";
import { ACCOUNT_TYPES, BRANCH_FILTERS, SALON_FILTERS, type AdminUser } from "@/lib/mock-admin";
import { nationalities, positions } from "@/lib/mock-data";
import { regions } from "@/lib/mock-main";
import type { RequestPriority } from "@/types";

const TYPES = ["Normal", "Special"] as const satisfies readonly RequestPriority[];
const opts = (list: readonly string[]) => [...new Set(list)].map((v) => ({ value: v, label: v }));

/**
 * Add / edit user (Super Admin). The fields follow the selected account type:
 * generic (design 53), Salon (54), Branch (55) and Worker (56).
 */
export function UserForm({ user, initialType }: { user?: AdminUser; initialType?: string }) {
  const router = useRouter();
  const [type, setType] = useState<string>(user?.accountType ?? initialType ?? "");
  const [image, setImage] = useState<File | null>(null);
  const [workerType, setWorkerType] = useState<RequestPriority>("Normal");

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
          options={opts(ACCOUNT_TYPES)}
        />
      </FormField>
    ),
    idNumber: (
      <FormField key="id" label="Id number" htmlFor="user-id">
        <TextInput id="user-id" name="idNumber" placeholder="Enter id number" inputMode="numeric" required />
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
        <DropdownSelect id="user-nationality" name="nationality" placeholder="Select nationality" required options={opts(nationalities.map((n) => n.name))} />
      </FormField>
    ),
    manager: (
      <FormField key="manager" label="Manager name" htmlFor="user-manager">
        <TextInput id="user-manager" name="manager" placeholder="Enter manager name" required />
      </FormField>
    ),
    region: (
      <FormField key="region" label="Region" htmlFor="user-region">
        <DropdownSelect id="user-region" name="region" placeholder="Select region" required options={opts(regions)} />
      </FormField>
    ),
    location: (
      <FormField key="location" label="Location" htmlFor="user-location">
        <TextInput id="user-location" name="location" placeholder="Enter location" required />
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
        <DropdownSelect id="user-salon" name="salon" placeholder="Select Salon" required options={opts(SALON_FILTERS)} />
      </FormField>
    ),
    branch: (
      <FormField key="branch" label="Branch" htmlFor="user-branch">
        <DropdownSelect id="user-branch" name="branch" placeholder="Select branch" required options={opts(BRANCH_FILTERS)} />
      </FormField>
    ),
    position: (
      <FormField key="position" label="Position" htmlFor="user-position">
        <DropdownSelect id="user-position" name="position" placeholder="Select Position" required options={opts(positions)} />
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
    Branch: [field.name, field.type, field.salon, field.username, field.manager, field.password, field.region, field.location, field.joining, field.image],
    Worker: [field.name, field.type, field.idNumber, field.username, field.nationality, field.password, field.salon, field.branch, field.position, field.joining, field.image, field.workerType],
  };
  const fields = layout[type] ?? [field.name, field.type, field.idNumber, field.username, field.nationality, field.password];

  return (
    <FormCard title={user ? "Edit User" : "Add User"}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          router.push(user ? `/admin/users/${user.id}` : "/admin/users");
        }}
      >
        <FormGrid>{fields}</FormGrid>
        <SubmitButton className="mt-[31px]">Save</SubmitButton>
      </form>
    </FormCard>
  );
}

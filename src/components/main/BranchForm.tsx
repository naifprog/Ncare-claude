"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  DateInput,
  DropdownSelect,
  FileInput,
  FormCard,
  FormField,
  FormGrid,
  SubmitButton,
  TextInput,
} from "@/components/ui/Form";
import { branchManagers } from "@/lib/access/directory";
import { DEMO_NOTE, toast } from "@/lib/demo-state";
import { regions, type Branch } from "@/lib/mock-main";

export const USERNAME_HINT = "To be used for logging in, must consist of letters and \"_\".";
export const PASSWORD_HINT = "It should contain uppercase and lowercase letters, numbers and symbols.";

/** Add Branch (design 29); also reused, pre-filled, for Edit. */
export function BranchForm({ branch }: { branch?: Branch }) {
  const router = useRouter();
  const [image, setImage] = useState<File | null>(null);

  return (
    <FormCard title={branch ? "Edit Branch" : "Add Branch"}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          toast(`${branch ? `${branch.name} updated` : "Branch added"}. ${DEMO_NOTE}`);
          router.push(branch ? `/main/branches/${branch.id}` : "/main/branches");
        }}
      >
        <FormGrid loose>
          <FormField label="Branch name" htmlFor="branch-name">
            <TextInput id="branch-name" name="name" placeholder="Enter name" required defaultValue={branch?.name} />
          </FormField>
          <FormField label="User name" hint={USERNAME_HINT} htmlFor="branch-username">
            <TextInput
              id="branch-username"
              name="username"
              placeholder="Enter User name"
              pattern="[A-Za-z_]+"
              title="Letters and _ only"
              required={!branch}
            />
          </FormField>
          <FormField label="Manager name" htmlFor="branch-manager">
            <TextInput
              id="branch-manager"
              name="manager"
              placeholder="Enter manager name"
              required={!branch}
              // A branch can have several managers (users); the design shows one field, so
              // existing managers are listed comma-separated.
              defaultValue={branch ? branchManagers(branch).map((m) => m.name).join(", ") : undefined}
            />
          </FormField>
          <FormField label="Password" hint={PASSWORD_HINT} htmlFor="branch-password">
            <TextInput
              id="branch-password"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="Enter password"
              required={!branch}
            />
          </FormField>
          <FormField label="Region" htmlFor="branch-region">
            <DropdownSelect
              id="branch-region"
              name="region"
              placeholder="Select region"
              required
              defaultValue={branch?.region}
              options={regions.map((r) => ({ value: r, label: r }))}
            />
          </FormField>
          <FormField label="Opening date" htmlFor="branch-opening">
            <DateInput id="branch-opening" name="openingDate" required={!branch} />
          </FormField>
          <FormField label="Location" htmlFor="branch-location">
            <TextInput
              id="branch-location"
              name="location"
              placeholder="Enter location"
              required
              defaultValue={branch?.address}
            />
          </FormField>
          <FormField label="Image" htmlFor="branch-image">
            <FileInput
              id="branch-image"
              accept="image/*"
              placeholder="Upload  image"
              fileName={image?.name}
              onFileChange={setImage}
              compact
            />
          </FormField>
        </FormGrid>
        <SubmitButton className="mt-[51px]">Save</SubmitButton>
      </form>
    </FormCard>
  );
}

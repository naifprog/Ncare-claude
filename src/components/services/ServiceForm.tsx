"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { pickBranch, useBranchOptions, type BranchChoice } from "@/components/auth/AccessProvider";
import {
  DropdownSelect,
  FileInput,
  FormCard,
  FormField,
  FormFields,
  FormGrid,
  SubmitButton,
  TextInput,
} from "@/components/ui/Form";
import { serviceCategories, workerProfiles } from "@/lib/mock-data";
import { DEMO_NOTE, toast } from "@/lib/demo-state";
import type { SalonService } from "@/types";

/**
 * Add service (design 20); also reused, pre-filled, for Edit. With `branches` it becomes the
 * multi-branch owner's two-column form with a Branch field (design 41).
 */
export function ServiceForm({
  service,
  basePath = "/services",
  branches: branchList,
  defaultBranch,
}: {
  service?: SalonService;
  basePath?: string;
  branches?: BranchChoice[] | "accessible";
  defaultBranch?: string;
}) {
  const router = useRouter();
  const branches = useBranchOptions(branchList);
  const [image, setImage] = useState<File | null>(null);

  const name = (
    <FormField key="name" label="Name" htmlFor="service-name">
      <TextInput id="service-name" name="name" placeholder="Enter name" required defaultValue={service?.name} />
    </FormField>
  );
  const workers = (
    <FormField key="workers" label="Workers" htmlFor="service-worker">
      <DropdownSelect
        id="service-worker"
        name="worker"
        placeholder="Select worker"
        required
        defaultValue={service?.workerIds[0]}
        options={workerProfiles.map((w) => ({ value: w.id, label: w.name, avatar: true, status: w.status }))}
      />
    </FormField>
  );
  const category = (
    <FormField key="category" label="Category" htmlFor="service-category">
      <DropdownSelect
        id="service-category"
        name="category"
        placeholder="Select Category"
        required
        defaultValue={service?.category}
        options={serviceCategories.map((c) => ({ value: c, label: c }))}
      />
    </FormField>
  );
  const imageField = (
    <FormField key="image" label="Image" htmlFor="service-image">
      <FileInput
        id="service-image"
        accept="image/*"
        placeholder="Upload image"
        fileName={image?.name}
        onFileChange={setImage}
        compact={!!branches}
      />
    </FormField>
  );
  const price = (
    <FormField key="price" label="Price" htmlFor="service-price">
      <TextInput
        id="service-price"
        name="price"
        type="number"
        min={0}
        placeholder={branches ? "Enter price" : "Enter service price"}
        required
        defaultValue={service?.price}
      />
    </FormField>
  );

  return (
    <FormCard title={service ? "Edit Service" : "Add Service"}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          toast(`${service ? `Service ${service.num} updated` : "Service added"}. ${DEMO_NOTE}`);
          router.push(service ? `${basePath}/${service.id}` : basePath);
        }}
      >
        {branches ? (
          <FormGrid>
            <FormField label="Branch" htmlFor="service-branch">
              <DropdownSelect
                id="service-branch"
                name="branch"
                placeholder="Select branch"
                required
                defaultValue={pickBranch(branches, service?.branchIds?.find((id) => branches.some((b) => b.value === id)) ?? defaultBranch ?? (service ? branches[0]?.value : undefined))}
                options={branches}
              />
            </FormField>
            {name}
            {workers}
            {category}
            {imageField}
            {price}
          </FormGrid>
        ) : (
          <FormFields>
            {name}
            {workers}
            {category}
            {imageField}
            {price}
          </FormFields>
        )}

        <SubmitButton>Save</SubmitButton>
      </form>
    </FormCard>
  );
}

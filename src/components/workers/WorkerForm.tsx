"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  DateInput,
  DropdownSelect,
  FormCard,
  FormField,
  FormFields,
  FormGrid,
  SegmentedToggle,
  SubmitButton,
  TextInput,
} from "@/components/ui/Form";
import { nationalities, positions } from "@/lib/mock-data";
import { toInputDate } from "@/lib/utils";
import type { RequestPriority, WorkerProfile } from "@/types";

const WORKER_TYPES = ["Normal", "Special"] as const satisfies readonly RequestPriority[];

/**
 * Add worker (design 16); also reused, pre-filled, for Edit. With `branches` it becomes the
 * multi-branch owner's two-column form with a Branch field (design 39).
 */
export function WorkerForm({
  worker,
  basePath = "/workers",
  branches,
}: {
  worker?: WorkerProfile;
  basePath?: string;
  branches?: string[];
}) {
  const router = useRouter();
  const [type, setType] = useState<RequestPriority>(worker?.type ?? "Normal");

  const name = (
    <FormField key="name" label="Name" htmlFor="worker-name">
      <TextInput id="worker-name" name="name" placeholder="Enter name" required defaultValue={worker?.name} />
    </FormField>
  );
  const idNumber = (
    <FormField key="id" label={branches ? "Id number" : "Id Number"} htmlFor="worker-id-number">
      <TextInput
        id="worker-id-number"
        name="idNumber"
        placeholder="Enter id number"
        inputMode="numeric"
        required
        defaultValue={worker?.idNumber}
      />
    </FormField>
  );
  const joinDate = (
    <FormField key="join" label="Date of joining" htmlFor="worker-join-date">
      <DateInput
        id="worker-join-date"
        name="joinDate"
        required
        defaultValue={worker ? toInputDate(worker.joinDate) : undefined}
      />
    </FormField>
  );
  const workerType = (
    <FormField key="type" label="Worker type">
      <SegmentedToggle options={WORKER_TYPES} value={type} onChange={setType} />
      <input type="hidden" name="type" value={type} />
    </FormField>
  );
  const nationality = (
    <FormField key="nationality" label="Nationality" htmlFor="worker-nationality">
      <DropdownSelect
        id="worker-nationality"
        name="nationality"
        placeholder="Select nationality"
        required
        defaultValue={worker?.nationality}
        options={nationalities.map((n) => ({ value: n.name, label: n.name }))}
      />
    </FormField>
  );
  const position = (
    <FormField key="position" label="Position" htmlFor="worker-position">
      <DropdownSelect
        id="worker-position"
        name="position"
        placeholder="Select position"
        required
        defaultValue={worker?.role}
        options={positions.map((p) => ({ value: p, label: p }))}
      />
    </FormField>
  );

  return (
    <FormCard title={worker ? "Edit worker" : branches ? "Add Worker" : "Add worker"}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          // No backend yet — return to the list once the form is valid.
          router.push(worker ? `${basePath}/${worker.id}` : basePath);
        }}
      >
        {branches ? (
          <FormGrid>
            <FormField label="Branch" htmlFor="worker-branch">
              <DropdownSelect
                id="worker-branch"
                name="branch"
                placeholder="Select Branch"
                required
                defaultValue={worker ? branches[0] : undefined}
                options={branches.map((b) => ({ value: b, label: b }))}
              />
            </FormField>
            {name}
            {idNumber}
            {joinDate}
            {nationality}
            {position}
            {workerType}
          </FormGrid>
        ) : (
          <FormFields>
            {name}
            {idNumber}
            {joinDate}
            {workerType}
            {nationality}
            {position}
          </FormFields>
        )}

        <SubmitButton>Save</SubmitButton>
      </form>
    </FormCard>
  );
}

"use client";

import { useRouter } from "next/navigation";
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
import { requestServiceFilters, workerProfiles } from "@/lib/mock-data";
import { toInputDate } from "@/lib/utils";
import type { RequestDetails } from "@/types";

const SERVICE_OPTIONS = requestServiceFilters.map((name) => ({ value: name, label: name }));
const WORKER_OPTIONS = workerProfiles.map((w) => ({ value: w.id, label: w.name, avatar: true, status: w.status }));

/**
 * Add request (design 9); also reused, pre-filled, for Edit. With `branches` it becomes the
 * multi-branch owner's two-column form with a Branch field first (design 33).
 */
export function RequestForm({
  request,
  basePath = "/requests",
  branches,
}: {
  request?: RequestDetails;
  basePath?: string;
  branches?: string[];
}) {
  const router = useRouter();
  const workerId = request ? workerProfiles.find((w) => w.name === request.workerName)?.id : undefined;

  const fields = [
    branches ? (
      <FormField key="branch" label="Branch" htmlFor="request-branch">
        <DropdownSelect
          id="request-branch"
          name="branch"
          placeholder="Select branch"
          required
          defaultValue={request?.branch}
          options={branches.map((b) => ({ value: b, label: b }))}
        />
      </FormField>
    ) : null,
    <FormField key="user" label="User name" htmlFor="request-user">
      <TextInput id="request-user" name="userName" placeholder="Enter name" required defaultValue={request?.customer.name} />
    </FormField>,
    <FormField key="services" label="Services" htmlFor="request-service">
      <DropdownSelect
        id="request-service"
        name="service"
        placeholder="Select services"
        required
        defaultValue={request?.service}
        options={SERVICE_OPTIONS}
      />
    </FormField>,
    <FormField key="workers" label="Workers" htmlFor="request-worker">
      <DropdownSelect
        id="request-worker"
        name="worker"
        placeholder="Select workers"
        required
        defaultValue={workerId}
        options={WORKER_OPTIONS}
      />
    </FormField>,
    <FormField key="date" label="Date" htmlFor="request-date">
      <DateInput id="request-date" name="date" required defaultValue={request ? toInputDate(request.date) : undefined} />
    </FormField>,
    <FormField key="time" label="Time" htmlFor="request-time">
      <TextInput
        id="request-time"
        name="time"
        placeholder="Enter time"
        required
        pattern="^\d{1,2}:\d{2}\s?([aApP][mM])?$"
        title="e.g. 5:00am"
        defaultValue={request?.time}
      />
    </FormField>,
  ];

  return (
    <FormCard title={request ? "Edit request" : "Add request"}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          // No backend yet — return to the list once the form is valid.
          router.push(request ? `${basePath}/${request.id}` : basePath);
        }}
      >
        {branches ? <FormGrid>{fields}</FormGrid> : <FormFields>{fields}</FormFields>}
        <SubmitButton className="mt-[41px]">Save</SubmitButton>
      </form>
    </FormCard>
  );
}

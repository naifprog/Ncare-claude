"use client";

import { useState } from "react";
import { FormCard, FormField, FormFields, SubmitButton, TextInput } from "@/components/ui/Form";

/** Change password (design screen 24). */
export function ChangePasswordForm({
  requireCurrent = true,
  title = "Change password",
}: {
  /** An admin resetting someone else's password is not asked for the current one. */
  requireCurrent?: boolean;
  title?: string;
} = {}) {
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  return (
    <FormCard title={title}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const data = new FormData(e.currentTarget);
          if (data.get("newPassword") !== data.get("confirmPassword")) {
            setError("Passwords do not match.");
            setSaved(false);
            return;
          }
          // No backend yet — just acknowledge the change.
          setError(null);
          setSaved(true);
          e.currentTarget.reset();
        }}
      >
        <FormFields>
          {requireCurrent && (
          <FormField label="Current password" htmlFor="current-password">
            <TextInput
              id="current-password"
              name="currentPassword"
              type="password"
              autoComplete="current-password"
              placeholder="Enter current password"
              required
            />
          </FormField>
          )}

          <FormField label="New password" htmlFor="new-password">
            <TextInput
              id="new-password"
              name="newPassword"
              type="password"
              autoComplete="new-password"
              placeholder="Select new password"
              minLength={8}
              required
            />
          </FormField>

          <FormField label="Confirm new password" htmlFor="confirm-password" error={error ?? undefined}>
            <TextInput
              id="confirm-password"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="Select confirm new password"
              required
            />
          </FormField>
        </FormFields>

        <div className="flex items-center gap-4">
          <SubmitButton>Save</SubmitButton>
          {saved && (
            <p role="status" className="mt-[31px] text-sm font-semibold text-positive">
              Password updated.
            </p>
          )}
        </div>
      </form>
    </FormCard>
  );
}

"use client";

import { useState } from "react";
import { Toggle } from "@/components/ui/Toggle";
import type { PowerGroup } from "@/lib/mock-main";

/**
 * Permission groups (designs 44, 46, 75): a navy tab straddling each #fcfcfc panel,
 * 473×50 white rows in two columns with an orange switch per permission.
 */
export function PowersEditor({
  groups,
  initial,
}: {
  groups: PowerGroup[];
  /** Initial on/off per permission key (defaults to all on, as drawn in the design). */
  initial?: Record<string, boolean>;
}) {
  const [values, setValues] = useState<Record<string, boolean>>(
    () =>
      initial ??
      Object.fromEntries(groups.flatMap((g) => g.powers.map((p) => [p.key, true] as const))),
  );

  return (
    <div className="space-y-5">
      {groups.map((group) => (
        <section key={group.title} className="pt-[25px]">
          <div className="relative rounded-[5px] bg-page px-5 pb-5 pt-[35px]">
            <h3 className="absolute -top-[25px] left-5 flex h-[50px] min-w-[121px] items-center justify-center rounded-l-[25px] rounded-r-[25px] rounded-bl-[5px] bg-brand px-6 text-base font-bold text-white">
              {group.title}
            </h3>
            <ul className="grid gap-2.5 lg:grid-cols-2 lg:gap-x-5">
              {group.powers.map((p) => (
                <li key={p.key} className="flex h-[50px] items-center justify-between rounded-[5px] bg-card pl-5 pr-11 text-[15px] text-ink">
                  <span>{p.label}</span>
                  <Toggle
                    checked={values[p.key] ?? false}
                    onChange={(v) => setValues((s) => ({ ...s, [p.key]: v }))}
                    label={p.label}
                  />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ))}
    </div>
  );
}

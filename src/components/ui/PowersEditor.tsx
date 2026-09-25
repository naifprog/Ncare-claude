"use client";

import { Toggle } from "@/components/ui/Toggle";
import type { Permission, PowerGroup } from "@/lib/access/permissions";

/**
 * Permission groups (designs 44, 46, 75): a navy tab straddling each #fcfcfc panel,
 * 473×50 white rows in two columns with an orange switch per permission.
 * Controlled: `value` is the list of granted permissions.
 */
export function PowersEditor({
  groups,
  value,
  onChange,
  readOnly,
}: {
  groups: PowerGroup[];
  value: readonly Permission[];
  onChange: (value: Permission[]) => void;
  /** Shown but not editable (user without "Manage powers"). */
  readOnly?: boolean;
}) {
  const granted = new Set(value);
  const set = (key: Permission, on: boolean) => {
    const next = new Set(granted);
    if (on) next.add(key);
    else next.delete(key);
    onChange([...next]);
  };

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
                <li key={p.key} className="flex h-[50px] items-center justify-between gap-4 rounded-[5px] bg-card pl-5 pr-5 text-[15px] text-ink sm:pr-11">
                  <span className="min-w-0 truncate">{p.label}</span>
                  <Toggle checked={granted.has(p.key)} onChange={(v) => set(p.key, v)} label={p.label} disabled={readOnly} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ))}
    </div>
  );
}

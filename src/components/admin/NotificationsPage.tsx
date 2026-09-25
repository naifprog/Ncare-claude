"use client";

import { useState } from "react";
import { SplitShell } from "@/components/admin/SplitShell";
import { CaretDownIcon } from "@/components/ui/DesignIcons";
import { DateInput, DropdownSelect, FormField, FormGrid, SubmitButton, TextInput } from "@/components/ui/Form";
import { Icon } from "@/components/ui/Icon";
import { ACCOUNT_TYPES, adminNotifications, adminUsers } from "@/lib/mock-admin";
import { cn } from "@/lib/utils";

type Notice = (typeof adminNotifications)[number];

/** Text field with the design's live "n/max" counter (design 85). */
function CountedField({
  id,
  name,
  max,
  multiline,
  dir,
  placeholder,
}: {
  id: string;
  name: string;
  max: number;
  multiline?: boolean;
  dir?: "rtl";
  placeholder: string;
}) {
  const [value, setValue] = useState("");
  const base =
    "w-full bg-page px-[30px] text-sm text-ink placeholder:text-[#aeaeae] focus:outline focus:outline-brand";
  return (
    <div className="relative">
      {multiline ? (
        <textarea
          id={id}
          name={name}
          dir={dir}
          maxLength={max}
          required
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className={cn(base, "h-[70px] resize-none rounded-[25px] pb-6 pt-3")}
        />
      ) : (
        <TextInput
          id={id}
          name={name}
          dir={dir}
          maxLength={max}
          required
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="pr-20"
        />
      )}
      <span className={cn("pointer-events-none absolute right-[30px] text-[10px] text-ink", multiline ? "bottom-2" : "top-1/2 -translate-y-1/2")}>
        {value.length}/{max}
      </span>
    </div>
  );
}

/** Notifications page (designs 85, 86): list with expandable details + "Add Notification" form. */
export function NotificationsPage() {
  const [items, setItems] = useState<Notice[]>(adminNotifications);
  const [openId, setOpenId] = useState<string | null>(null);
  const [sendNow, setSendNow] = useState(true);
  const [formKey, setFormKey] = useState(0);

  return (
    <SplitShell
      title="Notifications"
      list={
        <ul className="min-h-0 flex-1 space-y-5 overflow-y-auto pb-5 pr-1 thin-scrollbar">
          {items.map((n) => {
            const open = openId === n.id;
            return (
              <li key={n.id} className="rounded-[5px] bg-card text-xs text-ink">
                <div className="flex items-center gap-4 py-4 pl-2.5 pr-3">
                  <span className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-brand text-white">
                    <Icon name="bell" size={14} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold">{n.title}</p>
                    <p className="mt-1.5">{n.body}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span className="text-[9px] text-ink-muted">{n.time}</span>
                    <button
                      type="button"
                      aria-expanded={open}
                      aria-label={open ? "Hide details" : "Show details"}
                      onClick={() => setOpenId(open ? null : n.id)}
                      className="flex h-4 w-4 items-center justify-center rounded-[3px] bg-brand-orange text-white"
                    >
                      <CaretDownIcon className={cn("h-1.5 w-2.5 transition-transform", open && "rotate-180")} />
                    </button>
                  </div>
                </div>
                {open && (
                  <div className="space-y-2 border-t border-[#f2f2f2] px-2.5 pb-3 pt-2.5 text-[10px]">
                    <p>{n.sentAt}</p>
                    <p className="flex flex-wrap justify-between gap-2">
                      <span>From: {n.from}</span>
                      <span>To: {n.to}</span>
                    </p>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      }
    >
      <section className="px-2 pt-2">
        <h2 className="pl-2.5 text-[22px] leading-[26px] text-ink">Add Notification</h2>
        <form
          key={formKey}
          className="mt-6"
          onSubmit={(e) => {
            e.preventDefault();
            const data = new FormData(e.currentTarget);
            const to = String(data.get("accountType") || "All");
            setItems((list) => [
              {
                id: `an-new-${Date.now()}`,
                title: String(data.get("titleEn")),
                body: String(data.get("textEn")),
                time: sendNow ? "now" : String(data.get("time") || ""),
                sentAt: sendNow ? "Now" : `${data.get("time")}, ${data.get("date")}`,
                from: "Ahmed Alwaly(Admin)",
                to: `${to}.`,
              },
              ...list,
            ]);
            setFormKey((k) => k + 1);
            setSendNow(true);
          }}
        >
          <FormGrid loose>
            <FormField label="Title(English)" htmlFor="n-title-en">
              <CountedField id="n-title-en" name="titleEn" max={40} placeholder="Enter Title" />
            </FormField>
            <FormField label="Title(Arabic)" htmlFor="n-title-ar">
              <CountedField id="n-title-ar" name="titleAr" max={40} dir="rtl" placeholder="Enter Title" />
            </FormField>
            <FormField label="Text(English)" htmlFor="n-text-en">
              <CountedField id="n-text-en" name="textEn" max={150} multiline placeholder="Enter text" />
            </FormField>
            <FormField label="Text(Arabic)" htmlFor="n-text-ar">
              <CountedField id="n-text-ar" name="textAr" max={150} multiline dir="rtl" placeholder="Enter text" />
            </FormField>
            <FormField label="Account type" htmlFor="n-type">
              <DropdownSelect
                id="n-type"
                name="accountType"
                placeholder="Select Account type"
                options={ACCOUNT_TYPES.map((t) => ({ value: t, label: t }))}
              />
            </FormField>
            <FormField label="Username" htmlFor="n-user">
              <DropdownSelect
                id="n-user"
                name="username"
                placeholder="Select Username"
                options={[...new Set(adminUsers.map((u) => u.name))].map((n) => ({ value: n, label: n }))}
              />
            </FormField>
          </FormGrid>

          <label className="mt-5 flex w-fit cursor-pointer items-center gap-3 pl-1 text-sm text-ink">
            <input
              type="checkbox"
              checked={sendNow}
              onChange={(e) => setSendNow(e.target.checked)}
              className="h-4 w-4 accent-brand-orange"
            />
            Send Now
          </label>

          {!sendNow && (
            <div className="mt-5">
              <FormGrid>
                <FormField label="Time" htmlFor="n-time">
                  <TextInput
                    id="n-time"
                    name="time"
                    placeholder="Enter time"
                    required
                    pattern="^\d{1,2}:\d{2}\s?([aApP][mM])?$"
                    title="e.g. 5:00am"
                  />
                </FormField>
                <FormField label="Date" htmlFor="n-date">
                  <DateInput id="n-date" name="date" required />
                </FormField>
              </FormGrid>
            </div>
          )}

          <SubmitButton className="mt-6">Save</SubmitButton>
        </form>
      </section>
    </SplitShell>
  );
}

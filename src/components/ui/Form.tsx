"use client";

import { useState, type InputHTMLAttributes, type SelectHTMLAttributes } from "react";
import { PhotoAvatar, type AvatarStatus } from "@/components/ui/Avatar";
import { CalendarPopover, formatDisplayDate } from "@/components/ui/Calendar";
import { CaretDownIcon, ExportIcon } from "@/components/ui/DesignIcons";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

/** 764×50 pill field on #fcfcfc (design screens 9, 16, 20, 24). */
const FIELD_BASE =
  "h-[50px] w-full rounded-pill border border-transparent bg-page px-[30px] text-sm text-ink placeholder:text-[#aeaeae] focus:border-brand focus:outline-none";

/** White page card filling the content area, with the 22px section title. */
export function FormCard({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-card bg-card px-4 pb-10 pt-[27px] shadow-card sm:px-[30px] xl:min-h-[calc(100vh-130px)]",
        className,
      )}
    >
      <h2 className="pl-5 text-[22px] leading-[26px] text-ink">{title}</h2>
      <div className="mt-9">{children}</div>
    </section>
  );
}

/** Vertical stack of fields on the design's 110px pitch. */
export function FormFields({ children }: { children: React.ReactNode }) {
  return <div className="space-y-[19px]">{children}</div>;
}

/**
 * Two-column form layout (designs 29, 33, 39, 41, 53–56 …): 493px columns, 21px gutter,
 * 110px row pitch — 120px (`loose`) when labels carry hints (design 29).
 */
export function FormGrid({ children, loose }: { children: React.ReactNode; loose?: boolean }) {
  return (
    <div className={cn("grid gap-x-[21px] lg:grid-cols-2", loose ? "gap-y-[29px]" : "gap-y-[19px]")}>{children}</div>
  );
}

export function FormField({
  label,
  hint,
  htmlFor,
  error,
  children,
}: {
  label: string;
  /** 12px helper text tucked between the label and the field (e.g. "User name" in design 29). */
  hint?: string;
  htmlFor?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-w-0 max-w-[764px]">
      <label htmlFor={htmlFor} className="block pl-5 text-lg leading-5 text-ink">
        {label}
      </label>
      {hint ? <p className="absolute left-5 top-[22px] text-xs leading-[14px] text-ink">{hint}</p> : null}
      <div className="mt-[21px]">{children}</div>
      {error ? <p className="mt-2 pl-5 text-xs font-semibold text-negative">{error}</p> : null}
    </div>
  );
}

export function TextInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(FIELD_BASE, className)} {...props} />;
}

export function SelectInput({
  placeholder,
  options,
  className,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & {
  placeholder: string;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="relative">
      <select
        className={cn(FIELD_BASE, "appearance-none pr-20 invalid:text-[#aeaeae]", className)}
        {...props}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value} className="text-ink">
            {o.label}
          </option>
        ))}
      </select>
      <CaretDownIcon className="pointer-events-none absolute right-[54px] top-1/2 -translate-y-1/2 text-ink" />
    </div>
  );
}

export interface DropdownOption {
  value: string;
  label: string;
  /** Shows the memoji avatar before the label (worker lists, design frame 30359). */
  avatar?: boolean;
  status?: AvatarStatus;
}

/**
 * Select field that opens the design's dropdown card (frames 30355 / 30357 / 30359):
 * white 5px card, 41px rows with inset separators. Submits `name` via a hidden input.
 */
export function DropdownSelect({
  id,
  name,
  placeholder,
  options,
  required,
  defaultValue,
  onChange,
}: {
  id?: string;
  name: string;
  placeholder: string;
  options: DropdownOption[];
  onChange?: (value: string) => void;
  required?: boolean;
  defaultValue?: string;
}) {
  const [value, setValue] = useState(defaultValue ?? "");
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);
  const withAvatars = options.some((o) => o.avatar);

  return (
    <div className="relative">
      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={cn(FIELD_BASE, "pr-20 text-left", !selected && "text-[#aeaeae]")}
      >
        {selected ? selected.label : placeholder}
      </button>
      <CaretDownIcon
        className={cn(
          "pointer-events-none absolute right-[54px] top-[21px] text-ink transition-transform",
          open && "rotate-180",
        )}
      />
      <input
        tabIndex={-1}
        aria-hidden="true"
        name={name}
        required={required}
        value={value}
        onChange={() => {}}
        className="pointer-events-none absolute bottom-0 left-8 h-px w-px opacity-0"
      />
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <ul
            role="listbox"
            className={cn(
              "absolute right-5 top-[58px] z-50 max-h-[300px] overflow-y-auto rounded-[5px] bg-card px-2.5 py-1 shadow-card thin-scrollbar",
              withAvatars ? "min-w-[168px]" : "min-w-[110px]",
            )}
          >
            {options.map((o, i) => (
              <li key={o.value} className="border-b border-[#f2f2f2] last:border-0">
                <button
                  type="button"
                  role="option"
                  aria-selected={o.value === value}
                  onClick={() => {
                    setValue(o.value);
                    onChange?.(o.value);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex h-[41px] w-full items-center gap-2.5 whitespace-nowrap px-2 text-sm text-ink hover:text-brand",
                    withAvatars ? "justify-start" : "justify-center",
                    o.value === value && "font-bold text-brand",
                  )}
                >
                  {o.avatar ? <PhotoAvatar size={30} tint={i} status={o.status} /> : null}
                  {o.label}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

/**
 * Date field from the design: "Select date" pill with the orange 60×50 calendar trigger,
 * opening the design's month calendar (frame 3052). Submits `name` as yyyy-mm-dd.
 */
export function DateInput({
  id,
  name,
  required,
  defaultValue,
  placeholder = "Select date",
}: {
  id?: string;
  name: string;
  required?: boolean;
  defaultValue?: string;
  placeholder?: string;
}) {
  const [value, setValue] = useState(defaultValue ?? "");
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        id={id}
        type="button"
        onClick={() => setOpen(true)}
        className={cn(FIELD_BASE, "pr-20 text-left", !value && "text-[#aeaeae]")}
      >
        {value ? formatDisplayDate(value) : placeholder}
      </button>
      {/* Carries the value and native "required" validation for the form. */}
      <input
        tabIndex={-1}
        aria-hidden="true"
        name={name}
        required={required}
        value={value}
        onChange={() => {}}
        className="pointer-events-none absolute bottom-0 left-8 h-px w-px opacity-0"
      />
      <button
        type="button"
        aria-label="Open calendar"
        onClick={() => setOpen((o) => !o)}
        className="absolute right-0 top-0 flex h-[50px] w-[60px] items-center justify-center rounded-pill bg-brand-orange text-white transition-opacity hover:opacity-90"
      >
        <Icon name="calendarBold" size={20} />
      </button>
      {open && (
        <CalendarPopover
          value={value}
          onSelect={setValue}
          onClose={() => setOpen(false)}
          className="right-0 top-[58px]"
        />
      )}
    </div>
  );
}

/** File picker styled as a field with the orange 156px "Upload" pill (Add service → Image). */
export function FileInput({
  id,
  accept,
  placeholder,
  fileName,
  onFileChange,
  compact,
}: {
  id: string;
  accept?: string;
  placeholder: string;
  fileName?: string;
  onFileChange: (file: File | null) => void;
  /** Icon-only 60×50 orange trigger (two-column forms, e.g. design 29). */
  compact?: boolean;
}) {
  return (
    <div className="relative">
      <div className={cn(FIELD_BASE, "flex items-center", compact ? "pr-20" : "pr-44", !fileName && "text-[#aeaeae]")}>
        <span className="truncate">{fileName || placeholder}</span>
      </div>
      <label
        htmlFor={id}
        aria-label={compact ? "Upload" : undefined}
        className={cn(
          "absolute right-0 top-0 flex h-[50px] cursor-pointer items-center justify-center gap-2.5 rounded-pill bg-brand-orange text-lg font-bold text-white transition-opacity hover:opacity-90",
          compact ? "w-[60px]" : "w-[160px]",
        )}
      >
        <ExportIcon size={20} />
        {compact ? null : "Upload"}
      </label>
      <input
        id={id}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
      />
    </div>
  );
}

/** Two-option pill toggle (Worker type: Normal / Special), 142×50 each. */
export function SegmentedToggle<T extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-5">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={value === option}
          onClick={() => onChange(option)}
          className={cn(
            "h-[50px] w-[142px] rounded-pill text-sm transition-colors",
            value === option ? "bg-info font-bold text-white" : "bg-page text-ink hover:bg-border",
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export function SubmitButton({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <button
      type="submit"
      className={cn(
        "mt-[31px] h-[50px] w-[129px] rounded-pill bg-brand text-[15px] font-bold text-white shadow-card transition-colors hover:bg-brand/90",
        className,
      )}
    >
      {children}
    </button>
  );
}

/**
 * Multi-choice variant of DropdownSelect (same field and dropdown card) with a check
 * per option; `allOption` adds an exclusive "all" choice. Submits `name` as a
 * comma-separated list.
 */
export function MultiSelect({
  id,
  name,
  placeholder,
  options,
  defaultValue = [],
  allOption,
  onChange,
}: {
  id?: string;
  name: string;
  placeholder: string;
  options: { value: string; label: string }[];
  defaultValue?: string[];
  /** Label of the exclusive "all" choice (value "all"). */
  allOption?: string;
  onChange?: (value: string[]) => void;
}) {
  const [value, setValue] = useState<string[]>(defaultValue);
  const [open, setOpen] = useState(false);
  const choices = allOption ? [{ value: "all", label: allOption }, ...options] : options;
  const summary = value.includes("all")
    ? allOption
    : options
        .filter((o) => value.includes(o.value))
        .map((o) => o.label)
        .join(", ");

  const toggle = (v: string) => {
    const next = v === "all" ? (value.includes("all") ? [] : ["all"]) : value.includes(v) ? value.filter((x) => x !== v) : [...value.filter((x) => x !== "all"), v];
    setValue(next);
    onChange?.(next);
  };

  return (
    <div className="relative">
      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={cn(FIELD_BASE, "truncate pr-20 text-left", !summary && "text-[#aeaeae]")}
      >
        {summary || placeholder}
      </button>
      <CaretDownIcon
        className={cn("pointer-events-none absolute right-[54px] top-[21px] text-ink transition-transform", open && "rotate-180")}
      />
      <input type="hidden" name={name} value={value.join(",")} />
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <ul
            role="listbox"
            aria-multiselectable="true"
            className="absolute right-5 top-[58px] z-50 max-h-[300px] min-w-[220px] overflow-y-auto rounded-[5px] bg-card px-2.5 py-1 shadow-card thin-scrollbar"
          >
            {choices.map((o) => {
              const selected = value.includes(o.value);
              return (
                <li key={o.value} className="border-b border-[#f2f2f2] last:border-0">
                  <button
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => toggle(o.value)}
                    className={cn(
                      "flex h-[41px] w-full items-center gap-2.5 whitespace-nowrap px-2 text-sm text-ink hover:text-brand",
                      selected && "font-bold text-brand",
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "flex h-4 w-4 shrink-0 items-center justify-center rounded-[3px] border text-[10px] text-white",
                        selected ? "border-brand bg-brand" : "border-divider",
                      )}
                    >
                      {selected ? "✓" : ""}
                    </span>
                    {o.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}

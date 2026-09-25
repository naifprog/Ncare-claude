"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useAccess } from "@/components/auth/AccessProvider";
import { SubmitButton } from "@/components/ui/Form";
import { CaretDownIcon, GalleryExportIcon } from "@/components/ui/DesignIcons";
import { Icon } from "@/components/ui/Icon";
import { DEMO_NOTE, toast } from "@/lib/demo-state";
import { cn } from "@/lib/utils";
import type { SalonProfile, WeekDay } from "@/types";

const WEEK_DAYS: WeekDay[] = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const HOURS = Array.from({ length: 25 }, (_, h) => `${h}:00`);

export function Stars({ count, size = 14 }: { count: number; size?: number }) {
  return (
    // The design's stars are drawn slightly tilted, on a ~1.18× size pitch.
    <span
      className="inline-flex text-brand-orange"
      style={{ gap: Math.round(size * 0.18) }}
      aria-label={`${count} out of 5 stars`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <Icon key={i} name="star" size={size} className={cn("rotate-12", i >= count && "text-[#e3e3e3]")} />
      ))}
    </span>
  );
}

/** Picks an image file; used for the logo and cover in edit mode. */
function ImagePicker({ label, onPick, children }: { label: string; onPick: (file: File) => void; children: React.ReactNode }) {
  return (
    <label className="absolute inset-0 flex cursor-pointer items-center justify-center">
      {children}
      <span className="sr-only">Change {label}</span>
      <input
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onPick(file);
        }}
      />
    </label>
  );
}

/** Salon profile (design screen 22) and its edit state (screen 23). */
export function SalonProfileView({ profile }: { profile: SalonProfile }) {
  const { can } = useAccess();
  const canImages = can("settings.profileImages");
  const canHours = can("settings.profileHours");
  const [editing, setEditing] = useState(false);
  const [workDays, setWorkDays] = useState<WeekDay[]>(profile.workDays);
  const [openFrom, setOpenFrom] = useState(profile.openFrom);
  const [openTo, setOpenTo] = useState(profile.openTo);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);

  // Release object URLs created for image previews.
  useEffect(() => {
    if (!logoUrl) return;
    return () => URL.revokeObjectURL(logoUrl);
  }, [logoUrl]);
  useEffect(() => {
    if (!coverUrl) return;
    return () => URL.revokeObjectURL(coverUrl);
  }, [coverUrl]);

  const toggleDay = (day: WeekDay) =>
    setWorkDays((days) => (days.includes(day) ? days.filter((d) => d !== day) : [...days, day]));

  return (
    <form
      className={cn(
        "flex flex-col rounded-card bg-card px-4 pt-[30px] shadow-card sm:px-[30px] xl:h-[calc(100vh-151px)] xl:min-h-[760px]",
        editing ? "pb-[30px]" : "pb-0",
      )}
      onSubmit={(e) => {
        e.preventDefault();
        setEditing(false);
        toast(`Salon profile updated. ${DEMO_NOTE}`);
      }}
    >
      {/* Identity + cover */}
      <div className="grid gap-[21px] md:grid-cols-[221px_minmax(0,1fr)]">
        <div className="rounded-[5px] bg-page p-5">
          <div className="relative h-[179px] w-[181px] overflow-hidden rounded-[15px] bg-border">
            {/* eslint-disable-next-line @next/next/no-img-element -- local file preview or static asset */}
            <img src={logoUrl ?? "/images/salon-logo.png"} alt={`${profile.name} logo`} className="h-full w-full object-cover" />
            {editing && canImages && (
              <ImagePicker label="salon logo" onPick={(file) => setLogoUrl(URL.createObjectURL(file))}>
                <span className="absolute inset-0 bg-black/20" />
                <GalleryExportIcon size={35} className="relative text-white" />
              </ImagePicker>
            )}
          </div>
          <p className="mt-[17px] text-xl font-bold text-ink">{profile.name}</p>
          <p className="mt-3 text-justify text-lg leading-[23px] text-ink">{profile.address}</p>
        </div>

        <div className="relative min-h-[240px] overflow-hidden rounded-[5px] bg-tint-teal md:h-[351px]">
          {coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- local file preview
            <img src={coverUrl} alt={`${profile.name} cover`} className="h-full w-full object-cover" />
          ) : (
            <Image src="/images/salon-cover.jpg" alt={`${profile.name} cover`} fill sizes="764px" className="object-cover" priority />
          )}
          {editing && canImages ? (
            <ImagePicker label="salon cover image" onPick={(file) => setCoverUrl(URL.createObjectURL(file))}>
              <span className="absolute inset-0 bg-black/10" />
              <span className="relative flex h-[60px] w-[60px] items-center justify-center rounded-full bg-white/50 text-white">
                <GalleryExportIcon size={35} />
              </span>
            </ImagePicker>
          ) : editing || !(canImages || canHours) ? null : (
            <button
              type="button"
              onClick={() => setEditing(true)}
              aria-label="Edit salon profile"
              className="absolute bottom-5 right-5 flex h-[60px] w-[60px] items-center justify-center rounded-full bg-white/50 text-white transition-colors hover:bg-white/70"
            >
              <Icon name="editBold" size={24} />
            </button>
          )}
        </div>
      </div>

      <WorkTimeSection
        editing={editing && canHours}
        workDays={workDays}
        onToggleDay={toggleDay}
        openFrom={openFrom}
        openTo={openTo}
        onFromChange={setOpenFrom}
        onToChange={setOpenTo}
      />

      {editing ? (
        <div>
          <SubmitButton className="mt-[41px]">Save</SubmitButton>
        </div>
      ) : (
        <RatingsSection ratingCount={profile.ratingCount} reviews={profile.reviews} />
      )}    </form>
  );
}

/** "Work time" block: 90×40 day toggles on a white strip + From/To boxes (designs 22, 23, 30, 31). */
export function WorkTimeSection({
  editing,
  workDays,
  onToggleDay,
  openFrom,
  openTo,
  onFromChange,
  onToChange,
}: {
  editing: boolean;
  workDays: WeekDay[];
  onToggleDay: (day: WeekDay) => void;
  openFrom: string;
  openTo: string;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
}) {
  return (
    <>
      <h2 className="mt-3 pl-3.5 text-xl leading-6 text-ink">Work time</h2>
      <section className="mt-2.5 grid gap-2 rounded-[5px] bg-page px-[21px] pb-5 pt-5 text-ink xl:grid-cols-[669px_281px]">
        <div className="min-w-0">
          <p className="pl-2.5 text-lg leading-5">Days</p>
          <div className="mt-[11px] flex h-auto flex-wrap items-center gap-[5px] rounded-[5px] bg-card p-1 sm:h-[60px] sm:flex-nowrap">
            {WEEK_DAYS.map((day) => {
              const active = workDays.includes(day);
              return (
                <button
                  key={day}
                  type="button"
                  disabled={!editing}
                  aria-pressed={active}
                  onClick={() => onToggleDay(day)}
                  className={cn(
                    "h-10 w-[90px] shrink-0 rounded-[3px] text-xs transition-colors disabled:cursor-default",
                    active ? "bg-info font-bold text-white" : "bg-page text-ink",
                    editing && !active && "hover:bg-border",
                  )}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p className="pl-2.5 text-lg leading-5">Time</p>
          <div className="mt-[11px] flex h-[60px] items-center gap-1.5 rounded-[5px] bg-card px-2.5">
            <TimeField label="From" value={openFrom} onChange={onFromChange} editing={editing} />
            <TimeField label="To" value={openTo} onChange={onToChange} editing={editing} />
          </div>
        </div>
      </section>
    </>
  );
}

/** "Ratings" block with the review cards; the second row fades out and the list scrolls. */
export function RatingsSection({
  ratingCount,
  reviews,
}: {
  ratingCount: number;
  reviews: SalonProfile["reviews"];
}) {
  const empty = reviews.length === 0;
  return (
    <section
      className={cn(
        "mt-5 flex flex-col rounded-[5px] bg-page px-5 pt-[18px]",
        empty ? "min-h-[180px] flex-1" : "fade-ratings min-h-[300px] flex-1 xl:min-h-0",
      )}
    >
      <div className="flex items-center gap-8">
        <h2 className="text-xl leading-6 text-ink">Ratings</h2>
        <span className="flex items-center gap-2.5">
          <Stars count={empty ? 0 : 5} size={17} />
          <span className="text-[10px] text-ink">({ratingCount})</span>
        </span>
      </div>
      {empty ? (
        <p className="mt-12 text-base text-ink">No ratings yet</p>
      ) : (
        <ul className="mt-[18px] grid min-h-0 flex-1 auto-rows-[117px] gap-2.5 overflow-y-auto pb-24 no-scrollbar sm:grid-cols-2 xl:grid-cols-4">
          {reviews.map((review) => (
            <li key={review.id} className="rounded-[5px] bg-card px-2.5 pt-2 text-ink">
              <Stars count={review.rating} size={13} />
              <p className="mt-1 text-xs">{review.author}</p>
              <p className="mt-1.5 pl-1 text-xs leading-[14px]">{review.comment}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
/** 127×40 "From: 6:00" box; becomes an hour dropdown in edit mode. */
function TimeField({
  label,
  value,
  onChange,
  editing,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  editing: boolean;
}) {
  return (
    <label className="flex h-10 w-[127px] items-center justify-between rounded-[3px] bg-page px-2.5 text-sm text-ink">
      {label}:
      {editing ? (
        <span className="relative">
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="appearance-none bg-transparent pr-5 text-sm text-ink focus:outline-none"
          >
            {HOURS.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
          <CaretDownIcon className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2" />
        </span>
      ) : (
        <span>{value}</span>
      )}
    </label>
  );
}

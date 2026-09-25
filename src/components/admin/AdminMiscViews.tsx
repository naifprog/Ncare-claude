"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAccess } from "@/components/auth/AccessProvider";
import { OutlineIconButton } from "@/components/ui/Button";
import { DateInput, FileInput, FormCard, FormField, FormGrid, SubmitButton, TextInput } from "@/components/ui/Form";
import { Icon } from "@/components/ui/Icon";
import { DEMO_NOTE, toast } from "@/lib/demo-state";
import { ads } from "@/lib/mock-admin";

// ---------------------------------------------------------------------------
// Ads (designs 70, 72)
// ---------------------------------------------------------------------------

type Ad = (typeof ads)[number];

export function AdsView() {
  const { can } = useAccess();
  const canManage = can("ads.manage");
  const [items, setItems] = useState<Ad[]>(ads);
  const [preview, setPreview] = useState<Ad | null>(null);

  return (
    <section className="rounded-card bg-card px-4 pb-[30px] pt-5 shadow-card sm:px-[30px] xl:min-h-[calc(100vh-151px)]">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-[22px] text-ink">All ads</h2>
        {canManage && (
        <Link
          href="/admin/ads/add"
          className="inline-flex h-[50px] w-[175px] items-center justify-center rounded-pill bg-brand text-[15px] font-bold text-white shadow-card"
        >
          New Ad
        </Link>
        )}
      </div>

      <ul className="mt-5 grid gap-5 lg:grid-cols-2">
        {items.map((ad) => (
          <li key={ad.id}>
            <div className="relative aspect-[492/250] overflow-hidden rounded-t-[5px]">
              <Image src={ad.image} alt="Advertisement" fill sizes="(min-width: 1024px) 492px, 100vw" className="object-cover" />
            </div>
            <div className="flex h-[60px] items-center gap-2.5 rounded-b-[5px] bg-page px-5 text-sm text-ink">
              <span className="inline-flex h-[30px] items-center rounded-[3px] bg-tint-teal px-2.5 text-brand">{ad.duration}</span>
              <span className="inline-flex h-[30px] items-center rounded-[3px] bg-card px-2.5">
                From {ad.from} To {ad.to}
              </span>
              <span className="flex-1" />
              {canManage && (
                <OutlineIconButton
                  tone="negative"
                  aria-label="Delete ad"
                  onClick={() => {
                    setItems((l) => l.filter((x) => x.id !== ad.id));
                    toast(`Ad deleted. ${DEMO_NOTE}`);
                  }}
                >
                  <Icon name="trash" size={18} />
                </OutlineIconButton>
              )}
              <button
                type="button"
                onClick={() => setPreview(ad)}
                className="h-[30px] w-[86px] rounded-[3px] bg-brand text-sm font-bold text-white shadow-card"
              >
                Preview
              </button>
            </div>
          </li>
        ))}
        {items.length === 0 && <li className="py-10 text-center text-sm text-ink-muted lg:col-span-2">No ads yet.</li>}
      </ul>

      {preview && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Ad preview">
          <div className="absolute inset-0 bg-black/60" onClick={() => setPreview(null)} />
          <div className="relative w-full max-w-[900px] overflow-hidden rounded-[5px] bg-card shadow-card">
            <div className="relative aspect-[492/250]">
              <Image src={preview.image} alt="Advertisement" fill sizes="900px" className="object-cover" />
            </div>
            <div className="flex items-center justify-between px-5 py-3 text-sm text-ink">
              <span>
                {preview.duration} · From {preview.from} To {preview.to}
              </span>
              <button type="button" onClick={() => setPreview(null)} className="h-9 rounded-[5px] bg-page px-5 font-bold">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export function AdForm() {
  const router = useRouter();
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  return (
    <FormCard title="Add Ad">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const data = new FormData(e.currentTarget);
          if (!image) {
            setError("Choose an image for the ad.");
            return;
          }
          if (String(data.get("to")) < String(data.get("from"))) {
            setError("The end date must be on or after the start date.");
            return;
          }
          toast(`Ad added. ${DEMO_NOTE}`);
          router.push("/admin/ads");
        }}
      >
        <FormGrid>
          <FormField label="Image" htmlFor="ad-image" error={error ?? undefined}>
            <FileInput
              id="ad-image"
              accept="image/*"
              placeholder="Upload  image"
              fileName={image?.name}
              onFileChange={(f) => {
                setImage(f);
                setError(null);
              }}
              compact
            />
          </FormField>
          <FormField label="Duration" htmlFor="ad-duration">
            <TextInput id="ad-duration" name="duration" placeholder="Enter duration" required />
          </FormField>
          <FormField label="From" htmlFor="ad-from">
            <DateInput id="ad-from" name="from" required />
          </FormField>
          <FormField label="To" htmlFor="ad-to">
            <DateInput id="ad-to" name="to" required />
          </FormField>
        </FormGrid>
        <SubmitButton>Save</SubmitButton>
      </form>
    </FormCard>
  );
}

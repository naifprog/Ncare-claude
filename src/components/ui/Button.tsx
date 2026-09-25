import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

type Variant = "accept" | "reject" | "primary" | "outline" | "ghost";

const VARIANT_STYLES: Record<Variant, string> = {
  accept: "bg-positive text-white hover:bg-positive/90",
  reject: "bg-negative text-white hover:bg-negative/90",
  primary: "bg-brand text-white hover:bg-brand/90",
  outline: "border border-border bg-card text-ink hover:bg-page",
  ghost: "text-ink hover:bg-page",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-card px-4 py-2.5 text-sm font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-40",
        VARIANT_STYLES[variant],
        className,
      )}
      {...props}
    />
  );
}

const OUTLINE_TONES = {
  orange: "border-brand-orange text-brand-orange",
  brand: "border-brand text-brand",
  purple: "border-[#7e1bff] text-[#7e1bff]",
  negative: "border-negative text-negative",
  info: "border-info text-info",
} as const;

export type OutlineTone = keyof typeof OUTLINE_TONES;

/** Outlined square action used in the Workers / Services tables and document lists. */
export function outlineIconButtonClass(tone: OutlineTone, className?: string) {
  return cn(
    "inline-flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[5px] border bg-card shadow-card transition-colors hover:bg-page disabled:cursor-not-allowed disabled:opacity-40",
    OUTLINE_TONES[tone],
    className,
  );
}

export function OutlineIconButton({
  className,
  tone = "brand",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { tone?: OutlineTone }) {
  return <button type="button" className={outlineIconButtonClass(tone, className)} {...props} />;
}

export function IconButton({
  className,
  tone = "brand",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { tone?: "brand" | "info" | "negative" }) {
  const toneStyles = {
    brand: "bg-brand-orange text-white",
    info: "bg-info text-white",
    negative: "bg-negative text-white",
  } as const;

  return (
    <button
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-md transition-opacity hover:opacity-90",
        toneStyles[tone],
        className,
      )}
      {...props}
    />
  );
}

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

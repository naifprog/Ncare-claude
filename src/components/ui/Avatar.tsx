import Image from "next/image";
import { colorFromSeed, initialsFromName, cn } from "@/lib/utils";

/** Background tints the design puts behind avatars, in stacking order. */
const PHOTO_TINTS = [
  "bg-tint-teal",
  "bg-tint-rose",
  "bg-tint-yellow",
  "bg-tint-purple",
  "bg-tint-green",
] as const;

/**
 * Avatar as drawn in the design: the memoji portrait (public/images/avatar-memoji.png,
 * cut from the design reference) on a pastel circle. `tint` picks the circle color.
 */
const STATUS_STYLES = {
  brand: { ring: "border-brand", dot: "bg-brand" },
  orange: { ring: "border-brand-orange", dot: "bg-brand-orange" },
} as const;

export type AvatarStatus = keyof typeof STATUS_STYLES;

export function PhotoAvatar({
  size = 30,
  tint = 0,
  status,
  className,
}: {
  size?: number;
  tint?: number;
  /** Design's status marker: 1px colored ring + dot at the bottom-right (designs 15, 21, frame 30359). */
  status?: AvatarStatus;
  className?: string;
}) {
  const dot = Math.round(size * 0.27);
  return (
    <span className={cn("relative inline-flex shrink-0", className)} style={{ width: size, height: size }}>
      <span
        className={cn(
          "flex h-full w-full items-center justify-center overflow-hidden rounded-full",
          PHOTO_TINTS[tint % PHOTO_TINTS.length],
          status && cn("border", STATUS_STYLES[status].ring),
        )}
      >
        {/* The portrait fills ~80% of the circle in the design. */}
        <Image src="/images/avatar-memoji.png" alt="" width={size} height={size} className="h-[80%] w-[80%]" />
      </span>
      {status ? (
        <span
          aria-hidden="true"
          className={cn("absolute rounded-full", STATUS_STYLES[status].dot)}
          style={{ width: dot, height: dot, right: -1, bottom: Math.round(size * 0.07) }}
        />
      ) : null}
    </span>
  );
}

interface AvatarProps {
  seed: string;
  size?: number;
  className?: string;
  flag?: string;
}

export function Avatar({ seed, size = 30, className, flag }: AvatarProps) {
  const bg = colorFromSeed(seed);
  const initials = initialsFromName(seed);

  return (
    <span
      className={cn("relative inline-flex shrink-0", className)}
      style={{ width: size, height: size }}
    >
      <span
        className="flex h-full w-full items-center justify-center rounded-full font-bold text-white"
        style={{ backgroundColor: bg, fontSize: size * 0.38 }}
      >
        {initials}
      </span>
      {flag ? (
        <span
          className="absolute -right-0.5 -bottom-0.5 flex items-center justify-center rounded-full border border-white bg-white leading-none shadow-card-sm"
          style={{ width: size * 0.5, height: size * 0.5, fontSize: size * 0.32 }}
        >
          {flag}
        </span>
      ) : null}
    </span>
  );
}

import { colorFromSeed, initialsFromName, cn } from "@/lib/utils";

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

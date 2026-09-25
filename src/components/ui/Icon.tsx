import { getIconData, iconToSVG } from "@iconify/utils";
import solarIcons from "@iconify-json/solar/icons.json";
import { cn } from "@/lib/utils";

/**
 * Icons are resolved from the locally bundled Solar icon set (a close visual
 * match for the "vuesax" icons used in the Figma source) and rendered to raw
 * SVG on the server. No runtime/network icon fetching is involved.
 */
export const ICONS = {
  dashboard: "chart-2-linear",
  menu: "hamburger-menu-linear",
  requests: "calendar-mark-linear",
  workers: "users-group-rounded-linear",
  services: "barcode-linear",
  settings: "settings-linear",
  logout: "logout-2-linear",
  chevronDown: "alt-arrow-down-bold",
  bell: "bell-bold",
  chat: "chat-round-dots-bold",
  arrowRight: "alt-arrow-right-linear",
  arrowUp: "alt-arrow-up-bold",
  search: "minimalistic-magnifer-line-duotone",
  calendar: "calendar-linear",
  plus: "add-circle-bold",
  bolt: "bolt-circle-bold",
  edit: "pen-linear",
  trash: "trash-bin-trash-linear",
  chevronLeft: "alt-arrow-left-linear",
  chevronRight: "alt-arrow-right-linear",
  eye: "eye-linear",
  download: "download-minimalistic-linear",
  upload: "upload-minimalistic-linear",
  galleryAdd: "gallery-add-linear",
  star: "star-bold",
  verified: "verified-check-bold",
  editBold: "pen-bold",
  sort: "sort-vertical-linear",
  calendarBold: "calendar-bold",
  arrowRightLine: "arrow-right-linear",
  shop: "shop-linear",
  wallet: "wallet-money-linear",
  reports: "clipboard-text-linear",
  chevronRightBold: "alt-arrow-right-bold",
  chevronLeftBold: "alt-arrow-left-bold",
  arrowUpLine: "arrow-up-linear",
  arrowDownLine: "arrow-down-linear",
} as const;

export type IconName = keyof typeof ICONS;

interface IconProps {
  name: IconName;
  className?: string;
  size?: number;
}

export function Icon({ name, className, size = 20 }: IconProps) {
  const iconData = getIconData(solarIcons, ICONS[name]);
  if (!iconData) return null;

  const rendered = iconToSVG(iconData, { width: size, height: size });

  return (
    <svg
      {...rendered.attributes}
      className={cn("shrink-0", className)}
      fill="currentColor"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: rendered.body }}
    />
  );
}

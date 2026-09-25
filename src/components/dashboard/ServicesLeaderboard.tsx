import { RowArrowButton } from "@/components/dashboard/RowArrowButton";
import { PhotoAvatar } from "@/components/ui/Avatar";
import { PriorityBadge } from "@/components/ui/Badge";
import type { ServiceRow } from "@/types";

export function ServicesLeaderboard({ services }: { services: ServiceRow[] }) {
  return (
    // The whole section (including its #fcfcfc background) fades out at the bottom, as in the design.
    <section className="fade-services mx-5 flex min-h-0 flex-1 flex-col bg-page pt-5">
      <h2 className="pl-[30px] text-[15px] font-bold leading-5 text-ink">Most requested services</h2>

      <div className="mt-5 max-h-[420px] min-h-0 flex-1 overflow-auto px-5 no-scrollbar xl:max-h-none">
        <ul className="min-w-[600px] space-y-2.5 pb-[90px]">
          {services.map((service, index) => (
            <li
              key={service.id}
              className="flex h-[50px] items-center rounded-[5px] bg-card pl-[19px] pr-[19px] text-sm text-ink"
            >
              <span className="w-[31px] shrink-0 font-bold">{index + 1}.</span>
              <span className="min-w-0 flex-[77_1_0] truncate">{service.name}</span>
              <span className="flex min-w-0 flex-[133_1_0] items-center">
                {service.workerAvatars.length === 1 ? (
                  <span className="flex min-w-0 items-center gap-[13px]">
                    <PhotoAvatar />
                    <span className="truncate">{service.workerAvatars[0]}</span>
                  </span>
                ) : (
                  <span className="flex -space-x-2.5">
                    {service.workerAvatars.map((seed, i) => (
                      <PhotoAvatar key={seed} tint={i} />
                    ))}
                  </span>
                )}
              </span>
              <span className="flex h-[30px] w-[84px] shrink-0 items-center justify-center rounded-[3px] bg-tint-yellow">
                {service.category}
              </span>
              <PriorityBadge priority={service.priority} className="ml-[21px]" />
              <span className="ml-[31px] w-[100px] shrink-0 text-positive">
                <span className="font-bold">{service.price}</span> <span className="text-[11px]">SAR</span>
              </span>
              <RowArrowButton tone="info" label={`View ${service.name}`} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

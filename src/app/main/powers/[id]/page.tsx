import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { PowersEditor } from "@/components/ui/PowersEditor";
import { branches, getBranch, powerGroups } from "@/lib/mock-main";

export function generateStaticParams() {
  return branches.map((b) => ({ id: b.id }));
}

/** Powers of a branch (designs 44, 46). */
export default async function BranchPowersPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const branch = getBranch(id);
  if (!branch) notFound();

  return (
    <AppShell title="Powers" role="main">
      <section className="rounded-card bg-card px-4 pb-[30px] pt-[27px] shadow-card sm:px-[30px] xl:min-h-[calc(100vh-130px)]">
        <div className="flex flex-wrap items-center gap-4 pl-5">
          <h2 className="text-[22px] leading-[26px] text-ink">Powers of</h2>
          <span className="inline-flex h-10 items-center rounded-[5px] bg-page px-5 text-base text-ink">{branch.name}</span>
        </div>
        <div className="mt-5">
          <PowersEditor groups={powerGroups} />
        </div>
      </section>
    </AppShell>
  );
}
import type { Metadata } from "next";
import { getI18n } from "@/i18n/server";
import { rich } from "@/i18n/text";
import { getAgency, getPackages, getTours } from "@/lib/dunastour/server";
import { agencyInfo } from "@/lib/agency-info";
import { PageHero } from "@/components/layout/PageHero";
import { PackageCardView, TourCard } from "@/components/tour/TourCard";
import { EmptyTours } from "@/components/tour/EmptyTours";
import { Reveal } from "@/components/ui/Reveal";

export const revalidate = 300;
export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getI18n()).t.meta.toursTitle };
}

export default async function ToursPage() {
  const { t } = await getI18n();
  const [tours, packages, agency] = await Promise.all([getTours(), getPackages(), getAgency()]);
  return (
    <>
      <PageHero
        image={tours[0]?.coverImageUrl}
        eyebrow={t.tours.pageEyebrow}
        title={rich(t.tours.pageTitle)}
        crumbs={[{ href: "/", label: t.common.home }]}
      >
        <p className="mt-4 max-w-xl text-lg text-ink/75">{t.tours.pageText}</p>
      </PageHero>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        {packages.length > 0 && (
          <div className="mb-12 grid gap-5 md:grid-cols-2">
            {packages.map((p) => (
              <PackageCardView key={p.id} pkg={p} />
            ))}
          </div>
        )}
        {tours.length > 0 ? (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {tours.map((tour, i) => (
              <Reveal key={tour.id} delay={(i % 3) * 0.08}>
                <TourCard tour={tour} priority={i < 3} />
              </Reveal>
            ))}
          </div>
        ) : (
          packages.length === 0 && <EmptyTours phone={agencyInfo(agency).phone} />
        )}
      </div>
    </>
  );
}
